import { ValidationError } from './errorHandler.js';

export const validate = ({ body, query, params }) => {
  return (req, res, next) => {
    try {
      if (body) {
        req.body = body.parse(req.body);
      }
      if (query) {
        req.query = query.parse(req.query);
      }
      if (params) {
        req.params = params.parse(req.params);
      }
      next();
    } catch (err) {
      if (err.errors) {
        const formatted = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message
        }));
        return next(new ValidationError('Input validation failed', formatted));
      }
      next(err);
    }
  };
};
