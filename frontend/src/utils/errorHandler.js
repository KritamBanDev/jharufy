import toast from "react-hot-toast";

// Enhanced error handling utilities for frontend
export const handleApiError = (error, fallbackMessage = "An error occurred") => {
  console.error("API Error:", error);
  
  let errorMessage = fallbackMessage;
  
  // Check for network errors first
  if (error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error')) {
    errorMessage = "Unable to connect to server. Please check your internet connection and try again.";
  } else if (error?.code === 'ERR_NETWORK' || error?.request && !error?.response) {
    errorMessage = "Server is not responding. Please try again later.";
  } else if (error?.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error?.response?.status === 429) {
    errorMessage = "Too many requests. Please try again later.";
  } else if (error?.response?.status === 401) {
    errorMessage = "Invalid credentials. Please check your email and password.";
  } else if (error?.response?.status === 403) {
    errorMessage = "You don't have permission to perform this action.";
  } else if (error?.response?.status === 404) {
    errorMessage = "The requested resource was not found.";
  } else if (error?.response?.status >= 500) {
    errorMessage = "Server error. Please try again later.";
  } else if (error?.message) {
    errorMessage = error.message;
  }
  
  toast.error(errorMessage);
  return errorMessage;
};

// Success notification helper
export const showSuccess = (message, options = {}) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
    ...options
  });
};

// Loading notification helper
export const showLoading = (message = "Loading...", options = {}) => {
  return toast.loading(message, {
    position: 'top-right',
    ...options
  });
};

// Dismiss loading notification
export const dismissLoading = (toastId) => {
  if (toastId) {
    toast.dismiss(toastId);
  }
};

// Network error handler
export const handleNetworkError = () => {
  toast.error("Network error. Please check your connection and try again.");
};

// Validation error helper
export const showValidationErrors = (errors) => {
  if (Array.isArray(errors)) {
    errors.forEach(error => toast.error(error));
  } else if (typeof errors === 'object') {
    Object.values(errors).forEach(error => toast.error(error));
  } else {
    toast.error(errors || "Validation failed");
  }
};

// Form validation helper
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = data[field];
    
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[field] = `${rule.label || field} is required`;
    }
    
    if (value && rule.minLength && value.toString().length < rule.minLength) {
      errors[field] = `${rule.label || field} must be at least ${rule.minLength} characters`;
    }
    
    if (value && rule.maxLength && value.toString().length > rule.maxLength) {
      errors[field] = `${rule.label || field} must be no more than ${rule.maxLength} characters`;
    }
    
    if (value && rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${rule.label || field} format is invalid`;
    }
    
    if (value && rule.custom && !rule.custom(value)) {
      errors[field] = rule.message || `${rule.label || field} is invalid`;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Common validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
  name: /^[a-zA-Z\s\-']{2,100}$/,
  url: /^https?:\/\/.+/
};

// Form field validation rules
export const FORM_RULES = {
  email: {
    required: true,
    pattern: VALIDATION_PATTERNS.email,
    message: "Please enter a valid email address",
    label: "Email"
  },
  password: {
    required: true,
    minLength: 6,
    pattern: VALIDATION_PATTERNS.password,
    message: "Password must be at least 6 characters with letters and numbers",
    label: "Password"
  },
  fullName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: VALIDATION_PATTERNS.name,
    message: "Name must contain only letters, spaces, hyphens, and apostrophes",
    label: "Full Name"
  },
  bio: {
    required: false,
    maxLength: 500,
    label: "Bio"
  },
  location: {
    required: false,
    minLength: 2,
    maxLength: 100,
    label: "Location"
  },
  profilePic: {
    required: false,
    pattern: VALIDATION_PATTERNS.url,
    message: "Please enter a valid URL",
    label: "Profile Picture URL"
  }
};
