# Implementation Plan: Todo List Life Dashboard

## Overview

Build a standalone single-page application using one HTML file, one CSS file (`css/style.css`), and one JavaScript file (`js/app.js`). No build tools, no external libraries, no server. All state is persisted via `localStorage`. Implementation proceeds widget by widget, wiring everything together at the end.

---

## Tasks

- [x] 1. Set up project structure and static shell
  - Create `index.html` with the base HTML skeleton: `<!DOCTYPE html>`, `<head>` linking `css/style.css`, and `<body>` with four widget container elements (`#greeting-widget`, `#focus-timer`, `#todo-list`, `#quick-links`)
  - Create `css/style.css` as an empty file (populated in later tasks)
  - Create `js/app.js` with a `DOMContentLoaded` listener that will call each widget's `init()` in order
  - Add the `<script src="js/app.js" defer>` tag to `index.html`
  - _Requirements: 9.1, 9.2, 9.3_

- [~] 2. Implement StorageService
  - [ ] 2.1 Implement `StorageService` module in `js/app.js`
    - Write `loadTasks()`: reads `"dashboard_tasks"` from `localStorage`, parses JSON inside `try/catch`, returns `[]` on any error or if result is not an array
    - Write `saveTasks(tasks, onError)`: stringifies and writes to `"dashboard_tasks"` inside `try/catch`, calls `onError` callback on failure
    - Write `loadLinks()`: reads `"dashboard_links"`, same defensive pattern as `loadTasks`
    - Write `saveLinks(links, onError)`: writes `"dashboard_links"`, same pattern as `saveTasks`
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ] 2.2 Write property test for Task serialization round-trip
    - **Property 5: Task Serialization Round-Trip**
    - **Validates: Requirements 8.1, 8.2, 8.5**
    - Generate arbitrary `Task[]` arrays; assert `JSON.parse(JSON.stringify(tasks))` is deeply equal to the original

  - [x] 2.3 Write property test for Link serialization round-trip
    - **Property 6: Link Serialization Round-Trip**
    - **Validates: Requirements 8.1, 8.2, 8.5**
    - Generate arbitrary `Link[]` arrays; assert `JSON.parse(JSON.stringify(links))` is deeply equal to the original

- [~] 3. Implement GreetingWidget
  - [x] 3.1 Implement `GreetingWidget` module in `js/app.js`
    - Write `_getGreeting(hour)`: maps hour → one of `"Good Morning"` (5–11), `"Good Afternoon"` (12–17), `"Good Evening"` (18–20), `"Good Night"` (21–4); exhaustive with no overlaps
    - Write `_formatTime(date)`: returns `"hh:mm:ss AM/PM"` string (12-hour format, zero-padded)
    - Write `_formatDate(date)`: returns `"Day, Month DD, YYYY"` (e.g., `"Monday, January 6, 2025"`)
    - Write `_render()`: reads current `Date`, updates `#greeting-widget` DOM with time, date, and greeting
    - Write `init()`: calls `_render()` immediately, then sets `setInterval(_render, 1000)`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [-] 3.2 Write property test for greeting coverage
    - **Property 1: Time-Based Greeting Coverage**
    - **Validates: Requirements 1.4, 1.5, 1.6, 1.7**
    - Generate integers in [0, 23]; assert `_getGreeting` returns exactly one valid greeting with no gaps or overlaps

  - [~] 3.3 Write property test for time format
    - **Property 2: Time Format Round-Trip**
    - **Validates: Requirements 1.1, 1.2**
    - Generate random `Date` objects; assert `_formatTime` output matches `/^\d{2}:\d{2}:\d{2} (AM|PM)$/` and extracted values are numerically correct

