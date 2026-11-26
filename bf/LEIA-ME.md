# Página de Black Friday: AI Agent Office Kit

Página: `bf/index.html` → URL final `https://gojira1998.github.io/joaoagents/bf/`
Nada publicado. Prints em `bf/_prints/` (390x844 e 1440x900, estado BF e estado depois do prazo).

## v2 (26/11, depois do "meio boca" do João): NÃO publicada, o JARVIS publica

- A v1 está guardada em `bf/index-v1.html` (usa os assets antigos, que continuam em `assets/`).
- Ordem nova: faixa amarela de BF correndo → vídeo de apresentação no topo (autoplay, mudo, loop, botão "Sound on") → título + preço gigante "$19 / Save $10 before Tuesday / Then $29 from Dec 1" + botão + contagem → "Four problems it fixes" (4 linhas com ícone) → "This is my real office" (gravação da guilda) + bloco do fundador com foto real → "Five parts, one download" (pilha de valor + botão) → [bônus escondido] → FAQ (7) → fechamento amarelo gigante (preço, contagem, botão de 84 px, garantia de 7 dias) → rodapé.
- Setas "See what it fixes / See my real office / See what you get" guiam a rolagem.
- Saiu: a seção do tour de 30 s (o vídeo agora está no topo), a demo "Give the office a job", "Is this kit for you?" (virou pergunta do FAQ "Who should skip it?") e a seção separada da garantia (entrou no fechamento). Página 51% mais curta no celular (13.145 → 6.431 px) e 37% no desktop (10.047 → 6.303 px).
- Pixel, ViewContent, InitiateCheckout (data-buy: bar, hero, price, final, footer), contagem, troca para $29 e aviso de cookies: mesmo código da v1. Testado no Chrome: ViewContent 19/29 e InitiateCheckout "final" 19/29 conforme a fase.
- Vídeo do topo: `PAGINA-video-apresentacao-16x9-v3-capa.mp4` comprimido em 720p com som (AAC mono 64k):
  - `assets/presentation-bf-720.mp4` (1,35 MB, 37,5 s inteiro, com a capa e o cartão final de "$19") só durante a BF;
  - `assets/presentation-after-720.mp4` (1,13 MB, corte de 3,2 s a 32 s, sem nenhum "$19") a partir de terça. A página troca sozinha (também se a pessoa estiver com a página aberta na virada).
  - Posters: `presentation-poster-bf.webp` e `presentation-poster-after.webp`.
- Prova real: `assets/real-office-1120.mp4` (432 KB, 12 s, sem áudio) + `real-office-poster.webp`, gravados com Playwright de `http://127.0.0.1:8787/index-3d.html` em 26/11, só leitura, sem clicar em nada. Para não vazar nada privado, nessa cópia do navegador foram escondidos (só CSS local) o painel lateral "Aguardando seu OK"/histórico, o texto de status do Claude e o relógio. Ficaram só os nomes das salas e o status (precisa de você / pronto).
- Foto do fundador: `assets/joao-real.webp`, recorte de `JGA-Servicos-IA/identidade/foto-perfil/foto-real-perfil.jpg` (a selfie real). Não usei a `perfil-1-blazer-estudio` porque tem cara de retrato de estúdio feito por IA; se o João confirmar que é foto real, dá pra trocar o arquivo.
- Prints da v2: `bf/_prints-v2/` (390x844 e 1440x900, BF e depois do prazo) e `bf/_prints-v2/PRANCHA.jpg` para o WhatsApp.
- Inspector da skill de design (pontos que ficaram e são esperados): "05" da contagem lido como numeração; barra fixa de BF cobrindo títulos na rolagem (é a barra pedida); as 4 linhas com ícone dos problemas (ícones pedidos pelo João); "If sold separately" lido como etiqueta.

### Bônus de Black Friday (ESCONDIDO, esperando o João)

O bloco "Black Friday bonus (until Monday)" já está no HTML, logo depois da pilha de valor, com `data-bonus="off"` (não aparece).

