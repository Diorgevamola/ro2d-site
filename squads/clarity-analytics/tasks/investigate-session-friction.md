---
task: Investigate Session Friction
responsavel: "@clarity-analyst"
responsavel_type: agent
atomic_layer: task
Entrada: |
  - date_window: Bounded UTC or provider-supported window
  - campaign_or_landing_page: Campaign identifier or landing-page URL
  - friction_threshold: Optional threshold for prioritization
Saida: |
  - friction_report: Dead clicks, rage clicks, quick backs, error clicks and script errors
  - recording_sample: Small bounded list of relevant recordings where available
  - prioritized_hypotheses: Clearly labelled hypotheses and next checks
Checklist:
  - "[ ] Load microsoft-clarity-analytics skill"
  - "[ ] Query friction metrics with matching dimensions"
  - "[ ] Calculate affected-session rates from returned counts"
  - "[ ] Bound recordings by date and relevant landing-page scope"
  - "[ ] Protect personal data and do not reproduce replay contents"
  - "[ ] Label all causal explanations as hypotheses"
---

# *investigate-session-friction

Diagnose whether paid visitors encounter technical or interaction friction on a landing page.

## Procedure

1. Retrieve dead-click, rage-click, quick-back, error-click, and script-error metrics for the same window and segment as the paid-session baseline.
2. Report both the affected-session rate and returned event count. Do not conflate the two.
3. When signals exist, retrieve only a small, date-bounded sample of relevant recordings, subject to the provider capabilities and privacy rules.
4. Identify recurring page, device, browser, or interaction patterns without exposing session-level identifiers or replay content.
5. Rank next checks by observed paid-session impact: broken scripts/errors first, then non-responsive interactions, then content/offer hypotheses.

## Completion Criteria

The report distinguishes metric facts, sampled qualitative patterns, and hypotheses; it includes no token or personal data.
