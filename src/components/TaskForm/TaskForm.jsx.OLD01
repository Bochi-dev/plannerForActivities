import React, { useEffect, useState } from 'react';
import { Input, Button, Form, Select, Typography } from 'antd';
import { PlusOutlined, TagOutlined, StarOutlined } from '@ant-design/icons'; // Added StarOutlined for priority icon

// Import priority levels and helper function from todoTools
// Adjusted path: trying a different relative path based on common resolution patterns in environments
import { PRIORITY_LEVELS, getPriorityDisplay } from '../../tools'; // Changed from '../../tools/todoTools'

const { Option } = Select;

export const TaskForm = ({ onAddTask, onEditTask, editingTask, setEditingTask, defaultTagsForNewTask = [] }) => {
  const [form] = Form.useForm();
  const [allAvailableTags, setAllAvailableTags] = useState([]); // State to manage a list of previously used tags (optional)

  useEffect(() => {
    if (editingTask) {
      form.setFieldsValue({
        taskText: editingTask.text,
        tags: editingTask.tags || [],
        priority: editingTask.priority !== undefined ? editingTask.priority : PRIORITY_LEVELS[0].value, // Set existing priority or default
      });
    } else {
      form.setFieldsValue({
        taskText: '',
        tags: defaultTagsForNewTask,
        priority: PRIORITY_LEVELS[0].value, // Default to lowest priority 'C' for new tasks
      });
    }
  }, [editingTask, form, defaultTagsForNewTask]); // Add defaultTagsForNewTask to dependencies

  const handleFinish = (values) => {
    const { taskText, tags, priority } = values; // Destructure priority

    if (editingTask) {
      onEditTask(editingTask.id, { text: taskText, tags: tags || [], priority: priority }); // Pass priority to onEditTask
      setEditingTask(null);
    } else {
      onAddTask(taskText, tags || [], priority); // Pass priority to onAddTask
    }

    form.resetFields(['taskText']); // Only reset taskText after submission
    // Tags and Priority will be reset by the useEffect handling default/editing values.

    setAllAvailableTags(prevTags => {
      const newTags = tags ? tags.filter(tag => !prevTags.includes(tag)) : [];
      return [...prevTags, ...newTags];
    });
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 p-4 bg-blue-50 rounded-md shadow-inner"
    >
      <Form.Item
        name="taskText"
        noStyle
        rules={[{ required: true, message: 'Please enter a task' }]}
        className="flex-grow w-full"
      >
        <Input
          placeholder={editingTask ? "Edit task description..." : "Add a new task description..."}
          className="rounded-full p-2.5 border border-blue-200 focus:ring-blue-500 focus:border-blue-500 text-lg"
          autoFocus
        />
      </Form.Item>

      {/* Tags Select */}
      <Form.Item
        name="tags"
        noStyle
        className="w-full sm:w-auto flex-grow"
        initialValue={[]}
      >
        <Select
          mode="tags"
          placeholder="Add tags (e.g., work, urgent)"
          style={{ width: '100%', borderRadius: '9999px' }}
          className="ant-select-tag-input rounded-full"
          suffixIcon={<TagOutlined />}
          tokenSeparators={[',']}
        />
      </Form.Item>

      {/* NEW: Priority Select Box */}
      <Form.Item
        name="priority"
        noStyle
        initialValue={PRIORITY_LEVELS[0].value} // Default to 'C' (0) if not explicitly set by useEffect
        className="w-full sm:w-auto flex-shrink-0"
      >
        <Select
          placeholder="Priority"
          style={{ width: '100%', borderRadius: '9999px' }}
          className="ant-select-priority-input rounded-full"
          suffixIcon={<StarOutlined />}
        >
          {PRIORITY_LEVELS.map(level => (
            <Option key={level.value} value={level.value}>
              {level.letter} - Priority {level.value}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full shadow-md transition duration-200 text-lg flex items-center justify-center"
        icon={<PlusOutlined />}
      >
        {editingTask ? "Update Task" : "Add Task"}
      </Button>
      {editingTask && (
        <Button
          type="default"
          onClick={() => setEditingTask(null)}
          className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full shadow-md transition duration-200"
        >
          Cancel
        </Button>
      )}
    </Form>
  );
};

