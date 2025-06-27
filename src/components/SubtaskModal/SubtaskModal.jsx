// subtaskmodal

import React, { useState } from 'react';
import { Modal, Form, Input, Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export const SubtaskModal = ({ open, onClose, parentTaskId, onAddSubtask }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onAddSubtask(values.subtaskText); // Pass subtask text to the handler
    form.resetFields(); // Clear input
    onClose(); // Close the modal
  };

  return (
    <Modal
      title={<Typography.Title level={4} className="text-center font-bold text-gray-800">Add Subtask</Typography.Title>}
      open={open}
      onCancel={onClose}
      footer={null} // Remove default footer buttons
      centered
      className="p-4 rounded-lg shadow-xl" // Tailwind for modal styling
      bodyStyle={{ padding: '24px' }} // Default Antd body padding
    >
      <p className="text-gray-600 text-center mb-6">Subtasks for Task ID: <span className="font-semibold text-blue-600">{parentTaskId}</span></p>

      <Form form={form} onFinish={handleFinish} className="flex flex-col items-center space-y-4">
        <Form.Item
          name="subtaskText"
          noStyle
          rules={[{ required: true, message: 'Please enter subtask text' }]}
          className="w-full"
        >
          <Input placeholder="Enter subtask description..." className="rounded-md p-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-200 w-full"
          icon={<PlusOutlined />}
        >
          Add Subtask
        </Button>
      </Form>

      {/* You can add a list of existing subtasks here later */}
      <div className="mt-6">
        <Typography.Text className="font-semibold text-gray-700">Existing Subtasks (WIP):</Typography.Text>
        <ul className="list-disc list-inside text-gray-500 mt-2">
          <li>Subtask 1 (Placeholder)</li>
          <li>Subtask 2 (Placeholder)</li>
        </ul>
      </div>
    </Modal>
  );
};

