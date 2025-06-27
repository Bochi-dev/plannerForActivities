import React, { useEffect, useState } from 'react';
import { Input, Button, Form, Select, Typography } from 'antd'; // Import Select and Typography for tags
import { PlusOutlined, TagOutlined } from '@ant-design/icons'; // Import TagOutlined icon for tag input label

const { Option } = Select;

export const TaskForm = ({ onAddTask, onEditTask, editingTask, setEditingTask }) => {
  const [form] = Form.useForm();
  const [allAvailableTags, setAllAvailableTags] = useState([]); // State to manage a list of previously used tags (optional)

  useEffect(() => {
    if (editingTask) {
      form.setFieldsValue({
        taskText: editingTask.text,
        // Ensure tags are set for editing, default to empty array if undefined
        tags: editingTask.tags || [],
      });
    } else {
      form.resetFields(); // Clear form when not editing
      // Optionally, you might clear previously used tags if not editing
      // setAllAvailableTags([]);
    }
    // As a simple example, you might populate allAvailableTags from existing tasks
    // This would require passing all tasks down to TaskForm, or fetching them here.
    // For now, it will simply allow free-form input without suggestions.
  }, [editingTask, form]);

  const handleFinish = (values) => {
    // Collect text and tags from the form
    const { taskText, tags } = values;

    if (editingTask) {
      // For editing, pass an object with updated properties (text and tags)
      onEditTask(editingTask.id, { text: taskText, tags: tags || [] });
      setEditingTask(null);
    } else {
      // For adding, pass text and tags
      onAddTask(taskText, tags || []);
    }
    form.resetFields(); // Clear the input fields
    setAllAvailableTags(prevTags => {
      // Add newly entered tags to the available tags list, avoiding duplicates
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

      <Form.Item
        name="tags"
        noStyle // To allow custom styling via className
        className="w-full sm:w-auto flex-grow" // Adjust width
        initialValue={[]} // Ensure tags field is initialized as an empty array
      >
        <Select
          mode="tags" // Allows free-form tag input (user types, presses Enter/Space)
          placeholder="Add tags (e.g., work, urgent)"
          style={{ width: '100%', borderRadius: '9999px' }} // Full width and rounded
          className="ant-select-tag-input rounded-full" // Custom class for styling
          suffixIcon={<TagOutlined />} // Add a tag icon as suffix
          tokenSeparators={[',']} // Allow comma as a separator for new tags
          // You could map 'allAvailableTags' here for suggestions if you had a global list
          // options={allAvailableTags.map(tag => ({ value: tag, label: tag }))}
        />
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

export default TaskForm;

