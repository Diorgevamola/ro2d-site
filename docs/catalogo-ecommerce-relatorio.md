# Catálogo e-commerce — Home RO2D

Data: 2026-09-01
Branch: `feat/catalogo-ecommerce`

A seção `#catalogo` da home passou a exibir uma grade responsiva com quatro cards. Em desktop há quatro colunas; em telas de até 1024px, duas colunas; em telas de até 820px, uma coluna.

| Produto | Preço exibido | Link do card | Imagem |
|---|---:|---|---|
| 300 Cards de Segurança Familiar | R$ 27,00 | `/cards_seguranca_familiar/` | `img/produto-seguranca.jpg` |
| A Palavra de Cada Dia | R$ 27,00 | `/a-palavra-de-cada-dia/` | `img/produto-biblicos.jpg` |
| Luz para Cada Dia | R$ 9,99 | `/luz-para-cada-dia/` | `luz-para-cada-dia/img/capa-pack-3.jpg` |
| Mentalidade Rica | R$ 9,99 | `/mentalidade_rica/` | `mentalidade_rica/img/capa-mentalidade-rica.png` |

Confirmações:

- Os preços dos três primeiros produtos seguem suas respectivas páginas de produto.
- O preço de Mentalidade Rica é R$ 9,99 por decisão confirmada de Diorge; esta alteração não modifica `mentalidade_rica/index.html`.
- Todos os CTAs usam o texto `Ver produto` e apontam para rotas internas existentes.
