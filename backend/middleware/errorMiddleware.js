// Catch 404 routes
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Map known domain errors to appropriate HTTP status codes
  if (err.message.includes("Invalid email or password") || err.message.includes("Not authorized")) {
    statusCode = 401;
  } else if (
    err.message.includes("already exists") ||
    err.message.includes("stock") ||
    err.message.includes("Stock") ||
    err.name === "ValidationError" ||
    err.name === "CastError"
  ) {
    statusCode = 400;
  } else if (err.message.includes("not found")) {
    statusCode = 404;
  }

  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
