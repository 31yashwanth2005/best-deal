import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/bestdeal_db?schema=public'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters').default('bestdeal_jwt_secret_key_production_grade_32chars_min'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  GEMINI_API_KEY: z.string().optional().default(''),
  AI_CACHE_TTL: z.string().default('86400').transform((val) => parseInt(val, 10)),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform((val) => parseInt(val, 10)),
  RATE_LIMIT_MAX: z.string().default('100').transform((val) => parseInt(val, 10)),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Environment validation error:', JSON.stringify(result.error.format(), null, 2));
    throw new Error('Invalid environment variables');
  }
  return result.data;
};

export const env = parseEnv();
export default env;
