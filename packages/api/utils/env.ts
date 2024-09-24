import { z } from "zod";

export type Env = z.infer<typeof envSchema>;

declare global {
    namespace NodeJS {
        interface ProcessEnv extends Env {}
    }
}

const envSchema = z.object({
    MONGO_URI: z.string(),
    AUTH0_DOMAIN: z.string(),
    AUTH0_CLIENT_ID: z.string(),
    AUTH0_CLIENT_SECRET: z.string(),
    AUTH0_REDIRECT_URI: z.string(),
    R2_CLIENT_ID: z.string(),
    R2_CLIENT_SECRET: z.string(),
    R2_BUCKET_ENDPOINT: z.string(),
    R2_BUCKET_REGION: z.string(),
    R2_BUCKET_NAME: z.string(),
    R2_PUBLIC_URL: z.string(),
    APP_URI: z.string(),
    GEMINI_API_KEY: z.string(),
    DEEPGRAM_API_KEY: z.string(),
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: z.string(),
    PORT: z.string(),
});

export const env = envSchema.parse(process.env);