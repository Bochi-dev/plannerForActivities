import { useState, useEffect } from 'react';
import { Button, Checkbox, Form, Input, Select } from 'antd';
import { TableSlotsFormHtml } from "../../components"
import { saveRatingsToLocalStorage } from "../../tools"

export const TableSlotsFormEdit = ({operations, eventId, selectedDate, ratingId, handleOk}) => {
  const [ratings, setRatings] = operations.ratingsOperations
  const ratingToEditObj = ratings.find(el => el.ID === ratingId)
    if (!ratingToEditObj) return (<></>)
    
  const [form] = Form.useForm();
  
    useEffect(() => {
        form.setFieldsValue({
            RATING: ratingToEditObj.RATING,
        })
    }, [ratingToEditObj, form])
    
    const onFinish = (values) => {
      const [ratingsOfEvents, setRatingsOfEvents] = operations.ratingsOperations
      const rating = values.RATING
      const updatedEvent = { ...ratingToEditObj, RATING: rating }
      
      
      setRatingsOfEvents(prevEvents => {
          const index = prevEvents.findIndex(event => event.ID === ratingId);

          if (index !== -1) {
              const newEventsArray = [
                  ...prevEvents.slice(0, index), 
                  updatedEvent,                    
                  ...prevEvents.slice(index + 1) 
              ];
              saveRatingsToLocalStorage(newEventsArray)

              return newEventsArray;
          } else {
              console.warn(`Attempted to save event with ID ${updatedEvent.ID}, but it was not found in the current events state.`);

              return prevEvents;
          }
      });
      
      handleOk()
      form.resetFields()
      
      
    };


    const onFinishFailed = errorInfo => {
      console.log('Failed:', errorInfo);
    };
    
    

  return (
    <TableSlotsFormHtml form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}/> 
  )
  
};
