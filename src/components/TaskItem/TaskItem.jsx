import React, { useState } from 'react';
import { Button, Typography, Popconfirm, Tag } from 'antd'; // Keep Tag for subtasks if needed
import {
  ArrowRightOutlined, ArrowLeftOutlined, PlusOutlined, SubnodeOutlined,
  EditOutlined, DeleteOutlined,
  TagOutlined, StarOutlined
} from '@ant-design/icons';

// Corrected Imports for Components: Importing from the components barrel export
// This assumes your src/components/index.js exports ClickableTag and SubtaskModal
import { ClickableTag, SubtaskModal } from '../../components';

// Corrected Import for todoTools: Direct import as it's not part of a barrel in App.jsx's context
import { getPriorityDisplay } from '../../tools'; // Adjust path based on src/components/TaskItem/ to src/tools/todoTools.js

const { Text } = Typography;

export const TaskItem = ({
  task,
  onEditClick,
  onDeleteClick,
  onUpdateTaskStatus,
  onAddSubtask,
  nextStatus,
  backStatus,
  onTagClick
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

  // Get priority display details
  // Ensure task.priority defaults to 0 if undefined (for old tasks or if not set)
  const taskPriority = task.priority !== undefined ? task.priority : 0;
  const priorityDisplay = getPriorityDisplay(taskPriority);

  // -------------------- CHANGES BELOW ---------------------
  // NEW: State and helper for description modal
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);

  // Helper: Shorten description for preview
  const previewDescription = (desc) => {
    if (!desc) return "";
    return desc.length > 60 ? desc.slice(0, 60) + "..." : desc;
  };
  // --------------------------------------------------------

  return (
    <div
      className={`p-3 rounded-md shadow-sm transition duration-300 ease-in-out border border-gray-200
                  ${isCompleted ? 'bg-gray-200 text-gray-500 line-through' : 'bg-white text-gray-800'}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap gap-2">
        {/* Top Row: Arrow icon, Task Text, and Action Buttons */}
        <div className="flex items-center flex-grow min-w-0 mr-2">
          <ArrowRightOutlined className={`mr-2 ${arrowColor} text-lg`} />
          <Text
            className={`flex-grow break-words text-base font-medium p-1 px-2 rounded-md ${activeTaskBgColor} ${activeTaskTextColor}`}
            style={{ minWidth: '40px' }}
          >
            {task.text}
          </Text>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {nextStatus && (
            <Button
              type="primary"
              size="small"
              onClick={() => onUpdateTaskStatus(task.id, nextStatus)}
              className={`${baseButtonClasses} bg-blue-500 hover:bg-blue-600 text-white`}
              icon={<ArrowRightOutlined />}
              aria-label={`Move to ${nextStatus.replace('-', ' ')}`}
            >
              {nextStatus === 'next-up' && 'Next up'}
              {nextStatus === 'in-progress' && 'Progress'}
              {nextStatus === 'in-review' && 'Review'}
              {nextStatus === 'completed' && 'Complete'}
            </Button>
          )}

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
      </div>

      {/* -------------------- CHANGES BELOW -------------------- */}
      {/* Description preview and modal */}
      {task.description && task.description.trim() !== "" && (
        <div style={{ margin: "8px 0", color: "#888" }}>
          <em>
            {previewDescription(task.description)}
            {task.description.length > 60 && (
              <button
                style={{
                  marginLeft: 8,
                  color: "#3B82F6",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: "inherit"
                }}
                onClick={() => setShowDescriptionModal(true)}
              >
                See details
              </button>
            )}
          </em>
        </div>
      )}
      {showDescriptionModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 1000
          }}
          onClick={() => setShowDescriptionModal(false)}
        >
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: 8,
              maxWidth: 400,
              margin: "10% auto",
              padding: 24,
              boxShadow: "0 6px 32px rgba(0,0,0,0.2)"
            }}
          >
            <h3>Description</h3>
            <p style={{ whiteSpace: "pre-line" }}>{task.description}</p>
            <button onClick={() => setShowDescriptionModal(false)}>Close</button>
          </div>
        </div>
      )}
      {/* ------------------------------------------------------- */}

      {/* Tags Display Section */}
      {task.tags && task.tags.length > 0 && (
        <div className="w-full mt-2 pt-2 border-t border-gray-200">
          <Text className="text-sm font-semibold text-gray-600 flex items-center">
            <TagOutlined className="mr-1" /> Tags:
          </Text>
          <div className="flex flex-wrap gap-2 mt-1">
            {task.tags.map((tag, index) => (
              <ClickableTag
                key={tag + index}
                tagText={tag}
                onClick={onTagClick}
                color="blue"
                className="hover:bg-blue-200"
              />
            ))}
          </div>
        </div>
      )}

      {/* Priority Display Section (Below Tags, Above Subtasks) */}
      <div className="w-full mt-2 pt-2 border-t border-gray-200">
        <Text className="text-sm font-semibold text-gray-600 flex items-center">
          <StarOutlined className="mr-1" /> Priority:
        </Text>
        <div className="flex flex-wrap gap-2 mt-1">
          <Tag
            className={`rounded-full px-3 py-1 text-sm font-medium ${priorityDisplay.colorClass}`}
            // Using Ant Design Tag directly as priority tag is not clickable to filter, just display
          >
            {priorityDisplay.letter}
          </Tag>
        </div>
      </div>

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
