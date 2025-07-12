import { useState, useEffect, useCallback } from 'react';
// Assuming loadTasksFromLocalStorage, saveTasksToLocalStorage are in src/tools/index.js or src/tools/dataTools.js
// Based on your App.jsx, it seems loadTasksFromLocalStorage and saveTasksToLocalStorage are not explicitly imported,
// but rather handled by the custom hook itself or implicitly from a dataTools.js.
// Let's assume they are defined within this file or easily accessible.
// If they are in a separate file like dataTools.js, ensure to import them.
// For now, I'll define them here for completeness based on previous context.

// Re-defining for clarity, assuming they were implicitly available or defined elsewhere
const TODO_STORAGE_KEY = 'my_app_todo_tasks';

const loadTasksFromLocalStorage = () => {
  try {
    const tasksJsonString = localStorage.getItem(TODO_STORAGE_KEY);
    if (tasksJsonString === null) {
      return [];
    }
    let tasks = JSON.parse(tasksJsonString);
    // Ensure subtasks and tags are arrays, even if saved as null/undefined
    // NEW: Migrate 'drafted' status to 'new-on-hold'
    tasks = tasks.map(task => ({
      ...task,
      subtasks: task.subtasks || [],
      tags: task.tags || [], // Ensure tags are an array
      status: task.status === 'drafted' ? 'new-on-hold' : task.status // MIGRATION LOGIC
    }));
    return tasks;
  } catch (error) {
    console.error('Error loading tasks from local storage:', error);
    return [];
  }
};

const saveTasksToLocalStorage = (tasksList) => {
  try {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(tasksList));
    console.log('Tasks successfully saved to local storage.');
  } catch (error) {
    console.error('Error saving tasks to local storage:', error);
  }
};

// Import all task utilities from todoTools.js
import {
  addTaskLocally,
  editTaskLocally,
  updateTaskStatusLocally,
  deleteTaskLocally,
  addSubtaskLocally,
  toggleSubtaskCompleteLocally // Ensure this is imported if used
} from './todoTools'; // Path from src/tools/useTodoManagement.js to src/tools/todoTools.js


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

  // onAddTask now accepts priority
  const handleAddTask = useCallback((text, tags, priority) => {
    setTasks(prevTasks => addTaskLocally(prevTasks, text, tags, priority));
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

  // Assuming onToggleSubtaskComplete is used and needs to be returned
  const handleToggleSubtaskComplete = useCallback((parentTaskId, subtaskId) => {
    setTasks(prevTasks => toggleSubtaskCompleteLocally(prevTasks, parentTaskId, subtaskId));
  }, []);


  return {
    tasks,
    onAddTask: handleAddTask,
    onEditTask: handleEditTask,
    onUpdateTaskStatus: handleUpdateTaskStatus,
    onDeleteTask: handleDeleteTask,
    onAddSubtask: handleAddSubtask,
    onToggleSubtaskComplete: handleToggleSubtaskComplete, // Ensure this is returned if used
  };
};

