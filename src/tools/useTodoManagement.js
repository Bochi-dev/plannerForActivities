import { useState, useEffect, useCallback } from 'react';
import {
  addTaskLocally,
  editTaskLocally,
  updateTaskStatusLocally,
  deleteTaskLocally,
  addSubtaskLocally,
} from './todoTools'; // This path expects todoTools.js to be directly in the 'src/' directory
                       // if useTodoManagement.js is in 'src/hooks/'

// --- Local Storage Key for Tasks ---
const TODO_STORAGE_KEY = 'my_app_todo_tasks';

/**
 * Loads tasks from local storage.
 * @returns {Array<Object>} The array of tasks, or an empty array if none found.
 */
const loadTasksFromLocalStorage = () => {
  try {
    const tasksJsonString = localStorage.getItem(TODO_STORAGE_KEY);
    if (tasksJsonString === null) {
      return [];
    }
    const tasks = JSON.parse(tasksJsonString);
    // Ensure subtasks and tags are arrays, even if saved as null/undefined
    return tasks.map(task => ({
      ...task,
      subtasks: task.subtasks || [],
      tags: task.tags || [] // Ensure tags are an array
    }));
  } catch (error) {
    console.error('Error loading tasks from local storage:', error);
    return [];
  }
};

/**
 * Saves tasks to local storage.
 * @param {Array<Object>} tasksList - The array of tasks to save.
 */
const saveTasksToLocalStorage = (tasksList) => {
  try {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(tasksList));
    console.log('Tasks successfully saved to local storage.');
  } catch (error) {
    console.error('Error saving tasks to local storage:', error);
  }
};

/**
 * Custom React Hook for managing To-Do tasks locally.
 * Encapsulates task state, local storage persistence, and CRUD/subtask operations.
 * @returns {Object} An object containing the tasks array and all task management functions.
 */
export const useTodoManagement = () => {
  const [tasks, setTasks] = useState(() => loadTasksFromLocalStorage()); // Initialize state from local storage

  // Effect to save tasks to local storage whenever 'tasks' state changes
  useEffect(() => {
    saveTasksToLocalStorage(tasks);
  }, [tasks]);


  // --- Task Management Operations using todoTools.js ---

  const handleAddTask = useCallback((text, tags, priority) => {
    console.log("useTodoManagement.js: onAddTask received:", { text, tags, priority }); // DEBUG LOG
    setTasks(prevTasks => addTaskLocally(prevTasks, text, tags, priority)); // Pass priority to addTaskLocally
  }, []);

  const handleEditTask = useCallback((id, updates) => {
    setTasks(prevTasks => editTaskLocally(prevTasks, id, updates));
  }, []);

  const handleUpdateTaskStatus = useCallback((id, newStatus) => {
    setTasks(prevTasks => updateTaskStatusLocally(prevTasks, id, newStatus));
  }, []);

  const handleDeleteTask = useCallback((id) => {
    // IMPORTANT: For production, replace window.confirm with an Ant Design Modal.confirm
    if (window.confirm('Are you sure you want to delete this task?')) {
        setTasks(prevTasks => deleteTaskLocally(prevTasks, id));
    }
  }, []);

  const handleAddSubtask = useCallback((parentTaskId, subtaskText) => {
    setTasks(prevTasks => addSubtaskLocally(prevTasks, parentTaskId, subtaskText));
  }, []);

  return {
    tasks,
    onAddTask: handleAddTask,
    onEditTask: handleEditTask,
    onUpdateTaskStatus: handleUpdateTaskStatus,
    onDeleteTask: handleDeleteTask,
    onAddSubtask: handleAddSubtask,
  };
};

