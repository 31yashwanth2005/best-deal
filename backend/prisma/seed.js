import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create Demo Users
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('Admin@123456', salt);
  const userPasswordHash = await bcrypt.hash('User@123456', salt);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@bestdeal.ai' },
    update: {},
    create: {
      name: 'BestDeal Admin',
      email: 'admin@bestdeal.ai',
      passwordHash: adminPasswordHash,
      role: 'ADMIN'
    }
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'user@bestdeal.ai' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'user@bestdeal.ai',
      passwordHash: userPasswordHash,
      role: 'USER'
    }
  });

  console.log('✅ Demo Users created:', { admin: admin.email, user: demoUser.email });

  // 2. Clean old product seed data if needed
  await prisma.priceAlert.deleteMany();
  await prisma.aIAnalysis.deleteMany();
  await prisma.priceHistory.deleteMany();
  await prisma.platformPrice.deleteMany();
  await prisma.product.deleteMany();

  // 3. Seed Products with Platform Prices & Historical Prices
  const products = [
    {
      name: 'Apple iPhone 16 Pro (128GB, Natural Titanium)',
      brand: 'Apple',
      category: 'Mobiles',
      description: 'Features A18 Pro chip, Camera Control, 48MP Fusion camera, and grade 5 titanium design.',
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
      productUrl: 'https://www.amazon.in/s?k=Apple+iPhone+16+Pro+128GB+Natural+Titanium',
      currentPrice: 119900,
      originalPrice: 129900,
      discountPercentage: 8,
      rating: 4.8,
      reviewCount: 1420,
      platform: 'Amazon',
      inStock: true,
      prices: [
        { platform: 'Amazon', price: 119900, originalPrice: 129900, discountPercentage: 8, productUrl: 'https://www.amazon.in/s?k=Apple+iPhone+16+Pro+128GB+Natural+Titanium', availability: true },
        { platform: 'Flipkart', price: 121990, originalPrice: 129900, discountPercentage: 6, productUrl: 'https://www.flipkart.com/apple-iphone-16-pro-natural-titanium-128-gb/p/itm4397c54ec56b7', availability: true }
      ],
      history: [
        { platform: 'Amazon', price: 129900, recordedAt: new Date(Date.now() - 86400000 * 120) },
        { platform: 'Amazon', price: 127500, recordedAt: new Date(Date.now() - 86400000 * 90) },
        { platform: 'Amazon', price: 124990, recordedAt: new Date(Date.now() - 86400000 * 60) },
        { platform: 'Amazon', price: 122900, recordedAt: new Date(Date.now() - 86400000 * 30) },
        { platform: 'Amazon', price: 119900, recordedAt: new Date() }
      ]
    },
    {
      name: 'Samsung Galaxy S25 Ultra 5G (256GB, Titanium Gray)',
      brand: 'Samsung',
      category: 'Mobiles',
      description: 'Galaxy AI powered flagship with 200MP quad camera system, Snapdragon 8 Gen 4, and integrated S Pen.',
      imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
      productUrl: 'https://www.amazon.in/s?k=Samsung+Galaxy+S25+Ultra+5G+256GB',
      currentPrice: 129999,
      originalPrice: 139999,
      discountPercentage: 7,
      rating: 4.7,
      reviewCount: 980,
      platform: 'Amazon',
      inStock: true,
      prices: [
        { platform: 'Amazon', price: 129999, originalPrice: 139999, discountPercentage: 7, productUrl: 'https://www.amazon.in/s?k=Samsung+Galaxy+S25+Ultra+5G+256GB', availability: true },
        { platform: 'Samsung Store', price: 134999, originalPrice: 139999, discountPercentage: 3, productUrl: 'https://www.samsung.com/in/search/?searchvalue=Samsung%20Galaxy%20S25%20Ultra', availability: true }
      ],
      history: [
        { platform: 'Amazon', price: 139999, recordedAt: new Date(Date.now() - 86400000 * 120) },
        { platform: 'Amazon', price: 136999, recordedAt: new Date(Date.now() - 86400000 * 90) },
        { platform: 'Amazon', price: 134999, recordedAt: new Date(Date.now() - 86400000 * 60) },
        { platform: 'Amazon', price: 131999, recordedAt: new Date(Date.now() - 86400000 * 30) },
        { platform: 'Amazon', price: 129999, recordedAt: new Date() }
      ]
    },
    {
      name: 'Apple MacBook Air M3 (15-inch, 16GB RAM, 512GB SSD)',
      brand: 'Apple',
      category: 'Laptops',
      description: 'Strikingly thin design with Liquid Retina display, M3 chip speed, and up to 18 hours battery life.',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
      productUrl: 'https://www.amazon.in/s?k=Apple+MacBook+Air+M3+15-inch+16GB+512GB',
      currentPrice: 134900,
      originalPrice: 154900,
      discountPercentage: 13,
      rating: 4.9,
      reviewCount: 640,
      platform: 'Amazon',
      inStock: true,
      prices: [
        { platform: 'Amazon', price: 134900, originalPrice: 154900, discountPercentage: 13, productUrl: 'https://www.amazon.in/s?k=Apple+MacBook+Air+M3+15-inch+16GB+512GB', availability: true }
      ],
      history: [
        { platform: 'Amazon', price: 154900, recordedAt: new Date(Date.now() - 86400000 * 120) },
        { platform: 'Amazon', price: 149900, recordedAt: new Date(Date.now() - 86400000 * 90) },
        { platform: 'Amazon', price: 144900, recordedAt: new Date(Date.now() - 86400000 * 60) },
        { platform: 'Amazon', price: 139900, recordedAt: new Date(Date.now() - 86400000 * 30) },
        { platform: 'Amazon', price: 134900, recordedAt: new Date() }
      ]
    },
    {
      name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
      brand: 'Sony',
      category: 'Accessories',
      description: 'Industry-leading noise canceling with two processors, 8 microphones, and crystal clear hands-free calling.',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      productUrl: 'https://www.flipkart.com/sony-wh-1000xm5-wireless-noise-cancellation-ai-reduction-bluetooth-wired/p/itm9ee097bc0ae76',
      currentPrice: 26990,
      originalPrice: 34990,
      discountPercentage: 23,
      rating: 4.6,
      reviewCount: 3120,
      platform: 'Flipkart',
      inStock: true,
      prices: [
        { platform: 'Flipkart', price: 26990, originalPrice: 34990, discountPercentage: 23, productUrl: 'https://www.flipkart.com/sony-wh-1000xm5-wireless-noise-cancellation-ai-reduction-bluetooth-wired/p/itm9ee097bc0ae76', availability: true },
        { platform: 'Amazon', price: 26990, originalPrice: 34990, discountPercentage: 23, productUrl: 'https://www.amazon.in/dp/B09XS7JWHH', availability: true }
      ],
      history: [
        { platform: 'Flipkart', price: 29990, recordedAt: new Date(Date.now() - 86400000 * 120) },
        { platform: 'Flipkart', price: 29990, recordedAt: new Date(Date.now() - 86400000 * 90) },
        { platform: 'Flipkart', price: 28990, recordedAt: new Date(Date.now() - 86400000 * 60) },
        { platform: 'Flipkart', price: 27990, recordedAt: new Date(Date.now() - 86400000 * 30) },
        { platform: 'Flipkart', price: 26990, recordedAt: new Date() }
      ]
    },
    {
      name: 'Sony PlayStation 5 Slim Console (Disc Edition)',
      brand: 'Sony',
      category: 'Gaming',
      description: 'Slim design with 1TB SSD storage, ultra-high speed SSD, ray tracing, and 4K TV gaming.',
      imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80',
      productUrl: 'https://www.amazon.in/s?k=Sony+PlayStation+5+Slim+Disc+Edition',
      currentPrice: 52990,
      originalPrice: 54990,
      discountPercentage: 4,
      rating: 4.9,
      reviewCount: 2150,
      platform: 'Amazon',
      inStock: true,
      prices: [
        { platform: 'Amazon', price: 52990, originalPrice: 54990, discountPercentage: 4, productUrl: 'https://www.amazon.in/s?k=Sony+PlayStation+5+Slim+Disc+Edition', availability: true },
        { platform: 'Flipkart', price: 53990, originalPrice: 54990, discountPercentage: 2, productUrl: 'https://www.flipkart.com/search?q=Sony%20PlayStation%205%20Slim%20Disc%20Edition', availability: true }
      ],
      history: [
        { platform: 'Amazon', price: 54990, recordedAt: new Date(Date.now() - 86400000 * 120) },
        { platform: 'Amazon', price: 49990, recordedAt: new Date(Date.now() - 86400000 * 90) },
        { platform: 'Amazon', price: 54990, recordedAt: new Date(Date.now() - 86400000 * 60) },
        { platform: 'Amazon', price: 53990, recordedAt: new Date(Date.now() - 86400000 * 30) },
        { platform: 'Amazon', price: 52990, recordedAt: new Date() }
      ]
    },
    {
      name: 'LG C3 55-inch 4K Smart OLED TV',
      brand: 'LG',
      category: 'Home Appliances',
      description: 'Self-lit OLED pixels, α9 AI Processor Gen6, Dolby Vision & Atmos, 120Hz refresh rate for gaming.',
      imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80',
      productUrl: 'https://www.amazon.in/s?k=LG+C3+55+inch+4K+Smart+OLED+TV',
      currentPrice: 114990,
      originalPrice: 169990,
      discountPercentage: 32,
      rating: 4.8,
      reviewCount: 430,
      platform: 'Amazon',
      inStock: true,
      prices: [
        { platform: 'Amazon', price: 114990, originalPrice: 169990, discountPercentage: 32, productUrl: 'https://www.amazon.in/s?k=LG+C3+55+inch+4K+Smart+OLED+TV', availability: true }
      ],
      history: [
        { platform: 'Amazon', price: 135000, recordedAt: new Date(Date.now() - 86400000 * 120) },
        { platform: 'Amazon', price: 129990, recordedAt: new Date(Date.now() - 86400000 * 90) },
        { platform: 'Amazon', price: 124990, recordedAt: new Date(Date.now() - 86400000 * 60) },
        { platform: 'Amazon', price: 119990, recordedAt: new Date(Date.now() - 86400000 * 30) },
        { platform: 'Amazon', price: 114990, recordedAt: new Date() }
      ]
    }
  ];

  for (const p of products) {
    const { prices, history, ...productData } = p;
    const createdProduct = await prisma.product.create({
      data: {
        ...productData,
        prices: {
          create: prices
        },
        history: {
          create: history
        }
      }
    });

    // Create initial AI analysis cache
    await prisma.aIAnalysis.create({
      data: {
        productId: createdProduct.id,
        currentPrice: createdProduct.currentPrice,
        predictedPrice: Math.round(createdProduct.currentPrice * 0.96),
        decision: 'BUY_NOW',
        confidence: 90,
        reasoning: [
          'Historical price analysis confirms current pricing is at 6-month lowest point.',
          'Authentic discount verified against primary e-commerce partners.',
          'High stock stability indicates peak buying opportunity.'
        ],
        discountAuthentic: true,
        discountScore: 88
      }
    });

    // Create a demo budget alert for demo user
    if (createdProduct.name.includes('iPhone')) {
      await prisma.priceAlert.create({
        data: {
          userId: demoUser.id,
          productId: createdProduct.id,
          targetPrice: 112000,
          status: 'ACTIVE'
        }
      });
    }
  }

  console.log('✅ Seed completed successfully! Products, prices, history, and alerts seeded.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
