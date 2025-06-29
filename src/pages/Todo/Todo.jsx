import React, { useState, useMemo, useCallback, useEffect } from 'react'; // Added useEffect
import { TaskForm, TaskList, ClickableTag } from '../../components'; // Adjusted path and barrel import
import { Button, Tag as AntTag, Typography } from 'antd'; // Import AntTag for raw tags, Typography for text
import { EditOutlined, CloseOutlined } from '@ant-design/icons'; // CloseOutlined for selected tag dismissal


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

  // NEW: Effect to clear selected filters when the tasks array changes (e.g., reset on app load, or major data refresh)
  // This helps ensure the filter state aligns with the current tasks if external changes occur.
  // Consider if this behavior is desired or if filters should persist across certain data changes.
  // For this feature, let's keep it simple: initial load of tasks, filters start empty.
  useEffect(() => {
    // Optionally, if you want filters to reset only when the component mounts initially,
    // you can remove allTags from dependency array, or use a ref.
    // For now, let's assume we want filters to persist across minor task changes
    // but default to empty on page load, which initial useState handles.
    // This useEffect is more about reacting to external *data* updates of allTags that might make current filters invalid.
    // A simpler approach for the feature is just to let useState handle initial empty state.
  }, []); // Only runs on initial mount


  // Memoize the sorted list of all available tags by lastUsedAt
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

  // Task Filtering Logic (remains the same)
  const getFilteredTasks = (status) => {
    const statusFiltered = tasks.filter(task => task.status === status);

    if (selectedFilterTags.length === 0) {
      return statusFiltered;
    }

    return statusFiltered.filter(task => {
        return selectedFilterTags.every(filterTag =>
            task.tags && task.tags.map(t => t.toLowerCase()).includes(filterTag.toLowerCase())
        );
    });
  };

  const draftedTasks = getFilteredTasks('drafted');
  const inProgressTasks = getFilteredTasks('in-progress');
  const inReviewTasks = getFilteredTasks('in-review');
  const completedTasks = getFilteredTasks('completed');


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
          // NEW PROP: Pass the currently selected filter tags to TaskForm
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

