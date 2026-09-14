---
task: Report Clarity Insights
responsavel: "@clarity-analyst"
responsavel_type: agent
atomic_layer: task
Entrada: |
  - paid_session_report: Output from analyze-paid-traffic
  - friction_report: Output from investigate-session-friction
  - meta_summary_optional: Optional campaign delivery and click summary
Saida: |
  - executive_report: Findings ordered by impact
  - next_actions: Read-only diagnosis follow-ups and owner-ready remediation items
  - measurement_gaps: Tracking and attribution limitations
Checklist:
  - "[ ] Begin with exact scope and data sources"
  - "[ ] Present facts before inferences"
  - "[ ] Preserve click versus session distinction"
  - "[ ] Do not claim revenue or purchases from Clarity"
  - "[ ] Prioritize defects affecting paid sessions"
  - "[ ] Include measurement gaps and validation steps"
---

# *report-clarity-insights

Create a decision-ready report from the paid-traffic and friction tasks.

## Report Format

1. Scope and exact window.
2. Paid traffic baseline.
3. Friction signals and their affected-session rates.
4. Cross-source comparison, if Meta summary is supplied.
5. Facts, then inferences, then next actions.
6. Measurement gaps: consent, blockers, UTM coverage, Pixel/CAPI, checkout confirmation, and provider limits.

## Completion Criteria

Every recommendation traces to an observed metric or is explicitly marked as a hypothesis requiring validation.
