(function () {
  var calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var raiz = document.documentElement;
  if (!calmo) raiz.classList.add("js-ok");

  // titulo do hero: palavra por palavra, com "pop" como no reel
  var h1 = document.querySelector("[data-palavras]");
  if (h1 && !calmo) {
    var dourado = { "agentes": 1, "ia": 1 }, i = 0;
    h1.innerHTML = h1.textContent.split(" ").map(function (w) {
      var k = w.toLowerCase().replace(/[^a-zà-ú]/g, "");
      return '<span class="w' + '" style="--i:' + (i++) + (dourado[k] ? ";color:var(--gold)" : "") + '">' + w + "</span>";
    }).join(" ");
  }

  // revelar ao rolar + contadores
  function contar(el) {
    var alvo = +el.getAttribute("data-n"), t0 = null, dur = 1100;
    if (calmo) { el.textContent = alvo; return; }
    function f(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(alvo * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); }
    el.textContent = "0"; requestAnimationFrame(f);
  }
  var alvos = [].slice.call(document.querySelectorAll(".rv, .moldura"));
  if ("IntersectionObserver" in window && !calmo) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("v"); io.unobserve(e.target);
        var n = e.target.querySelector && e.target.querySelector("[data-n]"); if (n) contar(n);
      });
    }, { threshold: .15, rootMargin: "0px 0px -6% 0px" });
    alvos.forEach(function (a) { io.observe(a); });
  } else { alvos.forEach(function (a) { a.classList.add("v"); }); }


  // reels de amostra: o video so carrega ao tocar
  [].slice.call(document.querySelectorAll(".reel[data-v]")).forEach(function (b) {
    b.addEventListener("click", function () {
      var v = document.createElement("video"); v.src = b.getAttribute("data-v"); v.controls = true; v.autoplay = true; v.playsInline = true; v.setAttribute("playsinline", ""); v.loop = true;
      b.innerHTML = ""; b.appendChild(v); b.style.cursor = "default"; v.play && v.play().catch(function () {});
    }, { once: true });
  });

  // caixas de material: o contato e pedido uma vez; cada caixa aberta grava o seu slug na tabela leads (Supabase, so insercao)
  var form = document.getElementById("form-lead"), msg = document.getElementById("msg-erro"), botao = form.querySelector("button");
  var caixas = [].slice.call(document.querySelectorAll(".caixa[data-slug]")), inicio = Date.now(), p = new URLSearchParams(location.search), atual = null;
  var local = location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.protocol === "file:";
  function guarda(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function contato() { try { return JSON.parse(guarda("jga_contato") || "null"); } catch (e) { return null; } }
  function abrir(cx, festa) {
    cx.classList.add("aberta"); cx.querySelector(".dentro").hidden = false; cx.querySelector(".abrir").hidden = true;
    var ic = cx.querySelector(".ic"); if (festa && !calmo) ic.classList.add("abre");
    if (form.parentNode === cx) { form.hidden = true; document.querySelector(".mat .cx").appendChild(form); }
    if (festa) cx.scrollIntoView({ behavior: calmo ? "auto" : "smooth", block: "start" });
  }
  function pedir(cx) {
    atual = cx; msg.textContent = ""; cx.querySelector(".abrir").hidden = true;
    caixas.forEach(function (o) { if (o !== cx && !o.classList.contains("aberta")) o.querySelector(".abrir").hidden = false; });
    cx.insertBefore(form, cx.querySelector(".dentro")); form.hidden = false;
  }
  function gravar(c, slug) {
    var cfg = window.JGA_LEADS || {};
    if (!cfg.url || !cfg.anonKey) return Promise.reject(new Error("config"));
    return fetch(cfg.url.replace(/\/$/, "") + "/rest/v1/" + (cfg.tabela || "leads"), {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": cfg.anonKey, "Authorization": "Bearer " + cfg.anonKey, "Prefer": "return=minimal" },
      body: JSON.stringify({ nome: c.nome, whatsapp: c.whatsapp, email: c.email, post_slug: slug, mentoria: false, consentimento: true, origem: (p.get("utm_source") || document.referrer || "direto").slice(0, 120) })
    }).then(function (r) { if (!r.ok && r.status !== 409) throw new Error("status " + r.status); guarda("jga_lead_" + slug, "1"); });
  }
  caixas.forEach(function (cx) {
    var slug = cx.getAttribute("data-slug"), b = cx.querySelector(".abrir");
    if (guarda("jga_lead_" + slug) === "1" || (p.get("preview") === "1" && local)) { abrir(cx, false); return; }
    b.addEventListener("click", function () {
      var c = contato(); if (!c) { pedir(cx); return; }
      var av = cx.querySelector(".aviso"); if (av) av.remove();
      b.disabled = true; b.textContent = "Abrindo...";
      gravar(c, slug).then(function () { abrir(cx, true); }).catch(function () {
        b.disabled = false; b.textContent = "Abrir este material";
        var a = document.createElement("p"); a.className = "aviso"; a.setAttribute("role", "alert"); a.textContent = "Não consegui abrir agora. Tente de novo em instantes."; cx.insertBefore(a, cx.querySelector(".dentro"));
      });
    });
  });
  var primeira = caixas.filter(function (cx) { return !cx.classList.contains("aberta"); })[0];
  if (primeira && !contato() && location.hash !== "#contratar") pedir(primeira);
  function erro(t) { msg.textContent = t || ""; }
  form.addEventListener("submit", function (ev) {
    ev.preventDefault(); erro("");
    var f = new FormData(form);
    if (f.get("site_url") || !atual) return;
    if (Date.now() - inicio < 3000) { erro("Aguarde um instante e envie de novo."); return; }
    var c = { nome: (f.get("nome") || "").trim(), whatsapp: (f.get("whatsapp") || "").replace(/\D/g, ""), email: (f.get("email") || "").trim().toLowerCase() };
    if (c.nome.length < 2) { erro("Escreva o seu nome."); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(c.email)) { erro("Confira o e-mail."); return; }
    if (c.whatsapp.length < 10 || c.whatsapp.length > 13) { erro("Confira o celular, com DDD. Exemplo: 31 99999-9999."); return; }
    if (!f.get("consentimento")) { erro("Marque a caixa de aceite para abrir."); return; }
    if (p.get("teste") === "1" && local) { erro("Modo teste: tudo validado, nada foi enviado."); return; }
    botao.disabled = true; botao.textContent = "Abrindo...";
    gravar(c, atual.getAttribute("data-slug")).then(function () {
      guarda("jga_contato", JSON.stringify(c)); botao.disabled = false; botao.textContent = "Abrir o material"; abrir(atual, true);
    }).catch(function (e) {
      erro(e.message === "config" ? "O cadastro está em ajuste. Me chame no WhatsApp que eu libero pra você." : "Não consegui enviar agora. Tente de novo ou me chame no WhatsApp.");
      botao.disabled = false; botao.textContent = "Abrir o material";
    });
  });

  // lista de espera da mentoria: mesma tabela leads (post_slug marca a origem; a resposta vai junto no campo origem)
  var fe = document.getElementById("form-espera");
  if (fe) {
    var me = document.getElementById("msg-espera"), be = fe.querySelector("button"), ini2 = Date.now();
    fe.addEventListener("submit", function (ev) {
      ev.preventDefault(); me.textContent = "";
      var f = new FormData(fe); if (f.get("site_url")) return;
      var nome = (f.get("nome") || "").trim(), email = (f.get("email") || "").trim().toLowerCase(), wa = (f.get("whatsapp") || "").replace(/\D/g, ""), quer = f.get("quer");
      if (Date.now() - ini2 < 3000) { me.textContent = "Aguarde um instante e envie de novo."; return; }
      if (nome.length < 2) { me.textContent = "Escreva o seu nome."; return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) { me.textContent = "Confira o e-mail."; return; }
      if (wa && (wa.length < 10 || wa.length > 13)) { me.textContent = "Confira o WhatsApp, com DDD. Exemplo: 31 99999-9999. Ou deixe em branco."; return; }
      if (!quer) { me.textContent = "Escolha o que você mais quer aprender."; return; }
      if (!f.get("consentimento")) { me.textContent = "Marque a caixa de aceite para entrar."; return; }
      var cfg = window.JGA_LEADS || {};
      if (!cfg.url || !cfg.anonKey) { me.textContent = "A lista está em ajuste. Tente de novo mais tarde."; return; }
      var ref = "direto"; try { if (document.referrer) ref = new URL(document.referrer).hostname; } catch (e) {}
      be.disabled = true; be.textContent = "Enviando...";
      fetch(cfg.url.replace(/\/$/, "") + "/rest/v1/" + (cfg.tabela || "leads"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": cfg.anonKey, "Authorization": "Bearer " + cfg.anonKey, "Prefer": "return=minimal" },
        // a tabela exige whatsapp com 10 a 13 digitos: sem WhatsApp vai 0000000000 (= nao informado)
        body: JSON.stringify({ nome: nome, whatsapp: wa || "0000000000", email: email, post_slug: "lista-espera-mentoria", mentoria: true, consentimento: true, origem: ("quer: " + quer + " | " + (p.get("utm_source") || ref)).slice(0, 120) })
      }).then(function (r) {
        if (!r.ok && r.status !== 409) throw new Error("status " + r.status);
        document.getElementById("lista-espera").classList.add("enviado");
        document.getElementById("ok-espera").focus({ preventScroll: true });
      }).catch(function () {
        me.textContent = "Não consegui enviar agora. Tente de novo em instantes."; be.disabled = false; be.textContent = "Entrar na lista de espera";
      });
    });
  }
})();
