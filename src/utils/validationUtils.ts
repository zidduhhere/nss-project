// Form validation utilities
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateMobile = (mobile: string): ValidationResult => {
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobile) {
    return { isValid: false, error: "Mobile number is required" };
  }
  if (!mobileRegex.test(mobile)) {
    return {
      isValid: false,
      error: "Please enter a valid 10-digit mobile number",
    };
  }
  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }
  if (password.length < 6) {
    return {
      isValid: false,
      error: "Password must be at least 6 characters long",
    };
  }
  return { isValid: true };
};

export const validateRequired = (
  value: string,
  fieldName: string
): ValidationResult => {
  if (!value || value.trim() === "") {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
};

export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }
  return { isValid: true };
};

export const validateNumber = (
  value: string,
  fieldName: string,
  min?: number,
  max?: number
): ValidationResult => {
  if (!value) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }

  if (min !== undefined && numValue < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` };
  }

  if (max !== undefined && numValue > max) {
    return { isValid: false, error: `${fieldName} must be at most ${max}` };
  }

  return { isValid: true };
};
