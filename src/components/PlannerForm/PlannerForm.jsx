import { useState } from 'react';
import { Button, Checkbox, Form, Input, DatePicker, Select, InputNumber  } from 'antd';
const { RangePicker } = DatePicker;
import { transformToDateFromAntd, addToDate, isTimeInRange } from "../../tools"
import { WeekCheckBoxesFormPart } from "../../components"
import dayjs from 'dayjs'









export const PlannerForm = ({operations, handleOk, stringDate}) => {
  const [allDay, setAllDay] = useState(false)
  const [repeat, setRepeat] = useState("NONE")
  const [repeatEnd, setRepeatEnd] = useState("NEVER")
  const [selectedDays, setSelectedDays] = useState([])
  const [events, setEvents] = operations.eventsOperations
  
  
  const onFinish = values => {
    
    const title = values.TITLE
    const dsc = values.DSC
    const dates = values.RANGEDATE
    
    const improvedRepeatSettings = {
        /**
         * DETERMINES THE MAIN FREQUENCY OF THE REPEAT.
         * 'NONE': NO REPETITION.
         * 'DAILY': REPEATS EVERY `INTERVAL` DAYS.
         * 'WEEKLY': REPEATS EVERY `INTERVAL` WEEKS ON SPECIFIC DAYSOFWEEK.
         * 'MONTHLY': REPEATS EVERY `INTERVAL` MONTHS BASED ON MONTHLYREPEATPATTERN.
         * 'YEARLY': REPEATS EVERY `INTERVAL` YEARS ON A SPECIFIC DATE.
         */
        TYPE: 'NONE', // DEFAULT VALUE, CAN BE 'NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'

        /**
         * THE NUMBER OF FREQUENCY UNITS BETWEEN REPETITIONS.
         * E.G., IF TYPE IS 'WEEKLY' AND INTERVAL IS 2, IT REPEATS EVERY 2 WEEKS.
         * DEFAULTS TO 1 FOR SIMPLE "EVERY DAY", "EVERY WEEK", ETC.
         */
        INTERVAL: 1, // NUMBER, MUST BE 1 OR GREATER

        // --- DETAILS FOR SPECIFIC REPEAT TYPES ---
        // THESE FIELDS ARE ONLY RELEVANT DEPENDING ON THE 'TYPE' FIELD ABOVE.

        /**
         * ARRAY OF NUMBERS REPRESENTING THE DAYS OF THE WEEK FOR 'WEEKLY' REPEATS.
         * 0 = SUNDAY, 1 = MONDAY, ..., 6 = SATURDAY.
         * E.G., [1, 3, 5] FOR MONDAY, WEDNESDAY, FRIDAY.
         * ONLY RELEVANT IF TYPE IS 'WEEKLY'.
         */
        WEEKLYDAYS: selectedDays, // ARRAY OF NUMBERS 0-6

        /**
         * DEFINES HOW THE REPEAT DATE IS DETERMINED WITHIN THE MONTH FOR 'MONTHLY' REPEATS.
         * 'DAYOFMONTH': REPEATS ON THE SAME DAY NUMBER OF THE MONTH (E.G., THE 15TH).
         * 'DAYOFWEEK': REPEATS ON THE NTH OCCURRENCE OF A SPECIFIC WEEKDAY (E.G., THE 3RD TUESDAY).
         * ONLY RELEVANT IF TYPE IS 'MONTHLY'.
         */
        MONTHLYREPEATPATTERN: 'DAYOFMONTH', // CAN BE 'DAYOFMONTH' OR 'DAYOFWEEK'

        /**
         * THE DAY NUMBER OF THE MONTH (1-31) FOR 'MONTHLY' REPEATS WHEN MONTHLYREPEATPATTERN IS 'DAYOFMONTH'.
         * E.G., 15 FOR REPEATING ON THE 15TH OF THE MONTH.
         * ONLY RELEVANT IF TYPE IS 'MONTHLY' AND MONTHLYREPEATPATTERN IS 'DAYOFMONTH'.
         */
        MONTHLYDAY: 1, // NUMBER, 1-31

        /**
         * THE WEEK NUMBER WITHIN THE MONTH FOR 'MONTHLY' REPEATS WHEN MONTHLYREPEATPATTERN IS 'DAYOFWEEK'.
         * 0 = FIRST, 1 = SECOND, 2 = THIRD, 3 = FOURTH, 4 = LAST.
         * ONLY RELEVANT IF TYPE IS 'MONTHLY' AND MONTHLYREPEATPATTERN IS 'DAYOFWEEK'.
         */
        MONTHLYWEEK: 0, // NUMBER, 0-4

        /**
         * THE DAY OF THE WEEK (0-6) FOR 'MONTHLY' REPEATS WHEN MONTHLYREPEATPATTERN IS 'DAYOFWEEK'.
         * 0 = SUNDAY, 1 = MONDAY, ..., 6 = SATURDAY.
         * ONLY RELEVANT IF TYPE IS 'MONTHLY' AND MONTHLYREPEATPATTERN IS 'DAYOFWEEK'.
         */
        MONTHLYWEEKDAY: 0, // NUMBER, 0-6

         /**
         * THE MONTH (0-11) FOR 'YEARLY' REPEATS.
         * 0 = JANUARY, 1 = FEBRUARY, ..., 11 = DECEMBER.
         * ONLY RELEVANT IF TYPE IS 'YEARLY'.
         */
        YEARLYMONTH: 0, // NUMBER, 0-11

         /**
         * THE DAY OF THE MONTH (1-31) FOR 'YEARLY' REPEATS.
         * E.G., 25 FOR REPEATING ON THE 25TH.
         * ONLY RELEVANT IF TYPE IS 'YEARLY'.
         */
        YEARLYDAY: 1, // NUMBER, 1-31


        // --- END CONDITION ---

        /**
         * DETERMINES WHEN THE REPETITION ENDS.
         * 'NEVER': REPEATS INDEFINITELY.
         * 'AFTER': REPEATS FOR A SPECIFIC NUMBER OF OCCURRENCES.
         * 'ONDATE': REPEATS UNTIL A SPECIFIC DATE (INCLUSIVE).
         */
        ENDTYPE: 'NEVER', // DEFAULT VALUE, CAN BE 'NEVER', 'AFTER', 'ONDATE'

        /**
         * THE NUMBER OF OCCURRENCES AFTER WHICH THE REPEAT ENDS.
         * ONLY RELEVANT IF ENDTYPE IS 'AFTER'.
         * MUST BE 1 OR GREATER.
         */
        ENDAFTEROCCURRENCES: 1, // NUMBER

        /**
         * THE DATE ON WHICH THE REPEAT ENDS (INCLUSIVE).
         * THE TIME PART SHOULD TYPICALLY BE IGNORED OR SET TO END-OF-DAY WHEN CHECKING THIS CONDITION.
         * SHOULD BE A STANDARD JAVASCRIPT DATE OBJECT.
         * ONLY RELEVANT IF ENDTYPE IS 'ONDATE'.
         */
        ENDONDATE: NULL, // DATE OBJECT OR NULL
    };
    
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
        REPEATSETTINGS: improvedRepeatSettings 
//        dont use this ⬇️ version, ok? 
        /*REPEATSETTINGS: {
            REPEAT: FALSE
            EVERYDAY: FALSE,
            ACTIVATEREPEATWEEKLY: FALSE,
            REPEATWEEKLY: {
                SUNDAY: FALSE,
                MONDAY: FALSE,
                TUESDAY: FALSE,
                WEDNESDAY: FALSE,
                THURSDAY: FALSE,
                FRIDAY: FALSE,
                SATURDAY: FALSE
            }
            ACTIVATECUSTOMREPEAT: FALSE,
            CUSTOMREPEAT: {
//                EVERY HOW MANY THINGS
                EVERYFEWDAYS: 0,
                EVERYFEWWEEKS: 0,
                EVERYFEWMONTHS: 0,
                EVERYFEWYEARS: 0,
            }
            ACTIVATECUSTOMDATE: FALSE,
            CUSTOMDATE: DATE OBJ WITH DATE
            REPEATFOREVER: FALSE,
            REPEATENDDATE: DATE OBJ WITH DATE
        }*/
      }
    ])
    console.log(events)
    handleOk()
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  
    


  return (<>

  <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ 
        TYPE: "NONE",
        RANGEDATE: [dayjs(), dayjs()],
        ENDTYPE: "NEVER",
     }}
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
    
    { (repeat === "NONE") ? 
    <Form.Item name="ALLDAY" valuePropName="checked" label={null}>
      <Checkbox onChange={() => {setAllDay(prev => !prev)}}>All Day?</Checkbox>
    </Form.Item> : <></>}
    
    <Form.Item
      label={null}
      name="RANGEDATE"
      rules={[{ required: true, message: 'Please input a date!' }]}
    >
      { (repeat === "NONE") ? (allDay) ? <DatePicker/> : <RangePicker showTime/> : <DatePicker showTime/> }
    </Form.Item>
        {/**
         * DETERMINES THE MAIN FREQUENCY OF THE REPEAT.
         * 'NONE': NO REPETITION.
         * 'DAILY': REPEATS EVERY `INTERVAL` DAYS.
         * 'WEEKLY': REPEATS EVERY `INTERVAL` WEEKS ON SPECIFIC DAYSOFWEEK.
         * 'MONTHLY': REPEATS EVERY `INTERVAL` MONTHS BASED ON MONTHLYREPEATPATTERN.
         * 'YEARLY': REPEATS EVERY `INTERVAL` YEARS ON A SPECIFIC DATE.
         */}
        <Form.Item name="TYPE" label={"Repeat?"}>
          <Select onChange={(value) => {
            setRepeat(value)
          }} options={[
            { value: 'NONE', label: <span>None</span> },
            { value: 'DAILY', label: <span>Daily</span> },
            { value: 'WEEKLY', label: <span>Weekly</span> },
            { value: 'MONTHLY', label: <span>Monthly (WIP)</span>, disabled: true },
            { value: 'YEARLY', label: <span>Yearly (WIP)</span>, disabled: true},
          
          ]}/>
        </Form.Item>
    
    {(repeat === "DAILY") ? <>
        <Form.Item name="INTERVAL" label={"Interval"} min={1} rules={[{ required: true, message: 'You need to input a number bigger than 0' }]}>
            <InputNumber/>
        </Form.Item>
    </> : <></>}
    
    {(repeat === "WEEKLY") ? <>
      <Form.Item label={null}>
        <WeekCheckBoxesFormPart/>
      </Form.Item>
    </> : <></>}
    
    {(repeat !== "NONE") ? <>
      {/**
         * DETERMINES WHEN THE REPETITION ENDS.
         * 'NEVER': REPEATS INDEFINITELY.
         * 'AFTER': REPEATS FOR A SPECIFIC NUMBER OF OCCURRENCES.
         * 'ONDATE': REPEATS UNTIL A SPECIFIC DATE (INCLUSIVE).
         */}
    
      <Form.Item name="ENDTYPE" defaultValue={"NEVER"} label={"Interval end?"}>
        <Select onChange={(value) => {
          setRepeatEnd(value)
        }} options={[
          { value: 'NEVER', label: <span>Never</span> },
          { value: 'AFTER', label: <span>After</span> },
          { value: 'ONDATE', label: <span>On Date</span> },
          { value: 'AFTERXCYCLES', label: <span>After #X cycles</span> },
        
        ]}/>
      </Form.Item>
    
    </> : <></>}
    
    {(repeatEnd === "AFTER" || repeatEnd === "ONDATE") ? <>
      <Form.Item name="ENDONDATE" label={"End Cycle Date"}>
        <DatePicker showTime />
      </Form.Item>
    
    </> : <></>}
    
    {(repeatEnd === "AFTERXCYCLES") ? <>
      <Form.Item name="ENDAFTEROCCURRENCES" label={"how many times?"} min={1} rules={[{ required: true, message: 'You need to input a number bigger than 0' }]}>
        <InputNumber/>
      </Form.Item>
    
    </> : <></>}
    
    
    
    
    
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
