-- CreateEnum
CREATE TYPE "PurchaseDecision" AS ENUM ('BUY_NOW', 'WAIT', 'PRICE_INCREASE');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "productUrl" TEXT,
    "currentPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "originalPrice" DOUBLE PRECISION,
    "discountPercentage" DOUBLE PRECISION,
    "rating" DOUBLE PRECISION DEFAULT 4.5,
    "reviewCount" INTEGER DEFAULT 0,
    "platform" TEXT DEFAULT 'Amazon',
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_prices" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "originalPrice" DOUBLE PRECISION,
    "discountPercentage" DOUBLE PRECISION,
    "productUrl" TEXT,
    "availability" BOOLEAN NOT NULL DEFAULT true,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_histories" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "platform" TEXT NOT NULL DEFAULT 'Amazon',
    "price" DOUBLE PRECISION NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_analyses" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "currentPrice" DOUBLE PRECISION NOT NULL,
    "predictedPrice" DOUBLE PRECISION NOT NULL,
    "decision" "PurchaseDecision" NOT NULL,
    "confidence" INTEGER NOT NULL,
    "reasoning" TEXT[],
    "discountAuthentic" BOOLEAN NOT NULL DEFAULT true,
    "discountScore" INTEGER NOT NULL DEFAULT 80,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_alerts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "targetPrice" DOUBLE PRECISION NOT NULL,
    "status" "AlertStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "triggeredAt" TIMESTAMP(3),

    CONSTRAINT "price_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "products_category_idx" ON "products"("category");

-- CreateIndex
CREATE INDEX "products_brand_idx" ON "products"("brand");

-- CreateIndex
CREATE INDEX "platform_prices_productId_idx" ON "platform_prices"("productId");

-- CreateIndex
CREATE INDEX "platform_prices_platform_idx" ON "platform_prices"("platform");

-- CreateIndex
CREATE INDEX "price_histories_productId_recordedAt_idx" ON "price_histories"("productId", "recordedAt");

-- CreateIndex
CREATE INDEX "ai_analyses_productId_createdAt_idx" ON "ai_analyses"("productId", "createdAt");

-- CreateIndex
CREATE INDEX "price_alerts_userId_idx" ON "price_alerts"("userId");

-- CreateIndex
CREATE INDEX "price_alerts_productId_idx" ON "price_alerts"("productId");

-- AddForeignKey
ALTER TABLE "platform_prices" ADD CONSTRAINT "platform_prices_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_histories" ADD CONSTRAINT "price_histories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_analyses" ADD CONSTRAINT "ai_analyses_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_alerts" ADD CONSTRAINT "price_alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_alerts" ADD CONSTRAINT "price_alerts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
