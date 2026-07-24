/**
 * Storage Module - Handles LocalStorage operations for tasks
 */

const Storage = {
    STORAGE_KEY: 'todoTasks',

    /**
     * Get all tasks from localStorage
     * @returns {Array} Array of task objects
     */
    getTasks() {
        try {
            const tasks = localStorage.getItem(this.STORAGE_KEY);
            return tasks ? JSON.parse(tasks) : [];
        } catch (error) {
            console.error('Error retrieving tasks from localStorage:', error);
            return [];
        }
    },

    /**
     * Save tasks to localStorage
     * @param {Array} tasks - Array of task objects to save
     */
    saveTasks(tasks) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
            console.error('Error saving tasks to localStorage:', error);
        }
    },

    /**
     * Add a new task
     * @param {string} text - Task text
     * @returns {Object} The newly created task
     */
    addTask(text) {
        const tasks = this.getTasks();
        const newTask = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        this.saveTasks(tasks);
        return newTask;
    },

    /**
     * Update a task
     * @param {number} id - Task ID
     * @param {string} text - New task text
     * @returns {boolean} Success status
     */
    updateTask(id, text) {
        const tasks = this.getTasks();
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.text = text.trim();
            this.saveTasks(tasks);
            return true;
        }
        return false;
    },

    /**
     * Toggle task completion status
     * @param {number} id - Task ID
     * @returns {boolean} New completion status
     */
    toggleTask(id) {
        const tasks = this.getTasks();
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks(tasks);
            return task.completed;
        }
        return false;
    },

    /**
     * Delete a task
     * @param {number} id - Task ID
     * @returns {boolean} Success status
     */
    deleteTask(id) {
        const tasks = this.getTasks();
        const filteredTasks = tasks.filter(t => t.id !== id);
        if (filteredTasks.length < tasks.length) {
            this.saveTasks(filteredTasks);
            return true;
        }
        return false;
    },

    /**
     * Delete all completed tasks
     * @returns {boolean} Success status
     */
    deleteCompleted() {
        const tasks = this.getTasks();
        const activeTasks = tasks.filter(t => !t.completed);
        const hadCompleted = activeTasks.length < tasks.length;
        if (hadCompleted) {
            this.saveTasks(activeTasks);
        }
        return hadCompleted;
    },

    /**
     * Delete all tasks
     * @returns {boolean} Success status
     */
    deleteAll() {
        const tasks = this.getTasks();
        if (tasks.length > 0) {
            this.saveTasks([]);
            return true;
        }
        return false;
    },

    /**
     * Get statistics about tasks
     * @returns {Object} Statistics object
     */
    getStats() {
        const tasks = this.getTasks();
        const completed = tasks.filter(t => t.completed).length;
        return {
            total: tasks.length,
            active: tasks.length - completed,
            completed: completed
        };
    },

    /**
     * Get filtered tasks
     * @param {string} filter - Filter type: 'all', 'active', or 'completed'
     * @returns {Array} Filtered tasks
     */
    getFilteredTasks(filter = 'all') {
        const tasks = this.getTasks();
        switch (filter) {
            case 'active':
                return tasks.filter(t => !t.completed);
            case 'completed':
                return tasks.filter(t => t.completed);
            default:
                return tasks;
        }
    }
};
