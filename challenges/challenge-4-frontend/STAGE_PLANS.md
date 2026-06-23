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

**Status:** ✅ Implemented & Ready for Testing

### UX Brief

#### Objective
Add full CRUD (Create, Read, Update, Delete) capabilities to the task management system with client-side state management using Context + useReducer, form handling with validation, optimistic UI updates, error recovery, and task undo capability. Users can create new tasks, edit existing tasks, delete tasks with confirmation, and undo recent actions. All operations provide immediate visual feedback (loading states) and error handling with clear messaging.

#### Target Users
Task creators and task managers who need to quickly add, modify, and remove tasks while being able to recover from mistakes with undo functionality.

#### Key Workflows

**Create Task Workflow**
1. User clicks "Add Task" button (in header or task list area)
2. Modal dialog opens with TaskCreateForm
3. User fills required field (Title) and optional fields (Description, Priority, Status, Due Date, Assignee)
4. User clicks "Create" button
5. Form validates: Title must be 3+ characters
6. On success: Task appears immediately in list (optimistic), API call sent, success toast shown, modal closes
7. On error: Toast shows error, form remains open for retry, task removed from list

**Edit Task Workflow**
1. User clicks edit icon/button on task card (pencil icon)
2. Modal opens with TaskEditForm pre-populated with current task data
3. User modifies any fields
4. User clicks "Save" button
5. Form validates same as create
6. On success: Task updates immediately in list (optimistic), API call sent, success toast, modal closes
7. On error: Toast shows error, form remains open, rollback to original task data

**Delete Task Workflow**
1. User clicks delete icon/button on task card (trash icon)
2. Confirmation dialog appears: "Delete task '[Title]'? This cannot be undone."
3. Two buttons: "Cancel" (secondary) and "Delete" (red/destructive)
4. User clicks "Delete"
5. Task disappears immediately from list (optimistic), API call sent
6. On error: Task reappears in list, error toast shown
7. On success: Success toast shown, task removed from list permanently

**Undo Workflow**
1. User performs action: create, edit, or delete task
2. "Undo" button becomes enabled in header (shows tooltip "Undo (Ctrl+Z)")
3. User can click Undo button or press Ctrl+Z (or Cmd+Z on Mac)
4. Last action is reversed: newly created task removed, edited task reverts to previous state, deleted task restored
5. Undo stack stores up to 10 previous states
6. After undoing, user can see what was undone via toast message

#### UI Components

**Create/Edit Task Form (Modal)**
- Modal dialog with semi-transparent backdrop (bg-black/30)
- Modal size: Max-width 28rem (448px) on tablet+, full width with padding on mobile
- Form title: "Create Task" or "Edit Task"
- Form fields (all with rem-based padding):
  1. **Title** (required) — Text input, placeholder "Task title", min 3 characters
  2. **Description** (optional) — Textarea, placeholder "Add details...", max 500 characters
  3. **Priority** — Select dropdown with options: High (red), Medium (yellow), Low (green)
  4. **Status** — Select dropdown with options: To Do, In Progress, Blocked, Done
  5. **Due Date** (optional) — Date input with calendar picker
  6. **Assignee** — Select dropdown with 5 predefined names
  7. All fields: 1rem gap between fields, label above input (0.875rem font, bold)

- Form validation:
  - Title: Must be 3-50 characters, cannot be empty, show error "Title must be 3-50 characters"
  - All other fields: No validation errors unless server returns error
  - Validation occurs on blur (for each field) and on submit attempt

- Buttons:
  - "Create" or "Save" (primary blue button, full width on mobile, 50% on tablet+) — disabled while loading
  - "Cancel" (secondary gray button) — always enabled, closes modal without saving
  - Loading state: Button shows "Creating..." or "Saving..." text with spinner

- Error display:
  - Error banner at top of form (red background, white text, icon)
  - Message: e.g., "Failed to create task. Please check your input."
  - Option to dismiss error

**Add Task Button**
- Location: Header bar (right side, next to page title)
- Style: Primary blue button with plus icon
- Label: "Add Task" or just icon
- Tooltip: "Create a new task"

**Edit/Delete Icons on Task Card**
- Two small icon buttons on task card (top right corner or contextual menu)
- Edit icon: Pencil (gray-600, hover: blue)
- Delete icon: Trash (gray-600, hover: red)
- Button size: 1.5rem × 1.5rem for touch targets
- On hover: Slight background color change (gray-100)

**Delete Confirmation Dialog**
- Smaller modal or alert dialog
- Title: "Delete Task"
- Message: "Delete task '[Title]'? This cannot be undone."
- Buttons:
  - "Cancel" (secondary gray)
  - "Delete" (destructive red)
- No loading state needed (quick action)

**Undo Button (Header)**
- Location: Header bar (right side, after Add Task button)
- Style: Secondary gray button with undo icon
- Label: "Undo" or just icon
- Disabled state: Gray text (gray-400), not clickable
- Enabled state: Blue text, clickable
- Tooltip: "Undo last action (Ctrl+Z)" or "Nothing to undo"

