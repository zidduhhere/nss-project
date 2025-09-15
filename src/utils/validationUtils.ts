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

// Basic KTU ID validation (adjust pattern as real format clarifies)
export const validateKtuId = (ktuId: string): ValidationResult => {
  const pattern = /^[A-Z0-9]{6,}$/i;
  if (!ktuId) return { isValid: false, error: "KTU ID is required" };
  if (!pattern.test(ktuId))
    return { isValid: false, error: "Invalid KTU ID format" };
  return { isValid: true };
};

// Unified identifier validator based on role
export const validateIdentifier = (
  identifier: string,
  role: "student" | "faculty"
): ValidationResult => {
  return role === "student"
    ? validateKtuId(identifier)
    : validateEmail(identifier);
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

export function validateLoginForm(
  email: string,
  password: string
): ValidationResult {
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) return emailValidation;

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) return passwordValidation;
  return { isValid: true };
}

export function validateRegisterForm(data: {
  name: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  district: string;
  college: string;
  ktuRegistrationNumber: string;
  email: string;
}): ValidationResult {
  const nameValidation = validateRequired(data.name, "Name");
  if (!nameValidation.isValid) return nameValidation;

  const mobileValidation = validateMobile(data.mobile);
  if (!mobileValidation.isValid) return mobileValidation;

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) return passwordValidation;

  if (data.password !== data.confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }

  const districtValidation = validateRequired(data.district, "District");
  if (!districtValidation.isValid) return districtValidation;

  const collegeValidation = validateRequired(data.college, "College");
  if (!collegeValidation.isValid) return collegeValidation;

  const ktuIdValidation = validateKtuId(data.ktuRegistrationNumber);
  if (!ktuIdValidation.isValid) return ktuIdValidation;

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) return emailValidation;

  return { isValid: true };
}
