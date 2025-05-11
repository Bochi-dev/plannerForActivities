import { useState } from 'react';
import { Badge, Modal, Button, Calendar } from 'antd';
import { PlannerForm, PlannerTable, TableSlotsForm, PlannerCard, PlannerEditForm } from "../../components"
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


export const Planner = ({operations}) => {
  
  const today = new Date()
  const month = today.getMonth()
  const day = today.getDay()
  const diff = today.getDate() - (day + 1) + (day === 0 ? -6 : 1)
  const sunday = new Date(today.setDate(diff))

  const saturday = new Date(sunday)
  saturday.setDate(sunday.getDate() + 6)
  
  const weekDates = {
    Sun: sunday,
    Mon: addToDate(sunday, 1),
    Tue: addToDate(sunday, 2),
    Wed: addToDate(sunday, 3),
    Thu: addToDate(sunday, 4),
    Fri: addToDate(sunday, 5),
    // If 'saturday' is guaranteed to be exactly 6 days after 'sunday', you could
    // calculate it here: saturday: addToDate(sunday, 6), but using the potentially
    // pre-defined 'saturday' variable matches the original logic more closely.
    Sat: saturday
  };
  
  const [editId, setEditId] = useState(null)
  const [formPage, setFormPage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [events, setEvents] = operations.eventsOperations
  
  const showModal = (num, props) => {
    setFormPage(num)
    console.log(props)
    if (typeof props !== "undefined"){
        if (typeof props["id"] !== "undefined"){
            setEditId(props["id"])
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

  
  
  return (<>
    <Button type="primary" onClick={() => { showModal(0) }}>Add Event</Button>
    <h1>{monthDictionary[month]}</h1>
    <PlannerTable operations={operations} sunday={sunday} saturday={saturday} showModal={showModal} weekDates={weekDates}/>
    <PlannerCard operations={operations} sunday={sunday} saturday={saturday} showModal={showModal} />
    
    <Modal title="Add Event" open={isModalOpen} footer={[]} onCancel={handleCancel} onOk={handleOk}>
      {(formPage === 0 ) ? <PlannerForm operations={operations} handleOk={handleOk}/> : <></>}
      {(formPage === 1 ) ? <TableSlotsForm/> : <></>}
      {(formPage === 2 ) ? <PlannerEditForm 
        operations={operations} 
        editId={editId} 
        onSave={saveEditedEvent}
        onCancel
      /> : <></>}
      
    </Modal>
  </>)
};
