import { formatDistanceToNow } from "date-fns";

/**
 * Safely format a date value to distance from now
 * @param {string|Date} dateValue - The date value to format
 * @param {Object} options - Options to pass to formatDistanceToNow
 * @returns {string} - Formatted distance string or fallback
 */
export const safeFormatDistanceToNow = (dateValue, options = {}) => {
  try {
    if (!dateValue) return 'Unknown time';
    
    const date = new Date(dateValue);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date value:', dateValue);
      return 'Unknown time';
    }
    
    return formatDistanceToNow(date, options);
  } catch (error) {
    console.warn('Date formatting error:', error, 'for value:', dateValue);
    return 'Unknown time';
  }
};

/**
 * Safely format a date to a readable string
 * @param {string|Date} dateValue - The date value to format
 * @returns {string} - Formatted date string or fallback
 */
export const safeFormatDate = (dateValue) => {
  try {
    if (!dateValue) return 'Unknown date';
    
    const date = new Date(dateValue);
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid date value:', dateValue);
      return 'Unknown date';
    }
    
    return date.toLocaleDateString();
  } catch (error) {
    console.warn('Date formatting error:', error, 'for value:', dateValue);
    return 'Unknown date';
  }
};
