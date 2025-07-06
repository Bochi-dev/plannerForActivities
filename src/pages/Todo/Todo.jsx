import React, { useState, useMemo, useCallback, useEffect } from 'react';
// Corrected Imports: Importing from the components barrel export
// This assumes that your 'src/components/index.js' file correctly exports
// TaskForm, TaskList, and ClickableTag.
import { TaskForm, TaskList, ClickableTag } from '../../components';
import { Button, Tag as AntTag, Typography } from 'antd';
import { EditOutlined, CloseOutlined } from '@ant-design/icons';
import { TASK_STATUS } from '../../tools/todoTools'; // Import TASK_STATUS
import { useTodoManagement } from '../../tools/useTodoManagement'; // Import the hook

const { Text } = Typography;

// Define styles for each TaskList column - **UPDATED Styling**
const taskListColumnStyles = {
  [TASK_STATUS.NEW_ON_HOLD]: 'bg-gray-100',
  [TASK_STATUS.NEXT_UP]: 'bg-blue-100',
  [TASK_STATUS.IN_PROGRESS]: 'bg-yellow-100',
  [TASK_STATUS.IN_REVIEW]: 'bg-purple-100',
  [TASK_STATUS.COMPLETED]: 'bg-green-100',
};

export const Todo = ({
  tasks,
  onAddTask: onAddTaskProp, // Renamed to avoid shadowing
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

  // Get filtered and sorted tasks for each status - **UPDATED STATUSES**
  const newOnHoldTasks = getFilteredAndSortedTasks(TASK_STATUS.NEW_ON_HOLD);
  const nextUpTasks = getFilteredAndSortedTasks(TASK_STATUS.NEXT_UP);
  const inProgressTasks = getFilteredAndSortedTasks(TASK_STATUS.IN_PROGRESS);
  const inReviewTasks = getFilteredAndSortedTasks(TASK_STATUS.IN_REVIEW);
  const completedTasks = getFilteredAndSortedTasks(TASK_STATUS.COMPLETED);

    // Wrap the original onAddTask to include the status - **UPDATED STATUS**
    const onAddTask = useCallback((text, tags, priority, description) => {
        onAddTaskProp(text, tags, priority, description, TASK_STATUS.NEW_ON_HOLD); // Add status here
    }, [onAddTaskProp]);


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


      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4 pb-4"> {/*  **UPDATED Grid Layout** */}
        {/* New / On Hold TaskList */}
        <div className={` ${taskListColumnStyles[TASK_STATUS.NEW_ON_HOLD]} rounded-lg shadow-md p-4`}>
          <TaskList
            title="New / On Hold"  // **UPDATED Title**
            tasks={newOnHoldTasks}
            onEditClick={setEditingTask}
            onDeleteClick={onDeleteTask}
            onUpdateTaskStatus={onUpdateTaskStatus}
            onAddSubtask={onAddSubtask}
            onTagClick={onTagClick}
            nextStatus={TASK_STATUS.NEXT_UP}  // **UPDATED nextStatus**
            backStatus={null}
          />
        </div>
        {/* Next Up TaskList */}
        <div className={` ${taskListColumnStyles[TASK_STATUS.NEXT_UP]} rounded-lg shadow-md p-4`}>
          <TaskList
            title="Next Up"  // **UPDATED Title**
            tasks={nextUpTasks}
            onEditClick={setEditingTask}
            onDeleteClick={onDeleteTask}
            onUpdateTaskStatus={onUpdateTaskStatus}
            onAddSubtask={onAddSubtask}
            onTagClick={onTagClick}
            nextStatus={TASK_STATUS.IN_PROGRESS}  // **UPDATED nextStatus**
            backStatus={TASK_STATUS.NEW_ON_HOLD} // **UPDATED backStatus**
          />
        </div>
        {/* In Progress TaskList */}
        <div className={` ${taskListColumnStyles[TASK_STATUS.IN_PROGRESS]} rounded-lg shadow-md p-4`}>
          <TaskList
            title="In Progress"  // **UPDATED Title**
            tasks={inProgressTasks}
            onEditClick={setEditingTask}
            onDeleteClick={onDeleteTask}
            onUpdateTaskStatus={onUpdateTaskStatus}
            onAddSubtask={onAddSubtask}
            onTagClick={onTagClick}
            nextStatus={TASK_STATUS.IN_REVIEW}  // **UPDATED nextStatus**
            backStatus={TASK_STATUS.NEXT_UP}  // **UPDATED backStatus**
          />
        </div>
        {/* In Review TaskList */}
        <div className={` ${taskListColumnStyles[TASK_STATUS.IN_REVIEW]} rounded-lg shadow-md p-4`}>
          <TaskList
            title="In Review"  // **UPDATED Title**
            tasks={inReviewTasks}
            onEditClick={setEditingTask}
            onDeleteClick={onDeleteTask}
            onUpdateTaskStatus={onUpdateTaskStatus}
            onAddSubtask={onAddSubtask}
            onTagClick={onTagClick}
            nextStatus={TASK_STATUS.COMPLETED}  // **UPDATED nextStatus**
            backStatus={TASK_STATUS.IN_PROGRESS}  // **UPDATED backStatus**
          />
        </div>
        {/* Completed TaskList */}
        <div className={` ${taskListColumnStyles[TASK_STATUS.COMPLETED]} rounded-lg shadow-md p-4`}>
          <TaskList
            title="Completed"  // **UPDATED Title**
            tasks={completedTasks}
            onEditClick={setEditingTask}
            onDeleteClick={onDeleteTask}
            onUpdateTaskStatus={onUpdateTaskStatus}
            onAddSubtask={onAddSubtask}
            onTagClick={onTagClick}
            nextStatus={null}
            backStatus={TASK_STATUS.IN_REVIEW}  // **UPDATED backStatus**
          />
        </div>
      </div>
    </div>
  );
};
