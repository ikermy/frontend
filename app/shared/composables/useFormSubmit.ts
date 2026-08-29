import { ref, computed } from "vue";

export interface FormError {
  field?: string;
  message: string;
  code?: string;
  details?: any;
}

export interface SubmitOptions {
  validateBeforeSubmit?: boolean;
  resetAfterSubmit?: boolean;
  showSuccessMessage?: boolean;
  successMessage?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: FormError) => void;
  onFinally?: () => void;
}

export interface SubmitState {
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: FormError | null;
  successMessage: string | null;
  submitCount: number;
  lastSubmittedAt: Date | null;
}

export function useFormSubmit<
  T extends Record<string, any> = Record<string, any>,
>(submitFn: (values: T) => Promise<any>, options: SubmitOptions = {}) {
  const {
    validateBeforeSubmit = true,
    resetAfterSubmit = false,
    showSuccessMessage = true,
    successMessage = "Form submitted successfully",
    onSuccess,
    onError,
    onFinally,
  } = options;

  // State
  const isSubmitting = ref(false);
  const isSuccess = ref(false);
  const isError = ref(false);
  const error = ref<FormError | null>(null);
  const successMessageText = ref<string | null>(null);
  const submitCount = ref(0);
  const lastSubmittedAt = ref<Date | null>(null);

  // Computed state
  const submitState = computed<SubmitState>(() => ({
    isSubmitting: isSubmitting.value,
    isSuccess: isSuccess.value,
    isError: isError.value,
    error: error.value,
    successMessage: successMessageText.value,
    submitCount: submitCount.value,
    lastSubmittedAt: lastSubmittedAt.value,
  }));

  // Error handling
  const setError = (formError: FormError) => {
    isError.value = true;
    isSuccess.value = false;
    error.value = formError;
    successMessageText.value = null;
  };

  const clearError = () => {
    isError.value = false;
    error.value = null;
  };

  const clearSuccess = () => {
    isSuccess.value = false;
    successMessageText.value = null;
  };

  const clearAll = () => {
    clearError();
    clearSuccess();
  };

  // Success handling
  const setSuccess = (message?: string) => {
    isSuccess.value = true;
    isError.value = false;
    successMessageText.value = message || successMessage;
    error.value = null;
  };

  // Submit function
  const submit = async (
    values: T,
    validationErrors?: Record<string, string | undefined>
  ): Promise<any> => {
    // Clear previous state
    clearAll();

    // Validate before submit if required
    if (validateBeforeSubmit && validationErrors) {
      const hasErrors = Object.values(validationErrors).some(error => !!error);
      if (hasErrors) {
        const firstError = Object.entries(validationErrors).find(
          ([_, error]) => !!error
        );
        if (firstError) {
          setError({
            field: firstError[0],
            message: firstError[1]!,
            code: "VALIDATION_ERROR",
          });
          return;
        }
      }
    }

    // Set submitting state
    isSubmitting.value = true;
    submitCount.value++;
    lastSubmittedAt.value = new Date();

    try {
      // Call submit function
      const result = await submitFn(values);

      // Handle success
      setSuccess();

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err: any) {
      // Handle error
      const formError: FormError = {
        message: err.message || "An error occurred while submitting the form",
        code: err.code || "SUBMIT_ERROR",
        details: err,
      };

      // Check if it's a field-specific error
      if (err.field) {
        formError.field = err.field;
      }

      setError(formError);

      if (onError) {
        onError(formError);
      }

      throw err;
    } finally {
      // Set final state
      isSubmitting.value = false;
      lastSubmittedAt.value = new Date();

      if (onFinally) {
        onFinally();
      }
    }
  };

  // Reset form after successful submit
  const resetAfterSuccess = (resetFn: () => void) => {
    if (resetAfterSubmit && isSuccess.value) {
      resetFn();
    }
  };

  // Retry submit
  const retry = async (
    values: T,
    validationErrors?: Record<string, string | undefined>
  ) => {
    return submit(values, validationErrors);
  };

  // Handle specific error types
  const handleValidationError = (field: string, message: string) => {
    setError({
      field,
      message,
      code: "VALIDATION_ERROR",
    });
  };

  const handleNetworkError = (message: string = "Network error occurred") => {
    setError({
      message,
      code: "NETWORK_ERROR",
    });
  };

  const handleServerError = (
    message: string = "Server error occurred",
    code?: string
  ) => {
    setError({
      message,
      code: code || "SERVER_ERROR",
    });
  };

  const handleTimeoutError = (message: string = "Request timeout") => {
    setError({
      message,
      code: "TIMEOUT_ERROR",
    });
  };

  // Utility functions
  const hasError = (field?: string): boolean => {
    if (field) {
      return isError.value && error.value?.field === field;
    }
    return isError.value;
  };

  const getErrorMessage = (field?: string): string | null => {
    if (field) {
      return hasError(field) ? error.value?.message || null : null;
    }
    return error.value?.message || null;
  };

  const getErrorCode = (): string | null => {
    return error.value?.code || null;
  };

  const isFieldError = (field: string): boolean => {
    return hasError(field);
  };

  return {
    // State
    isSubmitting: readonly(isSubmitting),
    isSuccess: readonly(isSuccess),
    isError: readonly(isError),
    error: readonly(error),
    successMessage: readonly(successMessageText),
    submitCount: readonly(submitCount),
    lastSubmittedAt: readonly(lastSubmittedAt),
    submitState,

    // Actions
    submit,
    retry,
    resetAfterSuccess,

    // Error handling
    setError,
    clearError,
    clearSuccess,
    clearAll,
    handleValidationError,
    handleNetworkError,
    handleServerError,
    handleTimeoutError,

    // Success handling
    setSuccess,

    // Utilities
    hasError,
    getErrorMessage,
    getErrorCode,
    isFieldError,
  };
}
