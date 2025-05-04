import { useState } from 'react';
import { Button, Checkbox, Form, Input, DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import { transformToDateFromAntd, addToDate, isTimeInRange } from "../../tools"



export const PlannerForm = ({operations, handleOk}) => {
  const [allDay, setAllDay] = useState(false)
  const [events, setEvents] = operations.eventsOperations
  
  
  const onFinish = values => {
    
    const title = values.TITLE
    const dsc = values.DSC
    const dates = values.RANGEDATE
    setEvents(prev => [
      ... prev, 
      {
        ID: Math.floor(Math.random()*500),
        TITLE: title,
        DSC: dsc,
        STARTDATE: (allDay) ? transformToDateFromAntd(dates) : transformToDateFromAntd(dates[0]),
        ENDDATE: (allDay) ? transformToDateFromAntd(dates) : transformToDateFromAntd(dates[1]),
        ALLDAY: allDay,
        STARS: 0,
  //        note: add remember me notifications
        DONE: false,
      }
    ])
    console.log(events)
    handleOk()
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  
  const onChange = () => {
    setAllDay(prev => !prev)
  }


  return (<>

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
      label="Title"
      name="TITLE"
      rules={[{ required: true, message: 'Please input a title!' }]}
    >
      <Input />
    </Form.Item>
    
    <Form.Item name="ALLDAY" valuePropName="checked" label={null}>
      <Checkbox onChange={onChange}>All Day?</Checkbox>
    </Form.Item>
    
    <Form.Item
      label={null}
      name="RANGEDATE"
      rules={[{ required: true, message: 'Please input a date!' }]}
    >
      { (allDay) ? <DatePicker/> : <RangePicker showTime/> }
    </Form.Item>
    
    <Form.Item
      label="Descripccion"
      name="DSC"
    >
      <Input.TextArea />
    </Form.Item>

    

    <Form.Item label={null}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
</>)};
