import { Table } from "antd"
import { addToDate, isTimeInRange, normalizeDateToStartOfDay } from "../../tools"
import { PlannerTableSlots } from "../../components"




export const PlannerTable = ({operations, sunday, saturday, showModal}) => {
  const weekDates = {
    sunday: sunday,
    monday: addToDate(sunday, 1),
    tuesday: addToDate(sunday, 2),
    wednesday: addToDate(sunday, 3),
    thursday: addToDate(sunday, 4),
    friday: addToDate(sunday, 5),
    // If 'saturday' is guaranteed to be exactly 6 days after 'sunday', you could
    // calculate it here: saturday: addToDate(sunday, 6), but using the potentially
    // pre-defined 'saturday' variable matches the original logic more closely.
    saturday: saturday
  };

  const [events, setEvents] = operations.eventsOperations
  const dataSource = events.map(el => {
    const start = el.STARTDATE;
    const end = el.ENDDATE;

    // Handle cases where date transformation fails
    if (!start || !end) {
        console.warn("Skipping event due to invalid start or end date:", el);
        return null; // Or return a default structure, depending on requirements
    }

    const eventData = {
        name: el.TITLE,
    };

    // 2. Iterate through the pre-calculated week dates to populate the daily status
    for (const dayName in weekDates) {
        // Ensure we only process properties directly on the object
        if (Object.hasOwnProperty.call(weekDates, dayName)) {
          const dayDate = weekDates[dayName];
          eventData[dayName] = isTimeInRange(start, normalizeDateToStartOfDay(dayDate), end) ? <PlannerTableSlots operations={operations} date={dayDate} star={null} showModal={showModal}/> : "NO";
        }
    }

    return eventData;

    // 3. Optional: Filter out any events that returned null if date transformation failed
  }).filter(item => item !== null);

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
