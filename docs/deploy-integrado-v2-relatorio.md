# Relatório — deploy integrado v2

Status: PASS

Base e integração:

- Base atualizada: `origin/main` em `e647b8ddbca72a357a0dcb4ef26133820bdc5999`.
- Worktree isolado: `/home/orca/ro2d/ro2d-site/.worktrees/deploy-integrado-v2`.
- Branch local: `deploy/integrado-v2`.
- Merge da homepage: `1d27c79 merge: integrate homepage products fix`.
- Merge do logo: `2bec44f merge: integrate logo fix`.
- Nenhum push ou deploy foi executado.

## Correções de origem

- `fix/homepage-produtos` recebeu o commit `e88bfd173b22b4f610d8cda49340390a76a1e50b` (`feat(ro2d): add Mentalidade Rica card to homepage`). Ele inclui o quarto card, o título `Quatro baralhos publicados.` e o link `/mentalidade_rica/` com preço `R$ 9,99`.
- `fix/nova-logo` recebeu o commit `7d084362d9a85b09bb3c260c97aee25fbd4756c7` (`fix(ro2d): add favicon to Luz para Cada Dia`). Ele inclui o favicon em `luz-para-cada-dia/index.html`.

## Validações executadas

### A. Home: quatro produtos e Mentalidade Rica

Comando:

```bash
grep -nE 'Quatro baralhos publicados|href="/(cards_seguranca_familiar|a-palavra-de-cada-dia|luz-para-cada-dia|mentalidade_rica)/"|130 Cards Mentalidade Rica|R\$ 9,99' index.html
```

Evidência:

```text
296: Quatro baralhos publicados.
318: href="/cards_seguranca_familiar/"
341: href="/a-palavra-de-cada-dia/"
364: href="/luz-para-cada-dia/"
376: 130 Cards Mentalidade Rica
386: R$ 9,99
387: href="/mentalidade_rica/"
```

Resultado: PASS.

### B. Home: favicon, header e footer com logo RO2D

Comando:

```bash
grep -nE '<link rel="icon" href="/img/logo-ro2d.jpg" type="image/jpeg">|<header|<footer|logo-ro2d\.jpg' index.html
```

Evidência:

```text
25: <link rel="icon" href="/img/logo-ro2d.jpg" type="image/jpeg">
222: <header>
225: <img src="img/logo-ro2d.jpg" alt="RO2D">
533: <footer>
537: <img src="img/logo-ro2d.jpg" alt="RO2D">
```

Resultado: PASS.

### C. Favicon em todas as quatro páginas de produto

Comando:

```bash
for f in cards_seguranca_familiar/index.html a-palavra-de-cada-dia/index.html luz-para-cada-dia/index.html mentalidade_rica/index.html; do
  printf '%s: ' "$f"
  grep -oF '<link rel="icon" href="/img/logo-ro2d.jpg" type="image/jpeg">' "$f" | wc -l
done
```

Evidência:

```text
cards_seguranca_familiar/index.html: 1
a-palavra-de-cada-dia/index.html: 1
luz-para-cada-dia/index.html: 1
mentalidade_rica/index.html: 1
```

Resultado: PASS.

### D. Mentalidade Rica: preço e checkout

Comando:

```bash
grep -nE 'R\$ ?9,99|checkout' mentalidade_rica/index.html
grep -nF '#checkout-pendente' mentalidade_rica/index.html
```

Evidência:

```text
753: R$ 9,99
757: href="https://app.abacatepay.com/pay/bill_nXzeLZ2HqHuLcqLUug0FLPct"
896: href="https://app.abacatepay.com/pay/bill_nXzeLZ2HqHuLcqLUug0FLPct"
#checkout-pendente: ausente
```

Resultado: PASS. O checkout real da AbacatePay permanece presente e não há placeholder pendente.

### E. Integridade do diff

Comando:

```bash
git diff --check origin/main...HEAD
```

Evidência: comando retornou código `0`, sem saída.

Resultado: PASS.
