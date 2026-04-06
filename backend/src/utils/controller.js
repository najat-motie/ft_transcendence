const isDevelopment = process.env.NODE_ENV === 'development';

const getDevelopmentError = (error) => {
  if (!isDevelopment) {
    return undefined;
  }

  return error?.message;
};

const sendServerError = (res, message, error) => res.status(500).json({
  success: false,
  message,
  error: getDevelopmentError(error),
});

const parsePagination = (query = {}) => {
  const limit = Number.parseInt(query.limit, 10) || 0;
  const offset = Number.parseInt(query.offset, 10) || 0;

  return { limit, offset };
};

module.exports = {
  getDevelopmentError,
  sendServerError,
  parsePagination,
};
