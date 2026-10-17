/* js/app.js — Todo List Life Dashboard */

/* ─────────────────────────────────────────
   StorageService
   Thin wrapper around localStorage.
   Returns safe defaults on any error.
───────────────────────────────────────── */
const StorageService = {
  loadTasks() {
    try {
      const raw = localStorage.getItem('dashboard_tasks');
      if (raw === null) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveTasks(tasks, onError) {
    try {
      localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
    } catch (err) {
      if (typeof onError === 'function') onError(err);
    }
  },

  loadLinks() {
    try {
      const raw = localStorage.getItem('dashboard_links');
      if (raw === null) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveLinks(links, onError) {
    try {
      localStorage.setItem('dashboard_links', JSON.stringify(links));
    } catch (err) {
      if (typeof onError === 'function') onError(err);
    }
  },
};

/* ─────────────────────────────────────────
   GreetingWidget
   Displays current time, date, and a
   time-based greeting; updates every second.
───────────────────────────────────────── */
const GreetingWidget = {
  init() {
    this._render();
    setInterval(() => this._render(), 1000);
  },

  _render() {
    const now = new Date();
    document.getElementById('greeting-time').textContent = this._formatTime(now);
    document.getElementById('greeting-date').textContent = this._formatDate(now);
    document.getElementById('greeting-text').textContent = this._getGreeting(now.getHours());
  },

  _getGreeting(hour) {
    if (hour >= 5 && hour <= 11) return 'Good Morning';
    if (hour >= 12 && hour <= 17) return 'Good Afternoon';
    if (hour >= 18 && hour <= 20) return 'Good Evening';
    return 'Good Night'; // 21–23 and 0–4
  },

  _formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return (
      String(hours).padStart(2, '0') +
      ':' +
      String(minutes).padStart(2, '0') +
      ':' +
      String(seconds).padStart(2, '0') +
      ' ' +
      period
    );
  },

  _formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return (
      days[date.getDay()] +
      ', ' +
      months[date.getMonth()] +
      ' ' +
      date.getDate() +
      ', ' +
      date.getFullYear()
    );
  },
};

/* ─────────────────────────────────────────
   FocusTimer
   25-minute Pomodoro countdown with
   Start / Stop / Reset controls.
───────────────────────────────────────── */
const FocusTimer = {
  _remainingSeconds: 1500,
  _intervalId: null,
  _isRunning: false,

  init() {
    this._render();
    document.getElementById('timer-start').addEventListener('click', () => this._start());
    document.getElementById('timer-stop').addEventListener('click', () => this._stop());
    document.getElementById('timer-reset').addEventListener('click', () => this._reset());
    document.getElementById('timer-set').addEventListener('click', () => this._setTimer());
  },
_setTimer() {
    const timerInput = document.getElementById('timer-input');
    let newMinutes = parseInt(timerInput.value);
    
    if (isNaN(newMinutes) || newMinutes <= 0) {
      alert("Masukkan angka menit yang valid!");
      return;
    }
    
    this._stop(); 
    this._remainingSeconds = newMinutes * 60; 
    
    const msg = document.getElementById('timer-message');
    msg.textContent = '';
    msg.classList.add('hidden'); 
    
    this._render(); 
  },
  _start() {
    if (this._isRunning) return;
    this._isRunning = true;
    this._intervalId = setInterval(() => this._tick(), 1000);
    this._render();
  },

  _stop() {
    if (!this._isRunning) return;
    clearInterval(this._intervalId);
    this._intervalId = null;
    this._isRunning = false;
  },

  _reset() {
    clearInterval(this._intervalId);
    this._intervalId = null;
    this._isRunning = false;
    this._remainingSeconds = 1500;
    this._render();
    const msg = document.getElementById('timer-message');
    msg.textContent = '';
    msg.classList.add('hidden');
  },

  _tick() {
    this._remainingSeconds -= 1;
    this._render();
    if (this._remainingSeconds <= 0) {
      clearInterval(this._intervalId);
      this._intervalId = null;
      this._isRunning = false;
      const msg = document.getElementById('timer-message');
      msg.textContent = 'Session complete!';
      msg.classList.remove('hidden');
    }
  },

  _render() {
    document.getElementById('timer-display').textContent =
      this._formatTime(this._remainingSeconds);
  },

  _formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  },
};

/* ─────────────────────────────────────────
   TodoList
   Persistent, ordered list of tasks
   (add, edit, complete, delete).
───────────────────────────────────────── */
const TodoList = {
  _tasks: [],

  init(tasks) {
    this._tasks = tasks;
    this._renderList();
    document.getElementById('todo-add').addEventListener('click', () => {
      const input = document.getElementById('todo-input');
      this._addTask(input.value);
    });
    document.getElementById('todo-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this._addTask(e.target.value);
      }
    });
    const sortDropdown = document.getElementById('todo-sort');
    if (sortDropdown) {
      sortDropdown.addEventListener('change', (e) => {
        this._sortTasks(e.target.value);
      });
    }
  },
