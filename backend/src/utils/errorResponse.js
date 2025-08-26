export const errorResponse = (res, statusCode, errorCode, errorMessage) => {
  return res.status(statusCode).json({
    statusCode,
    errorCode,
    errorMessage,
  });
};
