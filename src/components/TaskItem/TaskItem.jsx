import React, { useState } from 'react';
import { Button, Typography, Popconfirm, Tag } from 'antd'; // Import Tag component
import {
  ArrowRightOutlined, ArrowLeftOutlined, PlusOutlined, SubnodeOutlined,
  EditOutlined, DeleteOutlined,
  TagOutlined // Added TagOutlined for visual cue on tags section if desired
} from '@ant-design/icons';
import { SubtaskModal, ClickableTag } from '../../components'; // Ensure this path is correct

const { Text } = Typography;

export const TaskItem = ({
  task,
  onEditClick,
  onDeleteClick,
  onUpdateTaskStatus,
  onAddSubtask,
  nextStatus,
  backStatus,
  // New prop: a function to call when a tag is clicked
  onTagClick // This function will be passed down from App.jsx or Todo.jsx
}) => {
  const [isSubtaskModalVisible, setIsSubtaskModalVisible] = useState(false);

  const isCompleted = task.status === 'completed';

  const showSubtaskModal = () => setIsSubtaskModalVisible(true);
  const closeSubtaskModal = () => setIsSubtaskModalVisible(false);
  const handleAddSubtaskForParent = (subtaskText) => {
    onAddSubtask(task.id, subtaskText);
    closeSubtaskModal();
  };

  // Define colors based on design image for active tasks (reusing previous definitions)
  const activeTaskBgColor = "bg-emerald-500"; // Green color from image for the task text tag
  const activeTaskTextColor = "text-white";
  const arrowColor = "text-gray-400"; // Gray for the arrow icon

  // Common button styles (you can adjust these globally with Tailwind or Antd themes)
  const baseButtonClasses = "rounded-md flex items-center justify-center py-1 px-2 text-xs font-medium transition duration-200";

  return (
    // Outer task item container (white background, rounded, subtle shadow, thin border from TaskList)
    <div
      className={`p-3 rounded-md shadow-sm transition duration-300 ease-in-out border border-gray-200
                  ${isCompleted ? 'bg-gray-200 text-gray-500 line-through' : 'bg-white text-gray-800'}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap gap-2">
        {/* Top Row: Arrow icon, Task Text, and Action Buttons */}
        <div className="flex items-center flex-grow min-w-0 mr-2">
          <ArrowRightOutlined className={`mr-2 ${arrowColor} text-lg`} /> {/* Arrow icon */}
          <Text
            className={`flex-grow break-words text-base font-medium p-1 px-2 rounded-md ${activeTaskBgColor} ${activeTaskTextColor}`}
            style={{ minWidth: '40px' }} // Ensures it looks like a tag even for short text
          >
            {task.text}
          </Text>
        </div>

        {/* Action Buttons (flex-shrink-0 to prevent them from pushing too wide) */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Status Transition Button (e.g., Progress, Review, Complete) */}
          {nextStatus && (
            <Button
              type="primary"
              size="small"
              onClick={() => onUpdateTaskStatus(task.id, nextStatus)}
              className={`${baseButtonClasses} bg-blue-500 hover:bg-blue-600 text-white`}
              icon={<ArrowRightOutlined />} // Keep icon for consistency
              aria-label={`Move to ${nextStatus.replace('-', ' ')}`}
            >
              {nextStatus === 'in-progress' && 'Progress'}
              {nextStatus === 'in-review' && 'Review'}
              {nextStatus === 'completed' && 'Complete'}
            </Button>
          )}

          {/* Back Status Button (only for "In Review" to "In Progress") */}
          {backStatus && (
            <Button
              type="default"
              size="small"
              onClick={() => onUpdateTaskStatus(task.id, backStatus)}
              className={`${baseButtonClasses} bg-gray-300 hover:bg-gray-400 text-gray-800`}
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
            className={`${baseButtonClasses} bg-purple-200 hover:bg-purple-300 text-purple-800`}
            icon={<SubnodeOutlined />}
            aria-label="Add Subtask"
          >
            Subtask
          </Button>

          {/* Edit Button (only for non-completed tasks) */}
          {!isCompleted && (
            <Button
              type="text" // Use text type for a subtle icon-only button
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
              type="text" // Use text type for a subtle icon-only button
              size="small"
              className="text-red-500 hover:text-red-700 p-1 rounded-full"
              icon={<DeleteOutlined className="text-lg" />}
              aria-label="Delete task"
            />
          </Popconfirm>
        </div>
      </div>

      {/* Tags Display Section - NOW USING ClickableTag */}
      {task.tags && task.tags.length > 0 && (
        <div className="w-full mt-2 pt-2 border-t border-gray-200">
          <Text className="text-sm font-semibold text-gray-600 flex items-center">
            <TagOutlined className="mr-1" /> Tags:
          </Text>
          <div className="flex flex-wrap gap-2 mt-1">
            {task.tags.map((tag, index) => (
              <ClickableTag // Replaced Antd Tag with ClickableTag
                key={tag + index}
                tagText={tag}
                onClick={onTagClick} // Pass the onTagClick function
                color="blue" // Use Ant Design 'blue' color for consistency
                // Add any extra Tailwind classes needed for ClickableTag here
                className="hover:bg-blue-200" // Example: lighter hover effect
              />
            ))}
          </div>
        </div>
      )}

      {/* Subtasks Display Section */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="w-full mt-2 pt-2 border-t border-gray-200">
          <Text className="text-sm font-semibold text-gray-600">Subtasks:</Text>
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
        onAddSubtask={handleAddSubtaskForParent}
      />
    </div>
  );
};

