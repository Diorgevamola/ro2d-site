# DNS do ro2d.com.br

O site está no ar e os domínios já estão cadastrados no EasyPanel. Falta apontar
o DNS — isso é feito no **registro.br**, onde você comprou o domínio.

## Registros a criar

Servidor: **178.104.248.117**

| Tipo | Nome | Valor |
|---|---|---|
| A | `@` (ou vazio) | `178.104.248.117` |
| A | `www` | `178.104.248.117` |

Só isso. Como a landing vive em um caminho (`/cards`) e não em subdomínio,
não é preciso criar entrada para `cards`.

No registro.br: entre no domínio → **Editar zona DNS** → adicione as duas
entradas. A propagação leva de 15 minutos a algumas horas, e o HTTPS é emitido
automaticamente pelo EasyPanel assim que o DNS resolver.

## Estrutura do site

| Endereço | Conteúdo |
|---|---|
| ro2d.com.br | Institucional: quem somos, catálogo, como funciona, políticas |
| ro2d.com.br/cards_seguranca_familiar | Landing de venda dos 300 Cards |

Tudo servido pelo mesmo container, a partir do repositório `ro2d-site`.

## Endereços antigos

Continuam funcionando e não atrapalham:

- `cards-seguranca-portal-dpa.bacjno.easypanel.host` — a mesma landing, na
  versão anterior. O `canonical` das duas aponta para `ro2d.com.br/cards`,
  então o Google entende qual é a oficial.
  O caminho antigo `/cards` redireciona (301) para o novo.
- `luz-para-cada-dia-portal-dpa.bacjno.easypanel.host` — landing do Luz para
  Cada Dia. **Ainda não foi movida** para o domínio novo; se quiser, dá para
  colocá-la em `ro2d.com.br/luz` do mesmo jeito.

Também deixei cadastrados no EasyPanel os domínios `cards.ro2d.com.br` e
`luz.ro2d.com.br` da montagem anterior. Eles não atrapalham, mas se quiser
limpar, é só removê-los no painel — eles não têm DNS apontado.

## Depois que o DNS estiver ativo

1. Criar a caixa **contato@ro2d.com.br** — o site inteiro aponta para lá.
2. Atualizar a "Página de vendas" do produto na Kiwify para
   `https://ro2d.com.br/cards_seguranca_familiar`.
3. Preencher razão social e CNPJ nos rodapés (institucional e landing).

## Verificar se propagou

```bash
nslookup ro2d.com.br
curl -I https://ro2d.com.br
curl -I https://ro2d.com.br/cards_seguranca_familiar/
```
