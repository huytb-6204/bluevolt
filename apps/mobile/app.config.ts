import { z } from "zod";
import { ExpoConfig, ConfigContext } from "expo/config";

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  EXPO_PUBLIC_TRPC_URL: z.string().url(),
  EXPO_PUBLIC_POSTHOG_KEY: z.string().min(1),
  EXPO_PUBLIC_POSTHOG_HOST: z.string().url().default("https://app.posthog.com"),
});

function validateEnv() {
  try {
    const parsedEnv = envSchema.parse({
      EXPO_PUBLIC_TRPC_URL: process.env.EXPO_PUBLIC_TRPC_URL,
      EXPO_PUBLIC_POSTHOG_KEY: process.env.EXPO_PUBLIC_POSTHOG_KEY,
      EXPO_PUBLIC_POSTHOG_HOST: process.env.EXPO_PUBLIC_POSTHOG_HOST,
    });
    console.log("\x1b[32m%s\x1b[0m", "✅ Environment validation passed");
    return parsedEnv;
  } catch (error: unknown) {
    console.error("\x1b[31m%s\x1b[0m", "❌ Environment validation failed:");
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`);
      });
    } else if (error instanceof Error) {
      console.error("\x1b[31m%s\x1b[0m", error.message);
    }
    process.exit(1);
  }
}

validateEnv();

const baseConfig: Omit<ExpoConfig, "extra"> = {
  name: "App Name",
  slug: "nextjs-nestjs-expo-template",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/logo.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/logo.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.yourcompany.appslug",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/logo.png",
      backgroundColor: "#ffffff",
    },
    package: "com.yourcompany.appslug",
  },
  experiments: {
    tsconfigPaths: true,
  },
  scheme: "appslug",
  web: {
    bundler: "metro",
  },
  owner: "baris5",
  newArchEnabled: true,
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const extraConfig = {
    EXPO_PUBLIC_TRPC_URL: process.env.EXPO_PUBLIC_TRPC_URL,
    EXPO_PUBLIC_POSTHOG_KEY: process.env.EXPO_PUBLIC_POSTHOG_KEY,
    EXPO_PUBLIC_POSTHOG_HOST:
      process.env.EXPO_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    eas: {
      projectId:
        process.env.EAS_PROJECT_ID || "e990666e-c30f-4c41-8abd-c5a562c79cdc",
    },
  };

  return {
    ...config,
    ...baseConfig,
    extra: {
      ...config.extra,
      ...extraConfig,
    },
  };
};
