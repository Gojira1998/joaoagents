/* Tela de Seleção (ep. 1 da conta A): monta a grade a partir de window.LUTADORES (lutadores.js),
   busca pelo @, abre a ficha e gera o card de story (1080x1920) no próprio navegador.
   Link direto pra ficha: index.html?lutador=<@>#lutadores */
(function () {
  var L = window.LUTADORES || [], sec = document.getElementById("lutadores");
  if (!sec || !L.length) return;
  var grade = sec.querySelector(".grade"), campo = sec.querySelector("#busca-at"), resp = sec.querySelector(".resp");
  var ficha = sec.querySelector(".ficha"), VAGAS = 3, aberto = null;
  function norm(t) { return String(t || "").trim().toLowerCase().replace(/^@+/, "").replace(/\s+/g, ""); }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }

  L.forEach(function (x, i) {
    var li = el("li"), b = el("button"); b.type = "button"; b.setAttribute("aria-label", "@" + x.h + ", " + x.classe);
    var r = el("span", "ret"), im = new Image(); im.alt = ""; im.loading = i < 8 ? "eager" : "lazy"; im.src = "assets/lutadores/" + x.s + "-rosto.png";
    im.onerror = function () { r.textContent = "?"; };
    r.appendChild(im); b.appendChild(r); b.appendChild(el("span", "at", "@" + x.h));
    b.addEventListener("click", function () { abrir(x, true); });
    li.appendChild(b); li.setAttribute("data-h", norm(x.h)); grade.appendChild(li);
  });
  var resto = (4 - (L.length + VAGAS) % 4) % 4;
  for (var v = 0; v < VAGAS + resto; v++) {
    var li = el("li", "vazio"), r = el("span", "ret"); r.appendChild(el("b", null, "?")); li.appendChild(r); li.appendChild(el("span", "at", "você?"));
    li.setAttribute("aria-hidden", "true"); grade.appendChild(li);
  }
  var itens = [].slice.call(grade.querySelectorAll("li[data-h]"));

  function buscar(q, abrirSeUm) {
    var n = norm(q);
    itens.forEach(function (li) { li.classList.remove("acha", "some"); });
    if (!n) { resp.textContent = ""; return; }
    var achou = itens.filter(function (li) { return li.getAttribute("data-h").indexOf(n) > -1; });
    itens.forEach(function (li) { if (achou.indexOf(li) < 0) li.classList.add("some"); });
    achou.forEach(function (li) { li.classList.add("acha"); });
    if (!achou.length) { resp.innerHTML = "Ainda não tem lutador com esse @. Comenta <b>LUTADOR</b> e a tarefa chata no reel mais novo: ele estreia no próximo episódio."; return; }
    resp.textContent = achou.length === 1 ? "Achei! Toque no retrato pra ver a ficha." : achou.length + " lutadores com esse começo de @.";
    var exato = L.filter(function (x) { return norm(x.h) === n; })[0];
    if (abrirSeUm && (exato || achou.length === 1)) abrir(exato || L.filter(function (x) { return norm(x.h) === achou[0].getAttribute("data-h"); })[0], false);
  }
  var t = null;
  campo.addEventListener("input", function () { clearTimeout(t); t = setTimeout(function () { buscar(campo.value, false); }, 120); });
  campo.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); buscar(campo.value, true); } });

  function abrir(x, rolar) {
    aberto = x;
    var im = ficha.querySelector(".palco img"); im.alt = "Lutador em pixel art de @" + x.h + ", " + x.classe; im.src = "assets/lutadores/" + x.s + ".png";
    im.style.animation = "none"; void im.offsetWidth; im.style.animation = "";
    ficha.querySelector(".nome").textContent = "@" + x.h;
    ficha.querySelector(".classe").textContent = x.classe;
    ficha.querySelector(".esp").textContent = x.esp;
    ficha.querySelector(".plugin").textContent = x.golpe;
    var nv = ficha.querySelector(".nv"); nv.innerHTML = ""; for (var i = 1; i <= 3; i++) nv.appendChild(el("i", i <= x.nivel ? "ok" : ""));
    ficha.querySelector(".nvt").textContent = "Nível " + x.nivel + " de 3";
    ficha.querySelector(".estreia").textContent = x.estreia;
    ficha.hidden = false;
    if (rolar) ficha.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    try { history.replaceState(null, "", "?lutador=" + encodeURIComponent(x.h) + "#lutadores"); } catch (e) {}
  }
  ficha.querySelector(".fechar").addEventListener("click", function () {
    ficha.hidden = true; aberto = null; grade.scrollIntoView({ block: "center" });
    try { history.replaceState(null, "", location.pathname + "#lutadores"); } catch (e) {}
  });

  function carrega(src) { return new Promise(function (ok, erro) { var i = new Image(); i.onload = function () { ok(i); }; i.onerror = erro; i.src = src; }); }
  function cabe(c, txt, max, peso, tam, fam) { var s = tam; c.font = peso + " " + s + "px " + fam; while (c.measureText(txt).width > max && s > 30) { s -= 4; c.font = peso + " " + s + "px " + fam; } return s; }
  var btCard = ficha.querySelector(".card");
  btCard.addEventListener("click", function () {
    if (!aberto) return;
    var x = aberto, txt0 = btCard.textContent; btCard.disabled = true; btCard.textContent = "Montando o card...";
    var fontes = document.fonts && document.fonts.load ? Promise.all([document.fonts.load('800 80px "Bricolage Grotesque"'), document.fonts.load('700 40px "DM Sans"')]).catch(function () {}) : Promise.resolve();
    Promise.all([carrega("assets/tela-selecao-fundo.jpg"), carrega("assets/lutadores/" + x.s + ".png"), fontes]).then(function (r) {
      var fundo = r[0], luta = r[1], W = 1080, H = 1920, c = document.createElement("canvas"); c.width = W; c.height = H;
      var g = c.getContext("2d"), TIT = '"Bricolage Grotesque", system-ui, sans-serif', CORPO = '"DM Sans", system-ui, sans-serif';
      g.drawImage(fundo, 0, 0, W, H);
      var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "rgba(10,15,41,.55)"); gr.addColorStop(.42, "rgba(10,15,41,0)"); gr.addColorStop(.58, "rgba(10,15,41,.25)"); gr.addColorStop(1, "rgba(10,15,41,.94)");
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      // lutador grande em cima da plataforma da esquerda (P1)
      var alt = 1060, lar = luta.width * alt / luta.height; if (lar > 980) { lar = 980; alt = luta.height * lar / luta.width; }
      g.imageSmoothingEnabled = false; g.drawImage(luta, (W - lar) / 2, 1150 - alt, lar, alt); g.imageSmoothingEnabled = true;
      g.textAlign = "center"; g.textBaseline = "alphabetic";
      g.fillStyle = "#ffc53d"; g.font = "800 46px " + TIT; g.fillText("LUTADOR SELECIONADO", W / 2, 150);
      var at = "@" + x.h, s = cabe(g, at, 960, "800", 104, TIT);
      g.lineWidth = 14; g.strokeStyle = "#0a0f29"; g.lineJoin = "round"; g.strokeText(at, W / 2, 1290); g.fillStyle = "#fff"; g.fillText(at, W / 2, 1290);
      g.font = "700 46px " + CORPO; g.fillStyle = "#c9d3ee"; g.fillText(x.classe + "  |  Nível " + x.nivel, W / 2, 1370);
      var esp = "ESPECIAL: " + x.esp; g.font = "800 50px " + TIT; var we = Math.min(g.measureText(esp).width + 64, 1000);
      g.fillStyle = "#ff5630"; rr(g, (W - we) / 2, 1420, we, 86, 18); g.fill(); g.fillStyle = "#fff"; g.fillText(esp, W / 2, 1480);
      g.font = "500 40px " + CORPO; g.fillStyle = "#c9d3ee"; g.fillText("Poder do plugin " + x.golpe, W / 2, 1572);
      g.font = "800 58px " + TIT; g.fillStyle = "#fff"; g.fillText("@joaoagents.ia", W / 2, 1760);
      g.font = "500 38px " + CORPO; g.fillStyle = "#c9d3ee"; g.fillText("Ache o seu lutador no link da bio", W / 2, 1822);
      c.toBlob(function (bl) {
        var a = document.createElement("a"); a.href = URL.createObjectURL(bl); a.download = "lutador-" + x.s + ".png";
        document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
        btCard.disabled = false; btCard.textContent = txt0;
      }, "image/png");
    }).catch(function () { btCard.disabled = false; btCard.textContent = "Não deu agora. Tente de novo"; });
  });
  function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

  var p = new URLSearchParams(location.search).get("lutador");
  if (p) { campo.value = p; buscar(p, true); var y = L.filter(function (x) { return norm(x.h) === norm(p); })[0]; if (y) setTimeout(function () { ficha.scrollIntoView({ block: "start" }); }, 300); }
})();
