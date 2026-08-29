import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

    PORT: z.coerce.number().int().positive().default(8080),

    DATABASE_URL: z.url(),

    REDIS_URL: z.url(),

    LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),

    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(32),

    GOOGLE_CLIENT_ID: z.string().min(1).optional(),
    GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),

    CLIENT_URL: z.url(),

    YOUTUBE_API_KEY: z.string().min(1),

    AWS_REGION: z.string().min(1),
    AWS_S3_BUCKET: z.string().min(1),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),

    SQS_CUSTOM_TRACK_QUEUE_URL: z.url(),

    MAX_CUSTOM_TRACK_SIZE_MB: z.coerce
    .number()
    .positive()
    .default(50),
});

export const env = envSchema.parse(process.env);
