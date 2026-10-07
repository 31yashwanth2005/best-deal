import express from 'express';
import prisma from '../config/prisma.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

router.get('/health/ready', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      status: 'ready',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(503).json({
      success: false,
      status: 'unready',
      database: 'disconnected',
      error: err.message
    });
  }
});

export default router;
