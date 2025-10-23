import api from "./api";

/**
 * Handles API errors consistently across the application
 * @param {Error} error - The error object from API calls
 * @param {string} defaultMessage - Default message if no specific error is found
 * @param {boolean} showAlert - Whether to show alert notification (default: true)
 * @returns {string} The error message to display
 */
export const handleApiError = (
  error,
  defaultMessage = "An unexpected error occurred. Please try again.",
  showAlert = true
) => {
  let errorMessage = defaultMessage;

  if (api.isAxiosError && api.isAxiosError(error)) {
    if (error.response) {
      // Server responded with error status
      errorMessage =
        error.response.data?.detail || error.response.data?.message || error.response.data?.error || defaultMessage;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "Network error. Please check your connection and try again.";
    } else {
      // Something else happened
      errorMessage = error.message || defaultMessage;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message || defaultMessage;
  }

  console.error("API Error:", errorMessage, error);

  if (showAlert) {
    alert(errorMessage);
  }

  return errorMessage;
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with score and feedback
 */
export const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let score = 0;
  const feedback = [];

  if (password.length >= minLength) {
    score += 1;
  } else {
    feedback.push(`At least ${minLength} characters`);
  }

  if (hasUpperCase) {
    score += 1;
  } else {
    feedback.push("One uppercase letter");
  }

  if (hasLowerCase) {
    score += 1;
  } else {
    feedback.push("One lowercase letter");
  }

  if (hasNumbers) {
    score += 1;
  } else {
    feedback.push("One number");
  }

  if (hasSpecialChar) {
    score += 1;
  } else {
    feedback.push("One special character");
  }

  const strength = score <= 2 ? "weak" : score <= 3 ? "medium" : "strong";
  const strengthColor = score <= 2 ? "text-red-400" : score <= 3 ? "text-yellow-400" : "text-green-400";

  return {
    score,
    strength,
    strengthColor,
    feedback,
    isValid: score >= 3 && password.length >= minLength,
  };
};

/**
 * Formats validation errors from form libraries
 * @param {object} errors - Form validation errors
 * @returns {string[]} Array of error messages
 */
export const formatValidationErrors = (errors) => {
  if (!errors || typeof errors !== "object") return [];

  return Object.values(errors).flat().filter(Boolean);
};

/**
 * Debounce function for input validation
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
