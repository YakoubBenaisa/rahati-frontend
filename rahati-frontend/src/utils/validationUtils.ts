/**
 * Validate an email address
 * @param email - Email address to validate
 * @returns Boolean indicating if the email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate a password (at least 8 characters, including a number and a special character)
 * @param password - Password to validate
 * @returns Boolean indicating if the password is valid
 */
export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 number, 1 uppercase, 1 lowercase
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate a phone number
 * @param phone - Phone number to validate
 * @returns Boolean indicating if the phone number is valid
 */
export const isValidPhone = (phone: string): boolean => {
  // Allow various formats like (123) 456-7890, 123-456-7890, 1234567890
  const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  return phoneRegex.test(phone);
};

/**
 * Check if a string is empty or only whitespace
 * @param str - String to check
 * @returns Boolean indicating if the string is empty
 */
export const isEmpty = (str: string): boolean => {
  return str.trim() === '';
};

/**
 * Validate a URL
 * @param url - URL to validate
 * @returns Boolean indicating if the URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validate a date string (YYYY-MM-DD)
 * @param dateStr - Date string to validate
 * @returns Boolean indicating if the date string is valid
 */
export const isValidDateString = (dateStr: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) return false;
  
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

/**
 * Validate a credit card number using Luhn algorithm
 * @param cardNumber - Credit card number to validate
 * @returns Boolean indicating if the credit card number is valid
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  
  // Check if it contains only digits
  if (!/^\d+$/.test(cleaned)) return false;
  
  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
};