- [~] 4. Implement FocusTimer
  - [~] 4.1 Implement `FocusTimer` module in `js/app.js`
    - Declare module-scoped state: `remainingSeconds = 1500`, `intervalId = null`, `isRunning = false`
    - Write `_formatTime(seconds)`: returns `"MM:SS"` string (zero-padded); covers range [0, 1500]
    - Write `_render()`: updates `#focus-timer` DOM with `_formatTime(remainingSeconds)`
    - Write `_tick()`: decrements `remainingSeconds`; if it reaches 0, calls `clearInterval`, sets `isRunning = false`, and displays `"Session complete!"` message
    - Write `_start()`: no-op if `isRunning`; otherwise sets `isRunning = true`, starts `setInterval(_tick, 1000)`, calls `_render()`
    - Write `_stop()`: no-op if not `isRunning`; clears interval, sets `isRunning = false`
    - Write `_reset()`: clears interval, resets `remainingSeconds = 1500`, `isRunning = false`, calls `_render()`, removes "Session complete!" message
    - Write `init()`: renders initial `25:00`, wires Start / Stop / Reset button click listeners
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10_

  - [~] 4.2 Write property test for timer format correctness
    - **Property 10: Timer Format Correctness**
    - **Validates: Requirements 2.1, 2.5**
    - Generate integers in [0, 1500]; assert `_formatTime` output matches `/^\d{2}:\d{2}$/` and minutes/seconds are arithmetically correct

- [~] 5. Checkpoint — Ensure GreetingWidget and FocusTimer work end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [~] 6. Implement TodoList
  - [~] 6.1 Implement `TodoList` core state and rendering in `js/app.js`
    - Declare module-scoped `tasks = []`
    - Write `_renderTask(task)`: creates and returns an `HTMLElement` for a single task (checkbox/toggle, label text with strikethrough if complete, edit button, delete button)
    - Write `_renderList()`: clears `#todo-list` task container, maps `tasks` through `_renderTask`, appends to DOM
    - Write `init(tasks)`: assigns module state, calls `_renderList()`
    - _Requirements: 3.5, 5.1, 5.2, 5.3_

  - [~] 6.2 Implement `TodoList._addTask` with validation
    - Write `_addTask(text)`: trims input; if empty/whitespace-only, retains focus on input, returns early; otherwise creates `Task` object with `crypto.randomUUID()` (or `Date.now() + Math.random()` fallback), appends to `tasks`, calls `_persist()`, calls `_renderList()`
    - Wire the input field and submit button in `#todo-list` to call `_addTask`
    - Enforce 200-character max on the input element
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [~] 6.3 Write property test for task addition grows the list
    - **Property 3: Task Addition Grows the List**
    - **Validates: Requirements 3.2**
    - Generate a task list state and valid non-empty text; assert list length increases by exactly 1 and new task text equals trimmed input

  - [~] 6.4 Write property test for whitespace task rejection
    - **Property 4: Whitespace-Only Task Text Is Rejected**
    - **Validates: Requirements 3.3**
    - Generate whitespace-only strings; assert `_addTask` does not modify the task list

  - [~] 6.5 Implement `TodoList._editTask`, `_toggleTask`, `_deleteTask`, and `_persist`
    - Write `_persist()`: calls `StorageService.saveTasks(tasks, onError)` where `onError` shows an inline error message in `#todo-list`
    - Write `_toggleTask(id)`: flips `task.completed`, calls `_persist()`, calls `_renderList()`
    - Write `_deleteTask(id)`: filters task from array, calls `_persist()`, calls `_renderList()` — must complete within 100ms
    - Write `_editTask(id, newText)`: if trimmed `newText` is empty, retains original text; otherwise updates text, calls `_persist()`, calls `_renderList()`
    - Wire edit, confirm-edit, cancel-edit, toggle, and delete controls in `_renderTask`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 5.4, 5.5, 5.6, 5.7, 5.8_

  - [~] 6.6 Write property test for completion toggle round-trip
    - **Property 7: Completion Toggle Is Its Own Inverse**
    - **Validates: Requirements 5.2, 5.3**
    - Generate a task; assert double-toggling `completed` restores original state

- [~] 7. Checkpoint — Ensure TodoList works end-to-end with localStorage persistence
  - Ensure all tests pass, ask the user if questions arise.

