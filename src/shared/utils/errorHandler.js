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

const UNIQUE_CONSTRAINT_HINTS = {
  'users_user.username': 'Username already exists. Please choose another username.',
  'users_user.email': 'Email already exists. Try signing in or use another email.',
};

const parseConstraintError = (text) => {
  if (!text || typeof text !== 'string') return null;

  const lowered = text.toLowerCase();
  if (!lowered.includes('unique constraint failed')) return null;

  for (const [constraint, message] of Object.entries(UNIQUE_CONSTRAINT_HINTS)) {
    if (lowered.includes(constraint.toLowerCase())) {
      return message;
    }
  }

  return 'This account already exists. Please use a different username or email.';
};

const flattenValidationMap = (payload) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;

  const entries = Object.entries(payload)
    .filter(([key]) => !['detail', 'message', 'non_field_errors'].includes(key))
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}: ${value.join(' ')}`;
      }
      if (typeof value === 'string') {
        return `${key}: ${value}`;
      }
      return null;
    })
    .filter(Boolean);

  if (entries.length > 0) {
    return entries.join(' ');
  }

  if (Array.isArray(payload.non_field_errors) && payload.non_field_errors.length > 0) {
    return payload.non_field_errors.join(' ');
  }

  return null;
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

  // Zod validation error
  if (Array.isArray(error.issues) && error.issues.length > 0) {
    return error.issues[0]?.message || 'Please check your input values.';
  }

  // Axios error
  if (error.response) {
    const status = error.response.status;
    const responseData = error.response.data;
    const rawResponseText = typeof responseData === 'string' ? responseData : '';
    const constraintMessage = parseConstraintError(
      responseData?.detail || responseData?.message || rawResponseText
    );

    if (constraintMessage) return constraintMessage;

    const validationMessage = flattenValidationMap(responseData);
    if (validationMessage) return validationMessage;

    const serverMessage = responseData?.message || responseData?.detail;
    if (serverMessage) return serverMessage;

    if (rawResponseText) {
      // Handle non-JSON backend responses (e.g., HTML/text errors in debug mode).
      const textConstraintMessage = parseConstraintError(rawResponseText);
      if (textConstraintMessage) return textConstraintMessage;
    }

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
