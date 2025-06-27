// This file encapsulates the core event occurrence logic.
// Make sure these helper functions are correctly imported from your main tools index,
// or directly from their respective files if you prefer.
import {
    isSameDay,          // Checks if two Date objects represent the same calendar day (ignoring time)
    isDailyOccurrence,  // Logic for daily repeating events
    isWeeklyOccurrence, // Logic for weekly repeating events
    normalizeDateToStartOfDay // Sets a Date object to midnight for consistent comparison
} from './'; // Assuming your 'tools' folder exports these from an index.js
                  // OR, you might import directly:
                  // import { isSameDay, isDailyOccurrence, ... } from './your_other_tools_file';


/**
 * Determines if a given event should occur on a specific calendar day
 * based on its start date, repeat settings, and end conditions.
 *
 * This function extracts and generalizes the predicate logic from PlannerTable.jsx's map loop.
 *
 * @param {Object} event - The full event object (e.g., from your 'events' state).
 * Expected properties: ID, STARTDATE, ENDDATE, REPEATSETTINGS (TYPE, INTERVAL, WEEKLYDAYS, ENDTYPE, ENDONDATE, ENDAFTEROCCURRENCES).
 * @param {Date} dayDate - The specific Date object for the day you are checking (e.g., Monday, May 17, 2025).
 * @returns {boolean} True if the event is scheduled to occur on `dayDate`, false otherwise.
 */
export const shouldEventOccurOnDay = (event, dayDate) => {
    // Basic validation
    if (!event || !dayDate || !event.STARTDATE) {
        return false;
    }

    const originalStart = new Date(event.STARTDATE);
    // Ensure originalStart is a valid date object
    if (isNaN(originalStart.getTime())) {
        console.warn("Invalid STARTDATE for event:", event.ID, event.TITLE);
        return false;
    }

    // Event cannot occur before its original start date
    if (normalizeDateToStartOfDay(dayDate).getTime() < normalizeDateToStartOfDay(originalStart).getTime()) {
        return false;
    }

    const repeatSettings = event.REPEATSETTINGS;
    const type = repeatSettings ? repeatSettings.TYPE : "NONE";
    const interval = repeatSettings ? repeatSettings.INTERVAL : 1; // Default interval to 1

    let doesMatchRepeatPattern = false; // Flag to indicate if it matches the repeating rule

    // --- Core Repeat Pattern Logic (extracted from PlannerTable.jsx) ---
    if (type === "NONE") {
        // Non-repeating event: occurs only on its single original start date's day
        doesMatchRepeatPattern = isSameDay(dayDate, originalStart);

    } else if (type === "DAILY") {
        // Daily repeating event: occurs if it's an 'interval' day from original start
        doesMatchRepeatPattern = isDailyOccurrence(originalStart, interval, dayDate);

    } else if (type === "WEEKLY") {
        // Weekly repeating event: occurs if it's on a selected day of the week and interval-week from start
        const weeklyDays = repeatSettings ? repeatSettings.WEEKLYDAYS : []; // e.g., [0, 2, 4] for Sun, Tue, Thu
        if (!Array.isArray(weeklyDays)) { // Safety check against malformed data
            return false;
        }
        doesMatchRepeatPattern = isWeeklyOccurrence(originalStart, interval, weeklyDays, dayDate);

    } else if (type === "MONTHLY") {
        // TODO: Implement MONTHLY repeat logic here.
        // This is more complex as monthly repeats can be "on the 15th" or "on the 3rd Tuesday".
        // You'll need to check if 'dayDate' matches the specific day/weekday of the month
        // and if it's the correct interval of months from the original start date.
        // Example sketch:
        // const repeatMonthDay = originalStart.getDate(); // If monthly on same day of month
        // const isCorrectDayOfMonth = dayDate.getDate() === repeatMonthDay;
        // const monthDiff = (dayDate.getFullYear() * 12 + dayDate.getMonth()) - (originalStart.getFullYear() * 12 + originalStart.getMonth());
        // doesMatchRepeatPattern = isCorrectDayOfMonth && (monthDiff % interval === 0);
        console.warn("MONTHLY repeat logic not implemented in shouldEventOccurOnDay.");
        doesMatchRepeatPattern = false; // Default to false until implemented
    } else if (type === "YEARLY") {
        // TODO: Implement YEARLY repeat logic here.
        // This would involve checking if 'dayDate' matches the original month and day,
        // and if it's the correct interval of years from the original start date.
        console.warn("YEARLY repeat logic not implemented in shouldEventOccurOnDay.");
        doesMatchRepeatPattern = false; // Default to false until implemented
    } else {
        // Handle any other unknown repeat types (or default to false)
        console.warn("Unknown repeat type:", type, "for event ID:", event.ID);
        doesMatchRepeatPattern = false;
    }

    // If the event doesn't even match the basic repeat pattern, it doesn't occur.
    if (!doesMatchRepeatPattern) {
        return false;
    }

    // --- End Condition Logic (extracted from PlannerTable.jsx's comments) ---
    const endType = repeatSettings ? repeatSettings.ENDTYPE : 'never';
    const endOnDate = (repeatSettings && repeatSettings.ENDONDATE) ? new Date(repeatSettings.ENDONDATE) : null;
    // const endAfterOccurrences = repeatSettings ? repeatSettings.ENDAFTEROCCURRENCES : null;

    if (endType === 'onDate' && endOnDate) {
        // Event should not occur on or after the specified end date
        // Normalize both dates to start of day for consistent comparison
        if (normalizeDateToStartOfDay(dayDate).getTime() > normalizeDateToStartOfDay(endOnDate).getTime()) {
            return false; // Day is after the end date
        }
    }
    // TODO: Implement 'after N occurrences' end condition (this is the most complex).
    // This typically requires a more advanced date calculation or pre-generating occurrences.
    // It's hard to determine "this is the 5th occurrence" for a given `dayDate` without context
    // of all previous occurrences.

    // If it matches the pattern and passes all end conditions, it occurs on this day.
    return true;
};
