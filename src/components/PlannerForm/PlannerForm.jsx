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
    <PlannerFormHtml 
        form={form}
        onFinish
        onFinishFailed 
        repeat 
        setRepeat 
        repeatEnd
        setRepeatEnd 
        allDay 
        setAllDay 
        selectedDays 
        setSelectedDays 
    
    />
    );
};
