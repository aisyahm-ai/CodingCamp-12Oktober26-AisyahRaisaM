# Requirements Document

## Introduction

The **Todo List Life Dashboard** is a standalone, client-side web application built with HTML, CSS, and Vanilla JavaScript. It serves as a personal productivity hub in the browser, combining a real-time greeting, a focus timer, a persistent to-do list, and a customizable quick-links panel — all backed by the browser's Local Storage API with no backend server required. The application must run in all modern browsers (Chrome, Firefox, Edge, Safari) and may also be packaged as a browser extension.

---

## Glossary

- **Dashboard**: The single-page web application that contains all widgets.
- **Greeting_Widget**: The UI component that displays the current time, date, and a time-based greeting message.
- **Focus_Timer**: The UI component that runs a 25-minute countdown timer with Start, Stop, and Reset controls.
- **Todo_List**: The UI component that manages a collection of Task items.
- **Task**: A single to-do item with a text label, a completion state, and a unique identifier.
- **Quick_Links**: The UI component that displays a set of user-defined shortcut buttons linking to external URLs.
- **Link**: A user-defined entry consisting of a label and a URL stored in Quick Links.
- **Local_Storage**: The browser's `localStorage` API used for client-side data persistence.
- **User**: The person interacting with the Dashboard in a browser.

---

## Requirements

### Requirement 1: Real-Time Greeting and Date/Time Display

**User Story:** As a User, I want to see the current time, date, and a contextual greeting when I open the Dashboard, so that I immediately know what time it is and feel welcomed.

#### Acceptance Criteria

1. WHILE the Dashboard is open, THE Greeting_Widget SHALL display the current local time in 12-hour format (hh:mm:ss AM/PM), updated every second.
2. WHEN the Dashboard loads, THE Greeting_Widget SHALL display the current local time in 12-hour format (hh:mm:ss AM/PM) immediately, without waiting for the first one-second interval to elapse.
3. THE Greeting_Widget SHALL display the current full date in the format: [Day of Week], [Month] [Day], [Year] (e.g., Monday, January 6, 2025).
4. WHEN the local time is between 05:00 and 11:59, THE Greeting_Widget SHALL display the greeting "Good Morning".
5. WHEN the local time is between 12:00 and 17:59, THE Greeting_Widget SHALL display the greeting "Good Afternoon".
6. WHEN the local time is between 18:00 and 20:59, THE Greeting_Widget SHALL display the greeting "Good Evening".
7. WHEN the local time is between 21:00 and 04:59, THE Greeting_Widget SHALL display the greeting "Good Night".

---

### Requirement 2: Focus Timer

**User Story:** As a User, I want a 25-minute countdown timer with Start, Stop, and Reset controls, so that I can use the Pomodoro technique to manage focused work sessions.

#### Acceptance Criteria

1. THE Focus_Timer SHALL initialize with a countdown value of 25 minutes and 00 seconds (25:00).
2. WHEN the User activates the Start control and the Focus_Timer is not already counting down, THE Focus_Timer SHALL begin counting down in one-second decrements from the current displayed time.
3. WHEN the User activates the Start control and the Focus_Timer is currently counting down, THE Focus_Timer SHALL take no action.
4. WHEN the User activates the Start control after a previous Stop, THE Focus_Timer SHALL resume counting down from the retained remaining time.
5. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL update the displayed time every second.
6. WHEN the User activates the Stop control and the Focus_Timer is counting down, THE Focus_Timer SHALL pause the countdown and retain the current remaining time.
7. WHEN the User activates the Stop control and the Focus_Timer is not counting down, THE Focus_Timer SHALL take no action.
8. WHEN the User activates the Reset control, THE Focus_Timer SHALL stop any active countdown and reset the displayed time to 25:00.
9. WHEN the countdown reaches 00:00, THE Focus_Timer SHALL stop counting down automatically.
10. WHEN the countdown reaches 00:00, THE Focus_Timer SHALL display a visible "Session complete!" message to notify the User that the session has ended.

---

### Requirement 3: To-Do List — Add and Display Tasks

