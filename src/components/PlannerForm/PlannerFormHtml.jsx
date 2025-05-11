import { useState } from 'react';
import { Button, Checkbox, Form, Input, DatePicker, Select, InputNumber, TimePicker, Flex, Row, Col} from 'antd';
const { RangePicker } = DatePicker;
import { transformToDateFromAntd, addToDate, isTimeInRange, saveEventsToLocalStorage } from "../../tools"
import { WeekCheckBoxesFormPart } from "../../components"
import dayjs from 'dayjs'









export const PlannerFormHtml = ({form, initialValues, onFinish, onFinishFailed, repeat, setRepeat, repeatEnd,
    setRepeatEnd, allDay, setAllDay, selectedDays, setSelectedDays}) => {

    


  return (
        <>
            {/* 5. Link the form instance to the Form component using the 'form' prop */}
            <Form
                form={form} // <-- Add this prop
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
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
