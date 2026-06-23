# Challenge 4 Frontend: Stage Plans and Decisions

Use this file to track design briefs, decisions, and implementation notes as you progress through each stage of the challenge. Generate each stage's UX brief using the `/UX Brief To Handoff` prompt and paste the output under the corresponding stage section.

---

## Stage 1: Component Architecture and Layout

**Status:** 🎯 Updated Brief (Ready for Implementation)

### UX Brief

#### Objective
Establish a foundational dashboard interface that displays a task management system with clear information hierarchy, a streamlined two-link navigation (Dashboard and All Tasks), summary card status overview, and responsive structure across mobile (375px), tablet (768px), and desktop (1440px). Users should be able to navigate between views and access task details by clicking individual task cards.

#### Target Users
Product managers, project leads, and team members who need to monitor task status and drill down into individual tasks for details.

#### Key Layout Components

**Header**
- Fixed header with height of 4rem (64px), positioned at top of viewport
- Contains app title/logo on left side (3.5rem from left edge, vertically centered)
- Contains current page/view title label on right side (aligned with main content area)
- Background color: Neutral light gray or white with subtle shadow for depth
- Z-index: High enough to stay above content when scrolling

**Sidebar Navigation**
- Desktop (1440px): 15rem (240px) fixed width, left-aligned below header
- Tablet (768px): 12.5rem (200px) fixed width, left-aligned below header
- Mobile (375px): Hidden by default; accessible via hamburger menu or bottom tab navigation
- Navigation links: Only 2 items (remove Task Detail link from navigation)
  1. Dashboard -- leads to dashboard summary view
  2. All Tasks -- leads to full task list view
- Active link styling: Distinct background color (e.g., blue tint) to show current page
- Focus states: 2px outline with 0.25rem (4px) offset for keyboard navigation
- Link padding: 1rem horizontal, 0.75rem vertical (12px gaps between items)

**Main Content Area**
- Responsive area that adjusts based on sidebar presence and screen size
- Padding: 1.5rem (24px) on mobile, 2rem (32px) on tablet and desktop
- Maximum content width on desktop: 56rem (900px) for single-column layouts, full width for multi-column
- No horizontal scrolling at any breakpoint

