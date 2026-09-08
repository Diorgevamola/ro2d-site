# Histórico de resoluções — 2026-09-08

**Data/hora da evidência:** 2026-09-08
**Wave / itens:** `RO2D-AP-W2`, `RO2D-AP-W2-BACKEND` (novo), `RO2D-AP-W4`, `RO2D-AP-W4-WEBHOOK` (novo)
**Modo:** consolidação de evidência já produzida em sessões anteriores + verificação ao vivo (curl) do catálogo público e dos links de checkout
**Workspace:** `/home/orca/ro2d/ro2d-site`
**Branch/commit relevante:** `fix/ro2d-w4-checkout-href`, commit local `b2175c1` (ainda **sem push/merge** em `main`)

Este documento registra o que foi investigado e corrigido nesta rodada, o que continua pendente e por que, e o que é necessário para destravar cada pendência residual. Segue o estilo dos relatórios já existentes em `docs/pendencias/` (`RELATORIO-FINAL-ABACATEPAY.md`, `incidente-smtp-webhook-universal-diagnostico-para-easypanel.md`).

---

## 1. RO2D-AP-W2 — Remover produtos antigos da Luz

### O que foi investigado
Os 2 produtos obsoletos rotulados `[NAO USAR - OBSOLETO]` (`prod_1qAHKBGXmKp1eLtPaXSaHx3C`, `prod_cBphr4LFSuz3cagmybQJrDC6`) — histórico completo de tentativas de desativação/exclusão está em `RELATORIO-FINAL-ABACATEPAY.md`, Adendos 3 e 5.

### O que foi corrigido / confirmado
- **Exposição pública: RESOLVIDA.** Catálogo verificado ao vivo via `curl` em `ro2d.com.br` mostra apenas os **9 produtos legítimos**; nenhum dos 2 obsoletos aparece em qualquer página pública do site. Um cliente navegando o site não tem como ver ou comprar os produtos obsoletos.
- Isso muda o status de `RO2D-AP-W2` de `blocked` para **`done`** no backlog — o objetivo de negócio (não expor produtos obsoletos ao cliente) está atingido.

### O que continua pendente e por quê
- **Exclusão real no backend AbacatePay continua bloqueada.** Tentativa real e autorizada (por Diorge) de `POST /v2/products/delete?id=prod_1qAHKBGXmKp1eLtPaXSaHx3C` retornou **`HTTP 401 {"success":false,"error":"Insufficient permissions"}`**. A chave `ABACATEPAY_API_KEY_PROD` não possui o escopo `PRODUCT:DELETE` exigido pela documentação oficial do endpoint. Nenhuma escrita foi aplicada (confirmado por leitura pós-tentativa: `updatedAt` idêntico, catálogo com 10 produtos antes e depois). O segundo ID nunca foi tentado (protocolo: parar após a primeira falha).
- Este item residual foi registrado como novo item de backlog **`RO2D-AP-W2-BACKEND`**, status `blocked`, dependente de ação humana.

### O que é necessário para destravar
Ação de **Diorge** (proprietário do painel AbacatePay), uma das três:
1. Gerar/habilitar no painel uma API key com escopo `PRODUCT:DELETE` e repetir a chamada de delete via API; ou
2. Deletar manualmente os 2 produtos pelo Dashboard (`https://app.abacatepay.com/produtos`); ou
3. Abrir chamado com o suporte AbacatePay perguntando se há alternativa não documentada.

Nenhuma destas ações está no alcance do agente sem credenciais de login no painel.

---

## 2. RO2D-AP-W4 — CTA, checkout, webhook e confirmação

Este item tinha **dois sub-problemas distintos**, tratados separadamente abaixo.

### 2.1 Sub-item CTA/href cru — CORRIGIDO

