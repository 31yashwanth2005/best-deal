import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import prisma from '../config/prisma.js';
import { UnauthorizedError, ForbiddenError } from './errorHandler.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token missing or invalid format', 'TOKEN_MISSING');
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Authentication token expired', 'TOKEN_EXPIRED');
      }
      throw new UnauthorizedError('Invalid authentication token', 'TOKEN_INVALID');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    if (!user) {
      throw new UnauthorizedError('Authenticated user no longer exists', 'USER_NOT_FOUND');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return next(new ForbiddenError('Administrative access required for this action', 'ADMIN_REQUIRED'));
  }
  next();
};