_sortTasks(sortType) {
    if (sortType === 'az') {
      this._tasks.sort((a, b) => a.text.localeCompare(b.text));
    } else if (sortType === 'za') {
      this._tasks.sort((a, b) => b.text.localeCompare(a.text));
    } else if (sortType === 'status') {
      this._tasks.sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
    }
    this._persist();
    this._renderList();
  },
  _addTask(text) {
    const trimmed = text.trim();
    const input = document.getElementById('todo-input');
    if (!trimmed) {
      input.focus();
      return;
    }
    const isDuplicate = this._tasks.some(
      (t) => t.text.toLowerCase() === trimmed.toLowerCase()
    );
    const errEl = document.getElementById('todo-error');

    if (isDuplicate) {
      errEl.textContent = 'Tugas ini sudah ada di dalam daftar!';
      errEl.classList.remove('hidden');
      setTimeout(() => errEl.classList.add('hidden'), 3000);
      return; 
    } else {
      errEl.classList.add('hidden');
    }
    const task = {
      id: (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : Date.now() + '-' + Math.random(),
      text: trimmed,
      completed: false,
    };
    this._tasks.push(task);
    this._persist();
    this._renderList();
    input.value = '';
    input.focus();
  },

  _editTask(id, newText) {
    const trimmed = newText.trim();
    if (!trimmed) return;
    const task = this._tasks.find((t) => t.id === id);
    if (task) {
      task.text = trimmed;
      this._persist();
      this._renderList();
    }
  },

  _toggleTask(id) {
    const task = this._tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this._persist();
      this._renderList();
    }
  },

  _deleteTask(id) {
    this._tasks = this._tasks.filter((t) => t.id !== id);
    this._persist();
    this._renderList();
  },

  _persist() {
    StorageService.saveTasks(this._tasks, () => {
      const errEl = document.getElementById('todo-error');
      errEl.textContent = 'Save failed — changes may not persist after reload.';
      errEl.classList.remove('hidden');
    });
  },

  _renderList() {
    const list = document.getElementById('todo-task-list');
    list.innerHTML = '';
    this._tasks.forEach((task) => list.appendChild(this._renderTask(task)));
  },

  _renderTask(task) {
    const li = document.createElement('li');
    li.className = 'todo-item' + (task.completed ? ' completed' : '');
    li.dataset.id = task.id;

    // Completion toggle
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', 'Mark task complete');
    checkbox.addEventListener('change', () => this._toggleTask(task.id));

    // Label (view mode)
    const label = document.createElement('span');
    label.className = 'task-label ml-3';
    label.textContent = task.text;

    // Edit input (hidden in view mode)
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'task-edit-input hidden';
    editInput.maxLength = 200;
    editInput.value = task.text;
    editInput.setAttribute('aria-label', 'Edit task text');

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'btn-edit ml-3';
    editBtn.textContent = 'Edit';
    editBtn.setAttribute('aria-label', 'Edit task');

    // Confirm edit button (hidden in view mode)
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn-confirm hidden ml-3';
    confirmBtn.textContent = 'Save';
    confirmBtn.setAttribute('aria-label', 'Save edit');

    // Cancel edit button (hidden in view mode)
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn-cancel hidden ml-3';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.setAttribute('aria-label', 'Cancel edit');

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete ml-3';
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('aria-label', 'Delete task');

    // Wire edit controls
    const enterEditMode = () => {
      label.classList.add('hidden');
      editInput.classList.remove('hidden');
      editBtn.classList.add('hidden');
      confirmBtn.classList.remove('hidden');
      cancelBtn.classList.remove('hidden');
      editInput.focus();
    };

    const exitEditMode = () => {
      label.classList.remove('hidden');
      editInput.classList.add('hidden');
      editBtn.classList.remove('hidden');
      confirmBtn.classList.add('hidden');
      cancelBtn.classList.add('hidden');
    };

    editBtn.addEventListener('click', enterEditMode);

    confirmBtn.addEventListener('click', () => {
      this._editTask(task.id, editInput.value);
    });

    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this._editTask(task.id, editInput.value);
      if (e.key === 'Escape') exitEditMode();
    });

    cancelBtn.addEventListener('click', exitEditMode);

    deleteBtn.addEventListener('click', () => this._deleteTask(task.id));

    li.append(checkbox, label, editInput, editBtn, confirmBtn, cancelBtn, deleteBtn);
    return li;
  },
};

