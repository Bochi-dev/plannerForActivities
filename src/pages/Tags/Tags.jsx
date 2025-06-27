import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom'; // To get the selectedTag from navigation state
import { Typography, Input, Button, Tag, Form, Divider } from 'antd';
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined, TagOutlined } from '@ant-design/icons';

// Import necessary components for rendering tasks
// Assuming these are imported from components/ index.js or directly from their files
// src/pages/Tags/Tags.jsx
import { TaskItem, ClickableTag } from '../../components'; // Assuming these are exported from src/components/index.js

const { Title, Text } = Typography;

/**
 * Helper to extract unique tags from a list of tasks and count their occurrences.
 * This is reused from TagDetailModal, but ensures it's available here.
 * @param {Array<Object>} tasks - The array of all task objects.
 * @returns {Array<{name: string, count: number}>} An array of unique tags with their counts.
 */
const getUniqueTagsWithCounts = (tasks) => {
  const tagCounts = {};
  tasks.forEach(task => {
    if (task.tags && Array.isArray(task.tags)) {
      task.tags.forEach(tag => {
        const lowerCaseTag = tag.toLowerCase();
        tagCounts[lowerCaseTag] = (tagCounts[lowerCaseTag] || 0) + 1;
      });
    }
  });
  return Object.keys(tagCounts)
    .map(tag => ({ name: tag, count: tagCounts[tag] }))
    .sort((a, b) => b.count - a.count);
};


