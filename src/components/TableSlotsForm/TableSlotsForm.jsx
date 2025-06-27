import { useState, useEffect } from 'react';
import { Button, Checkbox, Form, Input, Select } from 'antd';
import { TableSlotsFormHtml } from "../../components"
import { saveRatingsToLocalStorage } from "../../tools"

export const TableSlotsForm = ({operations, eventId, selectedDate, handleOk}) => {
  if (!operations) return (<></>)
  
  const [form] = Form.useForm();
  
  const onFinish = (values) => {
    const [ratingsOfEvents, setRatingsOfEvents] = operations.ratingsOperations
    const rating = values.RATING
    
    
    setRatingsOfEvents(prev => {
      const updatedList = [
        ...prev,
        {
          ID: Math.floor(Math.random()*500),
          EVENTID: eventId,
          RATING: rating,
          DATE: selectedDate,
        }
      ]
      saveRatingsToLocalStorage(updatedList)
      return updatedList
    })
    handleOk()
    form.resetFields()
    
    
    
  };


  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  
  

  return (
    <TableSlotsFormHtml form={form} operations={operations} eventId={eventId} selectedDate={selectedDate} ratingId={null} onFinish={onFinish} onFinishFailed={onFinishFailed}/> 
  )
  
};
