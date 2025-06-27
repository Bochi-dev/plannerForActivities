import {
    isSameDay, normalizeDateToStartOfDay, // Needed for date comparisons
    isTimeInRange, // Needed for checking if an event's time overlaps with an hour slot
    // You'll need a utility function that encapsulates the repeat logic from PlannerTable.jsx:
    shouldEventOccurOnDay // Takes event object and dayDate, returns boolean
} from './'; // Adjust the import path



/**
 * Structures events by day and hour for the card view.
 * @param {Array<Object>} allEvents - The full list of all event objects.
 * @param {Object} weekDates - Object mapping day names (e.g., "Sunday") to Date objects for the displayed week.
 * @param {Array<Object>} allRatings - The full list of all rating objects.
 * @returns {Object} An object structured by day and hour, containing relevant events with ratings attached for that day.
 */
export const structureEventsForCardView = (allEvents, weekDates, allRatings) => {
    const eventsByDayAndHour = {};

    // 1. Initialize the structure: Create entries for each day and hour with empty arrays
    for (const dayName in weekDates) {
        // Ensure we only process properties directly on the object
        if (Object.hasOwnProperty.call(weekDates, dayName)) {
            eventsByDayAndHour[dayName] = {
                allday: [] // Add a category for all-day events for this day
            };
            for (let i = 0; i < 24; i++) {
                eventsByDayAndHour[dayName][i] = []; // Initialize hourly arrays (0 through 23)
            }
        }
    }

    // 2. Iterate through each event and place it in the correct slot(s)
    allEvents.forEach(event => {
        const eventStart = new Date(event.STARTDATE);
        // Ensure eventEnd is a valid Date object, defaulting to eventStart if necessary
        const eventEnd = (event.ENDDATE && new Date(event.ENDDATE)) || new Date(eventStart);

        // Iterate through each day in the displayed week to check for occurrences
        for (const dayName in weekDates) {
            if (Object.hasOwnProperty.call(weekDates, dayName)) {
                const dayDate = weekDates[dayName];
                const startOfToday = normalizeDateToStartOfDay(dayDate); // Start of the current day's date at midnight

                // --- Repurposed Logic: Check if the event occurs on THIS specific day ---
                // This function should contain the repeat logic (daily, weekly, etc.)
                // and end condition checks (onDate, after).
                const occursOnDay = shouldEventOccurOnDay(event, dayDate);

                if (occursOnDay) {
                    // --- Logic to determine Time Slot if it occurs on this day ---

                    // Find the rating for this event on this specific day
                    // This assumes a rating is tied to an EVENTID and a specific DATE it occurred on
                    const ratingForDay = allRatings.find(r =>
                        (r && r.DATE && isSameDay(dayDate, new Date(r.DATE))) && r.EVENTID === event.ID
                    );

                    // Create a new event object copy with the rating attached for this day's rendering
                    const eventWithRating = {
                        ...event, // Copy all original event properties
                        ratingForDay: ratingForDay // Attach the rating found for this specific day
                    };


                    if (event.ALLDAY) {
                        // If it's an all-day event, add it to the 'allday' category for this day
                        eventsByDayAndHour[dayName].allday.push(eventWithRating);
                    } else {
                        // If it's a timed event, find which hourly slot(s) it belongs to for this day

                        // Need to compare the event's specific time (from eventStart/eventEnd)
                        // against the time range of each hour slot [hourStart, hourEnd).
                        // Crucially, consider the time relative to the start of the current dayDate.

                        // Iterate through each hour slot of the day (0 to 23)
                        for (let i = 0; i < 24; i++) {
                            const hourStart = new Date(startOfToday);
                            hourStart.setHours(i, 0, 0, 0); // Start time of the current hour slot

                            const hourEnd = new Date(startOfToday);
                            hourEnd.setHours(i + 1, 0, 0, 0); // End time of the current hour slot (exclusive)

                            // Check if the event's time range (eventStart to eventEnd)
                            // overlaps with the current hour slot time range (hourStart to hourEnd).
                            // This overlap check needs to correctly handle events that might span across midnight
                            // if your event data model allows that and should be displayed in multiple hour slots.

                            // Simplistic overlap check for events assumed to be within the same day:
                            // (Event Start Time < Hour Slot End Time) AND (Event End Time > Hour Slot Start Time)
                            // You might use your existing isTimeInRange helper if it works with Date objects,
                            // or implement the check directly.
                            const eventStartTime = eventStart.getTime();
                            const eventEndTime = eventEnd.getTime();
                            const hourStartTime = hourStart.getTime();
                            const hourEndTime = hourEnd.getTime();

                            // Check for overlap: Event starts before hour ends AND event ends after hour starts
                            const overlaps = eventStartTime < hourEndTime && eventEndTime > hourStartTime;


                            if (overlaps) {
                                // If it overlaps, add the event (with rating) to the array for this hour slot for this day
                                eventsByDayAndHour[dayName][i].push(eventWithRating);
                            }
                        }
                    }
                }
            }
        }
    });

    // 3. Optional: Sort events within each time slot (e.g., by start time) for better presentation
    for (const dayName in eventsByDayAndHour) {
         if (Object.hasOwnProperty.call(eventsByDayAndHour, dayName)) {
             // Sort all-day events
             eventsByDayAndHour[dayName].allday.sort((a, b) => new Date(a.STARTDATE) - new Date(b.STARTDATE));

             // Sort events in each hourly slot
             for (let i = 0; i < 24; i++) {
                  eventsByDayAndHour[dayName][i].sort((a, b) => new Date(a.STARTDATE) - new Date(b.STARTDATE));
             }
         }
     }


    return eventsByDayAndHour; // Return the structured data
};