Para ligar:
1. O pacote precisa existir de verdade dentro do ZIP da Gumroad (ou como arquivo extra no mesmo produto) ANTES de ligar.
2. No `index.html`, trocar `data-bonus="off"` por `data-bonus="on"` na `<section class="bonus ...">`.
3. Trocar os 3 textos `[PLACEHOLDER: ...]` pelo conteúdo real e o quadro `.ph` por uma imagem real do pacote (`<img>` de um print das sprites).
4. Ele some sozinho na terça (tem `only-bf`). Na Gumroad, tirar o pacote do ZIP na terça ou deixar como presente, mas a página não promete nada depois da BF.

O que o "Pixel Agent Sprites Pack" precisa conter de verdade para a página poder falar dele:
- Sprites pixel dos agentes (um personagem por sala, pelo menos as 10 salas do kit) em PNG com fundo transparente, nas poses que o escritório usa: sentado digitando (trabalhando), em pé acenando (precisa de você), pulando (pronto), andando (parado).
- Tamanho e formato declarados (ex.: 64x64 por quadro, folha de sprites + quadros soltos).
- Instrução curta de como trocar os bonecos do escritório 3D por esses (ou aviso honesto se for só para usar em posts e vídeos).
- Licença clara: uso pessoal e comercial do comprador, sem revenda.
- Tudo feito por nós (nada tirado de jogo ou de terceiros). Se for gerado por IA, o texto não pode dizer "desenhado à mão".
- Nada de valor em dólar inventado para o bônus ("worth $X") sem base.

## A oferta (decidida pelo João em 26/11)

- **US$ 19 até segunda, 30/11/2026, 23:59 no horário de Nova York (ET).**
- **A partir de terça, 01/12, o kit vai para US$ 29.** A página troca sozinha: no relógio de Nova York, à meia-noite de 01/12 (05:00 UTC, 02:00 de Brasília), todos os preços viram US$ 29, a barra do topo vira "Black Friday has ended", somem a contagem e as frases de BF.
- Garantia: reembolso em 7 dias, sem precisar explicar o motivo. Entrega instantânea pela Gumroad. Pagamento único, sem assinatura.
- Âncora honesta: o kit sempre custou US$ 19, então a página NÃO diz "de US$ X por US$ 19" nem mostra porcentagem de desconto. A urgência real é a subida para US$ 29.

Testar o estado "depois do prazo" sem esperar: abrir `.../bf/?preview_now=2026-12-01T06:00:00Z`.

## Pilha de valor usada (soma US$ 125)

| Parte | Valor | Por quê |
|---|---|---|
| Guia passo a passo (PDF de 20 páginas com prints reais) | US$ 29 | Guias de Claude Code/IA em PDF na Gumroad costumam ficar entre US$ 19 e 49; o nosso tem prints e checagem por etapa |
| Office Prompt (5 perguntas e o Claude monta tudo) | US$ 19 | Prompts "mestre" avulsos são vendidos na faixa de US$ 10 a 30 |
| 10 templates de agentes + 4 arquivos de memória | US$ 35 | Uns US$ 3,50 por agente; pacotes de templates de agentes/prompts vendem de US$ 20 a 50 |
| Escritório 3D (um HTML, sem servidor) | US$ 29 | Templates de painel/dashboard em HTML vendem de US$ 20 a 40 |
| Lista de 19 skills (comando, link do autor, licença, mapa por sala) | US$ 13 | Listas curadas de recursos costumam sair entre US$ 9 e 15 |

Como a página apresenta: "Here's what each part would cost if we sold it on its own" e, embaixo do total, "Our estimate for each part sold on its own. The kit is only sold as one bundle." Ou seja, é estimativa nossa, não preço antigo. As faixas acima são referência de mercado, não citadas na página.

Sem selo "verified", sem número de vendas, sem depoimentos, sem avaliações.

## O que mudar na Gumroad (https://lendasgringo.gumroad.com/l/myeirv)