**Dashboard View - Summary Cards Section**
- Grid layout with responsive columns:
  - Mobile (375px): 2 columns (2x2 grid)
  - Tablet (768px): 3 columns (1x3 or 2x2 depending on card count)
  - Desktop (1440px): 4 columns in a row (or fewer if blocked tasks don't exist)
- Card stack (top to bottom, left to right):
  1. **Todo Card** (always visible) -- cyan/light blue background (#06B6D4 or similar teal)
     - Displays count of tasks with "To Do" status
     - Label: "Todo"
  2. **In Progress Card** (always visible) -- blue background (#0EA5E9 or similar)
     - Displays count of tasks with "In Progress" status
     - Label: "In Progress"
  3. **Blocked Card** (conditional, only if blocked tasks exist) -- magenta/pink background (#EC4899 or similar)
     - Displays count of tasks with "Blocked" status
     - Label: "Blocked"
  4. **Done Card** (always visible) -- green background (#10B981 or similar)
     - Displays count of tasks with "Done" status
     - Label: "Done"
- Each card structure:
  - Height: 5rem (80px), consistent across all cards
  - Padding: 1rem (16px)
  - Border-radius: 0.5rem (8px)
  - Content: Large number (2.5rem/40px font) + label below (0.875rem/14px font)
  - Color: White text on colored background, sufficient contrast (WCAG AAA 7:1 minimum)
  - Click state: Pointer cursor, subtle scale or shadow change (optional animation)

**Task List Section (Dashboard and All Tasks pages)**
- Vertical stack of TaskCard components
- Gap between cards: 0.75rem (12px) on mobile, 1rem (16px) on tablet/desktop
- No card background wrapper needed -- cards are the primary visual elements

**TaskCard Component**
- Height: 6rem (96px) minimum to accommodate new layout
- Layout: Horizontal flex container with left-to-right content flow
- Background: White or light gray with 1px border (#E5E7EB or similar)
- Border-radius: 0.375rem (6px)
- Padding: 1rem (16px) on all sides
- Box-shadow: Subtle shadow (0 1px 3px rgba(0,0,0,0.1)) on default state
- Internal structure (left to right):
  1. **Priority Indicator** (left edge)
     - 0.25rem (4px) thick left border with priority color (red for high, yellow for medium, green for low)
     - Height: full card height (extends beyond padding)
     - Positioned absolutely on the left edge or as first flex child
  2. **Main Content Area** (flex-grow)
     - Title: Bold, 1rem (16px) font, dark gray/black
     - Status Badge: Inline with title or below, 0.5rem (8px) padding, small font (0.75rem/12px), rounded pill shape
       - Color matches status: To Do (gray), In Progress (blue), Blocked (pink), Done (green)
       - Text only, no icon confusion
  3. **Due Date Section** (moved to LEFT side, below priority indicator or inline with title area)
     - Label: "Due:" prefix in lighter text (0.875rem/14px font, gray color)
     - Date value: Bold or emphasized, 0.875rem (14px) font
     - Format: "Due: Jan 15" or "Due: 2 days left" (relative or absolute, consistent)
     - Position: Left side, NOT right side (different from previous design)
  4. **Assignee Section** (right side, new)
     - Label: "Assignee:" prefix in lighter text (0.875rem/14px font)
     - Name: Bold or emphasized, 0.875rem (14px) font
     - Assignee picked from predefined list (e.g., "Alice", "Bob", "Carol", etc.)
     - Display full name, not initials
     - Optional: Avatar placeholder if desired (small circle, 1.5rem/24px, with initials or icon)

- **Hover State (desktop only):**
  - Background: Light blue tint (#F0F9FF or similar)
  - Box-shadow: Slightly elevated (0 4px 6px rgba(0,0,0,0.12))
  - Cursor: pointer

- **Focus State (keyboard navigation):**
  - 2px outline with 0.25rem (4px) offset, blue color
  - Outline-offset: 0.125rem (2px)

- **Click Behavior:**
  - Card is clickable (entire card or explicit click zone)
  - Navigate to Task Detail page with task ID in URL (/task/:id)
  - No separate button needed

**Task Interface (TypeScript)**
- Must include:
  - id: unique identifier
  - title: string
  - status: enum ("To Do" | "In Progress" | "Blocked" | "Done")
  - priority: enum ("High" | "Medium" | "Low")
  - dueDate: ISO date string (e.g., "2026-02-15")
  - assignee: string (full name from predefined list)
  - Optional: description, createdAt, updatedAt (for future use)

#### Responsive Behavior

**Mobile (375px breakpoint)**
- Header: 4rem height (fixed)
- Sidebar: Hidden; access via hamburger menu (slide-out drawer) or bottom tab bar
  - If hamburger: Drawer overlays content on left, 12.5rem width, Z-index above content
  - If bottom tabs: Fixed bar at bottom, 2 tabs (Dashboard, All Tasks), 3rem height
- Main content: Full width with 1.5rem padding
- Dashboard summary cards: 2-column grid (Todo, In Progress in first row; Blocked*, Done in second row)
  - *Blocked card omitted if no blocked tasks exist, allowing Done card to move up
  - Cards may stack vertically on very small screens (< 375px) -- single column
- TaskCard: 6rem height, full width
  - Priority indicator: 0.25rem left border (visible)
  - Due Date: Left side, below or beside priority
  - Assignee: Right side, small font (0.75rem/12px) to fit
  - Title: Truncate to 2 lines if needed, ellipsis for overflow

**Tablet (768px breakpoint)**
- Header: 4rem height (fixed)
- Sidebar: 12.5rem (200px) fixed, visible on left
- Main content: Adjusts to sidebar, padding 2rem
- Dashboard summary cards: 3-column grid or 2x2 grid depending on card count
  - If 4 cards (with Blocked): 2 rows of 2
  - If 3 cards (no Blocked): 1 row of 3
- TaskCard: 6rem height, flexible width
  - All fields visible: priority, title, status badge, due date, assignee
  - Priority: 0.25rem left border
  - Due Date: Left side, full label "Due: [date]"
  - Assignee: Right side, full name

**Desktop (1440px breakpoint)**
- Header: 4rem height (fixed)
- Sidebar: 15rem (240px) fixed, visible on left
- Main content: Generous padding 2rem, max-width 56rem (900px) for centered layouts or full available width
- Dashboard summary cards: 4 columns in a single row (Todo, In Progress, Blocked*, Done)
  - *Blocked card only present if blocked tasks exist
  - Cards have consistent width with equal spacing
- TaskCard: 6rem height, flexible width up to max-content-width
  - All fields visible with ample space
  - Priority: 0.25rem left border
  - Due Date: Left side, full label and date
  - Assignee: Right side, full name with optional avatar

#### Accessibility Requirements

**Semantic HTML Structure**
- Use `<header>` for header bar
- Use `<nav>` with `<ul>/<li>` for sidebar navigation
- Use `<main>` for primary content area
- Use `<section>` for Dashboard and Task List views
- Use `<article>` or `<div role="article">` for TaskCard components
- Heading hierarchy: h1 for page title, h2 for section titles, h3 for card titles (TaskCard)
- Links: Marked with `<a>` or `<button>` with descriptive text

**Color Contrast**
- All text on colored backgrounds: Minimum 4.5:1 ratio (WCAG AA) for normal text
- Summary cards with colored backgrounds: 7:1 ratio preferred (WCAG AAA) for better readability
- Focus outlines: High contrast (blue or dark) against all backgrounds

**Focus and Keyboard Navigation**
- All interactive elements (links, buttons, clickable cards) focusable with Tab key
- Focus order: Left-to-right, top-to-bottom (natural reading order)
- Focus indicators: Clear 2px outline, 0.25rem offset, no hidden focus states
- Focus visible on nav links, sidebar items, and TaskCard components

**Touch Targets (Mobile)**
- Minimum touch target: 2.75rem x 2.75rem (44px x 44px)
- Sidebar hamburger button: 2.5rem x 2.5rem minimum
- Summary cards: Minimum 5rem height (achievable)
- TaskCard: 6rem height (achievable)
- Navigation links: 1rem vertical padding = adequate spacing

**Status and Priority Indicators**
- Status: Conveyed by color badge + text label ("To Do", "In Progress", "Blocked", "Done")
- Priority: Conveyed by left-border color + optional text label (if space permits)
- Do NOT rely on color alone to communicate status or priority

**Text Alternatives**
- Priority indicator: Use aria-label if icon only (e.g., "High priority")
- Summary cards: Use aria-label or explicit text for count (e.g., "3 To Do tasks" instead of just "3")

**Motion and Animation**
- Keep animations subtle and under 300ms for transitions
- Avoid flashing or rapid motion that could trigger photosensitive reactions
- Respect prefers-reduced-motion CSS media query if animations are used

**Error and Empty States**
- Empty task list: Show clear message "No tasks yet" with call-to-action (if applicable)
- Invalid task ID: Show 404 message on Task Detail page
- Loading state: Show skeleton or spinner with appropriate aria-busy state

#### Handoff Checklist for React Engineer

- [ ] **Layout Foundation**
  - [ ] Build responsive header (4rem) with app title and page label
  - [ ] Build responsive sidebar with 2-link navigation (Dashboard, All Tasks)
  - [ ] Implement header/sidebar positioning (fixed header, left sidebar on tablet+)
  - [ ] Ensure no horizontal scrolling at 375px, 768px, 1440px
  - [ ] Verify rem-based spacing throughout (0.75rem gaps, 2rem padding on desktop)

- [ ] **Navigation & Routing**
  - [ ] Set up React Router with 3 routes: Dashboard, All Tasks, Task Detail (/task/:id)
  - [ ] Implement NavLinks with active state styling
  - [ ] Test route transitions without page reload
  - [ ] Verify browser history works (back/forward buttons)

- [ ] **Task Data Model**
  - [ ] Define Task TypeScript interface with: id, title, status, priority, dueDate, assignee
  - [ ] Create hardcoded sample task array with 8-12 tasks
  - [ ] Include examples of each status (To Do, In Progress, Blocked, Done)
  - [ ] Use realistic assignee names from predefined list
  - [ ] Store in sampleTasks.ts file

- [ ] **Dashboard Component**
  - [ ] Display 4 summary cards (Todo, In Progress, Blocked*, Done)
  - [ ] *Blocked card only visible if blocked tasks exist
  - [ ] Each card shows count of tasks matching that status
  - [ ] Card colors: Todo=cyan, In Progress=blue, Blocked=magenta, Done=green
  - [ ] Display recent tasks below summary cards (or separate list)

- [ ] **TaskCard Component**
  - [ ] Render horizontal card with 6rem minimum height
  - [ ] Show priority indicator as left border (0.25rem thick)
  - [ ] Show title as bold text (h3 heading)
  - [ ] Show status as badge with text label
  - [ ] Show "Due: [date]" on LEFT side (repositioned from right)
  - [ ] Show "Assignee: [name]" on RIGHT side
  - [ ] Make entire card clickable to navigate to Task Detail page
  - [ ] Implement hover and focus states

- [ ] **TaskList Component**
  - [ ] Map task array to TaskCard components
  - [ ] Apply 0.75rem gap on mobile, 1rem on tablet+
  - [ ] Support both Dashboard view (recent tasks subset) and All Tasks view (full list)

- [ ] **Task Detail Page**
  - [ ] Accept :id parameter from URL
  - [ ] Fetch/find task from sample data
  - [ ] Display full task details
  - [ ] Show 404 or error if task ID not found
  - [ ] Provide back button or breadcrumb to return to previous view

- [ ] **Responsive Design**
  - [ ] Test and verify layout at 375px (mobile)
  - [ ] Test and verify layout at 768px (tablet)
  - [ ] Test and verify layout at 1440px (desktop)
  - [ ] Sidebar hidden and hamburger/tabs visible at 375px
  - [ ] Sidebar visible at 768px+ with correct width
  - [ ] Summary card grid adjusts: 2 columns on mobile, 3-4 on tablet/desktop
  - [ ] No horizontal overflow on any breakpoint

- [ ] **Accessibility**
  - [ ] Use semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`
  - [ ] Maintain heading hierarchy: h1 > h2 > h3
  - [ ] Ensure focus indicators visible on all interactive elements
  - [ ] Test keyboard navigation (Tab through all interactive elements)
  - [ ] Verify color contrast ratios (4.5:1 minimum)
  - [ ] Check touch target sizes (44px minimum on mobile)
  - [ ] Test with screen reader (NVDA, JAWS, VoiceOver) for semantic correctness

- [ ] **TypeScript & Code Quality**
  - [ ] Compile in strict mode with no errors
  - [ ] Define proper types for Task, Status, Priority
  - [ ] Use TypeScript for all component props
  - [ ] No use of `any` type
  - [ ] Consistent naming and file organization

- [ ] **Testing**
  - [ ] All routes render without errors
  - [ ] Components accept and render props correctly
  - [ ] TaskCard click navigation works
  - [ ] Active NavLink styling displays correctly
  - [ ] No console errors or warnings

#### Design Decisions

- **Layout approach:** Header (fixed at top, 4rem), Sidebar (left-fixed on tablet+, collapsible on mobile), Main content (flex-grow, responsive padding)
- **Spacing system:** All measurements in rem units (1rem = 16px base) for consistency and accessibility
- **Summary cards:** Color-coded by status for quick visual scanning; Blocked card conditional to minimize clutter when not needed
- **TaskCard information order:** Priority indicator (left) → Title + Status → Due Date (left side) → Assignee (right side) for natural left-to-right reading
- **Assignee display:** Full name instead of initials for clarity and accessibility
- **Navigation scope:** Reduced to 2 primary links (Dashboard, All Tasks) with Task Detail accessed via card click -- simplifies navigation mental model
- **Component split:** Separate files for Header, Sidebar, SummaryCard, TaskCard, TaskList, Dashboard, AllTasksPage, TaskDetailPage, plus types and sample data

#### Responsive Strategy
- Mobile-first approach: Start with 375px layout, scale up
- Use flexible layouts (Flexbox primary, CSS Grid for summary cards)
- Rem-based sizing for all spacing and dimensions
- Breakpoints: 375px (mobile), 768px (tablet), 1440px (desktop)
- Sidebar adaptation: Hidden on mobile (drawer/tabs), visible on tablet+

#### Engineering Handoff

**Suggested Approach:**
- Implement with React Router v6 and TypeScript
- Use Tailwind CSS for responsive design and spacing (convert rem values to Tailwind utilities or CSS custom properties)
- Create reusable component files in src/components/
- Keep data in src/data/sampleTasks.ts for Stage 2 state management work
- Use semantic HTML throughout

**No Framework-Specific Requirements Given** -- Engineer may choose implementation details (CSS-in-JS, styled-components, plain CSS, Tailwind utilities, etc.) as long as the visual and behavioral spec is met.

### A11y Findings
[Pending Frontend Accessibility Reviewer audit after implementation]

### Implementation Notes
[To be completed during implementation phase]

---

## Stage 2: State Management and CRUD

**Status:** Not started

### UX Brief
[Paste output from `UX Brief To Handoff` prompt with input: "Add task creation form, edit/delete actions, loading states, error states, and undo capability"]

### Design Decisions
- State management approach: [To be decided]
- Form handling strategy: [To be decided]
- Optimistic update pattern: [To be decided]

### A11y Findings
[After Frontend Accessibility Reviewer audit]

### Implementation Notes
[Record what worked, what didn't, key patterns discovered]

---

## Stage 3: Advanced Interactions

**Status:** Not started

### UX Brief
[Paste output from `UX Brief To Handoff` prompt with input: "Theme toggle UI, Kanban board columns with drag-and-drop, keyboard shortcut help, toast notifications for task events"]

### Design Decisions
- Theme management: [To be decided]
- Drag-and-drop library/approach: [To be decided]
- Keyboard shortcut strategy: [To be decided]

### A11y Findings
[After Frontend Accessibility Reviewer audit]

### Implementation Notes
[Record what worked, what didn't, key patterns discovered]

---

## Stage 4: Accessibility and Performance

**Status:** Not started

### UX Brief
[Paste output from `UX Brief To Handoff` prompt with input: "Virtualized task list for performance, code-split routes for faster initial load, fix identified accessibility violations from earlier stages"]

### Critical A11y Bugs Found
[List 5 priority accessibility issues to fix, sourced from Frontend Accessibility Reviewer audit]

1. [Bug 1]
2. [Bug 2]
3. [Bug 3]
4. [Bug 4]
5. [Bug 5]

### Design Decisions
- Virtualization library: [To be decided]
- Code splitting approach: [To be decided]
- Performance targets: [To be decided]

### A11y Fixes Applied
[Document which bugs were fixed and how]

### Implementation Notes
[Record what worked, what didn't, key patterns discovered]

---

## Stage 5: Integration and Testing

**Status:** Not started

### UX Brief
[Paste output from `UX Brief To Handoff` prompt with input: "API integration with mock service worker, offline detection UI, retry logic, empty and error states for all API calls"]

### Design Decisions
- API mocking approach: [To be decided, e.g., MSW]
- Offline detection strategy: [To be decided]
- Error recovery pattern: [To be decided]

### A11y Findings
[Final Frontend Accessibility Reviewer audit for Stage 5]

### Final Metrics
- Test coverage: [Target: >80%]
- Bundle size: [Record final measurement]
- Lighthouse score: [Record if available]

### Implementation Notes
[Record what worked, what didn't, key patterns discovered]

---

## Cross-Stage Decisions

### Component Architecture
[Document overall component hierarchy and relationships]

### Styling Approach
[CSS Modules, Styled Components, Tailwind, etc.]

### TypeScript Strategy
[Record patterns for types, interfaces, generics used]

### Testing Strategy
[Vitest + React Testing Library conventions adopted]

### Accessibility Standards
[WCAG 2.1 level adopted, key patterns for a11y]

---

## Key Learnings and Insights

[Record lessons learned that could apply to future frontend work]

- [Insight 1]
- [Insight 2]
- [Insight 3]

---

## Quick Reference: Commands and Prompts

**Generate a UX brief:**
```
Use the prompt: /UX Brief To Handoff
Input your stage scope, e.g., "Dashboard layout with header, sidebar, main content, and task card components"
Save the output to this file under the corresponding stage.
```

**Generate a test plan:**
```
Use the prompt: /React Test Plan
Input the component or feature you want to plan tests for.
```

**Get React implementation guidance:**
```
Use the agent: Expert React Frontend Engineer
Reference your UX brief and ask for specific components or features.
```

**Write tests for a component:**
```
Use the agent: React Tester
Reference the component file path and ask for tests.
```

**Audit for accessibility issues:**
```
Use the agent: Frontend Accessibility Reviewer
Ask for a WCAG 2.1 AA audit or specific a11y review.
```

---

**Next Step:** Start Stage 1 by generating a UX brief using the `UX Brief To Handoff` prompt.