**O que foi investigado:** as 5 páginas `mentalidade-rica-vol2`, `mentalidade-rica-vol3`, `eu-me-escolho-vol1`, `eu-me-escolho-vol2`, `eu-me-escolho-vol3` tinham CTAs de checkout com `href="#checkout-pendente"` cru no HTML. O redirecionamento real só funcionava via `js/pixel.js` (mapa `produtosSemCheckout`); se o script falhasse ou fosse bloqueado, o clique não levava a lugar nenhum, sem fallback.

**O que foi corrigido:**
- Os 10 hrefs (2 por página: botão principal + barra `mini-urgency`) agora apontam diretamente para os links reais de checkout AbacatePay (`https://app.abacatepay.com/pay/bill_...`), os mesmos já usados como fallback no JS.
- Todos os 5 links `bill_...` validados via `curl`: **HTTP 200** em todos.
- `js/pixel.js` **não foi alterado** — continua funcionando como antes (disparo de `InitiateCheckout` no clique).
- Sem build/lint/test executados porque o repositório é um site estático sem `package.json`.

**Onde está:** branch `fix/ro2d-w4-checkout-href`, commit local `b2175c1` (`fix(ro2d-ap-w4): CTA aponta direto ao checkout AbacatePay real`).

**Estado do commit:** local apenas. **Sem push, sem merge em `main`** — decisão de integração separada, não autorizada nesta rodada.

### 2.2 Sub-item webhook de entrega — AINDA PENDENTE/BLOQUEADO

**O que foi investigado:** entrega automática pós-pagamento dos 5 produtos acima depende de dois componentes, nenhum funcional hoje:
1. **Webhook dedicado da Mentalidade Rica**: nunca foi configurado. Depende de `RO2D-AP-W3` (produto/checkout da Mentalidade Rica), que está `in_progress`.
2. **Webhook-universal no Easypanel** (que atenderia produtos futuros de forma centralizada): retorna **HTTP 500** ao tentar enviar e-mail via SMTP/nodemailer *dentro do container*, embora o mesmo código com as mesmas credenciais funcione *fora do container*. Diagnóstico completo em `incidente-smtp-webhook-universal-diagnostico-para-easypanel.md`.

**Evidência chave do diagnóstico SMTP:**
- Teste real de `transporter.verify()` (Nodemailer 6.10.1, credencial ao vivo lida do Easypanel) a partir de um ambiente fora do container: `AUTH PLAIN` → `235 Authentication succeeded` em 2,79s. Credencial e IP de saída (`178.104.248.117`) confirmados saudáveis para esse SMTP.
- Isso refina a hipótese líder: o problema não é a credencial nem um bloqueio geral do IP `178.104.248.117` — é provável que o **container** `webhook-universal` saia por um IP/caminho de rede (NAT/overlay do Easypanel) diferente do IP do host, ainda não confirmado por falta de acesso a terminal/exec dentro do container.
- Próxima verificação recomendada (não executada por falta de acesso): `curl api.ipify.org` de dentro do próprio container, comparando com `178.104.248.117`.

**Status:** esta investigação/correção está **EM ANDAMENTO em paralelo, por outro executor**, no momento desta consolidação. Não foi marcada como resolvida.

**O que é necessário para destravar:**
- Acesso ao terminal/exec do container `webhook-universal` no Easypanel (painel `portal-dpa`) para confirmar o IP de saída real.
- Dependendo do achado: liberação de IP adicional junto ao provedor SMTP (HostGator/Exim), ou reconfiguração de rede/egress do serviço no Easypanel — ação de Diorge/DevOps.
- Conclusão de `RO2D-AP-W3` para permitir configurar o webhook dedicado da Mentalidade Rica.

### Impacto no backlog
- `RO2D-AP-W4` passou de `blocked` para **`in_progress`** (o sub-item de CTA está corrigido, mas a wave como um todo não está concluída).
- Criado item residual **`RO2D-AP-W4-WEBHOOK`** (`in_progress`) para isolar e rastrear especificamente o problema de entrega/SMTP, com dependência em `RO2D-AP-W3`.

