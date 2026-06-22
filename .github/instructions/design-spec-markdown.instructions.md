---
description: "Use when writing or editing markdown design specifications for frontend UX and UI behavior. Enforces consistent structure and wording."
name: "Design Spec Markdown Consistency"
applyTo:
  - "**/*design*.md"
  - "**/*spec*.md"
  - "docs/**/*.md"
  - "tracks/**/*.md"
---

# Design Spec Markdown Consistency

Use this format for design-spec style markdown files.

## Required Section Order

1. Objective
2. Users and key tasks
3. Information architecture
4. Layout and hierarchy
5. Interaction states
6. Responsive behavior
7. Accessibility requirements
8. Acceptance criteria
9. Open questions

## Writing Rules

- Use direct, implementation-ready language.
- Keep requirements measurable and testable.
- Avoid framework names, library names, and code snippets in design specs.
- Define behavior for loading, empty, and error states.
- Include keyboard and focus expectations for interactive elements.

## Formatting Rules

- Use sentence case headings.
- Use short bullet points for requirements.
- Use numbered lists only for ordered procedures.
- Keep one requirement per bullet where possible.
- Avoid duplicated sections and repeated wording.

## Requirement Pattern

Use this sentence pattern for concrete requirements:

- "When [condition], the UI should [observable behavior], so the user can [goal]."

## Final Review Checklist

- Sections are in the required order.
- States include default, hover, focus, active, disabled, loading, empty, and error.
- Responsive guidance covers mobile, tablet, and desktop.
- Accessibility requirements include semantics, keyboard flow, and contrast intent.
- Acceptance criteria can be validated by QA or tests.
