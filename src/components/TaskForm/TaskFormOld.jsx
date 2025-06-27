//Task Form

import React, { useEffect } from 'react';
import { Input, Button, Form, Flex, Card } from 'antd';

export const TaskForm = ({ onAddTask, onEditTask, editingTask, setEditingTask }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingTask) {
      form.setFieldsValue({
        taskText: editingTask.text,
      });
    } else {
      form.resetFields(); // Clear form when not editing
    }
  }, [editingTask, form]);

  const handleFinish = (values) => {
    if (editingTask) {
      onEditTask(editingTask.id, values.taskText);
      setEditingTask(null);
    } else {
      onAddTask(values.taskText);
    }
    form.resetFields();
  };

  return (
  
                <Form
                  form={form}
                  onFinish={handleFinish}
                >
                
                <Flex gap={10}>
                  <Form.Item
                    name="taskText"
                    noStyle
                    rules={[{ required: true, message: 'Please enter a task' }]}
                  >
                    <Input
                      placeholder={editingTask ? "Edit task..." : "Add a new task..."}
                      className=""
                      autoFocus
                    />
                  </Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-200"
                  >
                    {editingTask ? "Update Task" : "Add Task"}
                  </Button>
                </Flex>  
                  
                  {editingTask && (
                    <Button
                      type="default"
                      onClick={() => setEditingTask(null)}
                      className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md shadow-md transition duration-200"
                    >
                      Cancel
                    </Button>
                  )}
                </Form>
                
  
  );
};

