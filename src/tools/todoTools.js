// src/todoTools.js
// This file contains utility functions for managing tasks locally, now with tagging support.

/**
 * Generates a simple unique ID for tasks and subtasks.
 * In a real application, consider a more robust ID generator like UUID.
 * @returns {string} A unique ID string.
 */
const generateUniqueId = () => {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};

/**
 * Adds a new task to the list.
 * @param {Array<Object>} currentTasks - The current array of tasks.
 * @param {string} text - The text content of the new task.
 * @param {Array<string>} tags - An array of tags for the new task.
 * @returns {Array<Object>} A new array of tasks with the added task.
 */
export const addTaskLocally = (currentTasks, text, tags = []) => {
    const newTask = {
        id: generateUniqueId(),
        text,
        status: 'drafted', // New tasks start as 'drafted'
        subtasks: [],      // Initialize with empty subtasks
        tags: tags,        // Add tags property
        createdAt: new Date().toISOString(), // Local timestamp
    };
    return [newTask, ...currentTasks]; // Add new task to the beginning
};

/**
 * Edits an existing task's text and/or tags.
 * @param {Array<Object>} currentTasks - The current array of tasks.
 * @param {string} taskId - The ID of the task to edit.
 * @param {Object} updates - An object with properties to update (e.g., { text: 'New Text', tags: ['work', 'urgent'] }).
 * @returns {Array<Object>} A new array of tasks with the updated task.
 */
export const editTaskLocally = (currentTasks, taskId, updates) => {
    return currentTasks.map(task =>
        task.id === taskId ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
    );
};

/**
 * Updates the status (moves to a different list) of a task.
 * @param {Array<Object>} currentTasks - The current array of tasks.
 * @param {string} taskId - The ID of the task to update.
 * @param {string} newStatus - The new status for the task (e.g., 'in-progress', 'completed').
 * @returns {Array<Object>} A new array of tasks with the updated task status.
 */
export const updateTaskStatusLocally = (currentTasks, taskId, newStatus) => {
    return currentTasks.map(task =>
        task.id === taskId
            ? {
                ...task,
                status: newStatus,
                updatedAt: new Date().toISOString(),
                ...(newStatus === 'completed' && { completedAt: new Date().toISOString() }),
            }
            : task
    );
};

/**
 * Deletes a task from the list.
 * @param {Array<Object>} currentTasks - The current array of tasks.
 * @param {string} taskId - The ID of the task to delete.
 * @returns {Array<Object>} A new array of tasks with the specified task removed.
 */
export const deleteTaskLocally = (currentTasks, taskId) => {
    return currentTasks.filter(task => task.id !== taskId);
};

/**
 * Adds a new subtask to a parent task.
 * @param {Array<Object>} currentTasks - The current array of tasks.
 * @param {string} parentTaskId - The ID of the parent task.
 * @param {string} subtaskText - The text content of the new subtask.
 * @returns {Array<Object>} A new array of tasks with the subtask added to the parent task.
 */
export const addSubtaskLocally = (currentTasks, parentTaskId, subtaskText) => {
    return currentTasks.map(task => {
        if (task.id === parentTaskId) {
            const newSubtask = {
                id: generateUniqueId(),
                text: subtaskText,
                completed: false,
                createdAt: new Date().toISOString(),
            };
            const updatedSubtasks = task.subtasks ? [...task.subtasks, newSubtask] : [newSubtask];
            return {
                ...task,
                subtasks: updatedSubtasks,
                updatedAt: new Date().toISOString(),
            };
        }
        return task;
    });
};

/**
 * Toggles the completion status of a subtask within a parent task.
 * @param {Array<Object>} currentTasks - The current array of tasks.
 * @param {string} parentTaskId - The ID of the parent task.
 * @param {string} subtaskId - The ID of the subtask to toggle.
 * @returns {Array<Object>} A new array of items with the subtask's completion status updated.
 */
export const toggleSubtaskCompleteLocally = (currentTasks, parentTaskId, subtaskId) => {
    return currentTasks.map(task => {
        if (task.id === parentTaskId) {
            const updatedSubtasks = task.subtasks.map(subtask =>
                subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
            );
            return { ...task, subtasks: updatedSubtasks, updatedAt: new Date().toISOString() };
        }
        return task;
    });
};

