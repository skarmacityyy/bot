import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DISCORD_TOKEN: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_GUILD_ID: z.string().optional(),
  POSTGRES_URI: z.string().url(),
  REDIS_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.string().default('info'),
  TRANSCRIPT_DIR: z.string().default('./data/transcripts'),
  MAINTENANCE_BYPASS_ROLE_ID: z.string().optional()
});

export const env = schema.parse(process.env);
