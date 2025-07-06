import React, { useEffect } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { PlusOutlined, StarOutlined, TagOutlined } from '@ant-design/icons';
import { TASK_STATUS } from '../../tools/todoTools'; // Import TASK_STATUS
const { Option } = Select;

// Define your priority levels as in your original code
const PRIORITY_LEVELS = [
  { value: 0, letter: 'C' },
  { value: 1, letter: 'B' },
  { value: 2, letter: 'A' },
  { value: 3, letter: 'S' }
];

// Main TaskForm component
export const TaskForm = ({
  onAddTask,
  onEditTask,
  editingTask,
  setEditingTask,
  defaultTagsForNewTask = [],
  setAllAvailableTags
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingTask) {
      form.setFieldsValue({
        taskText: editingTask.text,
        tags: editingTask.tags || [],
        priority: editingTask.priority ?? PRIORITY_LEVELS[0].value,
        description: editingTask.description || "", // Pre-fill description if editing
      });
    } else {
      form.setFieldsValue({
        taskText: '',
        tags: defaultTagsForNewTask,
        priority: PRIORITY_LEVELS[0].value,
        description: '', // Reset description for new task
      });
    }
  }, [editingTask, form, defaultTagsForNewTask]);

  const handleFinish = (values) => {
    const { taskText, tags, priority, description } = values;

    if (editingTask) {
      onEditTask(editingTask.id, {
        text: taskText,
        tags: tags || [],
        priority: priority,
        description: description || ""
      });
      setEditingTask(null);
    } else {
      //  Include the status when adding a new task - **UPDATED STATUS**
      onAddTask(taskText, tags || [], priority, description || "");
    }

    form.resetFields(['taskText', 'description']); // Reset description and taskText after submission

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
          placeholder={editingTask ? "Edit task..." : "Add a new task..."}
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

      {/* Priority Select Box */}
      <Form.Item
        name="priority"
        noStyle
        initialValue={PRIORITY_LEVELS[0].value}
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

      {/* Description TextArea */}
      <Form.Item
        name="description"
        className="w-full sm:w-auto flex-grow"
        style={{ marginBottom: 0, minWidth: 200, maxWidth: 400 }}
      >
        <Input.TextArea
          placeholder="Add a description (optional)"
          autoSize={{ minRows: 1, maxRows: 4 }}
          style={{ borderRadius: '10px' }}
        />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full shadow-md transition duration-200 text-lg flex items-center justify-center"
        icon={<PlusOutlined />}
      >
        {editingTask ? "Update" : "Add"}
      </Button>
    </Form>
  );
};

export default TaskForm;