**User Story:** As a User, I want to add tasks to a list and see them displayed, so that I can keep track of what I need to do.

#### Acceptance Criteria

1. THE Todo_List SHALL provide an input field (maximum 200 characters) and a submit control for entering new Task text.
2. WHEN the User submits a non-empty, non-whitespace-only Task text, THE Todo_List SHALL add a new Task to the end of the list and render it in the display.
3. IF the User attempts to submit an empty or whitespace-only Task text, THEN THE Todo_List SHALL not add a Task and SHALL retain focus on the input field.
4. WHEN a Task is added, THE Todo_List SHALL persist all Tasks to Local_Storage before any subsequent user interaction is processed.
5. WHEN the Dashboard is loaded, THE Todo_List SHALL retrieve all Tasks from Local_Storage and display them in the order they were originally added (oldest first).
6. IF Local_Storage is unavailable or returns malformed data on load, THEN THE Todo_List SHALL initialize with an empty Task list and discard the malformed entry without throwing an uncaught error.

---

### Requirement 4: To-Do List — Edit Tasks

**User Story:** As a User, I want to edit existing task text, so that I can correct or update what I meant to write.

#### Acceptance Criteria

1. THE Todo_List SHALL provide an edit control for each Task in the list.
2. WHEN the User activates the edit control for a Task, THE Todo_List SHALL display an editable input field pre-filled with the Task's current text.
3. WHEN the User confirms the edit and the input field contains at least 1 non-whitespace character, THE Todo_List SHALL update the Task's label to the trimmed input text and exit edit mode.
4. IF the User confirms the edit with a field that is empty or contains only whitespace characters, THEN THE Todo_List SHALL not update the Task and SHALL retain the original text.
5. WHEN a Task's text is updated, THE Todo_List SHALL persist the updated Task list to Local_Storage before any subsequent user interaction is processed.
6. IF Local_Storage is unavailable when persisting the updated Task list, THEN THE Todo_List SHALL display an error message indicating the save failed and SHALL retain the updated text in the current session.
7. WHEN the User cancels the edit, THE Todo_List SHALL discard any changes to the input field and exit edit mode with the Task's original text unchanged.

---

### Requirement 5: To-Do List — Complete and Delete Tasks

**User Story:** As a User, I want to mark tasks as done and delete tasks I no longer need, so that I can track my progress and keep the list clean.

#### Acceptance Criteria

1. THE Todo_List SHALL provide a completion toggle control for each Task.
2. WHEN the User activates the completion toggle on an incomplete Task, THE Todo_List SHALL mark the Task as complete and apply strikethrough text styling to the Task label.
3. WHEN the User activates the completion toggle on a complete Task, THE Todo_List SHALL mark the Task as incomplete and remove the strikethrough text styling from the Task label.
4. THE Todo_List SHALL provide a delete control for each Task.
5. WHEN the User activates the delete control for a Task, THE Todo_List SHALL permanently remove the Task from the list within 100 milliseconds, with no undo option.
6. WHEN a Task's completion state is changed, THE Todo_List SHALL persist the updated Task list to Local_Storage before any subsequent user interaction is processed.
7. WHEN a Task is deleted, THE Todo_List SHALL persist the updated Task list to Local_Storage before any subsequent user interaction is processed.
8. IF Local_Storage is unavailable when persisting after a completion toggle or delete, THEN THE Todo_List SHALL display an error message and retain the previous in-memory state without reverting the UI.

---

### Requirement 6: Quick Links — Display and Open Links

**User Story:** As a User, I want to see my saved favorite website shortcuts and open them with one click, so that I can navigate to frequently used sites quickly.

#### Acceptance Criteria

