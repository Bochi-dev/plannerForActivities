export const transformToDateFromAntd = (date) => {
    return new Date(date["$d"])
}

export const addToDate = (date, num) => {
    const newDate = new Date(date)
    const diff = newDate.getDate() + (num)
    return new Date(newDate.setDate(diff))
}

export const isTimeInRange = (start, date, end) => {
    return ((date >= start) && (date <= end))
}


/**
 * Normalizes a Date object to the start of the day (midnight) in the local timezone.
 * Returns a new Date object, does not modify the original.
 * Handles invalid Date objects.
 * @param {Date} date The input Date object.
 * @returns {Date | null} A new Date object set to the start of the day, or null if the input is invalid.
 */
export const normalizeDateToStartOfDay = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        // Return null or throw an error for invalid input
        console.error("Invalid Date object provided to normalizeDateToStartOfDay:", date);
        return null;
    }
    // Create a copy to avoid modifying the original date object
    const normalized = new Date(date.getTime());
    // Set hours, minutes, seconds, and milliseconds to zero
    normalized.setHours(0, 0, 0, 0);
    return normalized;
}


