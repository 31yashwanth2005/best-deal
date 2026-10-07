import app from './app.js';
import env from './config/env.js';
import prisma from './config/prisma.js';
import { logger } from './middleware/logger.js';
import { processPriceAlerts } from './services/alertService.js';

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`==================================================`);
  logger.info(`🚀 Best Deal AI Server listening on http://localhost:${PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
  logger.info(`==================================================`);
});

// Start background price alert processing job every 5 minutes
const alertInterval = setInterval(() => {
  processPriceAlerts().catch((err) => {
    logger.error({ err: err.message }, 'Background alert job error');
  });
}, 5 * 60 * 1000);

// Graceful Shutdown Handler (Phase 29)
const shutdown = async (signal) => {
  logger.info(`Received ${signal}. Initiating graceful shutdown...`);
  clearInterval(alertInterval);

  server.close(async () => {
    logger.info('HTTP server closed. Disconnecting PostgreSQL database connection...');
    try {
      await prisma.$disconnect();
      logger.info('PostgreSQL database disconnected cleanly.');
      process.exit(0);
    } catch (err) {
      logger.error({ err: err.message }, 'Error disconnecting database');
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds if connections fail to close
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));