1. THE Quick_Links SHALL display all saved Links as clickable buttons, each labeled with the Link's label text.
2. WHEN the User clicks a Link button and the associated URL is a valid absolute URL, THE Quick_Links SHALL open the URL in a new browser tab.
3. WHEN the User clicks a Link button and the associated URL is not a valid absolute URL, THE Quick_Links SHALL not navigate and SHALL display an inline error message indicating the link is invalid.
4. WHEN the Dashboard is loaded, THE Quick_Links SHALL retrieve all Links from Local_Storage and render each Link as a button before any user interaction is possible.
5. IF Local_Storage contains no Links or returns malformed data on load, THEN THE Quick_Links SHALL display an empty panel with no buttons and discard the malformed entry without throwing an uncaught error.

---

### Requirement 7: Quick Links — Add and Delete Links

**User Story:** As a User, I want to add new website shortcuts and remove ones I no longer need, so that my quick-links panel stays relevant.

#### Acceptance Criteria

1. THE Quick_Links SHALL provide an input field for a Link label (maximum 50 characters), an input field for a Link URL (maximum 2048 characters), and a submit control for adding a new Link.
2. WHEN the User submits a Link with both a non-empty label and a non-empty URL, THE Quick_Links SHALL add the Link to the panel and render the new Link button.
3. IF the User submits a Link with an empty label or an empty URL, THEN THE Quick_Links SHALL not add the Link and SHALL display an inline validation message identifying which field is missing.
4. IF the User submits a Link with a non-empty URL that is not a valid absolute URL (i.e., does not begin with "http://" or "https://"), THEN THE Quick_Links SHALL not add the Link and SHALL display an inline validation message indicating the URL format is invalid.
5. THE Quick_Links SHALL provide a delete control for each Link button.
6. WHEN the User activates the delete control for a Link, THE Quick_Links SHALL remove the Link from the panel within 100 milliseconds, with no undo option.
7. WHEN a Link is added or deleted, THE Quick_Links SHALL persist the updated Link list to Local_Storage before any subsequent user interaction is processed.
8. IF the number of saved Links reaches 20, THEN THE Quick_Links SHALL disable the submit control and display a message indicating the maximum number of links has been reached.

---

### Requirement 8: Data Persistence Integrity

**User Story:** As a User, I want my tasks and links to be reliably saved and restored, so that I never lose my data between browser sessions.

#### Acceptance Criteria

1. THE Dashboard SHALL serialize each Task as a JSON object containing at minimum: a unique identifier, the task text, and the completion status; and each Link as a JSON object containing at minimum: a unique identifier, the label, and the URL.
2. WHEN the Dashboard is loaded, THE Dashboard SHALL deserialize Task and Link data from Local_Storage and restore the complete application state before any user interaction is possible.
3. IF the Local_Storage entry for Tasks is missing or contains malformed data, THEN THE Dashboard SHALL initialize the Todo_List with an empty Task list and discard the malformed entry without throwing an uncaught error.
4. IF the Local_Storage entry for Links is missing or contains malformed data, THEN THE Dashboard SHALL initialize the Quick_Links with an empty Link list and discard the malformed entry without throwing an uncaught error.
5. WHEN any Task or Link is created, updated, or deleted, THE Dashboard SHALL write the updated data to Local_Storage before the next user interaction is processed.

---

### Requirement 9: Layout and Visual Design

**User Story:** As a User, I want a clean, readable, and visually organized interface, so that I can use the Dashboard comfortably without distraction.

#### Acceptance Criteria

1. THE Dashboard SHALL render all four widgets (Greeting_Widget, Focus_Timer, Todo_List, Quick_Links) within a single HTML page without requiring page navigation.
2. THE Dashboard SHALL apply styles exclusively from a single CSS file located in the `css/` directory.
3. THE Dashboard SHALL apply all interactive behavior exclusively from a single JavaScript file located in the `js/` directory.
4. THE Dashboard SHALL separate each widget from adjacent widgets with a minimum of 16px spacing or a visible border so that no two widget boundaries overlap.
5. THE Dashboard SHALL use a font size of at least 14px for body text and a text-to-background contrast ratio of at least 4.5:1 for all body text when rendered on a viewport of at least 1024px wide.
6. WHEN the Dashboard is rendered on a viewport narrower than 768px, THE Dashboard SHALL arrange all widgets in a single-column layout so that no widget content is clipped or requires horizontal scrolling.
