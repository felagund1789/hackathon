---
description: "Use when working on challenge-4-frontend-track. Coordinates Frontend Designer, React Frontend Engineer, React Tester, and Accessibility Reviewer agents with planning and verification at each stage."
name: "Challenge 4 Frontend Copilot Workflow"
applyTo: "challenges/challenge-4-frontend/**/*.{ts,tsx,js,jsx}, challenges/challenge-4-frontend/**/*.md"
---

# Challenge 4 Frontend Copilot Workflow

This instruction coordinates all custom agents and prompts for the frontend challenge. Follow this workflow to build a complete, tested, and accessible React application with GitHub Copilot guidance.

## Workflow Overview

Each stage follows this sequence:

1. **Plan Phase**: Create a UX/design brief using Frontend Designer
2. **Design Phase**: Refine UI/UX guidelines (framework-agnostic)
3. **Implementation Phase**: Code React components with React Frontend Engineer
4. **Test Phase**: Write tests with React Tester
5. **Audit Phase**: Review for accessibility with Frontend Accessibility Reviewer
6. **Verify Phase**: Confirm deliverables meet stage requirements
7. **Save Plan**: Document decisions for future reference

## Getting Started

1. Navigate to `challenges/challenge-4-frontend/`
2. Run `npm install` and `npm run dev`
3. Open the chat in VS Code and read this workflow as you progress
4. Keep a markdown file (e.g., `STAGE_PLANS.md`) to track design decisions and plans

## Stage-by-Stage Guidance

### Pre-Work: Setup and Planning

**Before you start any stage, create a stage plan file:**

- Use the prompt `/` -> `UX Brief To Handoff` with your stage scope
- Save the output to `challenges/challenge-4-frontend/STAGE_PLANS.md`
- This becomes your reference during implementation

**File structure recommendation:**

```
challenges/challenge-4-frontend/
├── STAGE_PLANS.md          # All UX/design briefs and handoffs
├── src/
│   ├── components/         # React components
│   ├── __tests__/          # Test files
│   ├── types/              # TypeScript interfaces
│   └── ...
```

### Stage 1: Component Architecture and Layout

**Deliverable:** Responsive dashboard, routing, static components

**Steps:**

1. **Plan & Design** (15 min)
   - Prompt: `UX Brief To Handoff`
   - Input: "Dashboard layout with header, sidebar, main content, and task card components"
   - Save output to `STAGE_PLANS.md` under "Stage 1: UX Brief"
   - Verify it includes: information architecture, layout grid, responsive behavior, component states

2. **Implementation** (40 min)
   - Use: **Frontend Designer** agent (if you need layout clarification)
   - Use: **Expert React Frontend Engineer** agent for:
     - Set up React Router with 3 routes
     - Create TypeScript interfaces for tasks
     - Build Dashboard, TaskList, TaskCard, and Layout components
     - Use Tailwind CSS for responsive design
   - Reference the design brief from Step 1

3. **Testing** (10 min)
   - Use: **React Tester** agent
   - Generate tests for component rendering and routing
   - Test responsive behavior at 3 breakpoints
   - Aim for >60% coverage on Stage 1

4. **Accessibility Review** (10 min)
   - Use: **Frontend Accessibility Reviewer** agent
   - Focus: Semantic HTML, heading hierarchy, keyboard navigation
   - Document findings in `STAGE_PLANS.md` under "Stage 1: A11y Findings"

5. **Verification**
   - Routes navigate without page reload
   - Components render at mobile (375px), tablet (768px), desktop (1440px)
   - TypeScript strict mode passes
   - Tests pass and cover main flows

---

### Stage 2: State Management and CRUD

**Deliverable:** Context + useReducer, forms, optimistic updates, undo

**Steps:**

1. **Plan & Design** (10 min)
   - Prompt: `UX Brief To Handoff`
   - Input: "Add task creation form, edit/delete actions, loading states, error states, and undo capability"
   - Save to `STAGE_PLANS.md` under "Stage 2: UX Brief"
   - Include: Form validation states, optimistic UI feedback, error messaging

2. **Implementation** (50 min)
   - Use: **Expert React Frontend Engineer** agent for:
     - Create a task reducer hook with Context
     - Build CreateTaskForm and EditTaskForm components
     - Implement optimistic updates and undo stack
     - Add loading and error states to task operations
   - Reference both the Stage 2 design brief and Stage 1 component structure

3. **Testing** (25 min)
   - Use: **React Tester** agent
   - Write tests for:
     - Reducer actions and state transitions
     - Form submission and validation
     - Optimistic updates and rollback
     - Undo/redo state recovery
   - Target >70% coverage

4. **Accessibility Review** (10 min)
   - Use: **Frontend Accessibility Reviewer** agent
   - Focus: Form labels, error announcements, focus management, loading state communication
   - Document in `STAGE_PLANS.md` under "Stage 2: A11y Findings"

