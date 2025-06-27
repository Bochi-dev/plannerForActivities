// TaskList

import { useState } from 'react';
import { Button, Typography, Popconfirm, Tag } from 'antd';
import {
  CheckCircleFilled, CheckCircleOutlined, DeleteOutlined, EditOutlined,
  ArrowRightOutlined, ArrowLeftOutlined, PlusOutlined, SubnodeOutlined
} from '@ant-design/icons';
import { SubtaskModal } from '../../components'; // Placeholder for subtask modal

export const TaskItem = ({ task, onEditClick, onDeleteClick, onUpdateTaskStatus, onAddSubtask, nextStatus, backStatus }) => {
  const [isSubtaskModalVisible, setIsSubtaskModalVisible] = useState(false);

  // Determine if the task is completed for styling
  const isCompleted = task.status === 'completed';

  // Handler for opening the subtask modal
  const showSubtaskModal = () => {
    setIsSubtaskModalVisible(true);
  };

  const closeSubtaskModal = () => {
    setIsSubtaskModalVisible(false);
  };

  const handleAddSubtaskForParent = (subtaskText) => {
    onAddSubtask(task.id, subtaskText); // Call parent handler with task ID and subtask text
    closeSubtaskModal(); // Close modal after adding
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 my-2 rounded-lg shadow-sm transition duration-300 ease-in-out
                  ${isCompleted ? 'bg-gray-200 text-gray-500 line-through' : 'bg-white text-gray-800'}`}
    >
      <div className="flex items-center flex-grow min-w-0 mb-2 sm:mb-0">
        {/* Task Text */}
        <Typography.Text className="flex-grow break-words text-lg font-medium mr-2">
          {task.text}
        </Typography.Text>
      </div>

      <div className="flex items-center space-x-2 text-sm sm:ml-4">
        {/* Status Transition Buttons */}
        {nextStatus && (
          <Button
            type="primary"
            size="small"
            onClick={() => onUpdateTaskStatus(task.id, nextStatus)}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center py-1 px-2"
            icon={<ArrowRightOutlined />}
            aria-label={`Move to ${nextStatus.replace('-', ' ')}`}
          >
            {/* Short text labels for better fit on small buttons */}
            {nextStatus === 'in-progress' && 'Progress'}
            {nextStatus === 'in-review' && 'Review'}
            {nextStatus === 'completed' && 'Complete'}
          </Button>
        )}
        {backStatus && ( // Only for "In Review" list currently
          <Button
            type="default"
            size="small"
            onClick={() => onUpdateTaskStatus(task.id, backStatus)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md flex items-center justify-center py-1 px-2"
            icon={<ArrowLeftOutlined />}
            aria-label={`Move back to ${backStatus.replace('-', ' ')}`}
          >
            Back
          </Button>
        )}

        {/* Add Subtask Button */}
        <Button
          type="default"
          size="small"
          onClick={showSubtaskModal}
          className="bg-purple-200 hover:bg-purple-300 text-purple-800 rounded-md flex items-center justify-center py-1 px-2"
          icon={<SubnodeOutlined />}
          aria-label="Add Subtask"
        >
          Subtask
        </Button>

        {/* Edit Button (only for non-completed tasks) */}
        {!isCompleted && (
          <Button
            type="text"
            size="small"
            className="text-blue-500 hover:text-blue-700 p-1 rounded-full"
            onClick={() => onEditClick(task)}
            aria-label="Edit task"
            icon={<EditOutlined className="text-lg" />}
          />
        )}

        {/* Delete Button */}
        <Popconfirm
          title="Delete the task"
          description="Are you sure to delete this task?"
          onConfirm={() => onDeleteClick(task.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="text"
            size="small"
            className="text-red-500 hover:text-red-700 p-1 rounded-full"
            icon={<DeleteOutlined className="text-lg" />}
            aria-label="Delete task"
          />
        </Popconfirm>
      </div>

      {/* Display Subtasks */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="w-full mt-2 pt-2 border-t border-gray-200">
          <Typography.Text className="text-sm font-semibold text-gray-600">Subtasks:</Typography.Text>
          <div className="flex flex-wrap gap-2 mt-1">
            {task.subtasks.map(subtask => (
              <Tag
                key={subtask.id}
                color={subtask.completed ? "green" : "blue"}
                className={`${subtask.completed ? 'line-through opacity-70' : ''}`}
                // Add click handler to toggle subtask complete here later if needed
              >
                {subtask.text}
              </Tag>
            ))}
          </div>
        </div>
      )}

      {/* Subtask Modal */}
      <SubtaskModal
        open={isSubtaskModalVisible}
        onClose={closeSubtaskModal}
        parentTaskId={task.id}
        onAddSubtask={handleAddSubtaskForParent} // Pass the specific handler for this parent
      />
    </div>
  );
};



