import prisma from '../config/prisma.js';
import { NotFoundError } from '../middleware/errorHandler.js';
import { logger } from '../middleware/logger.js';

const formatAlert = (a) => ({
  id: a.id,
  productId: a.productId,
  productName: a.product ? a.product.name : undefined,
  productImage: a.product ? a.product.imageUrl : undefined,
  currentPrice: a.product ? a.product.currentPrice : 0,
  targetPrice: a.targetPrice,
  status: a.status,
  createdAt: a.createdAt,
  triggeredAt: a.triggeredAt
});

export const getAlertsService = async (userId) => {
  const alerts = await prisma.priceAlert.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: 'desc' }
  });

  return alerts.map(formatAlert);
};

export const getAlertByIdService = async (userId, id) => {
  const alert = await prisma.priceAlert.findUnique({
    where: { id },
    include: { product: true }
  });

  if (!alert || alert.userId !== userId) {
    throw new NotFoundError(`Alert with ID '${id}' not found`, 'ALERT_NOT_FOUND');
  }

  return formatAlert(alert);
};

export const createAlertService = async (userId, data) => {
  const product = await prisma.product.findUnique({ where: { id: data.productId } });
  if (!product) {
    throw new NotFoundError(`Product '${data.productId}' not found`, 'PRODUCT_NOT_FOUND');
  }

  const alert = await prisma.priceAlert.create({
    data: {
      userId,
      productId: data.productId,
      targetPrice: parseFloat(data.targetPrice),
      status: 'ACTIVE'
    },
    include: { product: true }
  });

  return formatAlert(alert);
};

export const updateAlertService = async (userId, id, data) => {
  const alert = await prisma.priceAlert.findUnique({ where: { id } });
  if (!alert || alert.userId !== userId) {
    throw new NotFoundError(`Alert with ID '${id}' not found`, 'ALERT_NOT_FOUND');
  }

  const updateData = {};
  if (data.targetPrice !== undefined) {
    updateData.targetPrice = parseFloat(data.targetPrice);
  }
  if (data.status !== undefined) {
    updateData.status = data.status;
  }

  const updated = await prisma.priceAlert.update({
    where: { id },
    data: updateData,
    include: { product: true }
  });

  return formatAlert(updated);
};

export const updateAlertStatusService = async (userId, id, status) => {
  return updateAlertService(userId, id, { status });
};

export const deleteAlertService = async (userId, id) => {
  const alert = await prisma.priceAlert.findUnique({ where: { id } });
  if (!alert || alert.userId !== userId) {
    throw new NotFoundError(`Alert with ID '${id}' not found`, 'ALERT_NOT_FOUND');
  }

  await prisma.priceAlert.delete({ where: { id } });
  return { id };
};

/**
 * Scalable Alert Processing Job
 * Atomically triggers alerts where current price <= target price
 */
export const processPriceAlerts = async () => {
  try {
    const activeAlerts = await prisma.priceAlert.findMany({
      where: {
        status: 'ACTIVE',
        triggeredAt: null
      },
      include: { product: true }
    });

    let triggeredCount = 0;
    for (const alert of activeAlerts) {
      if (alert.product && alert.product.currentPrice <= alert.targetPrice) {
        // Atomic update ensures idempotency across multiple instances
        await prisma.priceAlert.updateMany({
          where: {
            id: alert.id,
            triggeredAt: null
          },
          data: {
            triggeredAt: new Date()
          }
        });
        triggeredCount++;
        logger.info(
          { alertId: alert.id, productId: alert.productId, currentPrice: alert.product.currentPrice, targetPrice: alert.targetPrice },
          'Price alert triggered!'
        );
      }
    }
    return triggeredCount;
  } catch (err) {
    logger.error({ err: err.message }, 'Error in price alert processing job');
    return 0;
  }
};
