// errorHandler.js
import { ApiError } from "./ApiError.js";

const errorHandler = (err, req, res, next) => {
  if (err) {
    return res.status(err.statusCode).json(
      new ApiError({
        status: "error",
        statusCode: err.statusCode,
        message: err.message,
      })
    );
  }

  return res.status(500).json(
    new ApiError({
      status: "error",
      statusCode: 500,
      message: "Internal Server Error",
    })
  );
};

export default errorHandler;