1. **Agora (antes de rodar anúncio de BF):**
   - Preço: conferir que está em **US$ 19** (pay what you want desligado).
   - Política de reembolso: deixar em **7 dias** (a página promete isso).
   - Trocar a descrição pelo texto de BF abaixo (o começo da descrição atual pode ficar como está, só colar o bloco de BF no topo).
2. **Terça, 01/12, logo depois da meia-noite ET (02:00 de Brasília, ou no máximo de manhã):**
   - Preço: **US$ 29**.
   - Tirar o bloco de BF da descrição.
   - Se o pixel/anúncio usar valor de conversão fixo, trocar 19 por 29.
   - Atenção: entre 02:00 e a hora em que a Gumroad for alterada, a página diz US$ 29 e a Gumroad ainda cobra 19. Isso é a favor do cliente, mas não deixar passar da manhã de terça.
3. Não criar cupom nem "preço original riscado" na Gumroad: o kit nunca custou US$ 125.

## Texto curto para a descrição da Gumroad durante a BF (colar no topo)

> **Black Friday: $19 until Monday, Nov 30 at 11:59 PM ET.** On Tuesday, Dec 1, the kit goes to $29.
>
> One prompt turns Claude Code into 10 AI agents, each with its own job and a shared memory, plus a live 3D office that shows who is working and who needs your OK.
>
> What you get: a 20 page step by step guide, the Office Prompt, 10 agent templates with 4 memory files, the 3D office and a list of 19 skills for Claude Code.
>
> Paid once. Instant download. 7-day refund if it isn't for you.

## Pixel da Meta

- Mesmo pixel da en-v2: `fbq('init','1138422325458467')`.
- Ao carregar: `PageView` + `ViewContent` (valor 19 na BF, 29 depois).
- Em todo botão de compra (`data-buy`): `InitiateCheckout` com o nome do botão em `content_category` (hero, bar, problems, inside, fit, price, guarantee, final, footer). Testado nos prints: dispara com valor 19 na BF e 29 depois.
- **Igual à en-v2, o pixel só carrega depois que a pessoa clica "Accept" no aviso de cookies** (a política de privacidade em `../en/privacy/` diz isso, e o público UK exige). Quem recusar não é medido. Se o JARVIS quiser o pixel sem consentimento para EUA/CA/AU, é decisão do João e precisa ajustar a política de privacidade antes.

## Mídia

- Topo: vídeo novo, gravado do escritório 3D real do kit (sem texto por cima), `assets/office-loop-800.mp4` (114 KB, celular) e `office-loop-1280.mp4` (210 KB, computador), muted autoplay loop playsinline, com poster webp.
- Seção "30 seconds inside the kit": corte do `PAGINA-video-apresentacao-16x9-v3-capa.mp4` de 3,2 s a 32 s (sem a capa inicial e sem o cartão final de "$19", que ficaria errado depois de 01/12), sem áudio, 760 KB, só carrega quando chega perto da tela.
- Outras imagens copiadas da en-v2 (`assets/`). O `joao.jpg` foi copiado para `bf/assets/` para a pasta funcionar sozinha.

## Checagens feitas

- Prints 390x844 e 1440x900, BF e depois do prazo: sem corte de texto, sem rolagem lateral, título em 2 linhas nos dois tamanhos, botão "Get the kit for $19" visível sem rolar no celular (acaba em 554 px, aviso de cookies começa em 769 px) e o botão da barra fixa sempre visível.
- Contagem andando (segundo a segundo) e troca automática para US$ 29 testada com `?preview_now`.
- Nenhum travessão (— ou –) no texto.
- Inspector da skill de design: pontos que ficaram e são esperados: a barra fixa de BF cobre títulos durante a rolagem (é a barra pedida); o "05" da contagem lido como numeração; a linha "Total if sold separately" lida como etiqueta; e o inspector só percorre 11 telas, por isso acusa "vazio" no fim da página no celular (a página tem ~15 telas; conferido nos prints que está tudo preenchido).