**Toast Notifications**
- Position: Top-right corner (right padding 1rem, top padding 1rem from header)
- Auto-dismiss: 3-4 seconds for success, 5-6 seconds for errors
- Success toast: Green background, white text, check icon
- Error toast: Red background, white text, warning icon
- Manual dismiss: X button on right side
- Messages:
  - Create success: "Task created successfully"
  - Edit success: "Task updated successfully"
  - Delete success: "Task deleted successfully"
  - Undo success: "Undo: '[Action]' was undone"
  - Error: "Failed to [action] task. Try again."

#### Loading and Error States

**Form Submit Loading State**
- Submit button: Shows spinner, text changes to "Creating..." or "Saving..."
- Form inputs: Disabled (pointer-events: none, opacity-50)
- Background inputs: Slightly dimmed or grayed

**Individual Task Card Delete Loading State**
- Delete button: Shows spinner instead of icon
- Card: Opacity-50 or striped pattern to indicate "being deleted"
- Other actions on card: Disabled

**Error State Display**
- Form error: Red banner at top of modal with error message
- Card delete error: Toast notification showing error
- Retry mechanism: Form remains open or card remains visible for retry

#### Optimistic Updates Pattern

1. **Create Task**: 
   - User submits form
   - Task object created locally with temporary ID (UUID or negative index)
   - Task added to state immediately (optimistic)
   - API call sent in background
   - On success: Task ID updated with real ID, success toast shown
   - On error: Task removed from state, error toast shown

2. **Edit Task**:
   - User submits form with changes
   - Task updated in state immediately (optimistic)
   - API call sent in background
   - On success: Confirm update, success toast shown
   - On error: Task reverted to previous state, error toast shown

3. **Delete Task**:
   - User confirms deletion
   - Task removed from state immediately (optimistic)
   - API call sent in background
   - On success: Keep task removed, success toast shown
   - On error: Task restored to list, error toast shown

#### Undo/Redo Capability

- **Undo Stack**: Maintains up to 10 previous task list states
- **State Snapshots**: Each action (create, edit, delete) creates a state snapshot before the action
- **Undo Action**: Clicking undo button or pressing Ctrl+Z reverts to previous snapshot
- **Undo Availability**: Button enabled only when undo stack has items
- **Toast Feedback**: "Undo: Created 'Task Title'" or "Undo: Deleted 'Task Title'"
- **No Redo**: Simple undo stack without redo (redo can be added in Stage 3)

#### Accessibility Considerations

**Form Accessibility**
- Label each input with `<label htmlFor>` (visible labels)
- Error messages associated via `aria-describedby`
- Focus management: Focus moves to first input when modal opens, returns to trigger button on close
- Read-only inputs: Use `aria-readonly` if applicable
- Tab order: Logical (top to bottom through form fields, then buttons)

**Modal Accessibility**
- Modal has `role="dialog"` and `aria-labelledby` (title element)
- Focus trapped within modal (Tab wraps from last button to first input)
- Backdrop has `inert` or focus trap to prevent interaction outside modal
- Close button (X) available in top-right
- Escape key closes modal (without saving if form dirty)

**Button and Icon Accessibility**
- All icon buttons have `aria-label` (e.g., "Edit task", "Delete task")
- Loading spinners have `aria-busy="true"` and `aria-label="Loading"`
- Edit/Delete icons: Tooltips show on hover, visible on focus

**Undo Button**
- Tooltip shows action being undone (e.g., "Undo: Created 'Task Title'")
- Disabled state has `aria-disabled="true"`
- Keyboard shortcut help: "Ctrl+Z" shown in tooltip

**Error Announcements**
- Form errors announced via `aria-live="assertive"` region
- Toast notifications announced via `aria-live="polite"` region
- Error messages descriptive (not just "Error!")

**Delete Confirmation**
- Confirmation dialog is modal with clear purpose
- Destructive button (Delete) is secondary button (not first)
- Cannot be accidentally triggered

#### Responsive Design

**Mobile (375px)**
- Form modal: Full width with 0.75rem padding on sides, max-height 90vh
- Form fields: Stack vertically, full width
- Buttons: Stack vertically, full width below form
- Task card edit/delete buttons: Visible or in hamburger menu
- Undo button: Visible in header (may be icon-only)
- Toast: Adjust position to avoid overlapping with buttons

**Tablet (768px)**
- Form modal: Max-width 28rem, centered on screen
- Form fields: Stack vertically, responsive widths
- Buttons: Side by side (Cancel left, Create/Save right) or stacked if space tight
- All buttons same height and aligned
- Task card: Buttons visible

**Desktop (1440px)**
- Form modal: Max-width 32rem, centered on screen
- Form fields: Stack vertically with proper spacing
- Buttons: Horizontal layout with good click targets
- All interactive elements have clear hover/focus states

