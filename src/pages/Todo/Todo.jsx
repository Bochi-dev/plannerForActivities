import React, { useState, useMemo, useCallback, useEffect } from 'react';
// Corrected Imports: Importing from the components barrel export
// This assumes that your 'src/components/index.js' file correctly exports
// TaskForm, TaskList, and ClickableTag.
import { TaskForm, TaskList, ClickableTag } from '../../components';
import { Button, Tag as AntTag, Typography } from 'antd';
import { EditOutlined, CloseOutlined } from '@ant-design/icons';


const { Text } = Typography;

export const Todo = ({
  tasks,
  onAddTask,
  onEditTask,
  onUpdateTaskStatus,
  onDeleteTask,
  onAddSubtask,
  onTagClick,
  userId,
  allTags,
}) => {
  const [editingTask, setEditingTask] = useState(null);
  const [selectedFilterTags, setSelectedFilterTags] = useState([]);

  useEffect(() => {
    // This useEffect is currently empty, you can add logic here if needed,
    // e.g., for specific initialization or cleanup related to Todo component mount/unmount.
  }, []);


  // Memoize the sorted list of all available tags by lastUsedAt (for the filter bar)
  const sortedAllTags = useMemo(() => {
    if (!Array.isArray(allTags)) return [];

    return [...allTags].sort((a, b) => {
      const dateA = new Date(a.lastUsedAt || 0);
      const dateB = new Date(b.lastUsedAt || 0);
      return dateB.getTime() - dateA.getTime();
    });
  }, [allTags]);

  // Handler for toggling tag selection for filtering
  const handleToggleFilterTag = useCallback((tagText) => {
    setSelectedFilterTags(prevTags => {
      if (prevTags.includes(tagText)) {
        return prevTags.filter(tag => tag !== tagText);
      } else {
        return [...prevTags, tagText];
      }
    });
  }, []);

  // Handler for clearing all selected filter tags
  const handleClearFilters = useCallback(() => {
    setSelectedFilterTags([]);
  }, []);

  // --- Task Filtering and Sorting Logic ---
  const getFilteredAndSortedTasks = (status) => {
    // 1. Filter by status
    let filtered = tasks.filter(task => task.status === status);

    // 2. Filter by selected tags (AND logic)
    if (selectedFilterTags.length > 0) {
      filtered = filtered.filter(task => {
        return selectedFilterTags.every(filterTag =>
            task.tags && task.tags.map(t => t.toLowerCase()).includes(filterTag.toLowerCase())
        );
      });
    }

    // 3. Sort by priority (descending: S (3) -> A (2) -> B (1) -> C (0))
    // If priority is undefined, treat it as the lowest priority (0) for sorting.
    return filtered.sort((a, b) => {
      const priorityA = a.priority !== undefined ? a.priority : 0;
      const priorityB = b.priority !== undefined ? b.priority : 0;
      return priorityB - priorityA; // Descending order
    });
  };

  const draftedTasks = getFilteredAndSortedTasks('drafted');
  const inProgressTasks = getFilteredAndSortedTasks('in-progress');
  const inReviewTasks = getFilteredAndSortedTasks('in-review');
  const completedTasks = getFilteredAndSortedTasks('completed');


  return (
    <div className="container mx-auto p-4 max-w-6xl bg-white rounded-lg shadow-xl font-inter">
      <div className="mb-8 p-4">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Multi-Stage To-Do Workflow</h1>

        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">User ID: {userId}</p>
          <Button
            type="text"
            className="text-gray-500 hover:text-gray-700"
            icon={<EditOutlined className="text-lg" />}
          >
          </Button>
        </div>

        <TaskForm
          onAddTask={onAddTask}
          onEditTask={onEditTask}
          editingTask={editingTask}
          setEditingTask={setEditingTask}
          defaultTagsForNewTask={selectedFilterTags}
        />
      </div>

      {/* Tag Filtering Section */}
      <div className="mb-8 px-4 py-6 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-gray-700">Filter by Tags:</Text>
          {selectedFilterTags.length > 0 && (
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={handleClearFilters}
              className="text-red-500 hover:text-red-700"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Display selected tags */}
        {selectedFilterTags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            <Text className="text-md font-medium text-gray-600">Selected:</Text>
            {selectedFilterTags.map(tagText => (
              <AntTag
                key={tagText}
                color="blue"
                closable
                onClose={() => handleToggleFilterTag(tagText)}
                className="rounded-full px-3 py-1 text-base font-medium"
              >
                {tagText}
              </AntTag>
            ))}
          </div>
        )}

        {/* List of all available tags for selection */}
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2">
          {sortedAllTags.length > 0 ? (
            sortedAllTags.map(tagObj => {
              const isSelected = selectedFilterTags.includes(tagObj.name);
              return (
                <ClickableTag
                  key={tagObj.id}
                  tagText={tagObj.name}
                  onClick={handleToggleFilterTag}
                  color={isSelected ? 'geekblue' : 'default'}
                  className={`${isSelected ? 'ring-2 ring-geekblue-300' : ''}`}
                />
              );
            })
          ) : (
            <Text type="secondary" className="text-center w-full py-4">No tags created yet.</Text>
          )}
        </div>
      </div>
      {/* END NEW: Tag Filtering Section */}


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 pb-4">
        <TaskList
          title="Drafted"
          tasks={draftedTasks}
          onEditClick={setEditingTask}
          onDeleteClick={onDeleteTask}
          onUpdateTaskStatus={onUpdateTaskStatus}
          onAddSubtask={onAddSubtask}
          onTagClick={onTagClick}
          nextStatus="in-progress"
            backStatus={null}
        />
        <TaskList
          title="In Progress"
          tasks={inProgressTasks}
          onEditClick={setEditingTask}
          onDeleteClick={onDeleteTask}
          onUpdateTaskStatus={onUpdateTaskStatus}
          onAddSubtask={onAddSubtask}
          onTagClick={onTagClick}
          nextStatus="in-review"
            backStatus="drafted"
        />
        <TaskList
          title="In Review"
          tasks={inReviewTasks}
          onEditClick={setEditingTask}
          onDeleteClick={onDeleteTask}
          onUpdateTaskStatus={onUpdateTaskStatus}
          onAddSubtask={onAddSubtask}
          onTagClick={onTagClick}
          nextStatus="completed"
          backStatus="in-progress"
        />
        <TaskList
          title="Completed"
          tasks={completedTasks}
          onEditClick={setEditingTask}
          onDeleteClick={onDeleteTask}
          onUpdateTaskStatus={onUpdateTaskStatus}
          onAddSubtask={onAddSubtask}
          onTagClick={onTagClick}
          nextStatus={null}
          backStatus={null}
        />
      </div>
    </div>
  );
};
