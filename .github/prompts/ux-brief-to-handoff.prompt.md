---
description: "Create a framework-agnostic UX brief and engineering handoff plan for a frontend feature"
name: "UX Brief To Handoff"
argument-hint: "Feature or page to design and hand off"
agent: "frontend-designer"
---

Produce a complete UI/UX brief and implementation handoff package.

Input:
- Scope: {{input}}

Requirements:
- Keep guidance generic and framework-agnostic.
- Do not include code snippets.
- Specify behavior for default, hover, focus, active, disabled, loading, empty, and error states.
- Include responsive guidance for mobile, tablet, and desktop.
- Include accessibility requirements aligned with WCAG 2.1 AA intent.
- End with handoff guidance and the best engineering agent target.

Return this structure:

1. UX objective and target users
2. Information architecture and screen layout
3. Component behaviors and interaction states
4. Responsive behavior by breakpoint
5. Accessibility and usability requirements
6. Acceptance criteria for implementation
7. Engineering handoff checklist
8. Recommended handoff agent and reason
