# DNS do ro2d.com.br

O site está no ar e os domínios já estão cadastrados no EasyPanel. Falta apontar
o DNS — isso é feito no **registro.br**, onde você comprou o domínio.

## Registros a criar

Servidor: **178.104.248.117**

| Tipo | Nome | Valor |
|---|---|---|
| A | `@` (ou vazio) | `178.104.248.117` |
| A | `www` | `178.104.248.117` |
| A | `cards` | `178.104.248.117` |
| A | `luz` | `178.104.248.117` |

No registro.br: entre no domínio → **Editar zona DNS** → adicione as quatro
entradas acima. A propagação costuma levar de 15 minutos a algumas horas.

## O que cada endereço vai servir

| Endereço | Conteúdo |
|---|---|
| ro2d.com.br | Site institucional |
| www.ro2d.com.br | Mesmo site |
| cards.ro2d.com.br | Landing dos 300 Cards de Segurança Familiar |
| luz.ro2d.com.br | Landing do Luz para Cada Dia |

O HTTPS é emitido automaticamente pelo EasyPanel assim que o DNS resolver —
não precisa fazer nada além dos registros A.

## Depois que o DNS estiver ativo

1. Trocar os links do catálogo no `index.html` pelos endereços definitivos
   (`cards.ro2d.com.br` e `luz.ro2d.com.br`) — hoje apontam para os subdomínios
   do EasyPanel, que continuam funcionando.
2. Criar a caixa **contato@ro2d.com.br** — o site inteiro aponta para esse
   endereço e ele ainda não existe.
3. Atualizar o rodapé das landings com o domínio próprio.

## Verificar se propagou

```bash
nslookup ro2d.com.br
curl -I https://ro2d.com.br
```
