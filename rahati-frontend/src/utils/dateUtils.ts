/**
 * Format a date string to a human-readable format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "May 15, 2024")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

/**
 * Format a date and time string to a human-readable format
 * @param dateTimeString - ISO date-time string
 * @returns Formatted date-time string (e.g., "May 15, 2024, 10:00 AM")
 */
export const formatDateTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};

/**
 * Format a time string to a human-readable format
 * @param timeString - ISO date-time string
 * @returns Formatted time string (e.g., "10:00 AM")
 */
export const formatTime = (timeString: string): string => {
  const date = new Date(timeString);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};

/**
 * Calculate the duration between two date-time strings
 * @param startDateTime - ISO start date-time string
 * @param endDateTime - ISO end date-time string
 * @returns Duration in minutes
 */
export const calculateDurationInMinutes = (startDateTime: string, endDateTime: string): number => {
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);
  const durationMs = end.getTime() - start.getTime();
  return Math.round(durationMs / (1000 * 60));
};

/**
 * Check if a date is in the past
 * @param dateString - ISO date string
 * @returns Boolean indicating if the date is in the past
 */
export const isDateInPast = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

/**
 * Check if a date-time is in the past
 * @param dateTimeString - ISO date-time string
 * @returns Boolean indicating if the date-time is in the past
 */
export const isDateTimeInPast = (dateTimeString: string): boolean => {
  const dateTime = new Date(dateTimeString);
  const now = new Date();
  return dateTime < now;
};

/**
 * Get a date string in YYYY-MM-DD format
 * @param date - Date object or ISO date string
 * @returns Date string in YYYY-MM-DD format
 */
export const getFormattedDateString = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

/**
 * Get a date-time string in YYYY-MM-DDTHH:MM format (for datetime-local inputs)
 * @param dateTime - Date object or ISO date-time string
 * @returns Date-time string in YYYY-MM-DDTHH:MM format
 */
export const getFormattedDateTimeString = (dateTime: Date | string): string => {
  const dt = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
  return dt.toISOString().slice(0, 16);
};
