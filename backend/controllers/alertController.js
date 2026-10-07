import { z } from 'zod';
import {
  getAlertsService,
  getAlertByIdService,
  createAlertService,
  updateAlertService,
  updateAlertStatusService,
  deleteAlertService
} from '../services/alertService.js';

export const createAlertSchema = z.object({
  productId: z.string().min(1, 'productId is required'),
  targetPrice: z.number().positive('targetPrice must be positive')
});

export const updateAlertSchema = z.object({
  targetPrice: z.number().positive('targetPrice must be positive').optional(),
  status: z.enum(['ACTIVE', 'DISABLED']).optional()
}).refine((data) => data.targetPrice !== undefined || data.status !== undefined, {
  message: 'At least one field (targetPrice or status) must be provided'
});

export const updateAlertStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'DISABLED'])
});

export const getAlerts = async (req, res, next) => {
  try {
    const alerts = await getAlertsService(req.user.id);
    res.json({
      success: true,
      data: alerts,
      alerts
    });
  } catch (err) {
    next(err);
  }
};

export const getAlertById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const alert = await getAlertByIdService(req.user.id, id);
    res.json({
      success: true,
      data: alert,
      alert
    });
  } catch (err) {
    next(err);
  }
};

export const createAlert = async (req, res, next) => {
  try {
    const alert = await createAlertService(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: alert,
      alert
    });
  } catch (err) {
    next(err);
  }
};

export const updateAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const alert = await updateAlertService(req.user.id, id, req.body);
    res.json({
      success: true,
      data: alert,
      alert
    });
  } catch (err) {
    next(err);
  }
};

export const updateAlertStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const alert = await updateAlertStatusService(req.user.id, id, status);
    res.json({
      success: true,
      data: alert,
      alert
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteAlertService(req.user.id, id);
    res.json({
      success: true,
      message: 'Alert deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
