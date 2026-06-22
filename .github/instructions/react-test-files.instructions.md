---
description: "Use when creating or updating React test files with Vitest and React Testing Library. Covers test naming, folder placement, and mock patterns."
name: "React Test File Conventions"
applyTo:
  - "**/*.{test,spec}.{ts,tsx,js,jsx}"
  - "**/__tests__/**/*.{ts,tsx,js,jsx}"
---

# React Test File Conventions

Use these rules for all React tests.

## Naming Conventions

- Use file names that match the unit under test:
  - Component: `ComponentName.test.tsx`
  - Hook: `useFeature.test.ts`
- Prefer `.test` suffix over `.spec` when creating new files.
- Use clear test names based on user outcomes, for example: `shows validation error when title is empty`.

## Folder Layout

- Keep tests close to source when possible:
  - `src/components/Button.tsx`
  - `src/components/Button.test.tsx`
- Use `__tests__` only for cross-cutting integration tests or shared test suites.
- Keep shared test utilities in a stable location such as `src/test/`.

## Mock Patterns

- Mock only real boundaries: network, time, randomness, browser APIs not provided by jsdom.
- Prefer request-level mocks over mocking component internals.
- For module mocks, keep the mock minimal and reset state between tests.
- Avoid snapshot-only tests for interactive UI; add behavior assertions.

## React Testing Library Practices

- Query priority: `getByRole` -> `getByLabelText` -> `getByPlaceholderText` -> `getByText` -> `getByTestId`.
- Use `findBy*` and `waitFor` only for asynchronous behavior.
- Prefer user-event style interactions over low-level event dispatches.
