/**
 * Main Application Module - Orchestrates Storage and UI modules
 */

const App = {
    /**
     * Initialize the application
     */
    init() {
        UI.init();
        console.log('To-Do List Application Initialized');
    },

    /**
     * Add a new task
     */
    addTask() {
        const text = UI.taskInput.value.trim();

        if (!text) {
            alert('Please enter a task!');
            return;
        }

        if (text.length > 200) {
            alert('Task is too long (max 200 characters)');
            return;
        }

        Storage.addTask(text);
        UI.clearInput();
        UI.render();
    },

    /**
     * Update an existing task
     * @param {number} id - Task ID
     * @param {string} text - New task text
     */
    updateTask(id, text) {
        if (text.length > 200) {
            alert('Task is too long (max 200 characters)');
            return;
        }

        Storage.updateTask(id, text);
        UI.render();
    },

    /**
     * Toggle task completion status
     * @param {number} id - Task ID
     */
    toggleTask(id) {
        Storage.toggleTask(id);
        UI.render();
    },

    /**
     * Delete a task
     * @param {number} id - Task ID
     */
    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            Storage.deleteTask(id);
            UI.render();
        }
    },

    /**
     * Clear all completed tasks
     */
    clearCompleted() {
        const stats = Storage.getStats();
        if (stats.completed === 0) {
            alert('No completed tasks to clear!');
            return;
        }

        if (confirm(`Clear ${stats.completed} completed task(s)?`)) {
            Storage.deleteCompleted();
            UI.render();
        }
    },

    /**
     * Clear all tasks
     */
    clearAll() {
        const stats = Storage.getStats();
        if (stats.total === 0) {
            alert('No tasks to clear!');
            return;
        }

        if (confirm('Are you sure you want to delete ALL tasks? This cannot be undone.')) {
            Storage.deleteAll();
            UI.clearInput();
            UI.render();
        }
    }
};

// Initialize the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
