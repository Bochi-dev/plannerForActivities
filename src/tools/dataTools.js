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

// =======================================================================================================

// --- Local Storage Utility Functions for Event Ratings ---

// Define a key to use for storing your ratings in local storage.
// It's good practice to use a unique key to avoid conflicts.
const EVENT_RATINGS_STORAGE_KEY = 'my_app_event_ratings'; // You can change this key

/**
 * Saves the list of event ratings to local storage.
 * @param {Array<Object>} ratingsList - The array of rating objects to save.
 * Each object should have the structure: { ID, EVENTID, RATING, DATE }
 */
export const saveRatingsToLocalStorage = (ratingsList) => {
  try {
    // 1. Convert the JavaScript array of objects into a JSON string.
    const ratingsJsonString = JSON.stringify(ratingsList);

    // 2. Save the JSON string to local storage under the defined key.
    localStorage.setItem(EVENT_RATINGS_STORAGE_KEY, ratingsJsonString);

    console.log('Event ratings successfully saved to local storage.'); // Optional log
  } catch (error) {
    // Handle potential errors (e.g., storage full, user disabled cookies)
    console.error('Error saving event ratings to local storage:', error);
    // You might want to show a user-facing error message here
  }
};

/**
 * Loads the list of event ratings from local storage.
 * @returns {Array<Object>} The array of rating objects, or an empty array if none are found or loading fails.
 */
export const loadRatingsFromLocalStorage = () => {
  try {
    const ratingsJsonString = localStorage.getItem(EVENT_RATINGS_STORAGE_KEY);
    if (ratingsJsonString === null) {
      console.log('No event ratings found in local storage, starting with an empty list.');
      return [];
    }

    const ratingsList = JSON.parse(ratingsJsonString);

    if (!Array.isArray(ratingsList)) {
         console.error('Data loaded from local storage is not an array.', ratingsList);
         return [];
    }

    // --- Add this step to convert date strings back to Date objects ---
    const ratingsListWithDates = ratingsList.map(rating => {
        // Check if the rating object exists and has a DATE property that is a string.
        // The type check is important to avoid errors if the data format is unexpected.
        if (rating && typeof rating.DATE === 'string') {
            // Return a new object with the DATE string converted to a Date object.
            // Using the spread operator {...rating} ensures other properties are copied.
            return {
                ...rating,
                DATE: new Date(rating.DATE) // Convert the ISO string back to a Date object
            };
        }
        // If the DATE property is not a string (e.g., it was null, undefined, or already a Date),
        // or the object structure is unexpected, return the object as is.
        return rating;
    });
    // --- End of date conversion step ---


    console.log('Event ratings successfully loaded from local storage.');
    // Return the array where DATE strings have been converted to Date objects.
    return ratingsListWithDates;

  } catch (error) {
    console.error('Error loading or parsing event ratings from local storage:', error);
    // Return empty array if loading or parsing fails
    return [];
  }
};



