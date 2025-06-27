import "./App.css"
import { useState, useEffect } from "react"
import { SideMenu, Header } from "./components"
import { Space, Button, Drawer, Flex } from "antd"
import { Route, Routes, useNavigate, useLocation } from "react-router-dom"
import { Planner, Todo } from "./pages"
import { 
  loadEventsFromLocalStorage,
  loadRatingsFromLocalStorage,
  addTaskLocally,
  editTaskLocally,
  updateTaskStatusLocally,
  deleteTaskLocally,
  addSubtaskLocally,
 } from "./tools"

const loadedEvents = loadEventsFromLocalStorage()
const loadedRatings = loadRatingsFromLocalStorage()



const loadTasksFromLocalStorage = () => {
  try {
    const tasksJsonString = localStorage.getItem(TODO_STORAGE_KEY);
    if (tasksJsonString === null) {
      return [];
    }
    const tasks = JSON.parse(tasksJsonString);
    // Ensure subtasks are arrays, even if saved as null/undefined
    return tasks.map(task => ({ ...task, subtasks: task.subtasks || [] }));
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



const loadedTasks = loadTasksFromLocalStorage(); // Load tasks initially

export default function App () {
  const [events, setEvents] = useState([ ... loadedEvents])
  const [openDrawer, setOpenDrawer] = useState(false)
  const [tasks, setTasks] = useState([...loadedTasks])
  
  const [ratingsOfEvents, setRatingsOfEvents] = useState([
  ...loadedRatings
  ])
  
  useEffect(() => {
    saveTasksToLocalStorage(tasks);
  }, [tasks]);

    
  const operations = {
    eventsOperations: [events, setEvents],
    ratingsOperations: [ratingsOfEvents, setRatingsOfEvents],
  }

  return (<div style={{height: "100%", backgroundColor: "#6279B8"}}>
    
    {/*Header*/}
    <Header openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
  
    {/*Content*/}
    <Flex justify={"center"}>
      <Space align="center">
        <Content operations={operations}/>
      </Space>
    </Flex>
  </div>)
}

function Content({operations}) {
    return <div style={{padding:15}}>
        <Routes>
            <Route 
                path="/" 
                element={<Planner operations={operations}/>}
            />
            <Route 
                path="tasks" 
                element={<Todo operations={operations}/>}
            />
        </Routes>
    </div>
    }
