export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', code = 'BAD_REQUEST') {
    super(message, 400, code);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    super(message, 401, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', code = 'FORBIDDEN') {
    super(message, 403, code);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource Not Found', code = 'NOT_FOUND') {
    super(message, 404, code);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource Conflict', code = 'CONFLICT') {
    super(message, 409, code);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation Error', details = null) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';

  const response = {
    success: false,
    error: {
      code,
      message,
      ...(err.details ? { details: err.details } : {})
    }
  };

  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
