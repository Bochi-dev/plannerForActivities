import { Table } from "antd"
import { addToDate,
 isTimeInRange, normalizeDateToStartOfDay, getDayDifference, isDailyOccurrence, isWeeklyOccurrence, isSameDay} from "../../tools"
import { PlannerTableSlots } from "../../components"



const rowRender = (func, weekDates, eventData, operations, showModal, source) => {
  for (const dayName in weekDates) {
      // Ensure we only process properties directly on the object
      if (Object.hasOwnProperty.call(weekDates, dayName)) {
        const dayDate = weekDates[dayName];
        eventData[dayName] =  func(dayDate) ? <PlannerTableSlots source={source} operations={operations} date={dayDate} star={null} showModal={showModal}/> : "NO";
      }
  }
}




export const PlannerTable = ({operations, sunday, saturday, showModal, weekDates}) => {
  

  const [events, setEvents] = operations.eventsOperations
  
//  ORIGINAL CODE TODO
  
  /*const dataSource = events.map(el => {
    const start = new Date(el["STARTDATE"])
    const eventData = {
          name: el.TITLE,
      };
    const repeatSettings = el["REPEATSETTINGS"]
    const type = repeatSettings["TYPE"]
  
    if (type !== "NONE"){
      const interval = repeatSettings["INTERVAL"]
        if (type === "DAILY"){
           const datesArray = []
           for (let i = 0; i < 7; i++){
            const intervalPlusDate = new Date(start.setDate(start.getDate() + interval))
            datesArray.push(intervalPlusDate.getDate())
           }
          rowRender((dayDate => {
            
            if (interval === 1) {
              return true
            } else {
              return datesArray.includes(dayDate.getDate())
            } 
          }), weekDates, eventData, operations, showModal)
        } else if (type === "WEEKLY") {
          const weeklyDays = repeatSettings["WEEKLYDAYS"]
          rowRender((dayDate => {
            return weeklyDays.includes(dayDate.getDay())
          }), weekDates, eventData, operations, showModal)
        }
    
    }
    return eventData

  }).filter(item => item !== null);*/
  
//  CODE FROM GEMINI TODO 
  
  // Assuming 'events', 'weekDates', 'operations', 'showModal' are accessible in this scope.
  // 'weekDates' is assumed to be an array of Date objects representing the days of the week being displayed.
  // 'rowRender' is assumed to be a function that takes a predicate (a function that checks if an event occurs on a given day),
  // the weekDates, the event data, and other arguments, and processes/renders the row for that event for the week.

  // --- Helper Functions for Date Comparisons (can be in a separate 'dateUtils.js' file) ---


  

  

  


  // --- Main Map Logic (Optimized and Corrected) ---

  const dataSource = events.map(el => {
      // Use original start/end dates from the event data
      const originalStart = new Date(el["STARTDATE"]);
      // Assuming ENDDATE exists, otherwise default duration logic might be needed
      const originalEnd = new Date(el["ENDDATE"] || el["STARTDATE"]); // Use STARTDATE if ENDDATE is missing


      const eventData = {
          name: el.TITLE,
          // Include other relevant properties from the original event
          id: el["ID"],
          allDay: el["ALLDAY"],
          // It's often useful to keep the original start/end times/dates accessible
          originalStartDate: originalStart,
          originalEndDate: originalEnd,
          // You might add properties here like duration, etc., calculated from original dates
      };

      const repeatSettings = el["REPEATSETTINGS"];
      // Default type to 'NONE' if repeatSettings is missing or type is undefined
      const type = repeatSettings ? repeatSettings["TYPE"] : "NONE";
      const interval = repeatSettings ? repeatSettings["INTERVAL"] : 1; // Default interval to 1

      // This is the function that will be passed to rowRender.
      // It takes a 'dayDate' (a Date object for a single day in the displayed week)
      // and determines if THIS event should occur on that specific day.
      let isOccurrenceOnDay = (dayDate) => false; // Default to false if no logic is applied

      // Check the type and define the correct occurrence predicate function
      if (type === "NONE") {
          // For non-repeating events, it only occurs on the single original start date's day
          isOccurrenceOnDay = (dayDate) => {
               // Ensure both dates are valid before comparison
               if (!dayDate || !originalStart) return false;
               return isSameDay(dayDate, originalStart); // Use the helper function from previous example
          };

      } else if (type === "DAILY") {
           // Use the corrected daily occurrence logic
          isOccurrenceOnDay = (dayDate) => {
              if (!dayDate || !originalStart || !interval) return false;
              return isDailyOccurrence(originalStart, interval, dayDate);
          };

      } else if (type === "WEEKLY") {
          const weeklyDays = repeatSettings ? repeatSettings["WEEKLYDAYS"] : []; // Get days array, default to empty
          // Use the corrected weekly occurrence logic
          isOccurrenceOnDay = (dayDate) => {
               if (!dayDate || !originalStart || !interval || !Array.isArray(weeklyDays)) return false;
               return isWeeklyOccurrence(originalStart, interval, weeklyDays, dayDate);
          };

      }
      // IMPORTANT: Add else if blocks here for other types (MONTHLY, YEARLY) based on your improved structure
      // For MONTHLY: The logic would check if dayDate is on the correct day of the month (15th?) or Nth weekday (3rd Tuesday?)
      //              and if the month/year is the correct interval away from the start date's month/year.
      // For YEARLY: The logic would check if dayDate is on the correct month/day (Dec 25th?)
      //              and if the year is the correct interval away from the start date's year.

      // You also need to consider the End Condition (endType, endAfterOccurrences, endOnDate)
      // The isOccurrenceOnDay predicate should ALSO check the end condition.
      // e.g., combine the date logic with: && (endType === 'never' || (endType === 'onDate' && dayDate <= endOnDate) || ...)
      // Checking 'after N occurrences' within this per-day predicate is complex; it's often easier
      // to generate occurrences up to N and then check if dayDate matches one of them, or
      // calculate which occurrence dayDate would be if it were an occurrence and check if that index <= N.

      // Example incorporating a simple 'onDate' end condition check into the predicate:
      /*
      const endType = repeatSettings ? repeatSettings["ENDTYPE"] : 'never';
      const endOnDate = (repeatSettings && repeatSettings["ENDONDATE"]) ? new Date(repeatSettings["ENDONDATE"]) : null;

      let originalIsOccurrenceOnDay = isOccurrenceOnDay; // Store the date rule check

      isOccurrenceOnDay = (dayDate) => {
          if (!dayDate) return false; // Always check for valid date

          // First, apply the date/frequency rule (daily, weekly, etc.)
          const dateRuleMatches = originalIsOccurrenceOnDay(dayDate);
          if (!dateRuleMatches) {
              return false; // Doesn't match the basic repeat pattern for this day
          }

          // Second, apply the end condition rule (if applicable)
          if (endType === 'onDate' && endOnDate) {
               // Check if the dayDate is on or after the original start date AND on or before the end date
               // Normalizing to start of day for comparison
               const normDayDate = normalizeDateToStartOfDay(dayDate);
               const normEndOnDate = normalizeDateToStartOfDay(endOnDate);
               const normStart = normalizeDateToStartOfDay(originalStart);

               if (!normDayDate || !normEndOnDate || !normStart) return false; // Invalid dates

               // Occurrence must be on or after the start date's day
               const isOnOrAfterStartDay = normDayDate >= normStart;
               // Occurrence must be on or before the end date's day
               const isOnOrBeforeEndDay = normDayDate <= normEndOnDate;

               return isOnOrAfterStartDay && isOnOrBeforeEndDay;

          }
          // Add 'after' end condition check here - this is the trickiest in a per-day predicate.
          // It might require calculating which occurrence number 'dayDate' would be if it were one,
          // and checking if that number is <= endAfterOccurrences.

          // If endType is 'never' or not handled here, the dateRuleMatches result is the final result.
          return dateRuleMatches;
      };
      */
      // Note: Implementing the 'after N occurrences' end condition check efficiently within a simple per-day predicate is complex.
      // An alternative is to generate the required number of occurrences upfront and store them or check against the generated list.


      // Call rowRender, passing the correctly defined predicate function
      // Assuming rowRender modifies eventData or prepares data for rendering based on the predicate
      rowRender(isOccurrenceOnDay, weekDates, eventData, operations, showModal, eventData, eventData);

      // Return the event data object, potentially modified by rowRender
      return eventData;

  }).filter(item => item !== null); // Keep filter if rowRender or map might return null

  // Make sure helper functions (normalizeDateToStartOfDay, getDayDifference,
  // isDailyOccurrence, isWeeklyOccurrence, isSameDay) are defined and accessible.
  

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
  ]
  
  for (const dayName in weekDates) {
      if (Object.hasOwnProperty.call(weekDates, dayName)) {
           const dayDate = weekDates[dayName];
           columns.push({
              title: dayName + " " + dayDate.getDate(),
              dataIndex: dayName,
              key: dayName,
           })
      }
  }
  
  
  
  
  

  return (<>
      <Table dataSource={dataSource} columns={columns} />
  </>)
}