#### Keyboard Navigation

- **Tab**: Move through form fields, buttons, undo button
- **Shift+Tab**: Move backward through form fields
- **Escape**: Close modal or dialog without saving
- **Enter**: Submit form (same as clicking Create/Save) if focus is on form (not in textarea)
- **Ctrl+Z** or **Cmd+Z**: Trigger undo
- **Space**: Activate buttons (undo, delete confirmation)

#### State Management Architecture (React 19.2)

- **Context**: TaskContext provides tasks state and dispatch
- **Reducer**: useTaskReducer handles actions: CREATE, READ, UPDATE, DELETE, UNDO, CLEAR_ERROR
- **Hooks**: useTask() custom hook for accessing context
- **Optimistic Updates**: Actions dispatch immediately, then API calls update/rollback
- **Error Handling**: Each action can set error state, cleared manually or on new action

#### Handoff Checklist for React Engineer

- [ ] **State Management**
  - [ ] Create TaskContext with tasks array and dispatch
  - [ ] Implement useTaskReducer hook with actions: CREATE, UPDATE, DELETE, UNDO, SET_ERROR, CLEAR_ERROR
  - [ ] Initialize reducer with sample tasks from Stage 1
  - [ ] Create useTask() hook to access context
  - [ ] Test reducer in isolation (unit tests)

- [ ] **Create Task Form Component (TaskCreateForm)**
  - [ ] Build form with all fields (Title, Description, Priority, Status, Due Date, Assignee)
  - [ ] Implement client-side validation (Title 3-50 chars)
  - [ ] Show validation errors below/beside inputs
  - [ ] Submit button disabled while loading, shows "Creating..."
  - [ ] On submit: Dispatch CREATE action, clear form on success
  - [ ] Error banner at top of form with error message and dismiss button
  - [ ] Keyboard: Escape closes modal, Ctrl+Z should be disabled in textarea

- [ ] **Edit Task Form Component (TaskEditForm)**
  - [ ] Pre-populate form with task data
  - [ ] Same fields and validation as Create
  - [ ] Submit button text: "Save"
  - [ ] On submit: Dispatch UPDATE action
  - [ ] On error: Revert form to previous values
  - [ ] Cancel button returns to previous values

- [ ] **Delete Confirmation Dialog (TaskDeleteConfirm)**
  - [ ] Modal with task title in message
  - [ ] "Delete" button is red/destructive (secondary position)
  - [ ] "Cancel" button is primary (left position)
  - [ ] On confirm: Dispatch DELETE action
  - [ ] Close on cancel

- [ ] **Undo Button (Header)**
  - [ ] Show in Header component (right side)
  - [ ] Enabled when undo stack has items
  - [ ] On click: Dispatch UNDO action
  - [ ] Show tooltip with action being undone
  - [ ] Support Ctrl+Z (or Cmd+Z) keyboard shortcut

- [ ] **Add Task Button (Header)**
  - [ ] Show in Header component (right side, left of Undo)
  - [ ] On click: Open TaskCreateForm modal
  - [ ] Tooltip: "Create a new task"

- [ ] **Edit/Delete Icons on Task Card**
  - [ ] Add pencil icon button (Edit) on task card
  - [ ] Add trash icon button (Delete) on task card
  - [ ] Position: Top-right or hover menu
  - [ ] Edit: Open TaskEditForm modal with task data
  - [ ] Delete: Open TaskDeleteConfirm dialog

- [ ] **Toast Notifications**
  - [ ] Create Toast component (reusable)
  - [ ] Show success toast on CREATE, UPDATE, DELETE
  - [ ] Show error toast on failed operations
  - [ ] Auto-dismiss after 3-4 seconds for success, 5-6 for errors
  - [ ] Manual dismiss button (X)
  - [ ] Position: Top-right corner
  - [ ] Multiple toasts: Stack vertically

- [ ] **Optimistic Updates**
  - [ ] CREATE: Task appears immediately, removed on error
  - [ ] UPDATE: Changes appear immediately, reverted on error
  - [ ] DELETE: Task removed immediately, restored on error
  - [ ] Show loading state on affected task card or form

- [ ] **Undo Functionality**
  - [ ] Maintain undo stack (up to 10 states)
  - [ ] Dispatch UNDO action on button click or Ctrl+Z
  - [ ] Revert to previous state (tasks array)
  - [ ] Undo button enabled only when stack available
  - [ ] Show toast: "Undo: [Action]"

- [ ] **Accessibility**
  - [ ] All form inputs have labels (visible or aria-label)
  - [ ] Error messages use aria-describedby
  - [ ] Modal has role="dialog" and aria-labelledby
  - [ ] Focus trapped in modal (Tab wraps)
  - [ ] Edit/Delete buttons have aria-label
  - [ ] Undo button shows keyboard shortcut in tooltip
  - [ ] Focus management: Modal open → focus first input; close → focus trigger
  - [ ] Escape key closes modal (without saving if dirty)

