import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { Spin, Modal } from 'antd';
// Removed the import for MultiListTodoApp as per your instruction.
// import MultiListTodoApp from './MultiListTodoApp';

// --- Constants & Global Vars ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// --- Firebase Initialization (outside component to avoid re-init) ---
let app;
let db;
let auth;

try {
  if (Object.keys(firebaseConfig).length > 0) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  }
} catch (e) {
  console.error("Firebase initialization failed:", e);
  // Handle case where config might be missing or invalid
}


// --- App Component (Main Application Logic) ---
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // --- Firebase Authentication & Firestore Listener ---
  useEffect(() => {
    if (!app) {
      console.error("Firebase app not initialized. Check firebaseConfig.");
      setLoading(false);
      return;
    }

    const signInAndListen = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
        console.log("Firebase Auth successful.");
      } catch (error) {
        console.error("Firebase Auth failed:", error);
      }
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setIsAuthReady(true);
      } else {
        setUserId(null);
        setIsAuthReady(true);
      }
      if (initialAuthToken === null) {
          setLoading(false);
      }
    });

    if (initialAuthToken) {
      signInAndListen();
    }

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!isAuthReady || !userId) {
      if (isAuthReady) {
          setLoading(false);
      }
      return;
    }

    if (!db) {
        console.error("Firestore DB not initialized.");
        setLoading(false);
        return;
    }

    // Collection path for user-specific tasks
    const tasksCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/tasks`);
    const q = query(tasksCollectionRef, orderBy('createdAt', 'desc')); // Order by creation time

    console.log(`Setting up Firestore listener for user: ${userId} in app: ${appId}`);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        // Ensure subtasks are always an array, even if undefined in Firestore initially
        subtasks: doc.data().subtasks || [],
        ...doc.data()
      }));
      setTasks(tasksData);
      setLoading(false);
      console.log("Tasks updated from Firestore.");
    }, (error) => {
      console.error("Error fetching tasks from Firestore:", error);
      setLoading(false);
    });

    return () => {
      console.log(`Unsubscribing Firestore listener for user: ${userId}`);
      unsubscribe();
    };
  }, [isAuthReady, userId, db]);


  // --- CRUD & Status Operations ---

  // Add a new task (always to 'drafted' initially)
  const handleAddTask = useCallback(async (text) => {
    if (!userId || !db) {
      Modal.error({ title: "Authentication Error", content: "Please wait for authentication to complete or check your network." });
      return;
    }
    try {
      const tasksCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/tasks`);
      await addDoc(tasksCollectionRef, {
        text,
        status: 'drafted', // New tasks start as 'drafted'
        subtasks: [],      // Initialize with an empty subtasks array
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      Modal.error({ title: "Error", content: "Failed to add task. Please try again." });
    }
  }, [userId, db]);

  // Update task text
  const handleEditTask = useCallback(async (id, newText) => {
    if (!userId || !db) {
      return;
    }
    try {
      const taskDocRef = doc(db, `artifacts/${appId}/users/${userId}/tasks`, id);
      await updateDoc(taskDocRef, {
        text: newText,
        updatedAt: serverTimestamp(), // Record update time
      });
    } catch (e) {
      console.error("Error editing document: ", e);
      Modal.error({ title: "Error", content: "Failed to edit task. Please try again." });
    }
  }, [userId, db]);

  // Update task status (move between lists)
  const handleUpdateTaskStatus = useCallback(async (id, newStatus) => {
    if (!userId || !db) {
      return;
    }
    try {
      const taskDocRef = doc(db, `artifacts/${appId}/users/${userId}/tasks`, id);
      await updateDoc(taskDocRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
        // If moving to 'completed', you might also set a 'completedAt' timestamp
        ...(newStatus === 'completed' && { completedAt: serverTimestamp() }),
      });
    } catch (e) {
      console.error(`Error updating task status to ${newStatus}: `, e);
      Modal.error({ title: "Error", content: `Failed to move task to ${newStatus}. Please try again.` });
    }
  }, [userId, db]);

  // Delete a task
  const handleDeleteTask = useCallback(async (id) => {
    if (!userId || !db) {
      return;
    }
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this task?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          const taskDocRef = doc(db, `artifacts/${appId}/users/${userId}/tasks`, id);
          await deleteDoc(taskDocRef);
          console.log("Document successfully deleted!");
        } catch (e) {
          console.error("Error removing document: ", e);
          Modal.error({ title: "Error", content: "Failed to delete task. Please try again." });
        }
      },
      onCancel() {
        console.log('Task deletion cancelled.');
      },
    });
  }, [userId, db]);

  // --- Subtask Operations ---
  const handleAddSubtask = useCallback(async (parentTaskId, subtaskText) => {
    if (!userId || !db) {
      return;
    }
    try {
      const taskDocRef = doc(db, `artifacts/${appId}/users/${userId}/tasks`, parentTaskId);
      const parentTask = tasks.find(t => t.id === parentTaskId);

      if (!parentTask) {
        console.error("Parent task not found for adding subtask.");
        Modal.error({ title: "Error", content: "Parent task not found." });
        return;
      }

      // Create a new subtask object
      const newSubtask = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9), // Simple unique ID for subtask
        text: subtaskText,
        completed: false,
        createdAt: new Date().toISOString(), // Use ISO string for subtask timestamp
      };

      // Update the parent task's subtasks array in Firestore
      await updateDoc(taskDocRef, {
        subtasks: [...parentTask.subtasks, newSubtask],
        updatedAt: serverTimestamp(),
      });
      console.log("Subtask added successfully!");
    } catch (e) {
      console.error("Error adding subtask: ", e);
      Modal.error({ title: "Error", content: "Failed to add subtask. Please try again." });
    }
  }, [userId, db, tasks]);


  // --- Render Logic ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Spin size="large" tip="Loading To-Dos..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Removed direct usage of MultiListTodoApp here as you will handle that */}
      {/* <MultiListTodoApp
        tasks={tasks}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        onUpdateTaskStatus={handleUpdateTaskStatus}
        onDeleteTask={handleDeleteTask}
        onAddSubtask={handleAddSubtask}
        userId={userId}
      /> */}
      {/* You can render other parts of your app here if needed */}
      <h1 className="text-3xl font-bold text-center text-gray-800">To-Do List Ready</h1>
      <p className="text-md text-center text-gray-600">Please integrate your MultiListTodoApp component.</p>
      <p className="text-sm text-center text-gray-600">User ID: {userId}</p>
    </div>
  );
}

