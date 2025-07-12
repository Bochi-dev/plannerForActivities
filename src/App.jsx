import "./App.css";
import "./styles/Todo.css";
import { useState, useEffect, useCallback } from "react";
import { SideMenu, Header, TagDetailModal } from "./components"
import { Space, Button, Drawer, Flex } from "antd"
import { Route, Routes, useNavigate, useLocation } from "react-router-dom"
import { Planner, Todo, Tags, Papafritapage } from "./pages"
import {
  loadEventsFromLocalStorage,
  loadRatingsFromLocalStorage,
  useTodoManagement,
  loadAllTagsFromLocalStorage,
  saveAllTagsToLocalStorage,
  addTagObjectLocally,
  editTagObjectLocally,
  deleteTagObjectLocally,
  ensureTagsExistInCentralList,
  updateTagUsageLocally,
  TASK_STATUS, // Import TASK_STATUS from todoTools
} from "./tools"

const loadedEvents = loadEventsFromLocalStorage()
const loadedRatings = loadRatingsFromLocalStorage()
const loadedAllTags = loadAllTagsFromLocalStorage();

export default function App() {
  const [events, setEvents] = useState([...loadedEvents]);
  const [ratingsOfEvents, setRatingsOfEvents] = useState([...loadedRatings]);
  const [openDrawer, setOpenDrawer] = useState(false);

  const [allTags, setAllTags] = useState([...loadedAllTags]);

  // Effect to save allTags to local storage whenever 'allTags' state changes
  useEffect(() => {
    saveAllTagsToLocalStorage(allTags);
  }, [allTags]);

  // Use the custom hook for To-Do tasks
  const {
    tasks,
    onAddTask: originalOnAddTask, // Rename to avoid conflict with our wrapped version
    onEditTask: originalOnEditTask, // Rename to avoid conflict with our wrapped version
    onUpdateTaskStatus: originalOnUpdateTaskStatus,
    onDeleteTask,
    onAddSubtask,
  } = useTodoManagement();

  // --- Wrapped Task Management Functions to Ensure Tags Exist ---\
  //   Include the status when adding a new task - **UPDATED STATUS**
  // UPDATED: Add description parameter (optional, default "")
  const handleAddTask = useCallback((text, tags, priority, description = "", status = TASK_STATUS.NEW_ON_HOLD) => {
    console.log("App.jsx: handleAddTask received:", { text, tags, priority, description, status }); // DEBUG LOG
    ensureTagsExistInCentralList(allTags, tags, setAllTags);
    // Pass description to originalOnAddTask if it supports it
    originalOnAddTask(text, tags, priority, description, status);
    // NEW: Update lastUsedAt for each tag added to the new task
    setAllTags(prevTags => {
      let updatedTags = [...prevTags];
      tags.forEach(tagName => {
        updatedTags = updateTagUsageLocally(updatedTags, tagName);
      });
      return updatedTags;
    });
  }, [allTags, originalOnAddTask]);

  // UPDATED: Ensure description is present when editing
  const handleEditTask = (id, updates) => {
    // Ensure updates.description exists and fallback to old value or ""
    if (updates.tags) {
      ensureTagsExistInCentralList(allTags, updates.tags, setAllTags);
      // NEW: Update lastUsedAt for each tag being updated/re-applied to the task
      setAllTags(prevTags => {
        let updatedTags = [...prevTags];
        updates.tags.forEach(tagName => {
          updatedTags = updateTagUsageLocally(updatedTags, tagName);
        });
        return updatedTags;
      });
    }
    // Ensure description is always sent (for legacy tasks)
    originalOnEditTask(id, {
      ...updates,
      description: typeof updates.description === "string"
        ? updates.description
        : (() => {
          // Find the old task so we can fallback to its description or ""
          const t = tasks.find(task => task.id === id);
          return (t && typeof t.description === "string") ? t.description : "";
        })()
    });
  };

  // --- Central Tag Management Functions (for TagsPage) ---
  const handleAddTagObject = (tagName, metadata) => {
    setAllTags(prevTags => addTagObjectLocally(prevTags, tagName, metadata));
  };

  const handleEditTagObject = (tagId, updates) => {
    setAllTags(prevTags => editTagObjectLocally(prevTags, tagId, updates));
  };

  // NEW: Wrapped Task Status Update Function
  const handleUpdateTaskStatus = (id, newStatus) => {
    // Find the task to get its tags before updating status
    const taskToUpdate = tasks.find(task => task.id === id);
    if (taskToUpdate && taskToUpdate.tags && taskToUpdate.tags.length > 0) {
      setAllTags(prevTags => {
        let updatedTags = [...prevTags];
        taskToUpdate.tags.forEach(tagName => {
          updatedTags = updateTagUsageLocally(updatedTags, tagName);
        });
        return updatedTags;
      });
    }
    originalOnUpdateTaskStatus(id, newStatus); // Call the original status update
  };

  const handleDeleteTagObject = (tagId) => {
    // Find the tag object to get its name before deletion
    const tagToDelete = allTags.find(tag => tag.id === tagId);

    if (!tagToDelete) {
      console.warn("Attempted to delete a tag that does not exist.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete the tag "${tagToDelete.name}"? This will also remove it from all associated tasks.`)) {
      // Step 1: Remove the tag object from the central allTags list
      setAllTags(prevTags => deleteTagObjectLocally(prevTags, tagId));

      // Step 2: Remove this tag from all tasks that use it
      // We need to iterate over a copy of the tasks and update them
      // using the onEditTask handler, which will then trigger persistence.
      tasks.forEach(task => {
        if (task.tags && task.tags.includes(tagToDelete.name)) {
          const updatedTags = task.tags.filter(tag => tag !== tagToDelete.name);
          handleEditTask(task.id, { tags: updatedTags }); // Use onEditTask to update the task
        }
      });

      console.log(`Tag "${tagToDelete.name}" and its occurrences in tasks deleted.`);
    }
  };

  const operations = {
    eventsOperations: [events, setEvents],
    ratingsOperations: [ratingsOfEvents, setRatingsOfEvents],
    taskOperations: {
      tasks: tasks,
      onAddTask: handleAddTask, // Use the wrapped function
      onEditTask: handleEditTask, // Use the wrapped function
      onUpdateTaskStatus: handleUpdateTaskStatus,
      onDeleteTask: onDeleteTask,
      onAddSubtask: onAddSubtask,
    },
    // New Tag operations for the TagsPage
    tagOperations: {
      allTags: allTags,
      onAddTagObject: handleAddTagObject,
      onEditTagObject: handleEditTagObject,
      onDeleteTagObject: handleDeleteTagObject,
    }
  };

  return (
    <div style={{ height: "100%", backgroundColor: "#6279B8" }}>
      <Header openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />

      <Flex justify={"center"}>
        <Space align="center">
          <Content operations={operations} />
        </Space>
      </Flex>

      {/* Render the TagDetailModal */}
      {/*<TagDetailModal
        isOpen={isTagModalOpen}
        onClose={handleCloseTagModal}
        initialClickedTag={selectedTagForModal}
        allTasks={tasks} // Pass all tasks for filtering
        // Also pass down the task action handlers required by TagDetailModal
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onUpdateTaskStatus={onUpdateTaskStatus}
        onAddSubtask={onAddSubtask}
      />*/}
    </div>
  );
}

function Content({ operations }) {
  const navigate = useNavigate(); // Import and use useNavigate

  // This re-assigns the onTagClick function to include navigation, after operations is defined
  operations.taskOperations.onTagClick = (tag) => {
    navigate('/tags', { state: { selectedTag: tag } });
  };

  console.log("All Tags before content: ", operations.tagOperations.allTags)

  return (
    <div style={{ padding: 15 }}>
      <Routes>
        <Route
          path="/"
          element={<Planner operations={operations} />}
        />
        <Route
          path="tasks"
          element={<Todo
            tasks={operations.taskOperations.tasks}
            onAddTask={operations.taskOperations.onAddTask}
            onEditTask={operations.taskOperations.onEditTask}
            onUpdateTaskStatus={operations.taskOperations.onUpdateTaskStatus}
            onDeleteTask={operations.taskOperations.onDeleteTask}
            onAddSubtask={operations.taskOperations.onAddSubtask}
            onTagClick={operations.taskOperations.onTagClick} // Pass the onTagClick handler
            userId="local-user"
            allTags={operations.tagOperations.allTags} // NEW: Pass allTags here
          />}
        />
        {/* New Route for the Tags Page */}
        <Route
          path="tags"
          element={<Tags
            allTags={operations.tagOperations.allTags}
            allTasks={operations.taskOperations.tasks} // TagsPage needs all tasks to filter
            onAddTagObject={operations.tagOperations.onAddTagObject}
            onEditTagObject={operations.tagOperations.onEditTagObject}
            onDeleteTagObject={operations.tagOperations.onDeleteTagObject}
            // Pass task operations as well, if TagsPage will show interactive TaskItems
            onEditTask={operations.taskOperations.onEditTask}
            onDeleteTask={operations.taskOperations.onDeleteTask}
            onUpdateTaskStatus={operations.taskOperations.onUpdateTaskStatus}
            onAddSubtask={operations.taskOperations.onAddSubtask}
            // onTagClick is passed to TagsPage itself, for when a tag is clicked within its left panel
            onTagClick={operations.taskOperations.onTagClick}
          />}
        />
        <Route
            path="papafrita"
            element={<Papafritapage/>}
        />
      </Routes>
    </div>
  );
}
