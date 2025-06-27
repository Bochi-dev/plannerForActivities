// MultiListTodoApp

import React, { useState } from 'react';
import { TaskForm, TaskList } from '../../components'; // For adding/editing parent tasks
import { Card, Tag } from 'antd';


export const Todo = ({
  tasks,
  onAddTask,
  onEditTask,
  onUpdateTaskStatus,
  onDeleteTask,
  onAddSubtask,
  userId,
  onTagClick,
}) => {
  // Filter tasks into their respective lists
  const draftedTasks = tasks.filter(task => task.status === 'drafted');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const inReviewTasks = tasks.filter(task => task.status === 'in-review');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const [editingTask, setEditingTask] = useState(null); // State for editing tasks

  return (
    <div className="h-full">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Multi-Stage To-Do Workflow</h1>
        <Card className="bg-app-blue border-0 mb-md">
          <Tag color="geekblue" style={{ marginBottom:5 }}>
            <span className="text-sm text-center text-gray-600 mb-6">User ID: {userId}</span>
          </Tag>
          
          
          {/* Form for adding/editing main tasks */}
          <div className="mb-8">
            <TaskForm
              onAddTask={onAddTask}
              onEditTask={onEditTask}
              editingTask={editingTask}
              setEditingTask={setEditingTask}
            />
          </div>
        </Card>


      {/* Grid for the four lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TaskList
          title="Drafted"
          tasks={draftedTasks}
          onEditClick={setEditingTask}
          onDeleteClick={onDeleteTask}
          onUpdateTaskStatus={onUpdateTaskStatus}
          onAddSubtask={onAddSubtask}
          // Pass nextStatus for the button
          nextStatus="in-progress"
          backStatus={null} // Drafted doesn't go back
          onTagClick={onTagClick}
        />
        <TaskList
          title="In Progress"
          tasks={inProgressTasks}
          onEditClick={setEditingTask}
          onDeleteClick={onDeleteTask}
          onUpdateTaskStatus={onUpdateTaskStatus}
          onAddSubtask={onAddSubtask}
          nextStatus="in-review"
          backStatus={null} // In Progress doesn't go back (based on spec, only Review does)
          onTagClick={onTagClick}
        />
        <TaskList
          title="In Review"
          tasks={inReviewTasks}
          onEditClick={setEditingTask}
          onDeleteClick={onDeleteTask}
          onUpdateTaskStatus={onUpdateTaskStatus}
          onAddSubtask={onAddSubtask}
          nextStatus="completed" // Can move to completed
          backStatus="in-progress" // Can move back to in-progress
          onTagClick={onTagClick}
        />
        <TaskList
          title="Completed"
          tasks={completedTasks}
          onEditClick={setEditingTask} // Still passed for consistency, though UI hides edit
          onDeleteClick={onDeleteTask}
          onUpdateTaskStatus={onUpdateTaskStatus} // Can be used to reactivate, though not explicitly requested
          onAddSubtask={onAddSubtask} // Can still add subtasks if allowed for completed tasks
          nextStatus={null} // Completed is end state
          backStatus={null}
          onTagClick={onTagClick}
        />
      </div>
    </div>
  );
};



