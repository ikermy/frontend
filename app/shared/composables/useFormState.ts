import { ref, computed, watch } from "vue";

export interface FormField<T = any> {
  value: T;
  touched: boolean;
  dirty: boolean;
  error?: string;
}

export interface FormState<
  T extends Record<string, any> = Record<string, any>,
> {
  fields: Record<keyof T, FormField<T[keyof T]>>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  isTouched: boolean;
}

export interface FormOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  resetOnSubmit?: boolean;
  initialValues?: Record<string, any>;
}

export function useFormState<
  T extends Record<string, any> = Record<string, any>,
>(initialValues: T = {} as T, options: FormOptions = {}) {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    resetOnSubmit = false,
  } = options;

  // Initialize form fields
  const fields = ref<Record<keyof T, FormField<T[keyof T]>>>({} as any);
  const isSubmitting = ref(false);
  const submitCount = ref(0);

  // Initialize fields with initial values
  const initializeFields = (values: T) => {
    Object.keys(values).forEach(key => {
      fields.value[key as keyof T] = {
        value: values[key as keyof T],
        touched: false,
        dirty: false,
        error: undefined,
      };
    });
  };

  // Initialize fields on mount
  initializeFields(initialValues);

  // Computed properties
  const isDirty = computed(() => {
    return Object.values(fields.value).some((field: any) => field.dirty);
  });

  const isTouched = computed(() => {
    return Object.values(fields.value).some((field: any) => field.touched);
  });

  const isValid = computed(() => {
    return Object.values(fields.value).every((field: any) => !field.error);
  });

  const values = computed(() => {
    const result = {} as T;
    Object.keys(fields.value).forEach(key => {
      result[key as keyof T] = fields.value[key as keyof T].value;
    });
    return result;
  });

  const errors = computed(() => {
    const result = {} as Record<keyof T, string | undefined>;
    Object.keys(fields.value).forEach(key => {
      result[key as keyof T] = fields.value[key as keyof T].error;
    });
    return result;
  });

  // Field operations
  const setFieldValue = <K extends keyof T>(name: K, value: T[K]) => {
    if (fields.value[name]) {
      fields.value[name].value = value;
      fields.value[name].dirty = true;
    }
  };

  const setFieldTouched = <K extends keyof T>(
    name: K,
    touched: boolean = true
  ) => {
    if (fields.value[name]) {
      fields.value[name].touched = touched;
    }
  };

  const setFieldError = <K extends keyof T>(name: K, error?: string) => {
    if (fields.value[name]) {
      fields.value[name].error = error;
    }
  };

  const getFieldValue = <K extends keyof T>(name: K): T[K] => {
    return fields.value[name]?.value;
  };

  const getFieldError = <K extends keyof T>(name: K): string | undefined => {
    return fields.value[name]?.error;
  };

  const isFieldTouched = <K extends keyof T>(name: K): boolean => {
    return fields.value[name]?.touched || false;
  };

  const isFieldDirty = <K extends keyof T>(name: K): boolean => {
    return fields.value[name]?.dirty || false;
  };

  // Form operations
  const setValues = (values: Partial<T>) => {
    Object.keys(values).forEach(key => {
      if (fields.value[key as keyof T]) {
        setFieldValue(key as keyof T, values[key as keyof T]!);
      }
    });
  };

  const setErrors = (errors: Partial<Record<keyof T, string>>) => {
    Object.keys(errors).forEach(key => {
      if (fields.value[key as keyof T]) {
        setFieldError(key as keyof T, errors[key as keyof T]);
      }
    });
  };

  const reset = () => {
    Object.keys(fields.value).forEach(key => {
      const field = fields.value[key as keyof T];
      field.value = initialValues[key as keyof T];
      field.touched = false;
      field.dirty = false;
      field.error = undefined;
    });
    submitCount.value = 0;
  };

  const resetField = <K extends keyof T>(name: K) => {
    if (fields.value[name]) {
      const field = fields.value[name];
      field.value = initialValues[name];
      field.touched = false;
      field.dirty = false;
      field.error = undefined;
    }
  };

  const clearErrors = () => {
    Object.keys(fields.value).forEach(key => {
      fields.value[key as keyof T].error = undefined;
    });
  };

  // Submit handling
  const setSubmitting = (submitting: boolean) => {
    isSubmitting.value = submitting;
  };

  const incrementSubmitCount = () => {
    submitCount.value++;
  };

  // Watch for changes to trigger validation
  if (validateOnChange) {
    watch(
      () => values.value,
      () => {
        // Validation will be handled by the validation composable
      },
      { deep: true }
    );
  }

  return {
    // State
    fields: readonly(fields),
    isSubmitting: readonly(isSubmitting),
    submitCount: readonly(submitCount),

    // Computed
    isDirty,
    isTouched,
    isValid,
    values,
    errors,

    // Field operations
    setFieldValue,
    setFieldTouched,
    setFieldError,
    getFieldValue,
    getFieldError,
    isFieldTouched,
    isFieldDirty,

    // Form operations
    setValues,
    setErrors,
    reset,
    resetField,
    clearErrors,

    // Submit operations
    setSubmitting,
    incrementSubmitCount,
  };
}