- [~] 8. Implement QuickLinks
  - [~] 8.1 Implement `QuickLinks` core state, validation, and rendering in `js/app.js`
    - Declare module-scoped `links = []`
    - Write `_isValidAbsoluteURL(url)`: returns `true` if `url` begins with `"http://"` or `"https://"` followed by at least one character; `false` otherwise
    - Write `_renderPanel()`: clears `#quick-links` button container; for each link, creates a button element labeled with `link.label` and a delete control; appends to DOM; if `links.length >= 20` disables the submit control and shows cap message
    - Write `init(links)`: assigns module state, calls `_renderPanel()`
    - _Requirements: 6.1, 6.4, 6.5, 7.8_

  - [~] 8.2 Write property test for URL validation
    - **Property 8: URL Validation Accepts Valid Absolute URLs and Rejects Invalid Ones**
    - **Validates: Requirements 6.2, 6.3, 7.4**
    - Generate strings starting with `"http://"` or `"https://"` → assert `true`; generate strings without those prefixes → assert `false`

  - [~] 8.3 Implement `QuickLinks._addLink`, `_deleteLink`, `_openLink`, and `_persist`
    - Write `_persist()`: calls `StorageService.saveLinks(links, onError)` where `onError` shows an inline error message
    - Write `_addLink(label, url)`: validates non-empty label and URL (shows field-specific message if missing), validates URL format via `_isValidAbsoluteURL` (shows format message if invalid), enforces 20-link cap (no-op if already at 20), creates `Link` object, pushes to `links`, calls `_persist()`, calls `_renderPanel()`
    - Write `_deleteLink(id)`: filters link from array, calls `_persist()`, calls `_renderPanel()` — must complete within 100ms
    - Write `_openLink(url)`: calls `_isValidAbsoluteURL`; if valid, opens `window.open(url, '_blank')`; if invalid, shows inline error next to button
    - Wire add-link form submit, link button clicks, and delete controls in `_renderPanel` and `init`
    - Enforce 50-character max on label input; 2048-character max on URL input
    - _Requirements: 6.2, 6.3, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8_

  - [ ]* 8.4 Write property test for Quick Links cap enforcement
    - **Property 9: Quick Links Cap Enforcement**
    - **Validates: Requirements 7.8**
    - Generate a link list of 20 entries; attempt to add one more; assert list length stays at 20

- [~] 9. Wire all widgets into the DOMContentLoaded initializer
  - In the `DOMContentLoaded` callback in `js/app.js`, call in order:
    1. `const tasks = StorageService.loadTasks()`
    2. `const links = StorageService.loadLinks()`
    3. `GreetingWidget.init()`
    4. `FocusTimer.init()`
    5. `TodoList.init(tasks)`
    6. `QuickLinks.init(links)`
  - Verify all four widgets render without console errors
  - _Requirements: 8.2, 9.1_

- [~] 10. Implement responsive layout and visual styles in `css/style.css`
  - [~] 10.1 Implement base styles and widget layout
    - Set global `font-size` to at least `14px` and a text/background contrast ratio ≥ 4.5:1
    - Use a grid or flexbox layout for the four widgets; apply at least `16px` gap/margin between widgets so no two widget boundaries overlap
    - Style all widget containers, headings, inputs, buttons, and task/link items consistently
    - _Requirements: 9.4, 9.5_

  - [~] 10.2 Implement responsive single-column layout
    - Add a `@media (max-width: 767px)` breakpoint that switches the layout to a single-column stack
    - Ensure no widget content is clipped or requires horizontal scrolling at 767px viewport width
    - _Requirements: 9.6_

- [~] 11. Final checkpoint — Full integration review
  - Verify all four widgets render on `index.html` load
  - Confirm tasks and links survive a page reload (data written to and read from `localStorage` correctly)
  - Confirm malformed `localStorage` entries are silently discarded (no uncaught errors in console)
  - Confirm responsive layout renders correctly at a narrow viewport
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests can be run in a separate `tests.html` page using [fast-check](https://fast-check.io/) via CDN as an ES module — no build step needed
- Each property test must include the comment: `// Feature: todo-list-life-dashboard, Property N: <property text>`
- All implementation is in the three files only: `index.html`, `css/style.css`, `js/app.js`
- `crypto.randomUUID()` is available in all modern browsers; use `Date.now() + '-' + Math.random()` as a fallback for older environments

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1"] },
    { "id": 1, "tasks": ["2.2", "2.3", "3.1"] },
    { "id": 2, "tasks": ["3.2", "3.3", "4.1"] },
    { "id": 3, "tasks": ["4.2", "6.1"] },
    { "id": 4, "tasks": ["6.2"] },
    { "id": 5, "tasks": ["6.3", "6.4", "6.5"] },
    { "id": 6, "tasks": ["6.6", "8.1"] },
    { "id": 7, "tasks": ["8.2", "8.3"] },
    { "id": 8, "tasks": ["8.4", "10.1"] },
    { "id": 9, "tasks": ["10.2"] }
  ]
}
```
