---
description: "Generate a React test plan before implementation using Vitest and React Testing Library"
name: "React Test Plan"
argument-hint: "Component or feature to plan tests for"
agent: "react-tester"
---

Create a test plan before writing any test code.

Input:
- Scope: {{input}}

Requirements:
- Use Vitest and React Testing Library conventions.
- Do not write test implementation code yet.
- Focus on behavior, accessibility, async states, and failure scenarios.
- Identify where mocks are needed and where real behavior should be preserved.

Return this structure:

1. Test scope and assumptions
2. Critical user behaviors to verify
3. Suggested test cases (happy path, edge cases, error states)
4. Accessibility checks to include
5. Mocking strategy
6. File layout and naming plan
7. Risks and open questions
