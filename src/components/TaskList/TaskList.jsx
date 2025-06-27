import React from 'react';
import { TaskItem } from '../../components'; // Individual task item component - COMMENTED OUT AS REQUESTED
import { Card } from 'antd';
export const TaskList = ({
  title,
  tasks,
  onEditClick,
  onDeleteClick,
  onUpdateTaskStatus,
  onAddSubtask,
  nextStatus, // e.g., 'in-progress', 'in-review', 'completed'
  backStatus, // e.g., 'in-progress' for 'in-review' list
  onTagClick
}) => {
  const borderColor = {
    "Drafted": "border-blue-400",
    "In Progress": "border-yellow-400",
    "In Review": "border-purple-400",
    "Completed": "border-green-400"
  }[title] || "border-gray-300";

  const emptyMessage = {
    "Drafted": "No drafted tasks. Add one above!",
    "In Progress": "No tasks in progress yet.",
    "In Review": "No tasks for review.",
    "Completed": "No completed tasks yet."
  }[title] || "No tasks.";


  return (
    <Card className="mb-md">
      <h2 className={`text-xl font-bold text-gray-700 mb-4 border-b-2 pb-2 ${borderColor}`}>
        {title} ({tasks.length})
      </h2>
      <div className="flex-grow"> {/* Allows list content to expand */}
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-4">{emptyMessage}</p>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
               <TaskItem  
                 key={task.id}
                 task={task}
                 onEditClick={onEditClick}
                 onDeleteClick={onDeleteClick}
                 onUpdateTaskStatus={onUpdateTaskStatus}
                 onAddSubtask={onAddSubtask}  
                 nextStatus={nextStatus}
                 backStatus={backStatus}
                 onTagClick={onTagClick}
               /> // COMMENTED OUT AS REQUESTED
              // Placeholder for where TaskItem would be rendered
    //              <div key={task.id} className="p-2 border border-gray-200 rounded-md bg-white">
    //                <p>{task.text} (ID: {task.id}) - Status: {task.status}</p>
    //                {/* You will replace this with your TaskItem rendering */}
    //              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
