/**
 * Utility functions for locale-aware date and time handling
 * 
 * @author Nicolás Sabogal
 */

/**
 * Get the user's locale
 * 
 * @returns {string} The user's locale in BCP 47 format (e.g., "en-US")
 * @author Nicolás Sabogal
 */
export const getUserLocale = (): string => {
  return navigator.language || 'es-CO'; // Default to 'es-CO' if navigator.language is not available
}

/**
 * Get the user's timezone
 * 
 * @returns {string} The user's timezone in IANA format (e.g., "America/New_York")
 * @author Nicolás Sabogal
 */
export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Convert date and time to ISO string with proper locale handling and timezone
 * 
 * @param {string} date - The date in 'YYYY-MM-DD' format
 * @param {string} time - The time in 'HH:mm:ss' format
 * @return {string} The ISO string in 'YYYY-MM-DDTHH:mm:ss±HH:MM' format
 * @author Nicolás Sabogal
 */
export const createISOStringFromDateTime = (date: string, time: string): string => {
  if (!date || !time) return '';
  
  try {
    // Create date object with timezone awareness
    const dateTimeString = `${date} ${time}`;
    
    // Parse the date/time in the user's timezone
    const localDateTime = new Date(dateTimeString);
    
    // Create timezone offset string
    const offset = localDateTime.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offset) / 60);
    const offsetMinutes = Math.abs(offset) % 60;
    const offsetSign = offset <= 0 ? '+' : '-';
    const offsetString = `${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
    
    const ISOString = `${localDateTime.getFullYear()}-${(localDateTime.getMonth() + 1).toString().padStart(2, '0')}-${localDateTime.getDate().toString().padStart(2, '0')}T${localDateTime.getHours().toString().padStart(2, '0')}:${localDateTime.getMinutes().toString().padStart(2, '0')}:${localDateTime.getSeconds().toString().padStart(2, '0')}${offsetString}`;

    return ISOString;
  } catch (error) {
    console.error('Error creating zoned ISO string:', error);
    return '';
  }
};

/**
 * Create ISO string with default time based on date key and locale with timezone
 * Using the default time of '00:00:00' for start dates and '23:59:59' for end dates.
 * 
 * @param {string} date - The date in 'YYYY-MM-DD' format
 * @param {boolean} isStartDate - True if this is a start date, false for end date
 * @return {string} The ISO string in 'YYYY-MM-DDTHH:mm:ss±HH:MM' format
 * @author Nicolás Sabogal
 */
export const createISOStringFromDate = (date: string, isStartDate: boolean): string => {
  if (!date) return '';
  
  try {
    // Use locale-appropriate default times
    const defaultTime = isStartDate ? '00:00:00' : '23:59:59';
    return createISOStringFromDateTime(date, defaultTime);
  } catch (error) {
    console.error('Error creating zoned ISO string from date:', error);
    return '';
  }
};

/**
 * Extract date part from ISO string (handles both zoned and UTC)
 * 
 * @param {string} isoString - The ISO string to extract date from
 * @returns {string} The date in 'YYYY-MM-DD' format
 * @author Nicolás Sabogal
 */
export const getDateFromISO = (isoString?: string): string => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    const timezone = getUserTimezone();
    // Format date in user's timezone
    return date.toLocaleDateString('sv-SE', { timeZone: timezone });
  } catch (error) {
    console.error('Error extracting date from zoned ISO string:', error);
    return '';
  }
};

/**
 * Extract time part from ISO string (handles both zoned and UTC)
 */
export const getTimeFromISO = (isoString?: string): string => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    const timezone = getUserTimezone();
    // Format time in user's timezone
    return date.toLocaleTimeString('sv-SE', { 
      timeZone: timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error extracting time from zoned ISO string:', error);
    return '';
  }
};
