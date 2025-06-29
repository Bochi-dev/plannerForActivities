import React, { useEffect, useState } from 'react';
import { Input, Button, Form, Select, Typography } from 'antd';
import { PlusOutlined, TagOutlined } from '@ant-design/icons';

const { Option } = Select;

export const TaskForm = ({ onAddTask, onEditTask, editingTask, setEditingTask, defaultTagsForNewTask = [] }) => { // NEW PROP: defaultTagsForNewTask
  const [form] = Form.useForm();
  const [allAvailableTags, setAllAvailableTags] = useState([]); // State to manage a list of previously used tags (optional)

  useEffect(() => {
    if (editingTask) {
      form.setFieldsValue({
        taskText: editingTask.text,
        tags: editingTask.tags || [],
      });
    } else {
      // If not editing, set the tags field to defaultTagsForNewTask
      form.setFieldsValue({
        taskText: '', // Ensure taskText is clear for new task
        tags: defaultTagsForNewTask, // NEW: Apply default tags
      });
      // form.resetFields(); // This would clear defaultTagsForNewTask, so we use setFieldsValue instead
      // Optionally, you might clear previously used tags if not editing
      // setAllAvailableTags([]);
    }
  }, [editingTask, form, defaultTagsForNewTask]); // Add defaultTagsForNewTask to dependencies

  const handleFinish = (values) => {
    const { taskText, tags } = values;

    if (editingTask) {
      onEditTask(editingTask.id, { text: taskText, tags: tags || [] });
      setEditingTask(null);
    } else {
      onAddTask(taskText, tags || []);
    }
    // We now use setFieldsValue in useEffect to clear/set defaults,
    // so a simple resetFields() here would override defaultTagsForNewTask.
    // Instead, we can manually reset just the taskText or let the useEffect handle it.
    form.resetFields(['taskText']); // Only reset taskText after submission
    // Note: The tags field will be reset by the useEffect setting it to defaultTagsForNewTask
    // or the editingTask's tags, depending on state.

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

      <Form.Item
        name="tags"
        noStyle
        className="w-full sm:w-auto flex-grow"
        initialValue={[]} // Still provide initialValue, but useEffect will override for new tasks
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