export const Tags = ({
  allTags,          // Array of central tag objects ({ id, name, ... })
  allTasks,         // Array of all task objects
  onAddTagObject,   // Function to add a new central tag object
  onEditTagObject,  // Function to edit a central tag object
  onDeleteTagObject, // Function to delete a central tag object
  // Task operations needed for rendering TaskItem components
  onEditTask,
  onDeleteTask,
  onUpdateTaskStatus,
  onAddSubtask,
  onTagClick        // For clicks within TagsPage to re-filter or navigate again
}) => {
  const location = useLocation();
  const initialSelectedTag = location.state?.selectedTag || ''; // Get tag from navigation state

  // State for the currently displayed tag's tasks
  const [selectedTag, setSelectedTag] = useState(initialSelectedTag);
  // State for searching through existing tags
  const [tagSearchTerm, setTagSearchTerm] = useState('');
  // State for the tag creation form
  const [newTagForm] = Form.useForm();


  useEffect(() => {
    if (initialSelectedTag && initialSelectedTag !== selectedTag) {
      setSelectedTag(initialSelectedTag);
    }
  }, [initialSelectedTag]); // Update selected tag if navigation state changes


  // Filter tasks based on the selected tag
  const filteredTasksBySelectedTag = useMemo(() => {
    if (!selectedTag) return [];
    return allTasks.filter(task =>
      task.tags && Array.isArray(task.tags) && task.tags.map(t => t.toLowerCase()).includes(selectedTag.toLowerCase())
    );
  }, [allTasks, selectedTag]);


  // Derive list of all unique tags with counts (for the left panel)
  const allUniqueTagsWithCounts = useMemo(() => getUniqueTagsWithCounts(allTasks), [allTasks]);

  // Filter existing tags based on search input
  const filteredExistingTags = useMemo(() => {
    return allUniqueTagsWithCounts.filter(tag =>
      tag.name.toLowerCase().includes(tagSearchTerm.toLowerCase())
    );
  }, [allUniqueTagsWithCounts, tagSearchTerm]);


  // Handle adding a new tag from the creation form
  const handleCreateNewTag = (values) => {
    const tagName = values.newTagName.trim();
    if (tagName) {
      onAddTagObject(tagName); // Call the centralized tag adder
      newTagForm.resetFields(); // Clear the form
      // Optionally, automatically select the new tag
      setSelectedTag(tagName);
    }
  };


  return (
    <div className="container mx-auto p-6 max-w-7xl bg-white rounded-lg shadow-xl min-h-[80vh] font-inter flex flex-col">
      <Title level={2} className="text-center text-gray-800 mb-6">Tag Management</Title>

      {/* Top Section: Tag Search & List (Left) and Tag Creation Form (Right) */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Top Left: Tags Search and List of Existing Tags */}
        <div className="w-full lg:w-1/2 p-4 bg-gray-50 rounded-lg shadow-inner flex flex-col">
          <Title level={4} className="mb-4 text-gray-700 flex items-center">
            <SearchOutlined className="mr-2" /> Browse Tags
          </Title>
          <Input
            placeholder="Filter tags..."
            className="mb-4 rounded-md"
            value={tagSearchTerm}
            onChange={(e) => setTagSearchTerm(e.target.value)}
          />
          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-2">
            {filteredExistingTags.length > 0 ? (
              filteredExistingTags.map(tag => (
                <Tag
                  key={tag.name} // Use tag name as key here
                  color={tag.name.toLowerCase() === selectedTag.toLowerCase() ? 'geekblue' : 'default'} // Highlight selected tag
                  className={`cursor-pointer rounded-full px-3 py-1 text-sm font-medium transition-all duration-200 ease-in-out
                              hover:scale-105 hover:shadow-md active:scale-95
                              ${tag.name.toLowerCase() === selectedTag.toLowerCase() ? 'ring-2 ring-geekblue-300' : ''}`}
                  onClick={() => setSelectedTag(tag.name)} // Update selectedTag state
                >
                  {tag.name} ({tag.count})
                </Tag>
              ))
            ) : (
              <Text type="secondary" className="text-center w-full">No tags found.</Text>
            )}
          </div>
        </div>

        {/* Top Right: Tag Creation Form */}
        <div className="w-full lg:w-1/2 p-4 bg-blue-50 rounded-lg shadow-md flex flex-col">
          <Title level={4} className="mb-4 text-gray-700 flex items-center">
            <PlusOutlined className="mr-2" /> Create New Tag
          </Title>
          <Form form={newTagForm} onFinish={handleCreateNewTag} layout="vertical">
            <Form.Item
              name="newTagName"
              rules={[{ required: true, message: 'Please enter a tag name!' }]}
            >
              <Input placeholder="Enter new tag name..." className="rounded-md" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
              icon={<PlusOutlined />}
            >
              Add Tag
            </Button>
          </Form>
          {/* Optional: Display existing tag objects (id, name) managed by tagTools for debugging/management */}
          <Divider orientation="left" className="my-4">Managed Tag Objects</Divider>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2">
            {allTags.length > 0 ? (
              allTags.map(tagObj => (
                <Tag
                  key={tagObj.id}
                  color="magenta" // Different color to distinguish from task tags
                  closable // Allows deletion
                  onClose={() => onDeleteTagObject(tagObj.id)} // Delete tag object
                  className="rounded-full px-3 py-1 text-xs"
                >
                  {tagObj.name} {/* Display name from object */}
                  {/* Optional: Add edit functionality here later */}
                  {/* <EditOutlined className="ml-1 cursor-pointer hover:text-blue-500" /> */}
                </Tag>
              ))
            ) : (
              <Text type="secondary">No tag objects managed yet.</Text>
            )}
          </div>
        </div>
      </div>

      {/* Middle Center: Selected Tag Display and Task List */}
      <div className="flex-grow p-4 bg-white rounded-lg shadow-md border border-gray-200">
        {!selectedTag ? (
          <div className="text-center py-10 text-gray-500 text-lg">
            <TagOutlined className="text-4xl mb-4 text-gray-400" />
            <p>Select a tag from the left to view associated tasks.</p>
            <p>Or create a new tag above!</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <Title level={3} className="text-gray-800 mb-4 flex items-center justify-center">
              Items with <Tag color="blue" className="ml-2 mr-1 rounded-full px-4 py-1 text-lg font-bold">
                {selectedTag}
              </Tag>
              <Text type="secondary" className="text-xl">({filteredTasksBySelectedTag.length} items)</Text>
            </Title>
            <Divider className="my-2"/>
            <div className="space-y-3 flex-grow overflow-y-auto pr-2">
              {filteredTasksBySelectedTag.length > 0 ? (
                filteredTasksBySelectedTag.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    // Pass task operations needed for TaskItem interactivity
                    onEditClick={onEditTask}
                    onDeleteClick={onDeleteTask}
                    onUpdateTaskStatus={onUpdateTaskStatus}
                    onAddSubtask={onAddSubtask}
                    onTagClick={onTagClick} // Allow clicking tags within TasksPage to re-select
                  />
                ))
              ) : (
                <Text type="secondary" className="text-center py-8">
                  No tasks found with tag "{selectedTag}".
                </Text>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

