// errorHandler.js
import { ApiError } from "./ApiError.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      success: err.success,
      message: err.message,
      errors: err.errors,
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default errorHandler;
