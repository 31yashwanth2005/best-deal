import express from 'express';
import {
  getAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  updateAlertStatus,
  deleteAlert,
  createAlertSchema,
  updateAlertSchema,
  updateAlertStatusSchema
} from '../controllers/alertController.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { alertLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', requireAuth, alertLimiter, getAlerts);
router.get('/:id', requireAuth, alertLimiter, getAlertById);
router.post('/', requireAuth, alertLimiter, validate({ body: createAlertSchema }), createAlert);
router.patch('/:id/status', requireAuth, validate({ body: updateAlertStatusSchema }), updateAlertStatus);
router.patch('/:id', requireAuth, validate({ body: updateAlertSchema }), updateAlert);
router.delete('/:id', requireAuth, deleteAlert);

export default router;