- [ ] **Form Validation & Error Handling**
  - [ ] Title: 3-50 characters, required
  - [ ] Display errors on blur and submit
  - [ ] Form-level error banner
  - [ ] API error: Show error message in toast
  - [ ] Form remains open on error for retry

- [ ] **Responsive Design**
  - [ ] Test form modal at 375px (full width), 768px (centered 28rem), 1440px (32rem)
  - [ ] Buttons stack vertically on mobile, horizontal on tablet+
  - [ ] Form fields full width on mobile, proper widths on tablet+
  - [ ] Toast position adjusted for mobile (not overlapping)
  - [ ] Undo/Add buttons visible at all breakpoints

- [ ] **Integration with Stage 1**
  - [ ] Dashboard shows updated task counts (from reducer state)
  - [ ] All Tasks page shows created/edited/deleted tasks
  - [ ] Task Detail page updates with edit changes
  - [ ] Undo affects all pages (global state)
  - [ ] Navigation remains responsive with new forms/buttons

- [ ] **TypeScript**
  - [ ] Define TaskAction types: CREATE, UPDATE, DELETE, UNDO, etc.
  - [ ] Type form props and state
  - [ ] Type reducer function signature
  - [ ] No `any` types, strict mode passing

- [ ] **Testing**
  - [ ] Reducer: Test all action types
  - [ ] Forms: Test validation, submission, error handling
  - [ ] Optimistic updates: Task appears/disappears correctly
  - [ ] Undo: State reverts correctly
  - [ ] Components mount/unmount without errors
  - [ ] Keyboard shortcuts work (Escape, Ctrl+Z)

### Design Decisions
- **State Management**: React Context + useReducer (avoids prop drilling, keeps state centralized)
- **Form Library**: Uncontrolled components with manual validation (no external library to keep Stage 2 focused on state)
- **Optimistic Updates**: Dispatch action immediately, rollback on API error (improves perceived performance)
- **Undo Stack**: Simple FIFO stack with 10-item limit (can extend to redo in Stage 3)
- **Modal vs Page**: Modal for forms (non-disruptive, keeps context on task list)
- **Error Recovery**: Form remains open on error, allowing retry without re-entering data

### A11y Findings
[Pending Frontend Accessibility Reviewer audit]

### Implementation Notes

**Completed Features:**
- ✅ TaskContext and TaskProvider for global state management
- ✅ useTaskReducer hook with Context + useReducer pattern (TypeScript strict mode)
- ✅ All CRUD actions: CREATE, UPDATE, DELETE with 10-item undo stack
- ✅ TaskCreateForm component with validation (Title 3+ chars) and error handling
- ✅ TaskEditForm component with pre-population and form validation
- ✅ TaskDeleteConfirm dialog with safe deletion flow
- ✅ Toast component for success/error notifications (auto-dismiss 3-6 sec)
- ✅ Header enhancements: "Add Task" button + "Undo" button with Ctrl+Z shortcut
- ✅ TaskCard enhanced with Edit (✎) and Delete (🗑) icon buttons
- ✅ Modal state management in Dashboard and TaskListPage pages
- ✅ Optimistic updates: Tasks appear/disappear immediately, undo stack updated
- ✅ Keyboard shortcuts: Ctrl+Z for undo, Escape to close modals
- ✅ All pages updated to use TaskContext instead of hardcoded sampleTasks
- ✅ Build passing (190.5 KB JS, 59.35 KB gzipped)
- ✅ Dev server running successfully at localhost:5174

**Key Implementation Patterns:**
- Reducer actions dispatch optimistically before any async operations
- Undo stack stores full task array snapshots (FIFO, 10-item limit)
- Modal state managed at page level (showCreateForm, editingTask, deletingTaskId)
- Task callbacks (onEdit, onDelete) passed through TaskList → TaskCard
- Form components handle their own validation and error display
- Edit/Delete button clicks use stopPropagation to prevent card navigation
- Header manages keyboard shortcuts globally with useEffect + cleanup
- Toast position: top-right, fixed positioning (top-16 for below header)

**What Worked Well:**
- Context + useReducer pattern simplified state management without external libraries
- Putting modal state at page level instead of globally makes flows more intuitive
- Optimistic updates feel responsive and reduce perceived latency
- Undo stack implementation is simple but effective
- Type-safe reducer with TypeScript discriminated unions caught errors at build time
- Separating form components (Create/Edit) keeps code maintainable and reusable

**Testing Readiness:**
- Stage 2 is feature-complete and ready for React Tester to write comprehensive tests
- All reducer actions should be unit tested in isolation
- Form validation and submission workflows should be tested
- Optimistic update and error rollback flows are critical test areas
- Keyboard shortcuts (Ctrl+Z, Escape) should be tested
- Modal state transitions (show/hide/reset) need coverage

