function successResponse(data, message = 'Operation completed successfully.') {
  return {
    success: true,
    data,
    message,
  };
}

function errorResponse(code, message, statusCode = 400) {
  return {
    success: false,
    error: {
      code,
      message,
    },
    statusCode,
  };
}

module.exports = { successResponse, errorResponse };
