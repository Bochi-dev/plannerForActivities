import React from 'react';
import { Button, Checkbox, Form, Input, Select } from 'antd';
const onFinish = values => {
  console.log('Success:', values);
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};
export const TableSlotsForm = () => (
  <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >

    <Form.Item
      label="Password"
      name="password"
    >
      <Select defaultValue={"null"} options={[
          { value: 'null', label: <span>UNFINISHED</span> },
          { value: '1', label: <span>1</span> },
          { value: '2', label: <span>2</span> },
          { value: '3', label: <span>3</span> }
      ]}/>
    </Form.Item>


    <Form.Item label={null}>
      <Button type="primary" htmlType="submit">
        save
      </Button>
    </Form.Item>
  </Form>
);