**Next Phase (Stage 3):**
- Theme switching (light/dark mode with localStorage persistence)
- Kanban board with drag-and-drop (status column-based)
- Toast notifications for async events (already have Toast component ready)
- Keyboard shortcut help modal

---

## Stage 3: Advanced Interactions

**Status:** 🎯 UX Brief Ready for Implementation

### UX Brief

#### Objective
Build advanced interactivity features that improve user productivity and experience: dark/light theme support with system preference detection, Kanban board view for visual task organization, keyboard shortcuts for power users, toast notifications for task feedback, and skeleton loaders for perceived performance.

#### Target Users
- Power users who want keyboard shortcuts for speed
- Users with accessibility needs (theme switching for visual comfort)
- Visual learners who prefer Kanban board layout
- Users who want instant feedback on actions (toasts)

#### Key Features

##### 1. Theme Switching (Dark/Light Mode)

**Theme Context**
- Create `ThemeContext` with two values: "light" and "dark"
- Derive initial theme from:
  1. localStorage `theme` preference if set
  2. System preference via `prefers-color-scheme` media query if localStorage empty
  3. Default to "light" if system preference unavailable
- Store theme in localStorage when user changes it

**Theme UI Toggle**
- Location: Header (right side, next to navigation or in dropdown menu)
- Button: Sun/Moon icon or "Light/Dark" text
- Behavior:
  - Click to toggle between light and dark
  - Save to localStorage immediately
  - Apply theme to entire app
  - Icon changes to show current theme (sun icon when light mode, moon icon when dark)

**Theme Colors (Tailwind Dark Mode)**
- Dark mode class: `dark:` prefix on Tailwind utilities
- Background colors:
  - Light: `bg-white` (main), `bg-gray-100` (secondary)
  - Dark: `dark:bg-gray-900` (main), `dark:bg-gray-800` (secondary)
- Text colors:
  - Light: `text-gray-900` (primary), `text-gray-600` (secondary)
  - Dark: `dark:text-gray-100` (primary), `dark:text-gray-400` (secondary)
- Borders:
  - Light: `border-gray-200`
  - Dark: `dark:border-gray-700`
- Task status badge colors adjusted for contrast in dark mode

**Theme Persistence**
- On app load: Check localStorage for `theme` key
- If found and valid ("light" or "dark"): Apply theme
- If not found: Check `prefers-color-scheme` media query
- If user changes theme: Update localStorage and apply immediately
- No server sync needed (client-side persistence only)

**System Preference Detection**
- Listen to `prefers-color-scheme` changes via matchMedia
- Update theme if user changes OS dark mode setting
- Only applies if user hasn't set localStorage preference
- Use `window.matchMedia('(prefers-color-scheme: dark)').matches` to detect

---

##### 2. Kanban Board View

**New Route**
- Add route: `/kanban` (alongside `/`, `/tasks`, `/tasks/:id`)
- Navigation: Add link in sidebar "Kanban Board"
- Layout: Same header and sidebar as other pages

**Kanban Layout**
- Column-based layout with 4 columns (one per status):
  1. **To Do** (blue accent)
  2. **In Progress** (cyan accent)
  3. **Blocked** (pink accent)
  4. **Done** (green accent)

**Kanban Column Structure**
- Desktop (1440px): 4 columns side-by-side in a row
  - Column width: Flexible, each gets ~25% of available space
  - Min-width: 16rem (256px) per column to prevent cramping
  - Gap: 1rem between columns
- Tablet (768px): 2 columns per row, stacked vertically
  - Each column width: ~50% of available space
- Mobile (375px): 1 column per row, scrollable horizontally
  - Full width columns that scroll horizontally
  - Snap scrolling for smooth experience

**Column Header**
- Title: Status name (e.g., "To Do", "In Progress")
- Subtitle: Count of tasks in column (e.g., "5 tasks")
- Background: Light tint matching status color (e.g., blue-50 for To Do)
- Border: Colored top border (2-3px) in status color
- Padding: 1rem horizontal, 0.75rem vertical

**Task Cards in Kanban**
- Same TaskCard component but without the link wrapper (not navigable)
- Cards are draggable (see Drag-and-Drop below)
- Visual feedback: Hover shadow on card, cursor: grab
- Dragging state: Cursor: grabbing, opacity-75 on card being dragged

**Empty Column State**
- If column has 0 tasks: Show "No tasks" placeholder text (gray, italic)
- Placeholder is drop zone (visual indicator)
- Drag task onto empty column to populate it

**Drop Zones**
- Each column is a drop zone (entire column acts as droppable area)
- On hover with dragged task: Highlight drop zone with dashed border and light background color
- After drop: Task moves to new column (status updates), task list re-renders

---

##### 3. Drag-and-Drop Implementation

**Drag Library Choice**
- Use `react-beautiful-dnd` OR `@dnd-kit` for accessibility and features
- Alternative: Vanilla HTML5 Drag and Drop API (simpler, built-in)
- Recommendation: `react-beautiful-dnd` for better UX and keyboard support

