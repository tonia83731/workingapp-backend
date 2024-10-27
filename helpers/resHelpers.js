const sendErrorResponse = (res, code, message) => {
  return res.status(code).json({
    success: false,
    message,
  });
};

const sendSuccessResponse = (res, code, data) => {
  return res.status(code).json({
    success: true,
    data,
  });
};

module.exports = {
  sendErrorResponse,
  sendSuccessResponse,
};
