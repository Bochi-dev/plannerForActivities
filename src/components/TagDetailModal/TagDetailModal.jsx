import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Typography, Tag, Divider, Input, Button } from 'antd'; // Import Button for task actions
import { SearchOutlined } from '@ant-design/icons'; // For search icon

// Corrected import path for the TaskItem component
// This assumes TaskItem.jsx is in the SAME directory as TagDetailModal.jsx (e.g., src/components/)
import { TaskItem } from '../../components';

const { Title, Text } = Typography;

/**
 * Helper to extract unique tags from a list of tasks and count their occurrences.
 * @param {Array<Object>} tasks - The array of all task objects.
 * @returns {Array<{name: string, count: number}>} An array of unique tags with their counts.
 */
const getUniqueTagsWithCounts = (tasks) => {
  const tagCounts = {};
  tasks.forEach(task => {
    if (task.tags && Array.isArray(task.tags)) {
      task.tags.forEach(tag => {
        const lowerCaseTag = tag.toLowerCase(); // Standardize tag casing
        tagCounts[lowerCaseTag] = (tagCounts[lowerCaseTag] || 0) + 1;
      });
    }
  });
  return Object.keys(tagCounts)
    .map(tag => ({ name: tag, count: tagCounts[tag] }))
    .sort((a, b) => b.count - a.count); // Sort by count descending
};

export const TagDetailModal = ({
  isOpen,
  onClose,
  initialClickedTag,
  allTasks,
  onEditTask,
  onDeleteTask,
  onUpdateTaskStatus,
  onAddSubtask,
  onTagClick
}) => {
  const [currentTag, setCurrentTag] = useState(initialClickedTag);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen && initialClickedTag) {
      setCurrentTag(initialClickedTag);
    } else if (!isOpen) {
      setCurrentTag('');
      setSearchTerm('');
    }
  }, [isOpen, initialClickedTag]);


  const allUniqueTags = useMemo(() => getUniqueTagsWithCounts(allTasks), [allTasks]);

  const filteredTasks = useMemo(() => {
    if (!currentTag) return [];
    return allTasks.filter(task =>
      task.tags && Array.isArray(task.tags) && task.tags.map(t => t.toLowerCase()).includes(currentTag.toLowerCase())
    );
  }, [allTasks, currentTag]);

  const currentTagItemCount = filteredTasks.length;

  const filteredUniqueTags = useMemo(() => {
    return allUniqueTags.filter(tag =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allUniqueTags, searchTerm]);


  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1000}
      centered
      className="p-4 rounded-lg shadow-xl"
      styles={{
        body: { padding: '24px', minHeight: '600px', display: 'flex', flexDirection: 'column' }
      }}
    >
      {/* Top Center: Clicked Tag and Counter */}
      <div className="text-center mb-6">
        <Title level={3} className="text-gray-800 flex items-center justify-center">
          <Tag color="blue" className="mr-2 rounded-full px-4 py-1 text-lg font-bold">
            {currentTag}
          </Tag>
          <Text type="secondary" className="text-xl">({currentTagItemCount} items)</Text>
        </Title>
        <Divider />
      </div>

      {/* Main Content Area: Two Columns (Existing Tags | Tagged Items) */}
      <div className="flex flex-grow gap-6">
        {/* Down-Left: List of Existing Tags */}
        <div className="w-1/3 p-4 bg-gray-50 rounded-lg shadow-inner flex flex-col">
          <Title level={4} className="mb-4 text-gray-700">Existing Tags</Title>
          <Input
            placeholder="Search tags..."
            prefix={<SearchOutlined />}
            className="mb-4 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto pr-2">
            {filteredUniqueTags.length > 0 ? (
              filteredUniqueTags.map(tag => (
                <Tag
                  key={tag.name}
                  color={tag.name.toLowerCase() === currentTag.toLowerCase() ? 'geekblue' : 'default'}
                  className={`cursor-pointer rounded-full px-3 py-1 text-sm font-medium transition-all duration-200 ease-in-out
                              hover:scale-105 hover:shadow-md active:scale-95
                              ${tag.name.toLowerCase() === currentTag.toLowerCase() ? 'ring-2 ring-geekblue-300' : ''}`}
                  onClick={() => setCurrentTag(tag.name)}
                >
                  {tag.name} ({tag.count})
                </Tag>
              ))
            ) : (
              <Text type="secondary">No tags found.</Text>
            )}
          </div>
        </div>

        {/* Down-Right: Items (Tasks) with the Clicked Tag */}
        <div className="w-2/3 p-4 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col">
          <Title level={4} className="mb-4 text-gray-700">Items with "{currentTag}"</Title>
          <div className="space-y-3 flex-grow overflow-y-auto pr-2">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEditClick={onEditTask}
                  onDeleteClick={onDeleteTask}
                  onUpdateTaskStatus={onUpdateTaskStatus}
                  onAddSubtask={onAddSubtask}
                  onTagClick={onTagClick}
                />
              ))
            ) : (
              <Text type="secondary" className="text-center py-8">No items found with this tag.</Text>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TagDetailModal;

