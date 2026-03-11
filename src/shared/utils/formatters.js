/**
 * Formats a price number to Kenyan Shilling string.
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats an ISO date string to a human-readable format.
 * @param {string} dateString
 * @returns {string}
 */
export const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
};

/**
 * Truncates a string to maxLength and appends ellipsis.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export const truncate = (str, maxLength = 100) => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
};

/**
 * Generates a route path with params substituted.
 * @param {string} path - e.g. '/products/:id'
 * @param {Record<string, string>} params
 * @returns {string}
 */
export const buildRoute = (path, params) => {
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, value),
    path
  );
};
