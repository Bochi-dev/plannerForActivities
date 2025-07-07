import React, { useState } from 'react';
import { Button, Typography, Popconfirm, Menu, Dropdown, Tag, Modal, Card } from 'antd'; // Added Dropdown, Menu, Modal
import {
  ArrowRightOutlined, ArrowLeftOutlined, PlusOutlined, SubnodeOutlined,
  EditOutlined, DeleteOutlined,
  TagOutlined, StarOutlined, // StarOutlined for priority icon
  MoreOutlined // For the dropdown trigger button
} from '@ant-design/icons';

// Corrected Imports: Assuming these are directly in their respective folders within components/
import { ClickableTag, SubtaskModal } from '../../components'; // Using barrel import as per your structure

// Corrected Import for todoTools: Path from components/TaskItem/ to tools/todoTools.js
import { getPriorityDisplay } from '../../tools/todoTools'; // Adjusted path to be explicit and correct


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
  // NEW: State for description modal
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);


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

  // Get priority display details
  // Ensure task.priority defaults to 0 if undefined (for old tasks or if not set)
  const taskPriority = task.priority !== undefined ? task.priority : 0;
  const priorityDisplay = getPriorityDisplay(taskPriority);

  // Helper: Shorten description for preview
  const previewDescription = (desc) => {
    if (!desc) return "";
    return desc.length > 60 ? desc.slice(0, 60) + "..." : desc;
  };

  // NEW: Menu for task options (consolidating all action buttons)
  const taskActionsMenu = (
    <Menu>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => onEditClick(task)}>
        Edit Task
      </Menu.Item>
      <Popconfirm
        title="Delete task"
        description="Are you sure you want to delete this task?"
        onConfirm={() => onDeleteClick(task.id)}
        okText="Yes"
        cancelText="No"
      >
        <Menu.Item key="delete" icon={<DeleteOutlined />}>
          Delete Task
        </Menu.Item>
      </Popconfirm>
      {nextStatus && (
        <Menu.Item key="nextStatus" icon={<ArrowRightOutlined />} onClick={() => onUpdateTaskStatus(task.id, nextStatus)}>
          Move to {nextStatus.replace('-', ' ')}
        </Menu.Item>
      )}
      {backStatus && (
        <Menu.Item key="backStatus" icon={<ArrowLeftOutlined />} onClick={() => onUpdateTaskStatus(task.id, backStatus)}>
          Move Back
        </Menu.Item>
      )}
      <Menu.Item key="addSubtask" icon={<SubnodeOutlined />} onClick={showSubtaskModal}>
        Add Subtask
      </Menu.Item>
    </Menu>
  );

  return (
    <Card
      className={`p-3 rounded-md shadow-sm transition duration-300 ease-in-out border border-gray-200
                  ${isCompleted ? 'bg-gray-200 text-gray-500 line-through' : 'bg-white text-gray-800'}`}
      extra={<Dropdown overlay={taskActionsMenu} trigger={['click']} placement="bottomRight">
          <Button
            type="text"
            size="small"
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full"
            icon={<MoreOutlined className="text-lg" />}
            aria-label="Task options"
          />
        </Dropdown>}
      style={{padding: ""}}
    >
      <div className="flex items-start justify-between gap-2">
        {/* Top Row: Arrow icon, Task Text, and Dropdown for Actions */}
        <div className="flex items-center flex-grow min-w-0 mr-2">
          <Text
            className={`flex-grow break-words text-base font-medium p-1 px-2 rounded-md ${activeTaskBgColor} ${activeTaskTextColor}`}
            style={{ minWidth: '40px' }}
          >
            {task.text}
          </Text>
        </div>

        {/* Action Buttons - Replaced with Dropdown */}
        
      </div>

      {/* Description preview and modal (Preserved) */}
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
      {/* Using Ant Design Modal for the description to match other modals */}
      <Modal
        title={<Typography.Title level={4} className="text-center font-bold text-gray-800">Task Description</Typography.Title>}
        open={showDescriptionModal}
        onCancel={() => setShowDescriptionModal(false)}
        footer={null} // No default footer buttons
        centered
        className="p-4 rounded-lg shadow-xl"
        bodyStyle={{ padding: '24px' }}
      >
        <Typography.Paragraph style={{ whiteSpace: "pre-line" }}>{task.description}</Typography.Paragraph>
        <Button onClick={() => setShowDescriptionModal(false)} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md">
          Close
        </Button>
      </Modal>


      {/* Tags Display Section (Preserved) */}
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

      {/* Priority Display Section (Preserved) */}
      <div className="w-full mt-2 pt-2 border-t border-gray-200">
        <Text className="text-sm font-semibold text-gray-600 flex items-center">
          <StarOutlined className="mr-1" /> Priority:
        </Text>
        <div className="flex flex-wrap gap-2 mt-1">
          <Tag
            className={`rounded-full px-3 py-1 text-sm font-medium ${priorityDisplay.colorClass}`}
          >
            {priorityDisplay.letter}
          </Tag>
        </div>
      </div>

      {/* Subtasks Display Section (Preserved) */}
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

      {/* Subtask Modal (Remains unchanged) */}
      <SubtaskModal
        open={isSubtaskModalVisible}
        onClose={closeSubtaskModal}
        parentTaskId={task.id}
        onAddSubtask={handleAddSubtaskForParent}
      />
    </Card>
  );
};

export default TaskItem;

