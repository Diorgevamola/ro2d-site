---
task: Analyze Paid Traffic
responsavel: "@clarity-analyst"
responsavel_type: agent
atomic_layer: task
Entrada: |
  - date_window: 1–3-day Clarity window
  - campaign_id: Optional paid campaign identifier
  - comparison_scope: Optional Meta click summary
Saida: |
  - paid_session_report: Source, medium, campaign, traffic and engagement metrics
  - campaign_mapping: Identifiers observed in Clarity
  - metric_limitations: Date semantics and click/session differences
Checklist:
  - "[ ] Load microsoft-clarity-analytics skill"
  - "[ ] Confirm read-only official Clarity access"
  - "[ ] Query source, medium and campaign for the requested window"
  - "[ ] Report traffic, engagement, pages per session and scroll depth"
  - "[ ] Separate Meta clicks from Clarity sessions"
  - "[ ] State data limitations and do not infer purchases"
---

# *analyze-paid-traffic

Collect a reproducible paid-traffic baseline from Microsoft Clarity.

## Procedure

1. Validate that `date_window` is within the supported 1–3-day export window; record the exact window returned by the provider.
2. Run a narrowly scoped read-only query for `Source`, `Medium`, and `Campaign`.
3. Retrieve traffic, pages per session, engagement time, and scroll depth with the same dimensions.
4. If `campaign_id` is supplied, isolate matching rows; otherwise, identify candidate paid rows without guessing their platform.
5. If a Meta click total is supplied, calculate and label the click-to-session difference as a measurement difference, not a conversion or tracking failure.
6. Return a table of facts followed by bounded interpretations and limitations.

## Completion Criteria

The output includes the exact window, dimensions, paid-session rows, observed campaign identifiers, and an explicit statement that Clarity does not confirm purchases.
