import { useState, useEffect } from 'react';
import { Button, Checkbox, Form, Input, DatePicker, Select, InputNumber, TimePicker, Flex, Row, Col} from 'antd';
const { RangePicker } = DatePicker;
import { transformToDateFromAntd, addToDate, isTimeInRange, saveEventsToLocalStorage } from "../../tools"
import { WeekCheckBoxesFormPart, PlannerFormHtml } from "../../components"
import dayjs from 'dayjs'

export const PlannerEditForm = ({operations, editId, onSave, onCancel}) => {
    const [events, setEvents] = operations.eventsOperations
    const eventToEdit = events.find(el => el.ID === editId)

    if (typeof eventToEdit === "undefined") return <></>    
     
    const [form] = Form.useForm();

    // State variables for conditional rendering and custom component state
    // Initialize them based on the eventToEdit data
    const [repeat, setRepeat] = useState(eventToEdit?.REPEATSETTINGS?.TYPE || 'NONE');
    const [repeatEnd, setRepeatEnd] = useState(eventToEdit?.REPEATSETTINGS?.ENDTYPE || 'NEVER');
    const [allDay, setAllDay] = useState(eventToEdit?.ALLDAY || false);
    // Initialize selectedDays from eventToEdit.REPEATSETTINGS.WEEKLYDAYS
    const [selectedDays, setSelectedDays] = useState(eventToEdit?.REPEATSETTINGS?.WEEKLYDAYS || []);

    // Use useEffect to update state if eventToEdit prop changes (e.g., if editing a different event)
    useEffect(() => {
        if (eventToEdit) {
            setRepeat(eventToEdit.REPEATSETTINGS?.TYPE || 'NONE');
            setRepeatEnd(eventToEdit.REPEATSETTINGS?.ENDTYPE || 'NEVER');
            setAllDay(eventToEdit.ALLDAY || false);
            setSelectedDays(eventToEdit.REPEATSETTINGS?.WEEKLYDAYS || []);

            // Use form.setFieldsValue to update Ant Design form fields
            // This is needed if the eventToEdit prop changes while the form is already mounted
            form.setFieldsValue({
              TITLE: eventToEdit.TITLE,
              DSC: eventToEdit.DSC,
              ALLDAY: eventToEdit.ALLDAY,
              // Convert Date objects back to dayjs objects for Ant Design pickers
              RANGEDATE: eventToEdit.STARTDATE && eventToEdit.ENDDATE ?
                        [dayjs(eventToEdit.STARTDATE), dayjs(eventToEdit.ENDDATE)] : undefined,
              TYPE: eventToEdit.REPEATSETTINGS?.TYPE || 'NONE',
              INTERVAL: eventToEdit.REPEATSETTINGS?.INTERVAL || 1,
              ENDTYPE: eventToEdit.REPEATSETTINGS?.ENDTYPE || 'NEVER',
              ENDAFTEROCCURRENCES: eventToEdit.REPEATSETTINGS?.ENDAFTEROCCURRENCES || 1,
              ENDONDATE: eventToEdit.REPEATSETTINGS?.ENDONDATE ? dayjs(eventToEdit.REPEATSETTINGS.ENDONDATE) : null,
              // Note: 'WEEKLYDAYS' is handled by the custom component's state, not directly via setFieldsValue
            });
        } else {
            // Handle case where eventToEdit becomes null (e.g., closing the edit form)
            form.resetFields();
            setRepeat('NONE');
            setRepeatEnd('NEVER');
            setAllDay(false);
            setSelectedDays([]);
        }
    }, [eventToEdit, form]); // Re-run effect if eventToEdit or form instance changes


    // This function is called when the form is successfully submitted and validated
    const onFinish = (values) => {
        console.log('Updated values:', values);
        const allday = values.ALLDAY
        const dates = values.RANGEDATE
        // Create an updated event object by merging original event data with form values
        const updatedEvent = {
            ...eventToEdit, // Start with the original event data
            TITLE: values.TITLE,
            DSC: values.DSC,
            ALLDAY: values.ALLDAY,
            // Convert dayjs objects from pickers back to Date objects
            STARTDATE: (allDay) ? transformToDateFromAntd(dates) : transformToDateFromAntd(dates[0]),
            ENDDATE: (allDay) ? transformToDateFromAntd(dates) : transformToDateFromAntd(dates[1]),
            REPEATSETTINGS: {
                ...eventToEdit?.REPEATSETTINGS, // Keep existing repeat settings if not overridden
                TYPE: values.TYPE,
                INTERVAL: values.INTERVAL,
                WEEKLYDAYS: selectedDays, // Get selected days from the component's state
                 // ... map other repeat settings fields from values ...
//                 monthlyRepeatPattern: values.monthlyRepeatPattern, // Assuming you add these fields
//                 monthlyDay: values.monthlyDay,
//                 monthlyWeek: values.monthlyWeek,
//                 monthlyWeekday: values.monthlyWeekday,
//                 yearlyMonth: values.yearlyMonth,
//                 yearlyDay: values.yearlyDay,
                 // --- End Condition ---
                 ENDTYPE: values.ENDTYPE,
                 ENDAFTEROCCURRENCES: values.ENDAFTEROCCURRENCES,
                 ENDONDATE: values.ENDONDATE ? values.ENDONDATE.toDate() : null, // Convert dayjs to Date or null
            },
            // STARS and DONE might be updated elsewhere, or could be added to the form if editable
            // STARS: eventToEdit.STARS,
            // DONE: eventToEdit.DONE,
        };

        console.log('Saving updated event:', updatedEvent);

        // Call the onSave callback, passing the updated event object
        if (onSave) {
            onSave(updatedEvent);
        }

        // Optional: Close the modal/form after saving
        // if (onCancel) {
        //     onCancel();
        // }

        // Note: You typically don't resetFields() after a successful edit submission
        // if the form is about to be closed. If the form stays open, you might reset
        // it to a default state or clear it, but often closing is the desired behavior.
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Validation Failed:', errorInfo);
        // Handle validation errors
    };
  
    


  return (<PlannerFormHtml 
    form={form}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed} 
    repeat={repeat} 
    setRepeat={setRepeat} 
    repeatEnd={repeatEnd}
    setRepeatEnd={setRepeatEnd} 
    allDay={allDay} 
    setAllDay={setAllDay} 
    selectedDays={selectedDays} 
    setSelectedDays={setSelectedDays} 
  />)
};
