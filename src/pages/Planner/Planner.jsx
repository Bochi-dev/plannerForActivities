import { useState, useEffect } from 'react';
import { Badge, Modal, Button, Calendar, Flex, Switch } from 'antd';
import { PlannerForm, PlannerTable, TableSlotsForm, PlannerCard, PlannerEditForm, TableSlotsFormEdit } from "../../components"
import { addToDate, saveEventsToLocalStorage } from "../../tools"
const monthDictionary = {
  "0": "January",
  "1": "February",
  "2": "March",
  "3": "April",
  "4": "May",
  "5": "June",
  "6": "July",
  "7": "August",
  "8": "September",
  "9": "October",
  "10": "November",
  "11": "December"
};

const getStartOfWeek = (date) => {
  const d = new Date(date); // Create a copy to avoid mutating the original date
  const dayOfWeek = d.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  const diff = dayOfWeek; // Number of days to subtract to get to Sunday
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0); // Set time to midnight for consistent date comparisons
  return d;
};


export const Planner = ({operations}) => {
  const [displayedWeekStart, setDisplayedWeekStart] = useState(() => {
    // Initialize state with the start of the *current* week when the component mounts
    return getStartOfWeek(new Date());
  });

  
  
  // Function to navigate to the previous week
  const goToPreviousWeek = () => {
    // Use the functional update form of setDisplayedWeekStart
    // to ensure you are calculating based on the absolute latest state
    setDisplayedWeekStart(prevWeekStart => {
      const newWeekStart = new Date(prevWeekStart); // Create a copy of the current week's start date
      newWeekStart.setDate(prevWeekStart.getDate() - 7); // Subtract 7 days to get the previous week's start
      // newWeekStart's time will automatically be midnight because prevWeekStart was set to midnight
      return newWeekStart; // Update the state with the new date
    });
  };

  // Function to navigate to the next week (optional, for completeness)
  const goToNextWeek = () => {
     setDisplayedWeekStart(prevWeekStart => {
       const newWeekStart = new Date(prevWeekStart); // Create a copy
       newWeekStart.setDate(prevWeekStart.getDate() + 7); // Add 7 days to get the next week's start
       return newWeekStart;
     });
   };
  
  
//  const today = new Date()
//  const [today, setToday] = useState(new Date())
//  console.log(today)
  const month = displayedWeekStart.getMonth()
//  const day = today.getDay()
//  const diff = today.getDate() - (day + 1) + (day === 0 ? -6 : 1)
//  const sunday = new Date(today.setDate(diff))

  const saturday = new Date(displayedWeekStart)
  saturday.setDate(displayedWeekStart.getDate() + 6)
  
  const weekDates = {
    Sun: displayedWeekStart,
    Mon: addToDate(displayedWeekStart, 1),
    Tue: addToDate(displayedWeekStart, 2),
    Wed: addToDate(displayedWeekStart, 3),
    Thu: addToDate(displayedWeekStart, 4),
    Fri: addToDate(displayedWeekStart, 5),
    // If 'saturday' is guaranteed to be exactly 6 days after 'sunday', you could
    // calculate it here: saturday: addToDate(sunday, 6), but using the potentially
    // pre-defined 'saturday' variable matches the original logic more closely.
    Sat: saturday
  };
  
  const [eventId, setEventId] = useState(null)
  const [ratingId, setRatingId] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  
  const [view, setView] = useState(true) 
  const [formPage, setFormPage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false); 
  
  
  const [events, setEvents] = operations.eventsOperations
  
  const showModal = (num, props) => {
    setFormPage(num)
    if (typeof props !== "undefined"){
        if (typeof props["eventId"] !== "undefined"){
            setEventId(props["eventId"])
        }
        if (typeof props["date"] !== "undefined"){
            setSelectedDate(props["date"])
        }
        if (typeof props["ratingId"] !== "undefined"){
            setRatingId(props["ratingId"])
        }    
    }
    setIsModalOpen(true);
  };
  
  const handleOk = () => {
    setIsModalOpen(false);
  };
  
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  
  
  const saveEditedEvent = (updatedEvent) => {
      // Use the functional update form of setEvents to ensure you're working with the latest state
      setEvents(prevEvents => {
          // Find the index of the event in the previous state array using its ID
          // findIndex is the correct method to find the index based on a condition
          const index = prevEvents.findIndex(event => event.ID === updatedEvent.ID);

          // Check if the event was found in the array
          if (index !== -1) {
              // Create a *new* array with the updated event at the correct position.
              // This is crucial for immutability in React state updates.
              const newEventsArray = [
                  ...prevEvents.slice(0, index), // Copy all events before the one being updated
                  updatedEvent,                     // Insert the updated event object
                  ...prevEvents.slice(index + 1) // Copy all events after the one being updated
              ];

              // Save the *newly created* array to local storage immediately after calculating it.
              // Calling save here ensures you are saving the exact array that setEvents will use.
              // For simple updates like this, calling inside the setter is acceptable.
              saveEventsToLocalStorage(newEventsArray);

              // Return the new array to update the component's state
              return newEventsArray;
          } else {
              // If the event ID was not found in the current state, log a warning.
              // This might indicate an issue (e.g., trying to save an event that was deleted).
              console.warn(`Attempted to save event with ID ${updatedEvent.ID}, but it was not found in the current events state.`);

              // In this case, no change was made to the events array.
              // We still call saveEventsToLocalStorage with the original array,
              // just to ensure consistency, although no data actually changed.
              saveEventsToLocalStorage(prevEvents);

              // Return the original array as no update occurred
              return prevEvents;
          }
      });
      
      handleOk()

      // Note: If you need to perform actions *after* the state has definitely been updated
      // (e.g., showing a success message that depends on the new state), you might need
      // to use a useEffect hook that watches the 'events' state, or pass a callback
      // to setEvents (though the latter is less common). For simple saving, calling
      // saveEventsToLocalStorage inside the setter as shown is a common and effective pattern.
  };
  
  const deleteEvent = (event) => {
    setEvents(prev => prev.filter(el.ID !== event.ID))
  }

  
  
  return (<>
    <Button type="primary" onClick={() => { showModal(0) }}>Add Event</Button>
    <Switch onChange={value => {
        setView(value)
    }}/>
    
    <Flex justify={"space-between"} align={"center"}>
        <Button icon={"<"} onClick={goToPreviousWeek}/>
        <h1>{monthDictionary[month]}</h1>
        <Button icon={">"} onClick={goToNextWeek}/>
    </Flex>
    
    {( !view && <>
        <PlannerTable operations={operations} sunday={displayedWeekStart} saturday={saturday} showModal={showModal} weekDates={weekDates}/>

    </>
    )}
    
    {( view && <>
        <PlannerCard operations={operations} sunday={displayedWeekStart} saturday={saturday} showModal={showModal} weekDates={weekDates}/>
    
    </> )}
    
    <Modal title="Add Event" open={isModalOpen} footer={[]} onCancel={handleCancel} onOk={handleOk}>
      {(formPage === 0 ) ? <PlannerForm operations={operations} handleOk={handleOk}/> : <></>}
      {(formPage === 1 ) ? <TableSlotsForm 
        operations={operations} 
        eventId={eventId} 
        selectedDate={selectedDate}
        handleOk={handleOk}
      /> : <></>}
      {(formPage === 2 ) ? <PlannerEditForm 
        operations={operations} 
        editId={eventId} 
        onSave={saveEditedEvent}
        onDelete={deleteEvent}
        onCancel={null}
        
      /> : <></>}
      {(formPage === 3 ) ? <TableSlotsFormEdit 
        operations={operations} 
        eventId={eventId} 
        selectedDate={selectedDate}
        ratingId={ratingId}
        handleOk={handleOk}
      /> : <></>}
      
    </Modal>
  </>)
};
