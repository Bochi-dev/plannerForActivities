import { Button, Checkbox, Form, Input, Select } from 'antd';




export const TableSlotsFormHtml = ({operations, eventId, selectedDate, ratingId, onFinish, onFinishFailed, form, handleOk}) => {

  return (
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ RATING: 0 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >

        <Form.Item
          label="Rating"
          name="RATING"
        >
          <Select options={[
              { value: 0, label: <span>UNFINISHED</span> },
              { value: 1, label: <span>1</span> },
              { value: 2, label: <span>2</span> },
              { value: 3, label: <span>3</span> }
          ]}/>
        </Form.Item>


        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            save
          </Button>
        </Form.Item>
        
      </Form>
  )
  
};
