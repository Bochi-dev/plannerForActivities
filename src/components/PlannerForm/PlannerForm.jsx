import { useState } from 'react';
import { Button, Checkbox, Form, Input, DatePicker, Select, InputNumber, TimePicker, Flex, Row, Col} from 'antd';
const { RangePicker } = DatePicker;
import { transformToDateFromAntd, addToDate, isTimeInRange, saveEventsToLocalStorage } from "../../tools"
import { WeekCheckBoxesFormPart } from "../../components"
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
  
  
  
  const onFinish = values => {
    
    const title = values.TITLE
    const dsc = values.DSC
    const dates = values.RANGEDATE
    const repeatSettings = {
        TYPE: repeat,
        
        }
        
    if (repeat !== "NONE") {
        const interval = values.INTERVAL
        repeatSettings["INTERVAL"] = interval
        repeatSettings["ENDTYPE"] = repeatEnd
        
        if (repeat === "WEEKLY") {
          const weeklyDays = values.WEEKLYDAYS
          repeatSettings["WEEKLYDAYS"] = selectedDays
        }
    }
    
    if (repeatEnd !== "NEVER"){
      if (repeatEnd === "AFTER" || repeatEnd === "ONDATE"){
        const endOnDate = values.ENDONDATE
        repeatSettings["ENDONDATE"] = transformToDateFromAntd(endOnDate)
      } else {
        const endAfterOccurrences = values.ENDAFTEROCCURRENCES
        repeatSettings["ENDAFTEROCCURRENCES"] = endAfterOccurrences
      }
    }
    
    
    
    
    
    
//    const improvedRepeatSettings = {
        /**
         * DETERMINES THE MAIN FREQUENCY OF THE REPEAT.
         * 'NONE': NO REPETITION.
         * 'DAILY': REPEATS EVERY `INTERVAL` DAYS.
         * 'WEEKLY': REPEATS EVERY `INTERVAL` WEEKS ON SPECIFIC DAYSOFWEEK.
         * 'MONTHLY': REPEATS EVERY `INTERVAL` MONTHS BASED ON MONTHLYREPEATPATTERN.
         * 'YEARLY': REPEATS EVERY `INTERVAL` YEARS ON A SPECIFIC DATE.
         */
        // TODO TYPE: repeat, // DEFAULT VALUE, CAN BE 'NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'

        /**
         * THE NUMBER OF FREQUENCY UNITS BETWEEN REPETITIONS.
         * E.G., IF TYPE IS 'WEEKLY' AND INTERVAL IS 2, IT REPEATS EVERY 2 WEEKS.
         * DEFAULTS TO 1 FOR SIMPLE "EVERY DAY", "EVERY WEEK", ETC.
         */
        // TODO INTERVAL: 1, // NUMBER, MUST BE 1 OR GREATER

        // --- DETAILS FOR SPECIFIC REPEAT TYPES ---
        // THESE FIELDS ARE ONLY RELEVANT DEPENDING ON THE 'TYPE' FIELD ABOVE.

        /**
         * ARRAY OF NUMBERS REPRESENTING THE DAYS OF THE WEEK FOR 'WEEKLY' REPEATS.
         * 0 = SUNDAY, 1 = MONDAY, ..., 6 = SATURDAY.
         * E.G., [1, 3, 5] FOR MONDAY, WEDNESDAY, FRIDAY.
         * ONLY RELEVANT IF TYPE IS 'WEEKLY'.
         */
        // TODO WEEKLYDAYS: selectedDays, // ARRAY OF NUMBERS 0-6

        /**
         * DEFINES HOW THE REPEAT DATE IS DETERMINED WITHIN THE MONTH FOR 'MONTHLY' REPEATS.
         * 'DAYOFMONTH': REPEATS ON THE SAME DAY NUMBER OF THE MONTH (E.G., THE 15TH).
         * 'DAYOFWEEK': REPEATS ON THE NTH OCCURRENCE OF A SPECIFIC WEEKDAY (E.G., THE 3RD TUESDAY).
         * ONLY RELEVANT IF TYPE IS 'MONTHLY'.
         */
        // TODO MONTHLYREPEATPATTERN: 'DAYOFMONTH', // CAN BE 'DAYOFMONTH' OR 'DAYOFWEEK'

        /**
         * THE DAY NUMBER OF THE MONTH (1-31) FOR 'MONTHLY' REPEATS WHEN MONTHLYREPEATPATTERN IS 'DAYOFMONTH'.
         * E.G., 15 FOR REPEATING ON THE 15TH OF THE MONTH.
         * ONLY RELEVANT IF TYPE IS 'MONTHLY' AND MONTHLYREPEATPATTERN IS 'DAYOFMONTH'.
         */
        // TODO MONTHLYDAY: 1, // NUMBER, 1-31

        /**
         * THE WEEK NUMBER WITHIN THE MONTH FOR 'MONTHLY' REPEATS WHEN MONTHLYREPEATPATTERN IS 'DAYOFWEEK'.
         * 0 = FIRST, 1 = SECOND, 2 = THIRD, 3 = FOURTH, 4 = LAST.
         * ONLY RELEVANT IF TYPE IS 'MONTHLY' AND MONTHLYREPEATPATTERN IS 'DAYOFWEEK'.
         */
        // TODO MONTHLYWEEK: 0, // NUMBER, 0-4

        /**
         * THE DAY OF THE WEEK (0-6) FOR 'MONTHLY' REPEATS WHEN MONTHLYREPEATPATTERN IS 'DAYOFWEEK'.
         * 0 = SUNDAY, 1 = MONDAY, ..., 6 = SATURDAY.
         * ONLY RELEVANT IF TYPE IS 'MONTHLY' AND MONTHLYREPEATPATTERN IS 'DAYOFWEEK'.
         */
        // TODO MONTHLYWEEKDAY: 0, // NUMBER, 0-6

         /**
         * THE MONTH (0-11) FOR 'YEARLY' REPEATS.
         * 0 = JANUARY, 1 = FEBRUARY, ..., 11 = DECEMBER.
         * ONLY RELEVANT IF TYPE IS 'YEARLY'.
         */
        // TODO YEARLYMONTH: 0, // NUMBER, 0-11

         /**
         * THE DAY OF THE MONTH (1-31) FOR 'YEARLY' REPEATS.
         * E.G., 25 FOR REPEATING ON THE 25TH.
         * ONLY RELEVANT IF TYPE IS 'YEARLY'.
         */
        // TODO YEARLYDAY: 1, // NUMBER, 1-31


        // --- END CONDITION ---

        /**
         * DETERMINES WHEN THE REPETITION ENDS.
         * 'NEVER': REPEATS INDEFINITELY.
         * 'AFTER': REPEATS FOR A SPECIFIC NUMBER OF OCCURRENCES.
         * 'ONDATE': REPEATS UNTIL A SPECIFIC DATE (INCLUSIVE).
         */
        // TODO ENDTYPE: 'NEVER', // DEFAULT VALUE, CAN BE 'NEVER', 'AFTER', 'ONDATE'

        /**
         * THE NUMBER OF OCCURRENCES AFTER WHICH THE REPEAT ENDS.
         * ONLY RELEVANT IF ENDTYPE IS 'AFTER'.
         * MUST BE 1 OR GREATER.
         */
        // TODO ENDAFTEROCCURRENCES: 1, // NUMBER

        /**
         * THE DATE ON WHICH THE REPEAT ENDS (INCLUSIVE).
         * THE TIME PART SHOULD TYPICALLY BE IGNORED OR SET TO END-OF-DAY WHEN CHECKING THIS CONDITION.
         * SHOULD BE A STANDARD JAVASCRIPT DATE OBJECT.
         * ONLY RELEVANT IF ENDTYPE IS 'ONDATE'.
         */
        // TODO ENDONDATE: NULL, // DATE OBJECT OR NULL
//    };
    
    setEvents(prev => {
    
    
        const newEvents = [
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
            REPEATSETTINGS: repeatSettings 
          }
        ]
        saveEventsToLocalStorage(newEvents)
        return newEvents
    
    })
    console.log(events)
    handleOk()
    
    
    // --- Clear the Form Inputs AFTER Submission ---
    // 2. Call resetFields() on the form instance
    form.resetFields();

    // 3. Manually reset state variables that control conditional rendering
    // and custom components not automatically handled by resetFields()
    setRepeat('NONE'); // Reset repeat type select state
    setRepeatEnd('NEVER'); // Reset repeat end select state
    setAllDay(false); // Reset all day checkbox state

    // 4. Manually reset the state of your custom WeekCheckBoxesFormPart
    setSelectedDays([]); // Reset the array of selected days
    
    
    
    
    
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  
    


  return (
        <>
            {/* 5. Link the form instance to the Form component using the 'form' prop */}
            <Form
                form={form} // <-- Add this prop
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{
                    // These values will be restored when resetFields() is called
                    TYPE: "NONE",
                    RANGEDATE: [dayjs(), dayjs()], // Initial value for RangePicker (adjust if only DatePicker initially)
                    ENDTYPE: "NEVER",
                    ALLDAY: false, // Make sure initial value matches useState if needed
                    INTERVAL: 1, // Good default
                    ENDAFTEROCCURRENCES: 1, // Good default
                    ENDONDATE: null, // Good default
                    TITLE: '', // Explicitly set initial empty string
                    DSC: '', // Explicitly set initial empty string
                    // Note: initialValues does NOT manage the selectedDays state for WeekCheckBoxesFormPart
                }}
                onFinish={onFinish} // Use the onFinish handler defined above
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                {/* All your existing Form.Item elements go here */}

                {/* Title */}
                <Form.Item
                    label="Title"
                    name="TITLE"
                    rules={[{ required: true, message: 'Please input a title!' }]}
                >
                    <Input />
                </Form.Item>

                {/* All Day Checkbox */}
                 <Form.Item name="ALLDAY" valuePropName="checked" label={null}>
                     {/* Ensure local state updates when checkbox is interacted with */}
                     <Checkbox onChange={(e) => { setAllDay(e.target.checked); }}>All Day?</Checkbox>
                 </Form.Item>

                {/* Date/Time Pickers */}
                {/* NOTE: Having multiple Form.Item with the SAME name="RANGEDATE" */}
                {/* conditionally rendered can be problematic. Ant Design expects unique names. */}
                {/* It's better to use distinct names or find a way to render only ONE Form.Item */}
                {/* with name="RANGEDATE" and change the INPUT component inside it conditionally. */}

                {/* Example showing ONE Form.Item with conditional input */}
                <Form.Item
                     label="Date/Time"
                     name="RANGEDATE" // Use a single name for the date/time value
                     rules={[{ required: true, message: 'Please input date and time!' }]}
                     // Add initialValue here if needed, or rely on initialValues prop of Form
                     // initialValue={allDay ? dayjs() : [dayjs(), dayjs()]} // Example initial value logic
                 >
                     {/* Render the appropriate picker based on local 'allDay' state */}
                     {(allDay) ? <DatePicker format="YYYY-MM-DD" /> : <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />}
                 </Form.Item>

                {/* If you need separate date/time fields when repeating vs non-repeating, */}
                {/* use different names for those Form.Items (e.g., 'SINGLE_EVENT_DATE_RANGE', 'REPEAT_START_DATE', 'REPEAT_START_TIME') */}


                {/* Repeat Type Select */}
                <Form.Item name="TYPE" label="Repeat?">
                    {/* Update local 'repeat' state when TYPE changes */}
                    <Select onChange={(value) => { setRepeat(value); }}
                            options={[
                                { value: 'NONE', label: 'None' },
                                { value: 'DAILY', label: 'Daily' },
                                { value: 'WEEKLY', label: 'Weekly' },
                                { value: 'MONTHLY', label: 'Monthly (WIP)', disabled: true },
                                { value: 'YEARLY', label: 'Yearly (WIP)', disabled: true },
                            ]}
                    />
                </Form.Item>

                {/* Interval Input (conditional) */}
                {(repeat !== "NONE") && (
                    <Form.Item name="INTERVAL"
                               label="Interval"
                               rules={[{ required: true, message: 'You need to input a number bigger than 0' }]}
                               extra='e.g., 1 for every day/week/month/year, 2 for every 2...'
                    >
                        <InputNumber min={1} />
                    </Form.Item>
                 )}

                {/* Weekly Day Selection (conditional) */}
                {(repeat === "WEEKLY") && (
                    <Form.Item label="Days of Week">
                        {/* Pass selectedDays and setSelectedDays props to your custom component */}
                        <WeekCheckBoxesFormPart selectedDays={selectedDays} setSelectedDays={setSelectedDays} />
                        {/* Alternatively, if WeekCheckBoxesFormPart manages its own state and uses a callback: */}
                        {/* <WeekCheckBoxesFormPart onDaysChange={setSelectedDays} /> */}
                         {/* If you need the selected days to be part of the *form* values submitted: */}
                         {/* Add a 'name' prop here: <Form.Item name="weeklyDays" label="Days of Week"> */}
                         {/* And update WeekCheckBoxesFormPart to work as a custom form control */}
                         {/* (using value/onChange props internally, not its own useState) */}
                    </Form.Item>
                 )}

                {/* Repeat End Type Select (conditional) */}
                {(repeat !== "NONE") && (
                    <Form.Item name="ENDTYPE" label="Ends?">
                         {/* Update local 'repeatEnd' state when ENDTYPE changes */}
                        <Select onChange={(value) => { setRepeatEnd(value); }}
                                options={[
                                    { value: 'NEVER', label: 'Never' },
                                    { value: 'AFTER', label: 'After' }, // Use 'AFTER' consistently
                                    { value: 'ONDATE', label: 'On Date' },
                                ]}
                        />
                    </Form.Item>
                 )}

                {/* End Date Picker (conditional based on repeatEnd state) */}
                {(repeatEnd === "ONDATE") && (
                     <Form.Item name="ENDONDATE" label="End Date"> {/* Use consistent name */}
                        <DatePicker format="YYYY-MM-DD" showTime /> {/* Include showTime if needed */}
                     </Form.Item>
                 )}

                {/* End After Occurrences Input (conditional based on repeatEnd state) */}
                {(repeatEnd === "AFTER") && ( // Use 'AFTER' consistently
                    <Form.Item name="ENDAFTEROCCURRENCES" label="After # times">
                        <InputNumber min={1} />
                    </Form.Item>
                 )}

                {/* Description Input */}
                <Form.Item
                    label="Description"
                    name="DSC"
                >
                    <Input.TextArea />
                </Form.Item>

                {/* Submit Button */}
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};
