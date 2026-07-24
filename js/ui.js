/**
 * UI Module - Handles DOM manipulation and UI updates
 */

const UI = {
    taskList: document.getElementById('taskList'),
    taskInput: document.getElementById('taskInput'),
    addBtn: document.getElementById('addBtn'),
    clearCompletedBtn: document.getElementById('clearCompleted'),
    clearAllBtn: document.getElementById('clearAll'),
    emptyState: document.getElementById('emptyState'),
    totalCount: document.getElementById('totalCount'),
    activeCount: document.getElementById('activeCount'),
    completedCount: document.getElementById('completedCount'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    editModal: document.getElementById('editModal'),
    editInput: document.getElementById('editInput'),
    saveBtn: document.getElementById('saveBtn'),
    cancelBtn: document.getElementById('cancelBtn'),
    closeModal: document.querySelector('.close'),
    currentEditId: null,
    currentFilter: 'all',

    /**
     * Initialize UI components and event listeners
     */
    init() {
        this.addEventListeners();
        this.render();
    },

    /**
     * Add event listeners to UI elements
     */
    addEventListeners() {
        this.addBtn.addEventListener('click', () => App.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') App.addTask();
        });
        this.clearCompletedBtn.addEventListener('click', () => App.clearCompleted());
        this.clearAllBtn.addEventListener('click', () => App.clearAll());

        // Filter buttons
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });

        // Modal controls
        this.closeModal.addEventListener('click', () => this.closeEditModal());
        this.cancelBtn.addEventListener('click', () => this.closeEditModal());
        this.saveBtn.addEventListener('click', () => this.saveEdit());
        this.editInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveEdit();
        });
        window.addEventListener('click', (e) => {
            if (e.target === this.editModal) this.closeEditModal();
        });
    },

    /**
     * Render the entire task list and update UI
     */
    render() {
        const tasks = Storage.getFilteredTasks(this.currentFilter);
        this.taskList.innerHTML = '';

        if (tasks.length === 0) {
            this.emptyState.classList.add('show');
        } else {
            this.emptyState.classList.remove('show');
            tasks.forEach(task => {
                this.taskList.appendChild(this.createTaskElement(task));
            });
        }

        this.updateStats();
    },

    /**
     * Create a task list item element
     * @param {Object} task - Task object
     * @returns {HTMLElement} Task list item element
     */
    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
            <span class="task-text">${this.escapeHtml(task.text)}</span>
            <div class="task-actions">
                <button class="icon-btn edit" data-id="${task.id}" title="Edit task">✏️</button>
                <button class="icon-btn delete" data-id="${task.id}" title="Delete task">🗑️</button>
            </div>
        `;

        // Checkbox listener
        li.querySelector('.checkbox').addEventListener('change', () => {
            App.toggleTask(task.id);
        });

        // Edit button listener
        li.querySelector('.edit').addEventListener('click', () => {
            this.openEditModal(task.id, task.text);
        });

        // Delete button listener
        li.querySelector('.delete').addEventListener('click', () => {
            App.deleteTask(task.id);
        });

        return li;
    },

    /**
     * Update task statistics display
     */
    updateStats() {
        const stats = Storage.getStats();
        this.totalCount.textContent = stats.total;
        this.activeCount.textContent = stats.active;
        this.completedCount.textContent = stats.completed;
    },

    /**
     * Clear input field
     */
    clearInput() {
        this.taskInput.value = '';
        this.taskInput.focus();
    },

    /**
     * Open edit modal
     * @param {number} id - Task ID
     * @param {string} text - Current task text
     */
    openEditModal(id, text) {
        this.currentEditId = id;
        this.editInput.value = text;
        this.editModal.classList.add('show');
        this.editInput.focus();
        this.editInput.select();
    },

    /**
     * Close edit modal
     */
    closeEditModal() {
        this.editModal.classList.remove('show');
        this.currentEditId = null;
        this.editInput.value = '';
    },

    /**
     * Save edited task
     */
    saveEdit() {
        const newText = this.editInput.value.trim();
        if (newText && this.currentEditId !== null) {
            App.updateTask(this.currentEditId, newText);
            this.closeEditModal();
        }
    },

    /**
     * Escape HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};
