/**
 * Format a currency amount
 * @param amount - Number to format as currency
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted currency string (e.g., "$100.00")
 */
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format a phone number to a readable format
 * @param phone - Phone number string
 * @returns Formatted phone number (e.g., "(555) 123-4567")
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a valid US phone number
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  // If not a standard format, return the original
  return phone;
};

/**
 * Capitalize the first letter of each word in a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export const capitalizeWords = (str: string): string => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format a status string to be more readable
 * @param status - Status string (e.g., "in_progress")
 * @returns Formatted status string (e.g., "In Progress")
 */
export const formatStatus = (status: string): string => {
  return capitalizeWords(status.replace(/_/g, ' '));
};

/**
 * Truncate a string if it exceeds a maximum length
 * @param str - String to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string with ellipsis if needed
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

/**
 * Format a file size in bytes to a human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