5. **Verification**
   - Create, edit, delete task flows work
   - Optimistic updates revert on error
   - Undo stack functions correctly
   - Form validates and shows errors
   - Tests pass

---

### Stage 3: Advanced Interactions

**Deliverable:** Theme switching, drag-and-drop Kanban, keyboard shortcuts, toasts

**Steps:**

1. **Plan & Design** (10 min)
   - Prompt: `UX Brief To Handoff`
   - Input: "Theme toggle UI, Kanban board columns with drag-and-drop, keyboard shortcut help, toast notifications for task events"
   - Save to `STAGE_PLANS.md` under "Stage 3: UX Brief"
   - Include: Keyboard shortcut list, theme persistence, toast position/timing, drop feedback

2. **Implementation** (50 min)
   - Use: **Expert React Frontend Engineer** agent for:
     - Theme context and localStorage persistence
     - Kanban board with drag-and-drop (React DnD or similar)
     - Toast notification system
     - Keyboard shortcut handler and help modal
   - Reference Stage 2 state management and design brief

3. **Testing** (25 min)
   - Use: **React Tester** agent
   - Write tests for:
     - Theme switching and persistence
     - Drag-and-drop column transitions
     - Keyboard shortcut triggering
     - Toast lifecycle and dismissal
   - Target >75% coverage

4. **Accessibility Review** (10 min)
   - Use: **Frontend Accessibility Reviewer** agent
   - Focus: Keyboard navigation, focus trap management in modals, keyboard shortcut conflicts, toast ARIA live regions
   - Document in `STAGE_PLANS.md` under "Stage 3: A11y Findings"

5. **Verification**
   - Theme persists after reload
   - Drag-and-drop works with mouse and keyboard
   - Keyboard shortcuts execute correctly
   - Toasts appear and auto-dismiss
   - Tests pass

---

### Stage 4: Accessibility and Performance

**Deliverable:** WCAG AA compliance, fix 5 a11y bugs, virtualized list, code splitting

**Steps:**

1. **Plan & Design** (10 min)
   - Prompt: `UX Brief To Handoff`
   - Input: "Virtualized task list for performance, code-split routes for faster initial load, fix identified accessibility violations from earlier stages"
   - Save to `STAGE_PLANS.md` under "Stage 4: UX Brief and A11y Fixes"
   - Reference previous accessibility findings

2. **Accessibility Audit** (20 min)
   - Use: **Frontend Accessibility Reviewer** agent with focus on:
     - WCAG 2.1 AA compliance scan
     - Contrast ratios on all text
     - Focus indicators and keyboard navigation
     - ARIA labels and semantics
     - Form accessibility
   - Document 5 priority bugs in `STAGE_PLANS.md` under "Stage 4: Critical A11y Bugs"

3. **Implementation** (40 min)
   - Use: **Expert React Frontend Engineer** agent for:
     - Implement virtualized task list (react-window or similar)
     - Add code splitting with React.lazy() and Suspense
     - Fix identified accessibility bugs
     - Ensure color contrast passes WCAG AA
     - Add proper heading hierarchy
   - Reference design brief and accessibility audit findings

4. **Testing** (20 min)
   - Use: **React Tester** agent
   - Write tests for:
     - Virtualized list rendering and scrolling
     - Code-split route loading
     - Keyboard accessibility flows
     - ARIA live regions for status updates
   - Target >80% coverage

5. **Verification**
   - Virtualized list renders 5000+ items smoothly
   - Page loads in <2 seconds (check Network tab)
   - All WCAG AA violations fixed and tested
   - Tests pass

---

### Stage 5: Integration and Testing

**Deliverable:** API integration or MSW mocking, offline support, >80% test coverage

**Steps:**

1. **Plan & Design** (10 min)
   - Prompt: `UX Brief To Handoff`
   - Input: "API integration with mock service worker, offline detection UI, retry logic, empty and error states for all API calls"
   - Save to `STAGE_PLANS.md` under "Stage 5: UX Brief"

2. **Implementation** (40 min)
   - Use: **Expert React Frontend Engineer** agent for:
     - Set up MSW (Mock Service Worker) handlers
     - Create API integration layer
     - Add offline detection and fallback UI
     - Implement retry logic for failures
     - Add empty and error states for data fetching
   - Reference design brief

3. **Testing** (40 min)
   - Use: **React Tester** agent
   - Write tests for:
     - API success, failure, and timeout scenarios
     - Offline mode detection and UI
     - Retry behavior
     - Empty, loading, and error states
     - Full happy-path workflows (create → read → update → delete)
   - Target >80% coverage
   - Use MSW to mock all API calls

