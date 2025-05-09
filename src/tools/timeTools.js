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


/**
   * Calculates the difference in full days between two dates, ignoring time.
   * Returns NaN if inputs are invalid.
   * @param {Date} date1
   * @param {Date} date2
   * @returns {number} The difference in full days (date1 - date2).
   */
export const getDayDifference = (date1, date2) => {
      const norm1 = normalizeDateToStartOfDay(date1);
      const norm2 = normalizeDateToStartOfDay(date2);

      if (!norm1 || !norm2) {
          return NaN; // Cannot compare invalid dates
      }

      // Calculate the time difference in milliseconds
      const diffTime = norm1.getTime() - norm2.getTime();

      // Convert to days. Use Math.round to handle potential floating point issues
      // due to timezones or daylight saving across midnight, although normalizing should prevent most.
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      return diffDays;
  };
  
/**
* Checks if a given date falls on a daily repeat occurrence based on start date and interval.
* @param {Date} startDate The original start date of the repetition.
* @param {number} interval The daily interval (must be >= 1).
* @param {Date} dateToCheck The date to check for occurrence.
* @returns {boolean} True if dateToCheck is a daily occurrence, false otherwise.
*/
export const isDailyOccurrence = (startDate, interval, dateToCheck) => {
  if (interval < 1 || !startDate || !dateToCheck) {
      // Invalid interval or dates
      return false;
  }

  // Calculate the difference in days between the date to check and the start date
  const dayDiff = getDayDifference(dateToCheck, startDate);

  // The dateToCheck must be on or after the startDate, AND
  // the number of days difference must be perfectly divisible by the interval.
  return dayDiff >= 0 && dayDiff % interval === 0;
};

/**
* Checks if a given date falls on a weekly repeat occurrence based on start date, interval, and selected weekdays.
* @param {Date} startDate The original start date of the repetition.
* @param {number} interval The weekly interval (must be >= 1).
* @param {number[]} weeklyDays Array of selected days of the week (0-6).
* @param {Date} dateToCheck The date to check for occurrence.
* @returns {boolean} True if dateToCheck is a weekly occurrence, false otherwise.
*/
export const isWeeklyOccurrence = (startDate, interval, weeklyDays, dateToCheck) => {
  if (interval < 1 || !startDate || !dateToCheck || !Array.isArray(weeklyDays) || weeklyDays.length === 0) {
      // Invalid interval, dates, or weeklyDays array
       return false;
  }

  // First, check if the day of the week of dateToCheck is one of the selected days
  const dayOfWeekToCheck = dateToCheck.getDay(); // 0 for Sunday, 6 for Saturday
  if (!weeklyDays.includes(dayOfWeekToCheck)) {
      return false; // The event does not occur on this specific day of the week
  }

  // Second, check if this specific week is one of the repeat weeks based on the interval.
  // We need to find the difference in weeks between dateToCheck's week and startDate's week.
  // Normalize both dates to the start of their respective weeks (Sunday at midnight) to compare weeks.
  const startOfWeekStart = new Date(startDate);
  startOfWeekStart.setHours(0, 0, 0, 0);
  startOfWeekStart.setDate(startOfWeekStart.getDate() - startOfWeekStart.getDay()); // Adjust to Sunday of start week

  const startOfWeekCheck = new Date(dateToCheck);
  startOfWeekCheck.setHours(0, 0, 0, 0);
  startOfWeekCheck.setDate(startOfWeekCheck.getDate() - startOfWeekCheck.getDay()); // Adjust to Sunday of check week

  const dayDiffBetweenSundays = getDayDifference(startOfWeekCheck, startOfWeekStart);

  // The dateToCheck's week must be on or after the startDate's week, AND
  // the number of days difference between their Sundays must be divisible by (interval * 7 days).
  const totalDayInterval = interval * 7;
  return dayDiffBetweenSundays >= 0 && dayDiffBetweenSundays % totalDayInterval === 0;
};


/**
 * Checks if two Date objects represent the same day (year, month, day), ignoring time.
 * @param {Date} date1 The first Date object.
 * @param {Date} date2 The second Date object.
 * @returns {boolean} True if the dates are the same day, false otherwise or if inputs are invalid.
 */
export function isSameDay(date1, date2) {
    const norm1 = normalizeDateToStartOfDay(date1);
    const norm2 = normalizeDateToStartOfDay(date2);

    // If normalization failed for either date, they can't be the same valid day
    if (!norm1 || !norm2) {
        return false;
    }

    return norm1.getTime() === norm2.getTime();
}

/**
 * Checks if the first Date object is before the second Date object, ignoring time.
 * @param {Date} date1 The first Date object.
 * @param {Date} date2 The second Date object.
 * @returns {boolean} True if date1 is before date2 (by day), false otherwise or if inputs are invalid.
 */
export function isBeforeDay(date1, date2) {
    const norm1 = normalizeDateToStartOfDay(date1);
    const norm2 = normalizeDateToStartOfDay(date2);

     if (!norm1 || !norm2) {
        return false;
    }

    return norm1.getTime() < norm2.getTime();
}

/**
 * Checks if the first Date object is after the second Date object, ignoring time.
 * @param {Date} date1 The first Date object.
 * @param {Date} date2 The second Date object.
 * @returns {boolean} True if date1 is after date2 (by day), false otherwise or if inputs are invalid.
 */
export function isAfterDay(date1, date2) {
    const norm1 = normalizeDateToStartOfDay(date1);
    const norm2 = normalizeDateToStartOfDay(date2);

     if (!norm1 || !norm2) {
        return false;
    }

    return norm1.getTime() > norm2.getTime();
}

/**
 * Checks if the first Date object is on or before the second Date object, ignoring time.
 * @param {Date} date1 The first Date object.
 * @param {Date} date2 The second Date object.
 * @returns {boolean} True if date1 is on or before date2 (by day), false otherwise or if inputs are invalid.
 */
export function isOnOrBeforeDay(date1, date2) {
    const norm1 = normalizeDateToStartOfDay(date1);
    const norm2 = normalizeDateToStartOfDay(date2);

     if (!norm1 || !norm2) {
        return false;
    }

    return norm1.getTime() <= norm2.getTime();
}

/**
 * Checks if the first Date object is on or after the second Date object, ignoring time.
 * @param {Date} date1 The first Date object.
 * @param {Date} date2 The second Date object.
 * @returns {boolean} True if date1 is on or after date2 (by day), false otherwise or if inputs are invalid.
 */
export function isOnOrAfterDay(date1, date2) {
    const norm1 = normalizeDateToStartOfDay(date1);
    const norm2 = normalizeDateToStartOfDay(date2);

     if (!norm1 || !norm2) {
        return false;
    }

    return norm1.getTime() >= norm2.getTime();
}


