const isDev = import.meta.env.DEV;

const HTTP_ERRORS = {
  400: 'Invalid request. Please check your input.',
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'A conflict occurred. This resource may already exist.',
  422: 'Validation failed. Please check your input.',
  429: 'Too many requests. Please try again later.',
  500: 'Server error. Please try again later.',
  502: 'Service unavailable. Please try again later.',
  503: 'Service temporarily unavailable. Please try again later.',
};

/**
 * Maps an Axios or Fetch error to a user-friendly message string.
 * @param {unknown} error
 * @returns {string}
 */
export const mapError = (error) => {
  if (isDev) {
    console.error('[ErrorHandler]', error);
  }

  if (!error) return 'An unexpected error occurred.';

  // Axios error
  if (error.response) {
    const status = error.response.status;
    const serverMessage = error.response.data?.message || error.response.data?.detail;
    if (serverMessage) return serverMessage;
    return HTTP_ERRORS[status] || `Request failed with status ${status}.`;
  }

  // Network error (no response)
  if (error.request) {
    return 'Network error. Please check your internet connection.';
  }

  // Generic JS error
  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
};

/**
 * Formats a Zod validation error into a field-keyed map.
 * @param {import('zod').ZodError} zodError
 * @returns {Record<string, string>}
 */
export const mapZodError = (zodError) => {
  return zodError.issues.reduce((acc, issue) => {
    const key = issue.path.join('.');
    acc[key] = issue.message;
    return acc;
  }, {});
};
