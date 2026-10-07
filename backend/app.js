import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import env from './config/env.js';
import { httpLogger } from './middleware/logger.js';
import { errorHandler, NotFoundError } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';

import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import alertRoutes from './routes/alerts.js';
import aiRoutes from './routes/ai.js';

const app = express();

// Security & Request Parsing Middleware
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(httpLogger);
app.use('/api', generalLimiter);

// Health Check Routes
app.use('/api', healthRoutes);

// Versioned API Routes (/api/v1/*)
app.use('/api/v1', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/alerts', alertRoutes);
app.use('/api/v1/ai', aiRoutes);

// Legacy Path Aliases (Ensures seamless compatibility with existing frontend)
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/ai', aiRoutes);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Best Deal AI Production Backend API 🚀',
    docs: '/api/v1/docs',
    version: '1.0.0'
  });
});

// 404 Handler
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
