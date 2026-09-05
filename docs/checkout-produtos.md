# Checkouts dos produtos

Os cinco produtos que estavam pendentes foram cadastrados na AbacatePay como
produtos avulsos de R$ 9,99, com checkout PIX:

| Produto | Product ID | Checkout |
|---|---|---|
| Mentalidade Rica Vol. 2 | `prod_L2uyhUdkNju6Ttt5PYaLHMFH` | `bill_CjuzGpjrczBMRXTpp15hKYCj` |
| Mentalidade Rica Vol. 3 | `prod_k1uekjrZ6uDKeyw0tb632DLh` | `bill_nEtBWPnbjjCqrtWwDuD6A65d` |
| Eu Me Escolho Vol. 1 | `prod_FZ1fqLtpEwj5UUgRJgyj1AHq` | `bill_aJ3pHAYRAJa13XeAWewu5aF5` |
| Eu Me Escolho Vol. 2 | `prod_EcX3nWRGYQt014exjZ6RFnut` | `bill_HZxrkZ4HR0JZeSwkZ5TrynUY` |
| Eu Me Escolho Vol. 3 | `prod_HRzhHwauabLHzPCZTjBR1zsP` | `bill_hpxhkcR516j6zrXyMXSHmDYc` |

Os links completos estão no mapa de fallback de `js/pixel.js`. Os CTAs das
páginas usam o checkout dinâmico quando o webhook multi-produto estiver
configurado e caem nesses links estáticos quando o endpoint estiver indisponível.

Para concluir a entrega automática após o pagamento, ainda é necessário
preencher `PRODUCTS_JSON` no serviço do webhook com esses IDs, as URLs das cinco
páginas de obrigado e os links privados dos materiais.