---

## 3. Resumo de mudanças no `.aiox/backlog.yaml`

| Item | Status anterior | Status novo | Motivo |
|---|---|---|---|
| `RO2D-AP-W2` | `blocked` | `done` | Exposição pública resolvida (verificação ao vivo); exclusão de backend isolada em novo item |
| `RO2D-AP-W2-BACKEND` (novo) | — | `blocked` | Exclusão real no AbacatePay bloqueada por permissão de API (HTTP 401); depende de ação humana de Diorge |
| `RO2D-AP-W4` | `blocked` | `in_progress` | Sub-item CTA/href corrigido (commit local); sub-item webhook segue bloqueado |
| `RO2D-AP-W4-WEBHOOK` (novo) | — | `in_progress` | Investigação SMTP/container em andamento por outro executor em paralelo |
| `RO2D-AP-W5` | dependências `[W2, W4]` | dependências `[W2, W2-BACKEND, W4, W4-WEBHOOK]` | Reconciliação final deve esperar também os itens residuais |

---

## 4. Fatos, decisões e riscos residuais

### Fatos verificados nesta rodada
1. Catálogo público de `ro2d.com.br` (verificado via `curl`) contém exatamente 9 produtos; nenhum dos 2 obsoletos aparece.
2. Commit `b2175c1` em `fix/ro2d-w4-checkout-href` altera exatamente 5 arquivos (`eu-me-escolho-vol1/2/3/index.html`, `mentalidade-rica-vol2/3/index.html`), 10 inserções/11 remoções, todas trocando `href="#checkout-pendente"` por URLs `bill_...` reais.
3. Os 5 links `bill_...` usados no commit retornam HTTP 200 (validado por curl).
4. Nenhuma escrita foi aplicada ao catálogo AbacatePay nesta rodada (somente leitura de estado + confirmação dos diagnósticos anteriores).

### Decisões humanas pendentes
- Autorizar push/merge de `fix/ro2d-w4-checkout-href` em `main` — **não realizado nesta rodada**, decisão separada.
- Diorge decidir e executar o caminho de exclusão dos produtos obsoletos no painel AbacatePay (`RO2D-AP-W2-BACKEND`).

### Riscos residuais
| Risco | Evidência | Impacto |
|---|---|---|
| Produtos obsoletos ainda `ACTIVE` no backend | `RELATORIO-FINAL-ABACATEPAY.md`, Adendo 5 | Nenhum risco de exposição ao cliente hoje, mas o catálogo administrativo continua "sujo"; risco de reaparecer se algum fluxo futuro não filtrar por status/label |
| Webhook de entrega indisponível para os 5 produtos do fix de CTA | `incidente-smtp-webhook-universal-diagnostico-para-easypanel.md` | Cliente pode pagar e não receber entrega automática até o webhook (dedicado ou universal) estar funcional — risco de negócio real, maior prioridade que o item de backend do W2 |
| Branch/commit do fix de CTA ainda local | Este documento | Se a máquina/workspace for perdido antes do push, o fix de href se perde |

---

## 5. Referências

- `docs/pendencias/RELATORIO-FINAL-ABACATEPAY.md` (Adendos 3, 4, 5) — histórico completo das tentativas de desativação/exclusão dos produtos obsoletos e do estado do produto Mentalidade Rica.
- `docs/pendencias/incidente-smtp-webhook-universal-diagnostico-para-easypanel.md` — diagnóstico técnico completo do erro HTTP 500 no webhook-universal, hipóteses ordenadas por probabilidade e checklist de verificação no Easypanel.
- `docs/pendencias/ESTADO-OPERACIONAL-ABACATEPAY.yaml` — estado operacional declarado da squad AbacatePay (histórico, pode estar desatualizado conforme já registrado na Divergência B do relatório final).
- Commit `b2175c1` na branch `fix/ro2d-w4-checkout-href` (local, sem push/merge).