**Drag Workflow**
1. User clicks and holds on a task card in Kanban view
2. Card becomes draggable (opacity-75, cursor changes)
3. User drags card over column
4. Target column highlights (dashed border, light background)
5. User releases: Card moves to new column
6. State updates: Task status changes to target column status
7. Undo available: Can undo drag-and-drop action

**Drop Behavior**
- If dropped on same column: No change (task returns to original position)
- If dropped on different column: Update task.status, state updates immediately
- Optimistic update: Task moves visually before API call
- On error: Toast shows error, task returns to original column

**Keyboard Support for Drag-and-Drop**
- Use library that supports keyboard (Tab to select card, arrow keys to move, Enter to drop)
- Fallback: Edit button on card to manually change status in modal

**Visual Feedback**
- Dragging: Card opacity-75, shadow increases, z-index increases
- Drop zone hover: Dashed border, light background tint
- Drop zone active: More prominent border, background color
- Drop animation: Smooth transition as cards re-arrange in column

---

##### 4. Keyboard Shortcuts

**Shortcut List**
1. `n` — Open new task form (same as "Add Task" button)
2. `Escape` — Close any open modal (create, edit, delete)
3. Arrow Keys (↑/↓/←/→) — Navigate through task list or Kanban columns
4. `d` — Delete selected task (when task is focused/selected)
5. `e` — Edit selected task (when task is focused/selected)
6. `?` or `Ctrl+/` — Show keyboard shortcut help modal
7. `t` — Toggle theme (light/dark)

**Shortcut Implementation**
- Global keyboard listener in App.tsx or Header component
- Event listener: `window.addEventListener('keydown', handleKeyPress)`
- Prevent conflicts:
  - Don't trigger shortcuts while typing in form inputs (check `event.target.tagName`)
  - Don't trigger `Escape` if already handled by modal
  - Don't trigger number/letter shortcuts in contenteditable elements

**Focus Management for Navigation**
- Arrow keys: Move focus up/down through task list (or left/right in Kanban columns)
- Focus management: Use `querySelector` or ref to manage active task
- Visual indicator: Highlight focused task with focus ring (2px blue outline)
- On navigation: Scroll focused task into view

**Shortcut Help Modal**
- Trigger: Press `?` or `Ctrl+/`
- Modal shows table with:
  - Column 1: Shortcut key(s) (e.g., "Ctrl+Z")
  - Column 2: Action (e.g., "Undo")
  - Column 3: Description (e.g., "Revert last action")
- List all 7 shortcuts
- Close with Escape or click X
- Accessible: Proper focus management, readable layout

---

##### 5. Toast Notification System

**Toast Variants**
1. **Success** — Green background (bg-green-500), white text, checkmark icon
2. **Error** — Red background (bg-red-500), white text, alert icon
3. **Info** — Blue background (bg-blue-500), white text, info icon
4. **Warning** — Yellow background (bg-yellow-500), text gray-900, warning icon

**Toast Component**
- Reusable Toast component already exists, needs to be hooked into actions
- Update reducer actions to dispatch toast messages (via separate action or state)

**Toast Container**
- Position: Fixed top-right corner
- Offset: 1rem from top, 1rem from right (below header: top-16 for 64px header)
- Stack: Multiple toasts stack vertically with 0.5rem gap
- Max toasts: Show up to 3 at once (queue additional ones)

**Toast Lifecycle**
- Appear: Fade-in animation (100ms)
- Persist: Display for 3-5 seconds (success), 5-7 seconds (error)
- Dismiss: Fade-out animation when time expires or user clicks X
- Manual dismiss: X button always available (top-right of toast)

**Toast Messages**
- **Create Success**: "✅ Task created successfully"
- **Create Error**: "❌ Failed to create task"
- **Edit Success**: "✅ Task updated successfully"
- **Edit Error**: "❌ Failed to update task"
- **Delete Success**: "✅ Task deleted successfully"
- **Delete Error**: "❌ Failed to delete task"
- **Undo**: "⟲ Undo successful"
- **Drag Success**: "✅ Task moved to [Status]"
- **Drag Error**: "❌ Failed to move task"
- **Theme Changed**: "✅ Theme changed to [Light/Dark]"

**Toast Accessibility**
- Position: `role="status"` or `role="alert"` (for errors)
- Announcement: `aria-live="polite"` (success/info), `aria-live="assertive"` (errors/warnings)
- Visibility: `aria-atomic="true"` (announce entire toast content)
- Auto-dismiss: Announce when toast is about to dismiss
- Close button: `aria-label="Dismiss notification"`

---

##### 6. Loading Skeleton Components

**Skeleton Types**
1. **Task Card Skeleton** — Placeholder for each task while loading
2. **Column Header Skeleton** — Placeholder for Kanban column headers
3. **Task List Skeleton** — Multiple card skeletons stacked

