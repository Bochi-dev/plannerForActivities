/**
 * The key used to store events in localStorage.
 */
const LOCAL_STORAGE_EVENTS_KEY = 'myEvents'; // Use a unique key for your application

/**
 * Saves an array of event objects to localStorage.
 * Events are serialized to a JSON string before saving.
 * @param {Array<Object>} events - An array of event objects to save.
 */
export const saveEventsToLocalStorage = (events) => {
  // Check if localStorage is available in the browser environment
  if (typeof window === 'undefined' || !window.localStorage) {
    console.warn('localStorage is not available.');
    return;
  }

  try {
    // Serialize the events array into a JSON string
    const eventsJson = JSON.stringify(events);

    // Save the JSON string to localStorage under the defined key
    localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, eventsJson);

    console.log('Events saved to localStorage.');

  } catch (error) {
    console.error('Error saving events to localStorage:', error);
    // Handle potential errors, e.g., storage limit exceeded
    if (error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Cannot save more data.');
      // Optionally alert the user or implement a data cleanup strategy
    }
  }
};

/**
 * Loads event objects from localStorage.
 * The stored JSON string is parsed back into a JavaScript array of objects.
 * Date strings are converted back into Date objects.
 * @returns {Array<Object>} An array of event objects, or an empty array if no data is found or an error occurs.
 */
export const loadEventsFromLocalStorage = () => {
  // Check if localStorage is available
  if (typeof window === 'undefined' || !window.localStorage) {
    console.warn('localStorage is not available.');
    return []; // Return empty array if not available
  }

  try {
    // Retrieve the JSON string from localStorage
    const eventsJson = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);

    // If no data is found, return an empty array
    if (eventsJson === null) {
      console.log('No events found in localStorage.');
      return [];
    }

    // Parse the JSON string back into a JavaScript array
    const events = JSON.parse(eventsJson);

    // IMPORTANT: JSON.parse converts Date objects to strings.
    // You need to manually convert date strings back into Date objects.
    // Assuming your event objects have STARTDATE and ENDDATE properties that were originally Date objects.
    const eventsWithDates = events.map(event => {
      // Check if STARTDATE exists and is a string, then convert
      if (event.STARTDATE && typeof event.STARTDATE === 'string') {
        event.STARTDATE = new Date(event.STARTDATE);
        // Check if the conversion resulted in a valid Date
        if (isNaN(event.STARTDATE.getTime())) {
             console.warn(`Invalid STARTDATE found for event ID ${event.ID || 'unknown'}:`, event.STARTDATE);
             // Handle invalid date, maybe set to null or a default
             event.STARTDATE = null;
        }
      }
       // Check if ENDDATE exists and is a string, then convert
      if (event.ENDDATE && typeof event.ENDDATE === 'string') {
        event.ENDDATE = new Date(event.ENDDATE);
         // Check if the conversion resulted in a valid Date
        if (isNaN(event.ENDDATE.getTime())) {
             console.warn(`Invalid ENDDATE found for event ID ${event.ID || 'unknown'}:`, event.ENDDATE);
             // Handle invalid date
             event.ENDDATE = null;
        }
      }
      // If you have other Date properties (like endOnDate in REPEATSETTINGS), convert those too.
      if (event.REPEATSETTINGS && event.REPEATSETTINGS.endOnDate && typeof event.REPEATSETTINGS.endOnDate === 'string') {
           event.REPEATSETTINGS.endOnDate = new Date(event.REPEATSETTINGS.endOnDate);
            if (isNaN(event.REPEATSETTINGS.endOnDate.getTime())) {
                console.warn(`Invalid REPEATSETTINGS.endOnDate found for event ID ${event.ID || 'unknown'}:`, event.REPEATSETTINGS.endOnDate);
                event.REPEATSETTINGS.endOnDate = null;
           }
      }


      return event; // Return the modified event object
    });

    console.log('Events loaded from localStorage.');
    return eventsWithDates; // Return the array with Date objects restored

  } catch (error) {
    console.error('Error loading or parsing events from localStorage:', error);
    // If parsing fails (e.g., corrupted data), you might want to clear the invalid data
    // clearEventsFromLocalStorage(); // Uncomment if you want to clear on parse error
    return []; // Return empty array in case of error
  }
};

/**
 * Removes the event data from localStorage.
 */
export const clearEventsFromLocalStorage = () => {
  // Check if localStorage is available
  if (typeof window === 'undefined' || !window.localStorage) {
    console.warn('localStorage is not available.');
    return;
  }

  try {
    // Remove the item associated with the events key
    localStorage.removeItem(LOCAL_STORAGE_EVENTS_KEY);
    console.log('Events cleared from localStorage.');
  } catch (error) {
    console.error('Error clearing events from localStorage:', error);
  }
};

// --- How to integrate with your React component ---

// 1. When your application or component loads (e.g., in a useEffect hook with an empty dependency array []),
//    load the events:
/*
import React, { useEffect, useState } from 'react';
import { loadEventsFromLocalStorage, saveEventsToLocalStorage } from './localStorageUtils'; // Assuming you save these functions in a file

const YourAppOrComponent = () => {
    const [events, setEvents] = useState([]); // State to hold your events

    useEffect(() => {
        const storedEvents = loadEventsFromLocalStorage();
        setEvents(storedEvents); // Load events when the component mounts
    }, []); // Empty dependency array means this runs once on mount

    // ... rest of your component logic ...

    // 2. When you add, edit, or delete an event (e.g., in your onFinish handler after adding a new event):
    const onFinish = (values) => {
        // ... process form values into a new event object ...
        const newEvent = {
            ID: Date.now(), // Simple ID generation, consider a more robust method
            TITLE: values.TITLE,
            // ... map other form values ...
            STARTDATE: values.RANGEDATE[0].toDate(), // Convert dayjs to Date if using Antd pickers
            ENDDATE: values.RANGEDATE[1].toDate(),
            ALLDAY: values.ALLDAY,
            REPEATSETTINGS: {
                 type: values.TYPE,
                 interval: values.INTERVAL,
                 weeklyDays: values.weeklyDays, // Assuming you added a name="weeklyDays" Form.Item
                 // ... map other repeat settings ...
                 endType: values.ENDTYPE,
                 endAfterOccurrences: values.ENDAFTEROCCURRENCES,
                 endOnDate: values.ENDONDATE ? values.ENDONDATE.toDate() : null, // Convert dayjs to Date
            },
            STARS: 0,
            DONE: false,
        };

        // Update the state with the new event
        const updatedEvents = [...events, newEvent];
        setEvents(updatedEvents);

        // 3. Save the updated array back to localStorage
        saveEventsToLocalStorage(updatedEvents);

        // ... reset form fields ...
        form.resetFields();
        setRepeat('NONE');
        setRepeatEnd('NEVER');
        setAllDay(false);
        setSelectedDays([]); // Reset state for WeekCheckBoxesFormPart

        // Optional: Show success message
    };

    // ... rest of your component rendering ...
};
*/

