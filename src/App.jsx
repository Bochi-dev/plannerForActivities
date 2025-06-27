import "./App.css"
import "./styles/Todo.css"
import { useState, useEffect, useCallback } from "react";
import { SideMenu, Header, TagDetailModal } from "./components"
import { Space, Button, Drawer, Flex } from "antd"
import { Route, Routes, useNavigate, useLocation } from "react-router-dom"
import { Planner, Todo } from "./pages"
import { 
  loadEventsFromLocalStorage,
  loadRatingsFromLocalStorage,
  useTodoManagement,
} from "./tools"

const loadedEvents = loadEventsFromLocalStorage()
const loadedRatings = loadRatingsFromLocalStorage()

export default function App() {
  const [events, setEvents] = useState([...loadedEvents]);
  const [ratingsOfEvents, setRatingsOfEvents] = useState([...loadedRatings]);
  const [openDrawer, setOpenDrawer] = useState(false);

  // State for controlling the TagDetailModal
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [selectedTagForModal, setSelectedTagForModal] = useState(''); // Stores the tag to display in modal

  // Use the custom hook for To-Do tasks
  const {
    tasks,
    onAddTask,
    onEditTask,
    onUpdateTaskStatus,
    onDeleteTask,
    onAddSubtask,
  } = useTodoManagement();

  // Function to open the tag detail modal
  const handleOpenTagModal = (tag) => {
    setSelectedTagForModal(tag);
    setIsTagModalOpen(true);
  };

  // Function to close the tag detail modal
  const handleCloseTagModal = () => {
    setIsTagModalOpen(false);
    setSelectedTagForModal(''); // Clear selected tag on close
  };

  const operations = {
    eventsOperations: [events, setEvents],
    ratingsOperations: [ratingsOfEvents, setRatingsOfEvents],
    taskOperations: {
      tasks: tasks,
      onAddTask: onAddTask,
      onEditTask: onEditTask,
      onUpdateTaskStatus: onUpdateTaskStatus,
      onDeleteTask: onDeleteTask,
      onAddSubtask: onAddSubtask,
      onTagClick: handleOpenTagModal, // Pass the function to open the tag modal
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
      <TagDetailModal
        isOpen={isTagModalOpen}
        onClose={handleCloseTagModal}
        initialClickedTag={selectedTagForModal}
        allTasks={tasks} // Pass all tasks for filtering
        // Also pass down the task action handlers required by TagDetailModal
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onUpdateTaskStatus={onUpdateTaskStatus}
        onAddSubtask={onAddSubtask}
      />
    </div>
  );
}

function Content({ operations }) {
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
          />}
        />
      </Routes>
    </div>
  );
}
