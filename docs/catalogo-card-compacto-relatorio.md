# Relatório — catálogo compacto na home

## Escopo

Alterado somente o catálogo em `index.html` da home. As quatro páginas individuais de produto não foram modificadas.

## Mudança aplicada

Cada card da home agora mostra apenas:

1. imagem do produto;
2. nome curto, limitado visualmente a uma linha;
3. uma descrição curta, limitada visualmente a uma linha;
4. preço em destaque;
5. botão `Ver produto`.

Foram removidos dos cards da home:

- selo/categoria acima do título;
- descrição longa;
- tabela de especificações (cards, trilhas, formato, folhas, edição e uso).

O grid responsivo, a elevação no hover, os tokens CSS existentes, as imagens, os links para as quatro páginas e os preços foram preservados.

## Informações que permanecem nas páginas individuais

As especificações detalhadas e a descrição completa permanecem nas páginas de cada produto. Nenhum arquivo de página individual foi alterado nesta branch.

## Medida aproximada de compactação

Medição estrutural do bloco `.cat` em `index.html`:

- antes: 94 linhas;
- depois: 63 linhas;
- redução: 31 linhas, aproximadamente 32%.

Além da redução de estrutura, a remoção de quatro linhas de especificação por produto reduz substancialmente a altura visual dos cards, especialmente no layout mobile de uma coluna.