**Skeleton Design**
- Background: Light gray (gray-200 in light mode, gray-700 in dark mode)
- Shimmer effect: Subtle animation (wave effect across skeleton)
- Height/width: Match real component dimensions
- Rounded corners: Match real component (0.5rem)
- Spacing: Same padding/margin as real component

**Task Card Skeleton**
- Title bar: 70% width, 1rem height
- Subtitle bar: 50% width, 0.75rem height
- Description line 1: 100% width, 0.75rem height
- Description line 2: 80% width, 0.75rem height
- Footer info: Two small bars (20% and 30% width each)
- Total height: ~200px (same as real card)

**Shimmer Animation**
- CSS: Background gradient that moves left-to-right (1-2 second duration)
- Keyframes: Start gray, transition to lighter gray, back to gray
- Repeat: Infinite loop while loading

**Loading States**
- Initial page load: Show 5-10 task skeletons while data loads
- Kanban initial load: Show skeleton for each column header + 3-5 card skeletons per column
- Simulate delay: Use setTimeout to show skeletons for 1-2 seconds (for demo purposes)

**Accessibility**
- Skeletons have `aria-busy="true"`
- Announce loading state: "Loading tasks..." in `aria-live` region
- Once data loads: Announce "Tasks loaded" and replace skeletons

---

#### UI Component Updates

**Header Theme Toggle Button**
- Location: Header (right side, left of navigation or in menu)
- Icon: Sun (light mode) or Moon (dark mode)
- Tooltip: "Switch to [Dark/Light] mode"
- Keyboard shortcut: `t` key
- Focus state: 2px blue outline

**Kanban Board Page**
- Route: `/kanban`
- Layout: Header + Sidebar + Main content
- Main content: Column grid with draggable task cards
- Responsive: 4 cols (desktop), 2 cols (tablet), 1 col (mobile with horizontal scroll)

**Keyboard Shortcut Help Modal**
- Trigger: `?` or `Ctrl+/`
- Table format with shortcuts and descriptions
- Close with Escape or X button
- Focus management: Focus first shortcut on open, return to trigger on close

**Task Cards (Updated)**
- When in Kanban: Draggable, no link wrapper, show drag handle
- When in List: Same as before (clickable, linked to detail page)
- Visual feedback on drag: opacity-75, shadow increase

---

#### Responsive Design

**Desktop (1440px)**
- Kanban: 4 columns side-by-side, min-width 256px each
- Theme toggle: Icon button in header
- Keyboard shortcuts: All available
- Toast: Top-right corner, max 3 visible

**Tablet (768px)**
- Kanban: 2 columns per row (1x2 grid), wraparound
- Theme toggle: Icon button (may be in menu)
- Drag-and-drop: Works but may require more scrolling
- Skeleton: Adjusted height to fit 2-column layout

**Mobile (375px)**
- Kanban: Single column, horizontal scroll enabled
- Column width: Full viewport width
- Drag-and-drop: Touch-friendly with visual feedback
- Theme toggle: Icon button in header (accessible)
- Toast: Adjusted position (smaller offset)
- Keyboard shortcuts: Limited (arrow keys, n, Escape, ?)

---

#### Keyboard Navigation

- **Tab**: Navigate through focusable elements (buttons, cards, etc.)
- **Shift+Tab**: Navigate backward
- **Arrow Keys**: Move through task list / Kanban columns (with focus management)
- **Enter**: Activate focused task (navigate to detail or show menu)
- **n**: Open new task form
- **e**: Edit focused task
- **d**: Delete focused task
- **Escape**: Close any open modal
- **?**: Show keyboard shortcuts
- **t**: Toggle theme
- **Space**: On draggable card, initiate drag (if using keyboard drag-and-drop)

---

#### State Management Updates

**New State**
- `theme`: "light" | "dark" (in ThemeContext or AppContext)
- `selectedTaskId`: string | null (for keyboard navigation focus)
- `toasts`: Toast[] array (for toast notifications)
- `isDragging`: boolean (for drag-and-drop state)

**New Actions**
- `SET_THEME` — Update theme and localStorage
- `SET_SELECTED_TASK` — Set focused task for keyboard navigation
- `ADD_TOAST` — Add notification to toast array
- `REMOVE_TOAST` — Remove notification by ID
- `REORDER_TASK` — Update task status (from Kanban drag-and-drop)

**Existing Actions (Updated)**
- `UPDATE` — Now includes `REORDER_TASK` (drag-and-drop sets status)

---

#### Accessibility Considerations

**Theme**
- Theme toggle button has descriptive label and tooltip
- Theme change announcement via toast or aria-live
- Sufficient contrast in both light and dark modes
- Respect `prefers-color-scheme` system setting

**Kanban Drag-and-Drop**
- Keyboard accessible (arrow keys to move between columns)
- Focus visible on draggable cards (blue outline)
- Alt text/labels for drag handle icon
- Touch accessible (drag-and-drop works on touch devices)

