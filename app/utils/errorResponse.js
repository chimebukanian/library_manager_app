class errorResponse extends Error {
    constructor(message, res, success, statusCode) {
      super(message);
      this.statusCode = statusCode;
      return res.status(statusCode).json({ message, success});
      }
  }
  
  module.exports = errorResponse;