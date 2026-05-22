import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  client: {
    NEXT_PUBLIC_IS_PRODUCTION: z.boolean().default(false),
    NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3001"),
    NEXT_PUBLIC_SOCKET_PATH: z.string().default("/socket.io"),
    NEXT_PUBLIC_TRPC_URL: z
      .string()
      .url()
      .default("http://localhost:3001/trpc"),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_HOST: z
      .string()
      .url()
      .default("https://app.posthog.com"),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_IS_PRODUCTION: process.env.NEXT_PUBLIC_IS_PRODUCTION,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SOCKET_PATH: process.env.NEXT_PUBLIC_SOCKET_PATH,
    NEXT_PUBLIC_TRPC_URL: process.env.NEXT_PUBLIC_TRPC_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },
});