/* ─────────────────────────────────────────
   QuickLinks
   Persistent set of user-defined shortcut
   links (add, open, delete).
───────────────────────────────────────── */
const QuickLinks = {
  _links: [],

  init(links) {
    this._links = links;
    this._renderPanel();
    document.getElementById('link-add').addEventListener('click', () => {
      const label = document.getElementById('link-label-input').value;
      const url = document.getElementById('link-url-input').value;
      this._addLink(label, url);
    });
  },

  _isValidAbsoluteURL(url) {
    return (
      typeof url === 'string' &&
      (url.startsWith('http://') || url.startsWith('https://')) &&
      url.length > 'https://'.length
    );
  },

  _addLink(label, url) {
    const trimmedLabel = label.trim();
    const trimmedUrl = url.trim();
    const msgEl = document.getElementById('links-validation-message');

    if (!trimmedLabel && !trimmedUrl) {
      msgEl.textContent = 'Please enter a label and a URL.';
      msgEl.classList.remove('hidden');
      return;
    }
    if (!trimmedLabel) {
      msgEl.textContent = 'Please enter a label.';
      msgEl.classList.remove('hidden');
      return;
    }
    if (!trimmedUrl) {
      msgEl.textContent = 'Please enter a URL.';
      msgEl.classList.remove('hidden');
      return;
    }
    if (!this._isValidAbsoluteURL(trimmedUrl)) {
      msgEl.textContent = 'URL must begin with "http://" or "https://".';
      msgEl.classList.remove('hidden');
      return;
    }
    if (this._links.length >= 20) return;

    msgEl.classList.add('hidden');
    msgEl.textContent = '';

    const link = {
      id: (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : Date.now() + '-' + Math.random(),
      label: trimmedLabel,
      url: trimmedUrl,
    };
    this._links.push(link);
    this._persist();
    this._renderPanel();

    document.getElementById('link-label-input').value = '';
    document.getElementById('link-url-input').value = '';
  },

  _deleteLink(id) {
    this._links = this._links.filter((l) => l.id !== id);
    this._persist();
    this._renderPanel();
  },

  _openLink(url, errorContainer) {
    if (this._isValidAbsoluteURL(url)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      errorContainer.textContent = 'Invalid URL — cannot open link.';
      errorContainer.classList.remove('hidden');
    }
  },

  _persist() {
    StorageService.saveLinks(this._links, () => {
      const msgEl = document.getElementById('links-validation-message');
      msgEl.textContent = 'Save failed — changes may not persist after reload.';
      msgEl.classList.remove('hidden');
    });
  },

  _renderPanel() {
    const panel = document.getElementById('links-panel');
    panel.innerHTML = '';
    const capMsg = document.getElementById('links-cap-message');
    const addBtn = document.getElementById('link-add');

    if (this._links.length >= 20) {
      capMsg.classList.remove('hidden');
      addBtn.disabled = true;
    } else {
      capMsg.classList.add('hidden');
      addBtn.disabled = false;
    }

    this._links.forEach((link) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'link-item';

      const linkBtn = document.createElement('button');
      linkBtn.className = 'link-btn';
      linkBtn.textContent = link.label;

      const errorSpan = document.createElement('span');
      errorSpan.className = 'link-error hidden';

      linkBtn.addEventListener('click', () => this._openLink(link.url, errorSpan));

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-delete';
      deleteBtn.textContent = '✕';
      deleteBtn.setAttribute('aria-label', 'Delete link ' + link.label);
      deleteBtn.addEventListener('click', () => this._deleteLink(link.id));

      wrapper.append(linkBtn, errorSpan, deleteBtn);
      panel.appendChild(wrapper);
    });
  },
};

/* ─────────────────────────────────────────
   Test Exports — expose pure functions for
   property-based tests in tests.html.
   Assigned immediately (before DOMContentLoaded)
   so tests.html can access them without the
   full widget DOM being present.
───────────────────────────────────────── */
window._testExports = {
  _getGreeting: (hour) => GreetingWidget._getGreeting(hour),
  _formatTime:  (date) => GreetingWidget._formatTime(date),
  _formatDate:  (date) => GreetingWidget._formatDate(date),
  _timerFormatTime: (seconds) => FocusTimer._formatTime(seconds),
};

/* ─────────────────────────────────────────
   Bootstrap — initialise all widgets after
   the DOM is fully parsed.
   Guard against running on pages that don't
   include the full dashboard DOM (e.g. tests.html).
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Only initialise widgets when the dashboard DOM is present
  if (!document.getElementById('greeting-widget')) return;
  const tasks = StorageService.loadTasks();
  const links = StorageService.loadLinks();

  GreetingWidget.init();
  FocusTimer.init();
  TodoList.init(tasks);
  QuickLinks.init(links);
});
