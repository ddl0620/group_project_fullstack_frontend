// utils/validationUtils.js

/**
 * Validates form data and returns errors
 * @param {Object} formData - The form data to validate
 * @param {Object} validationRules - Rules for validation
 * @returns {Object} - Object containing validation errors
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};

  Object.keys(validationRules).forEach((field) => {
    const rules = validationRules[field];

    // Check required fields
    if (rules.required) {
      if (typeof formData[field] === 'string') {
        // For strings, check if empty after trimming
        if (!formData[field] || !formData[field].trim()) {
          errors[field] = rules.requiredMessage || `${field} is required`;
        }
      } else if (
        formData[field] === null ||
        formData[field] === undefined ||
        formData[field] === ''
      ) {
        // For non-strings (e.g., boolean, null), check if falsy or undefined
        errors[field] = rules.requiredMessage || `${field} is required`;
      }
    }

    // Check pattern validation (only for strings)
    if (
      rules.pattern &&
      typeof formData[field] === 'string' &&
      formData[field] &&
      !rules.pattern.test(formData[field])
    ) {
      errors[field] = rules.patternMessage || `Invalid ${field} format`;
    }

    // Check min length (only for strings)
    if (
      rules.minLength &&
      typeof formData[field] === 'string' &&
      formData[field] &&
      formData[field].length < rules.minLength
    ) {
      errors[field] =
        rules.minLengthMessage ||
        `${field} must be at least ${rules.minLength} characters`;
    }

    // Check max length (only for strings)
    if (
      rules.maxLength &&
      typeof formData[field] === 'string' &&
      formData[field] &&
      formData[field].length > rules.maxLength
    ) {
      errors[field] =
        rules.maxLengthMessage ||
        `${field} cannot exceed ${rules.maxLength} characters`;
    }

    // Custom validation
    if (rules.validate && formData[field]) {
      const customError = rules.validate(formData[field], formData);
      if (customError) {
        errors[field] = customError;
      }
    }
  });

  return errors;
};

/**
 * Scrolls to the first element with an error
 * @param {Object} errors - The validation errors
 * @param {Object} refs - Object containing refs for each field
 */
export const scrollToFirstError = (errors, refs) => {
  const firstErrorField = Object.keys(errors)[0];
  if (
    firstErrorField &&
    refs[firstErrorField] &&
    refs[firstErrorField].current
  ) {
    refs[firstErrorField].current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }
};

/**
 * Common validation patterns
 */
export const validationPatterns = {
  email: {
    pattern: /^\S+@\S+\.\S+$/,
    message: 'Please enter a valid email address (e.g., name@example.com)',
  },
  phone: {
    pattern: /^\+[1-9][0-9]{0,2}[ ]?[0-9]{1,3}([ ]?[0-9]{2,4}){1,4}$/,
    message:
      'Please enter a valid phone number with country code (e.g., +1 234 567 8900)',
  },
  url: {
    pattern:
      /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
    message:
      'Please enter a valid URL starting with http:// or https:// (e.g., https://example.com)',
  },
};
