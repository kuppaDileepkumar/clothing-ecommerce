// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(", ");
  }

  // Cast Error (Invalid Mongo ObjectId)
  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }

  // Duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate value entered";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
