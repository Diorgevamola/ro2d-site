# Incidente SMTP webhook-universal — RESOLVIDO

**Data da correção (UTC):** 2026-09-08
**Serviço:** `webhook-universal` (Easypanel, projeto `portal-dpa`)
**Executor:** Agente Hermes, via terminal do container (Service Console) e API Easypanel

---

## Causa raiz real (contradiz a hipótese líder de bloqueio de IP)

A hipótese líder registrada em `incidente-smtp-webhook-universal-diagnostico-para-easypanel.md`
(bloqueio de IP de saída do container pelo provedor SMTP HostGator) foi **testada e
descartada**. Evidência:

1. Console/terminal real do container foi obtido via **Easypanel Service Console**
   (ícone de terminal na aba Overview do serviço → opção "Sh"), algo que os
   diagnósticos anteriores documentavam como indisponível.
2. `curl`/verificação de IP de saída de dentro do container confirmou que a hipótese
   de IP diferente não era o ponto — o problema real apareceu ao inspecionar a
   variável de ambiente efetiva dentro do processo do container.
3. **Achado real:** `SMTP_PASS` configurado no painel Easypanel tinha **18
   caracteres** (`***REDACTED***`), mas o valor que efetivamente chegava ao
   `process.env.SMTP_PASS` dentro do container era de **apenas 14 bytes**
   (`***REDACTED-PARTIAL***`) — truncado exatamente no caractere `#`.
4. O parser de variáveis de ambiente do Easypanel (editor de env no painel)
   trata `#` como início de comentário quando não está entre aspas, cortando
   silenciosamente o restante do valor (`uK-`) sem erro visível na UI.
5. Isso explica o erro de runtime documentado em `.webhook-universal-release-report.new.md`:
   `"Invalid login: 535 Incorrect authentication data"` — a senha realmente
   enviada ao servidor SMTP (HostGator/Exim) estava incompleta/errada, não
   houve bloqueio de rede algum.
6. `AUTH PLAIN` com a senha truncada é uma credencial diferente da real — o
   servidor corretamente rejeita com `535`, que é indistinguível de "senha
   errada" — daí a confusão anterior com hipóteses de rede/IP.

## Correção aplicada

1. No painel Easypanel → `webhook-universal` → Environment, o valor de
   `SMTP_PASS` foi reescrito **entre aspas simples**:
   `SMTP_PASS='***REDACTED***'`
   (mesma senha real, sem alteração de credencial — apenas correção de
   quoting para que o `#` pare de ser interpretado como comentário, já que
   a senha contém o caractere `#` sem estar entre aspas).
2. Redeploy do serviço disparado via `services.app.deployService` (Easypanel
   API) para propagar a env corrigida ao container em execução.
3. **Nota operacional:** durante a investigação, uma chamada de teste ao
   endpoint `services.app.updateEnv` (usada para descobrir o nome correto da
   mutation) sobrescreveu acidentalmente por alguns segundos a env do serviço
   com um valor de teste (`TEST=1`). Isso foi detectado imediatamente e a env
   completa e correta (já com a senha entre aspas) foi restaurada e
   redeployada antes de qualquer nova entrega ao vivo passar pelo serviço.
   Nenhum e-mail de cliente foi impactado (nenhum checkout válido ocorreu na
   janela do erro).

## Verificação da correção

Executado **dentro do container em produção**, via Service Console do
Easypanel (task `portal-dpa_webhook-universal.1.345k5rle0bz9w240jumiy43pz`):

```
$ node -e "const p=process.env.SMTP_PASS||''; console.log(JSON.stringify({len:p.length,bytes:Buffer.byteLength(p)}))"
{"len":18,"bytes":18}
```

Senha completa (18 bytes) agora chega íntegra ao processo — antes eram 14 bytes.

Teste real de handshake SMTP + autenticação, usando o `nodemailer` já
instalado na imagem do serviço (mesma versão de produção), com as
credenciais reais lidas do ambiente do próprio container:

```
$ node -e "const nm=require('nodemailer');const t=nm.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT),secure:process.env.SMTP_SECURE==='true',auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});t.verify().then(r=>console.log('VERIFY_OK',r)).catch(e=>console.log('VERIFY_FAIL',e.code,e.responseCode,e.message))"
VERIFY_OK true
```

**Handshake TCP + STARTTLS + AUTH PLAIN bem-sucedidos de dentro do container
de produção.** O erro `535 Incorrect authentication data` não se repete mais.

`GET /health` do serviço continua `200 {"status":"ok"}` após o redeploy.

## Item separado, não relacionado ao SMTP (fora de escopo desta correção)

Um teste ponta-a-ponta via `POST /webhooks/mentalidade-rica` com payload
sintético retornou `HTTP 401 {"erro":"webhook não verificado"}`. Isso é
esperado e **não é um bug**: a rota exige, além de HMAC assinado com a chave
pública da AbacatePay (não o `MENTALIDADE_RICA_WEBHOOK_SECRET`), um parâmetro
`secret` na query string comparado ao segredo do webhook — mecanismo de
verificação de assinatura da AbacatePay, ortogonal ao SMTP. Como o teste
sintético não reproduziu a assinatura real da AbacatePay, a rejeição em 401
é o comportamento correto do endpoint e confirma que a validação de
segurança da rota está intacta. Isso não faz parte do incidente SMTP e não
precisa de ação.

## Estado final

- **SMTP:** corrigido e verificado (`VERIFY_OK` de dentro do container real).
- **Serviço:** saudável (`/health` 200 OK), redeploy `cmtsxxho9001x07qtdzjgcwiu`
  concluído com `status: done`.
- **Nenhuma ação externa (HostGator, mudança de plano, whitelisting de IP)
  é necessária.** A causa raiz era 100% de configuração dentro da
  autoridade técnica do agente (formatação da variável de ambiente no
  Easypanel) e foi corrigida sem trocar credenciais nem infraestrutura.
- Próxima entrega real de pagamento (`checkout.completed` assinado
  corretamente pela AbacatePay) deve fluir normalmente; recomenda-se
  observar o log do próximo evento real para confirmar `outcome: "delivered"`.