**Keyboard Shortcuts**
- Shortcut help modal always accessible (`?` key)
- Shortcuts don't conflict with browser shortcuts (test in Chrome, Firefox, Safari)
- Shortcuts disabled in form inputs (prevent accidental triggers)
- Shortcut descriptions clear and concise

**Toast Notifications**
- Proper ARIA roles and live regions
- Toast content announced to screen readers
- Color not the only indicator (include icons and text)
- Toast doesn't obstruct important content

**Focus Management**
- Focus visible at all times (2px outline, contrasting color)
- Focus management in modals (trap focus, return on close)
- Focus management on Kanban navigation (scroll focused task into view)
- Logical Tab order throughout app

---

#### Handoff Checklist for React Engineer

**Theme System**
- [ ] Create ThemeContext with "light" and "dark" values
- [ ] Implement theme detection (localStorage → system preference → default)
- [ ] Add theme toggle button to Header
- [ ] Apply theme colors to all components (dark: prefix)
- [ ] Test theme persistence across page reload
- [ ] Keyboard shortcut `t` toggles theme

**Kanban Board**
- [ ] Create new KanbanBoard component
- [ ] Add `/kanban` route to Router
- [ ] Add "Kanban Board" link in Sidebar
- [ ] Build 4-column layout (one per status)
- [ ] Implement drag-and-drop using library (react-beautiful-dnd or @dnd-kit)
- [ ] Update task status on drop
- [ ] Show column headers with task count
- [ ] Handle empty columns (show placeholder)
- [ ] Test responsive layout (4 cols → 2 cols → 1 col)

**Drag-and-Drop**
- [ ] Set up drag-and-drop library and provider
- [ ] Make task cards draggable
- [ ] Make columns droppable
- [ ] Update state on successful drop (task status change)
- [ ] Show visual feedback (hover, dragging, drop zones)
- [ ] Keyboard support for drag-and-drop (if using accessible library)
- [ ] Optimistic update and error handling (on drop)

**Keyboard Shortcuts**
- [ ] Create global keyboard listener (useEffect in App or Header)
- [ ] Implement `n` → open new task form
- [ ] Implement `Escape` → close modals
- [ ] Implement arrow keys → navigate task list / Kanban
- [ ] Implement `d` → delete selected task
- [ ] Implement `e` → edit selected task
- [ ] Implement `?` → show shortcuts help
- [ ] Implement `t` → toggle theme
- [ ] Prevent shortcuts in form inputs (check target.tagName, contenteditable)
- [ ] Test each shortcut in context

**Keyboard Shortcut Help Modal**
- [ ] Create ShortcutHelpModal component
- [ ] Table or list format showing all shortcuts
- [ ] Close with Escape or X button
- [ ] Focus management (focus first item on open)
- [ ] Trigger with `?` or `Ctrl+/`

**Toast Notification System**
- [ ] Connect Toast component to reducer (actions dispatch toast messages)
- [ ] Create toast dispatch action (ADD_TOAST, REMOVE_TOAST)
- [ ] Create ToastContainer component to manage toast array
- [ ] Auto-dismiss toasts after delay (3-5 sec success, 5-7 sec error)
- [ ] Manual dismiss with X button
- [ ] Stack multiple toasts (max 3 visible)
- [ ] Show toasts for: create success/error, edit success/error, delete success/error, undo, drag success/error, theme change
- [ ] Proper positioning (top-right, fixed)
- [ ] Accessibility: role, aria-live, aria-atomic

**Loading Skeletons**
- [ ] Create TaskCardSkeleton component
- [ ] Create ColumnHeaderSkeleton component
- [ ] Shimmer animation (CSS or library)
- [ ] Show skeletons during initial load
- [ ] Simulate delay with setTimeout (for demo)
- [ ] Skeleton height/width matches real component
- [ ] Accessibility: aria-busy, aria-live announcements

**Integration**
- [ ] All pages can toggle theme (persists)
- [ ] Kanban drag-and-drop updates task state (undo available)
- [ ] Keyboard shortcuts work globally (not conflicting with browser)
- [ ] Toasts appear for all task actions
- [ ] Skeletons show during data load
- [ ] No TypeScript errors (strict mode)
- [ ] Responsive at all breakpoints

---

#### Design Decisions

- **Theme Management**: Client-side localStorage + system preference detection (no server sync for Stage 3)
- **Drag-and-Drop**: Use `react-beautiful-dnd` for accessibility and smooth UX (keyboard support built-in)
- **Keyboard Shortcuts**: Global listener in App, but disabled in form inputs (prevent accidental triggers)
- **Toast Queue**: Max 3 visible toasts, additional ones queued (prevent spam)
- **Skeleton Library**: CSS-based shimmer (no external library, keep bundle small)
- **Focus Management**: Manual focus management for Kanban navigation (arrow keys move focus between cards)

---

### A11y Findings
[Pending Frontend Accessibility Reviewer audit]

### Implementation Notes
[Record what worked, what didn't, key patterns discovered, testing readiness]

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
