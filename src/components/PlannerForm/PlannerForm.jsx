import { useState } from 'react';
import { Button, Checkbox, Form, Input, DatePicker, Select, InputNumber, TimePicker, Flex, Row, Col} from 'antd';
const { RangePicker } = DatePicker;
import { transformToDateFromAntd, addToDate, isTimeInRange, saveEventsToLocalStorage } from "../../tools"
import { WeekCheckBoxesFormPart, PlannerFormHtml } from "../../components"
import dayjs from 'dayjs'









export const PlannerForm = ({operations, handleOk, stringDate}) => {
  // 1. Use the Form.useForm() hook to get a form instance
  const [form] = Form.useForm();

  const [allDay, setAllDay] = useState(false)
  const [repeat, setRepeat] = useState("NONE")
  const [repeatEnd, setRepeatEnd] = useState("NEVER")
  const [selectedDays, setSelectedDays] = useState([])
  const [start, setStart] = useState(new Date())
  const [end, setEnd] = useState(new Date())
  const [events, setEvents] = operations.eventsOperations
  
  
  
  // Assuming repeat, repeatEnd, selectedDays, allDay,
  // transformToDateFromAntd, setEvents, saveEventsToLocalStorage,
  // console.log, handleOk, form, setRepeat, setRepeatEnd,
  // setAllDay, setSelectedDays are defined in the scope.

  const onFinish = values => {
      // 1. Use object destructuring for cleaner value extraction
      const {
          TITLE: title,
          DSC: dsc,
          RANGEDATE: dates,
          INTERVAL: interval, // Extract these values early
          WEEKLYDAYS: valuesWeeklyDays, // Extract even if not used directly later
          ENDONDATE: endOnDate,
          ENDAFTEROCCURRENCES: endAfterOccurrences,
          // Destructure other relevant fields if any...
      } = values;

      // 2. Build repeatSettings using a more declarative approach
      const repeatSettings = {
          TYPE: repeat, // Always include the repeat type
          // Conditionally add properties based on repeat and repeatEnd values
          ...(repeat !== "NONE" && {
              INTERVAL: interval, // Add interval if repeat is not NONE
              ENDTYPE: repeatEnd, // Add end type if repeat is not NONE
          }),
          ...(repeat === "WEEKLY" && {
              // Use the external selectedDays state as per original logic,
              // ignoring values.WEEKLYDAYS extracted from the form if selectedDays is the source of truth.
              // If values.WEEKLYDAYS is the source of truth, use WEEKLYDAYS: valuesWeeklyDays
              WEEKLYDAYS: selectedDays,
          }),
          ...(repeatEnd === "AFTER" && {
              ENDAFTEROCCURRENCES: endAfterOccurrences, // Add occurrences if end type is AFTER
          }),
          ...(repeatEnd === "ONDATE" && {
              ENDONDATE: transformToDateFromAntd(endOnDate), // Transform and add end date if end type is ONDATE
          }),
           // Add logic for MONTHLY and YEARLY if needed based on your commented structure
           /*
           ...(repeat === "MONTHLY" && {
              MONTHLYREPEATPATTERN: values.MONTHLYREPEATPATTERN, // Assuming you get this from values
              ...(values.MONTHLYREPEATPATTERN === 'DAYOFMONTH' && {
                   MONTHLYDAY: values.MONTHLYDAY, // Assuming you get this from values
              }),
              ...(values.MONTHLYREPEATPATTERN === 'DAYOFWEEK' && {
                   MONTHLYWEEK: values.MONTHLYWEEK, // Assuming you get this from values
                   MONTHLYWEEKDAY: values.MONTHLYWEEKDAY, // Assuming you get this from values
              }),
           }),
           // ... similar logic for YEARLY
           */
      };

      // 3. Create the new event object - This part is already reasonably clear
      const newEvent = {
          // Consider a more robust ID generation method like uuid
          ID: Math.floor(Math.random() * 500), // Basic ID generation - consider alternatives
          TITLE: title,
          DSC: dsc,
          // Handle date transformation based on allDay
          STARTDATE: transformToDateFromAntd(allDay ? dates : dates[0]),
          ENDDATE: transformToDateFromAntd(allDay ? dates : dates[1]),
          ALLDAY: allDay,
          STARS: 0, // Assuming default stars
          DONE: false, // Assuming default done status
          REPEATSETTINGS: repeatSettings, // Include the constructed repeat settings
      };

      // 4. Update state, save, and perform other actions
      setEvents(prev => {
          const newEventsList = [...prev, newEvent];
          saveEventsToLocalStorage(newEventsList); // Save the *new* list
          return newEventsList; // Return the new list to update state
      });

      // Note: console.log(events) here will likely show the state *before* the update
      // because setEvents is asynchronous. To see the latest state after update,
      // use a useEffect hook or console.log inside the setEvents updater.
      console.log("Attempting to set events. Check state in subsequent renders or effects.");


      handleOk(); // Call handleOk

      // --- Clear the Form Inputs and related state ---
      form.resetFields(); // Reset form fields

      // Manually reset state variables controlling form parts not handled by resetFields
      setRepeat('NONE');
      setRepeatEnd('NEVER');
      setAllDay(false);
      setSelectedDays([]);
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  
    


  return (
    <PlannerFormHtml 
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
    
    />
    );
};
