import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import env from '../config/env.js';
import prisma from '../config/prisma.js';

describe('Best Deal AI Backend API Integration Tests', () => {
  const mockUserId = 'test-user-id';
  const mockToken = jwt.sign({ userId: mockUserId }, env.JWT_SECRET, { expiresIn: '1h' });

  it('GET /api/health should return 200 and healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe('healthy');
  });

  it('GET /non-existent-route should return 404 with error envelope', async () => {
    const res = await request(app).get('/api/v1/non-existent-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('POST /api/v1/auth/register should fail validation on invalid payload', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'A', email: 'invalid-email', password: '123' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('GET /api/v1/alerts should require Bearer auth token (401)', async () => {
    const res = await request(app).get('/api/v1/alerts');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('TOKEN_MISSING');
  });

  it('POST /api/v1/products should require admin token (401)', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .send({ name: 'Test Product', brand: 'Brand', category: 'Category', currentPrice: 1000 });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/products/:id/history should return 404 for non-existent product', async () => {
    const res = await request(app).get('/api/v1/products/non-existent-uuid/history');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('PRODUCT_NOT_FOUND');
  });

  it('POST /api/v1/ai/analyze should require authentication (401)', async () => {
    const res = await request(app)
      .post('/api/v1/ai/analyze')
      .send({ productId: 'some-uuid' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('TOKEN_MISSING');
  });

  it('POST /api/v1/ai/analyze should return 404 when product does not exist', async () => {
    // Mock user for requireAuth
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
      id: mockUserId,
      name: 'Test User',
      email: 'test@example.com',
      role: 'USER'
    });

    const res = await request(app)
      .post('/api/v1/ai/analyze')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ productId: 'non-existent-product-id' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('PRODUCT_NOT_FOUND');
  });

  it('POST /api/v1/ai/analyze with missing productId should fail validation (400)', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
      id: mockUserId,
      name: 'Test User',
      email: 'test@example.com',
      role: 'USER'
    });

    const res = await request(app)
      .post('/api/v1/ai/analyze')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/v1/ai/analyze should return cached analysis (isCached: true) when valid cache exists', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
      id: mockUserId,
      name: 'Test User',
      email: 'test@example.com',
      role: 'USER'
    });
    vi.spyOn(prisma.aIAnalysis, 'findFirst').mockResolvedValueOnce({
      id: 'analysis-1',
      productId: 'prod-123',
      currentPrice: 100000,
      predictedPrice: 96000,
      decision: 'BUY_NOW',
      confidence: 90,
      reasoning: ['Cached reason'],
      discountAuthentic: true,
      discountScore: 85,
      createdAt: new Date()
    });

    const res = await request(app)
      .post('/api/v1/ai/analyze')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ productId: 'prod-123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isCached).toBe(true);
    expect(res.body.data.decision).toBe('BUY_NOW');
  });

  it('POST /api/v1/ai/analyze with forceRefresh: true should bypass cache (isCached: false) and persist new analysis', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
      id: mockUserId,
      name: 'Test User',
      email: 'test@example.com',
      role: 'USER'
    });
    vi.spyOn(prisma.product, 'findUnique').mockResolvedValueOnce({
      id: 'prod-123',
      name: 'Test Laptop',
      brand: 'BrandX',
      category: 'Laptops',
      currentPrice: 50000,
      prices: [],
      history: [],
      analyses: []
    });

    const findFirstSpy = vi.spyOn(prisma.aIAnalysis, 'findFirst');
    const createSpy = vi.spyOn(prisma.aIAnalysis, 'create').mockResolvedValueOnce({
      id: 'analysis-new',
      productId: 'prod-123',
      currentPrice: 50000,
      predictedPrice: 48000,
      decision: 'BUY_NOW',
      confidence: 88,
      reasoning: ['Fresh analysis'],
      discountAuthentic: true,
      discountScore: 84,
      createdAt: new Date()
    });

    const res = await request(app)
      .post('/api/v1/ai/analyze')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ productId: 'prod-123', forceRefresh: true });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isCached).toBe(false);
    expect(findFirstSpy).not.toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
  });

  // Price Alert Route Tests
  const userMock = {
    id: mockUserId,
    name: 'Test User',
    email: 'test@example.com',
    role: 'USER'
  };

  it('GET /api/v1/alerts/:id should succeed for owner', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(userMock);
    vi.spyOn(prisma.priceAlert, 'findUnique').mockResolvedValueOnce({
      id: 'alert-123',
      userId: mockUserId,
      productId: 'prod-123',
      targetPrice: 100000,
      status: 'ACTIVE',
      createdAt: new Date(),
      triggeredAt: null,
      product: {
        id: 'prod-123',
        name: 'Test Smartphone',
        imageUrl: 'http://example.com/phone.jpg',
        currentPrice: 105000
      }
    });

    const res = await request(app)
      .get('/api/v1/alerts/alert-123')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('alert-123');
    expect(res.body.data.targetPrice).toBe(100000);
  });

  it("GET /api/v1/alerts/:id should reject another user's alert with NOT_FOUND", async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(userMock);
    vi.spyOn(prisma.priceAlert, 'findUnique').mockResolvedValueOnce({
      id: 'alert-456',
      userId: 'other-user-id',
      productId: 'prod-123',
      targetPrice: 100000,
      status: 'ACTIVE'
    });

    const res = await request(app)
      .get('/api/v1/alerts/alert-456')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('ALERT_NOT_FOUND');
  });

  it('PATCH /api/v1/alerts/:id should require authentication (401)', async () => {
    const res = await request(app)
      .patch('/api/v1/alerts/alert-123')
      .send({ targetPrice: 95000 });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('TOKEN_MISSING');
  });

  it('PATCH /api/v1/alerts/:id with invalid targetPrice should fail validation (400)', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(userMock);

    const res = await request(app)
      .patch('/api/v1/alerts/alert-123')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ targetPrice: -500 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('PATCH /api/v1/alerts/:id for nonexistent alert should return 404', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(userMock);
    vi.spyOn(prisma.priceAlert, 'findUnique').mockResolvedValueOnce(null);

    const res = await request(app)
      .patch('/api/v1/alerts/nonexistent-alert-id')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ targetPrice: 95000 });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('ALERT_NOT_FOUND');
  });

  it('PATCH /api/v1/alerts/:id should succeed for owner with valid targetPrice', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(userMock);
    vi.spyOn(prisma.priceAlert, 'findUnique').mockResolvedValueOnce({
      id: 'alert-123',
      userId: mockUserId,
      productId: 'prod-123',
      targetPrice: 100000,
      status: 'ACTIVE'
    });
    vi.spyOn(prisma.priceAlert, 'update').mockResolvedValueOnce({
      id: 'alert-123',
      userId: mockUserId,
      productId: 'prod-123',
      targetPrice: 95000,
      status: 'ACTIVE',
      createdAt: new Date(),
      triggeredAt: null,
      product: {
        id: 'prod-123',
        name: 'Test Smartphone',
        imageUrl: 'http://example.com/phone.jpg',
        currentPrice: 105000
      }
    });

    const res = await request(app)
      .patch('/api/v1/alerts/alert-123')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ targetPrice: 95000 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.targetPrice).toBe(95000);
    expect(res.body.data.id).toBe('alert-123');
  });

  it('DELETE /api/v1/alerts/:id should require authentication (401)', async () => {
    const res = await request(app).delete('/api/v1/alerts/alert-123');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('TOKEN_MISSING');
  });

  it('DELETE /api/v1/alerts/:id for nonexistent alert should return 404', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(userMock);
    vi.spyOn(prisma.priceAlert, 'findUnique').mockResolvedValueOnce(null);

    const res = await request(app)
      .delete('/api/v1/alerts/nonexistent-alert-id')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('ALERT_NOT_FOUND');
  });

  it('DELETE /api/v1/alerts/:id should succeed for owner', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(userMock);
    vi.spyOn(prisma.priceAlert, 'findUnique').mockResolvedValueOnce({
      id: 'alert-123',
      userId: mockUserId,
      productId: 'prod-123',
      targetPrice: 100000,
      status: 'ACTIVE'
    });
    vi.spyOn(prisma.priceAlert, 'delete').mockResolvedValueOnce({
      id: 'alert-123'
    });

    const res = await request(app)
      .delete('/api/v1/alerts/alert-123')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Alert deleted successfully');
  });
});
