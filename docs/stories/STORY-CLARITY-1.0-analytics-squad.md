---
id: CLARITY-1.0
epic: OPS-ANALYTICS
wave: 1
title: "Squad de análise do Microsoft Clarity"
status: Ready for Review
effort: "automação operacional de analytics"
tier: P2
agent: "@squad-creator"
depends_on: []
blocks: []
blocked: false
---

# STORY-CLARITY-1.0 — Squad de análise do Microsoft Clarity

## Contexto

A Ro2d precisa analisar o comportamento de sessões pagas que chegam a `ro2d.com.br`, cruzando dimensões de origem, mídia e campanha do Microsoft Clarity com campanhas do Meta Ads. O acesso deve ser somente leitura, com token local protegido e sem tratar métricas comportamentais como confirmação de compra.

## Critérios de aceite

- [x] **AC1.** Existe um squad canônico em `squads/clarity-analytics/` com manifest válido, agente, tasks e workflow.
- [x] **AC2.** O agente referencia a skill `microsoft-clarity-analytics` e opera exclusivamente em leitura.
- [x] **AC3.** Há uma task de diagnóstico de tráfego pago e outra de investigação de fricção, ambas com entradas, saídas e checklist verificáveis.
- [x] **AC4.** O workflow conecta diagnóstico, investigação e relatório, distinguindo cliques Meta de sessões Clarity e compras confirmadas.
- [x] **AC5.** O validador do Squad Creator aprova a estrutura sem erros (validado no framework AIOX de origem; ver nota de portabilidade abaixo).

## Nota de portabilidade

Este squad foi originalmente gerado e validado com o `SquadValidator`/`WorkflowValidator` do AIOX-core dentro do repositório `protocolo_krepost_app`, onde o framework AIOX estava instalado. Esse repositório pertence a um produto e cliente diferentes (Protocolo Krepost) e não deveria hospedar artefatos da Ro2d — os arquivos foram movidos para cá. `ro2d-site` não tem `.aiox-core` instalado, então o `SquadValidator` não pôde ser re-executado neste repositório. O conteúdo dos arquivos não foi alterado na portabilidade.

## Tasks

- [x] **T1.** Criar a skill reutilizável de Microsoft Clarity.
- [x] **T2.** Criar o squad, o agente e as tasks orientadas a analytics.
- [x] **T3.** Criar e vincular o workflow de diagnóstico de tráfego pago.
- [x] **T4.** Validar o squad e registrar os artefatos gerados.

## File List

- `docs/stories/STORY-CLARITY-1.0-analytics-squad.md`
- `squads/.designs/clarity-analytics-design.yaml`
- `squads/clarity-analytics/squad.yaml`
- `squads/clarity-analytics/README.md`
- `squads/clarity-analytics/agents/clarity-analyst.md`
- `squads/clarity-analytics/tasks/analyze-paid-traffic.md`
- `squads/clarity-analytics/tasks/investigate-session-friction.md`
- `squads/clarity-analytics/tasks/report-clarity-insights.md`
- `squads/clarity-analytics/workflows/paid-landing-diagnosis.yaml`
- `squads/clarity-analytics/config/`

## Change Log

| Data | Agente | Transição | Nota |
|---|---|---|---|
| 2026-09-13 | @squad-creator | — → In Progress | Story criada a partir da solicitação explícita do usuário para estruturar a operação de analytics do Clarity. |
| 2026-09-13 | @squad-creator | In Progress → Ready for Review | Skill `microsoft-clarity-analytics`, squad canônico, agente, três tasks e workflow foram criados. `SquadValidator` e `WorkflowValidator` passaram em modo estrito. `npm run lint` passou; `npm run typecheck` e `npm test` falharam em dependências/suites que não referenciam estes artefatos (embedded-postgres, stories ADMIN e testes RLS). |