4. **Accessibility Review** (15 min)
   - Use: **Frontend Accessibility Reviewer** agent
   - Focus on: Error message clarity, loading state announcements, offline mode clarity
   - Document final findings in `STAGE_PLANS.md` under "Stage 5: A11y Review"

5. **Final Verification**
   - All API calls work with MSW
   - Offline mode detected and communicated
   - Error recovery works
   - >80% test coverage achieved
   - All tests pass
   - No TypeScript errors

## Using the Agents

### Frontend Designer Agent

**When to use:** Need generic, framework-agnostic UI/UX guidance

**Example prompts:**
- "Design the loading state UI for a task creation form"
- "Define responsive behavior for a dashboard at mobile, tablet, and desktop sizes"
- "What should the Kanban board look like with drag-and-drop feedback?"

**Output:** Detailed UI behavior, layout grid, interaction states, responsive breakpoints

---

### Expert React Frontend Engineer Agent

**When to use:** Ready to implement React components, hooks, or state management

**Example prompts:**
- "Build a TaskCard component that displays task title, description, and status with click handlers"
- "Create a useTaskReducer hook with create, update, delete, and undo actions"
- "Implement a Kanban board with React DnD, including drop feedback and persistence"

**Output:** Complete, tested React code with TypeScript, comments explaining logic

---

### React Tester Agent

**When to use:** Need to write tests for components or hooks

**Example prompts:**
- "Write Vitest tests for the TaskForm component including validation and submission"
- "Create tests for the useTaskReducer hook covering all actions and edge cases"
- "Test the optimistic update behavior when task creation fails"

**Output:** Complete test files with clear test names, good coverage, and helper utilities

---

### Frontend Accessibility Reviewer Agent

**When to use:** Need to audit UI for WCAG violations or strengthen a11y test coverage

**Example prompts:**
- "Review the Dashboard layout for keyboard navigation and ARIA labels"
- "Audit the form for WCAG AA compliance and suggest fixes"
- "Add accessibility tests for the Kanban board drag-and-drop interaction"

**Output:** Priority list of issues, suggested fixes, test recommendations

---

## Planning Template

Create `STAGE_PLANS.md` with this structure:

```markdown
# Challenge 4 Frontend: Stage Plans and Decisions

## Stage 1: Component Architecture and Layout

### UX Brief
[Output from Frontend Designer agent / UX Brief To Handoff prompt]

### Design Decisions
- Layout approach: [e.g., CSS Grid + Flexbox]
- Component split: [which components and why]
- Responsive strategy: [breakpoint approach]

### A11y Findings
[Output from Frontend Accessibility Reviewer agent]

### Implementation Notes
[What worked, what didn't, key patterns]

---

## Stage 2: State Management and CRUD

### UX Brief
[Design brief for this stage]

### Design Decisions
- State management: [Context, Redux, etc.]
- Form handling: [controlled, uncontrolled, etc.]
- Optimistic update approach: [specific pattern]

### A11y Findings
[Accessibility review results]

### Implementation Notes
[Lessons learned]

---

[Continue for Stages 3-5...]
```

## Key Principles

1. **Always Plan First** -- Use Frontend Designer to create a UX brief before coding
2. **Separate Concerns** -- Each agent handles its domain (design, implementation, testing, a11y)
3. **Design is Framework-Agnostic** -- The design brief should be implementable in any stack
4. **Tests as Specification** -- Write tests that verify the design brief requirements
5. **Accessibility is Foundational** -- Review a11y at every stage, not just at the end
6. **Save Your Plans** -- Keep design briefs and decisions for iteration and reference

## Quick Reference: Agent Handoff Commands

**When you need UI/UX guidance:**
> Use the Frontend Designer agent to define the layout and behavior

**When you're ready to implement:**
> Use the Expert React Frontend Engineer agent with your design brief and stage deliverables

**When you need to test components:**
> Use the React Tester agent and reference the component you want to test

**When you find accessibility issues:**
> Use the Frontend Accessibility Reviewer agent to prioritize and fix them

## Troubleshooting

**Q: How do I know if my design brief is complete?**
A: It should answer: What is the user goal? What does the UI look like? What are the interaction states? How does it respond on mobile/tablet/desktop? What are the a11y requirements?

**Q: Can I skip the testing phase?**
A: No -- tests verify that the design brief was implemented correctly. They're not optional.

**Q: Should I ask all agents to review my code?**
A: Follow the workflow order: Designer → Engineer (implement) → Tester (test) → Accessibility Reviewer (audit).

**Q: What if the accessibility reviewer finds major issues?**
A: Prioritize them in `STAGE_PLANS.md` and fix them in the next iteration or stage.

---

**Start with Stage 1:** Use the `UX Brief To Handoff` prompt to create your first design brief, save it to `STAGE_PLANS.md`, then follow the workflow steps above.
