import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../config/prisma.js';
import env from '../config/env.js';
import { BadRequestError, UnauthorizedError, ConflictError } from '../middleware/errorHandler.js';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required')
});

export const updateMeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters')
});

const generateToken = (userId) => {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
};

const sanitizeUser = (user) => {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      throw new ConflictError('User with this email already exists', 'EMAIL_EXISTS');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: 'USER'
      }
    });

    const token = generateToken(user.id);
    const safeUser = sanitizeUser(user);

    res.status(201).json({
      success: true,
      data: { user: safeUser, token },
      token
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const token = generateToken(user.id);
    const safeUser = sanitizeUser(user);

    res.json({
      success: true,
      data: { user: safeUser, token },
      token
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

export const getMe = async (req, res, next) => {
  res.json({
    success: true,
    data: req.user,
    user: req.user
  });
};

export const updateMe = async (req, res, next) => {
  try {
    const { name } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { ...(name ? { name } : {}) },
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true }
    });

    res.json({
      success: true,
      data: updated,
      user: updated
    });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isMatch) {
      throw new BadRequestError('Current password is incorrect', 'INVALID_CURRENT_PASSWORD');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash }
    });

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (err) {
    next(err);
  }
};
