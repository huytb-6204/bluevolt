import { Injectable, Logger } from "@nestjs/common";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AuthService } from "@repo/services";
import { Request, Response } from "express";
import { AppRouterClass } from "./routers/index.js";
import { AuthData, TRPCContext } from "./context/index.js";
import { Redis } from "ioredis";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TRPCService {
  private readonly logger = new Logger(TRPCService.name);
  private readonly redis?: Redis;
  private readonly TOKEN_EXPIRY = 5 * 60;
  private readonly useRedisCaching: boolean;

  constructor(
    private readonly authService: AuthService,
    private readonly appRouterService: AppRouterClass,
    private readonly configService: ConfigService,
  ) {
    this.useRedisCaching = this.configService.get<boolean>(
      "USE_REDIS_CACHING",
      true,
    );

    if (!this.useRedisCaching) {
      this.logger.warn(
        "⚠️ Redis caching is DISABLED - auth performance will be slower",
      );
      return;
    }

    const redisUrl = this.configService.get<string>("REDIS_URL");
    if (redisUrl) {
      this.redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        connectTimeout: 500,
      });
    } else {
      this.redis = new Redis({
        host: this.configService.get<string>("REDIS_HOST", "localhost"),
        port: this.configService.get<number>("REDIS_PORT", 6379),
        password: this.configService.get<string>("REDIS_PASSWORD", ""),
        maxRetriesPerRequest: 3,
        connectTimeout: 500,
        retryStrategy: (times) => Math.min(times * 50, 2000),
      });
    }

    this.redis.on("error", (err: Error) => {
      this.logger.error(`Redis connection error: ${err.message}`);
    });
    this.redis.on("connect", () => {
      this.logger.log("Successfully connected to Redis");
    });
  }

  private async createContext({
    req,
    res,
  }: {
    req: Request;
    res: Response;
  }): Promise<TRPCContext> {
    const context: TRPCContext = {
      req,
      res,
      auth: {
        userId: null,
        isAuthenticated: false,
        email: null,
        username: null,
      },
    };

    const authHeader = req?.headers?.authorization;
    if (!authHeader) return context;

    const [type, token] = authHeader.split(" ");
    if (type !== "Bearer" || !token) return context;

    try {
      if (this.useRedisCaching && this.redis) {
        const cacheKey = `auth:token:${token}`;
        const cached = await this.redis.get(cacheKey);
        if (cached) {
          context.auth = JSON.parse(cached) as AuthData;
          return context;
        }
      }

      const payload = await this.authService.verifyAccessToken(token);
      if (payload) {
        const authData: AuthData = {
          userId: payload.sub,
          isAuthenticated: true,
          email: payload.email,
          username: payload.username,
        };
        context.auth = authData;

        if (this.useRedisCaching && this.redis) {
          const cacheKey = `auth:token:${token}`;
          await this.redis.set(
            cacheKey,
            JSON.stringify(authData),
            "EX",
            this.TOKEN_EXPIRY,
          );
        }
      }
    } catch {
      // swallow errors silently
    }

    return context;
  }

  public get router() {
    return this.appRouterService.router;
  }

  applyMiddleware(app: NestExpressApplication) {
    this.logger.log("Applying tRPC middleware to NestJS application");
    app.use(
      "/trpc",
      createExpressMiddleware({
        router: this.router,
        createContext: ({ req, res }) => this.createContext({ req, res }),
      }),
    );
    this.logger.log("tRPC middleware applied successfully");
  }
}
