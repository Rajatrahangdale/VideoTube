class ApiError extends Error {
  constructor(statuscode, message, errors = [], stack = "") {
    super(message);
    this.statuscode = statuscode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.error = errors;
    if (stack.length > 0) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export default ApiError;
