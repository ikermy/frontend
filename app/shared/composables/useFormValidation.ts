import { computed, watch } from "vue";

export interface ValidationRule<T = any> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  email?: boolean;
  url?: boolean;
  custom?: (value: T, values: Record<string, any>) => string | undefined;
  message?: string;
}

export type ValidationRules<T = Record<string, any>> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string | undefined>;
}

export function useFormValidation<
  T extends Record<string, any> = Record<string, any>,
>(
  values: Ref<Record<keyof T, any>>,
  rules: ValidationRules<T>,
  options: {
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    validateOnSubmit?: boolean;
  } = {}
) {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    validateOnSubmit = true,
  } = options;

  // Validation functions
  const validateRequired = (
    value: any,
    message?: string
  ): string | undefined => {
    if (value === null || value === undefined || value === "") {
      return message || "This field is required";
    }
    return undefined;
  };

  const validateMinLength = (
    value: string,
    minLength: number,
    message?: string
  ): string | undefined => {
    if (typeof value === "string" && value.length < minLength) {
      return message || `Minimum length is ${minLength} characters`;
    }
    return undefined;
  };

  const validateMaxLength = (
    value: string,
    maxLength: number,
    message?: string
  ): string | undefined => {
    if (typeof value === "string" && value.length > maxLength) {
      return message || `Maximum length is ${maxLength} characters`;
    }
    return undefined;
  };

  const validateMin = (
    value: number,
    min: number,
    message?: string
  ): string | undefined => {
    if (typeof value === "number" && value < min) {
      return message || `Minimum value is ${min}`;
    }
    return undefined;
  };

  const validateMax = (
    value: number,
    max: number,
    message?: string
  ): string | undefined => {
    if (typeof value === "number" && value > max) {
      return message || `Maximum value is ${max}`;
    }
    return undefined;
  };

  const validatePattern = (
    value: string,
    pattern: RegExp,
    message?: string
  ): string | undefined => {
    if (typeof value === "string" && !pattern.test(value)) {
      return message || "Invalid format";
    }
    return undefined;
  };

  const validateEmail = (
    value: string,
    message?: string
  ): string | undefined => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof value === "string" && value && !emailPattern.test(value)) {
      return message || "Invalid email format";
    }
    return undefined;
  };

  const validateUrl = (value: string, message?: string): string | undefined => {
    try {
      if (typeof value === "string" && value) {
        new URL(value);
      }
      return undefined;
    } catch {
      return message || "Invalid URL format";
    }
  };

  // Main validation function
  const validateField = (
    fieldName: keyof T,
    value: any
  ): string | undefined => {
    const fieldRules = rules[fieldName];
    if (!fieldRules) return undefined;

    for (const rule of fieldRules) {
      let error: string | undefined;

      // Required validation
      if (rule.required) {
        error = validateRequired(value, rule.message);
        if (error) return error;
      }

      // Skip other validations if value is empty and not required
      if (!value && !rule.required) continue;

      // String validations
      if (typeof value === "string") {
        if (rule.minLength !== undefined) {
          error = validateMinLength(value, rule.minLength, rule.message);
          if (error) return error;
        }

        if (rule.maxLength !== undefined) {
          error = validateMaxLength(value, rule.maxLength, rule.message);
          if (error) return error;
        }

        if (rule.pattern) {
          error = validatePattern(value, rule.pattern, rule.message);
          if (error) return error;
        }

        if (rule.email) {
          error = validateEmail(value, rule.message);
          if (error) return error;
        }

        if (rule.url) {
          error = validateUrl(value, rule.message);
          if (error) return error;
        }
      }

      // Number validations
      if (typeof value === "number") {
        if (rule.min !== undefined) {
          error = validateMin(value, rule.min, rule.message);
          if (error) return error;
        }

        if (rule.max !== undefined) {
          error = validateMax(value, rule.max, rule.message);
          if (error) return error;
        }
      }

      // Custom validation
      if (rule.custom) {
        error = rule.custom(value, values.value);
        if (error) return error;
      }
    }

    return undefined;
  };

  // Validate all fields
  const validateAll = (): ValidationResult => {
    const errors: Record<string, string | undefined> = {};
    let isValid = true;

    Object.keys(rules).forEach(fieldName => {
      const fieldValue = values.value[fieldName as keyof T];
      const error = validateField(fieldName as keyof T, fieldValue);

      if (error) {
        errors[fieldName] = error;
        isValid = false;
      } else {
        errors[fieldName] = undefined;
      }
    });

    return { isValid, errors };
  };

  // Validate single field
  const validateFieldByName = (fieldName: keyof T): string | undefined => {
    const fieldValue = values.value[fieldName];
    return validateField(fieldName, fieldValue);
  };

  // Computed validation state
  const validationErrors = computed(() => {
    const errors: Record<string, string | undefined> = {};
    Object.keys(rules).forEach(fieldName => {
      const fieldValue = values.value[fieldName as keyof T];
      errors[fieldName] = validateField(fieldName as keyof T, fieldValue);
    });
    return errors;
  });

  const isFormValid = computed(() => {
    return Object.values(validationErrors.value).every(error => !error);
  });

  const hasErrors = computed(() => {
    return Object.values(validationErrors.value).some(error => !!error);
  });

  // Watch for changes to trigger validation
  if (validateOnChange) {
    watch(
      () => values.value,
      () => {
        // Validation is reactive through computed properties
      },
      { deep: true }
    );
  }

  return {
    // Validation functions
    validateField,
    validateFieldByName,
    validateAll,

    // Computed validation state
    validationErrors,
    isFormValid,
    hasErrors,

    // Individual validators (for external use)
    validateRequired,
    validateMinLength,
    validateMaxLength,
    validateMin,
    validateMax,
    validatePattern,
    validateEmail,
    validateUrl,
  };
}
