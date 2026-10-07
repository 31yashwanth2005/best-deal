import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateMe,
  changePassword,
  registerSchema,
  loginSchema,
  updateMeSchema,
  changePasswordSchema
} from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/auth/register', authLimiter, validate({ body: registerSchema }), register);
router.post('/auth/login', authLimiter, validate({ body: loginSchema }), login);
router.post('/auth/logout', logout);

router.get('/users/me', requireAuth, getMe);
router.put('/users/me', requireAuth, validate({ body: updateMeSchema }), updateMe);
router.patch('/users/me/password', requireAuth, validate({ body: changePasswordSchema }), changePassword);

export default router;
