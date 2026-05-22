import { Injectable, Logger } from "@nestjs/common";
import { procedure, protectedProcedure, t } from "../base/index.js";

@Injectable()
export class AuthRouter {
  private readonly logger = new Logger(AuthRouter.name);

  public readonly router = t.router({
    getUser: procedure.query(({ ctx }) => ({
      userId: ctx.auth.userId,
      email: ctx.auth.email,
      username: ctx.auth.username,
      isAuthenticated: ctx.auth.isAuthenticated,
    })),

    me: protectedProcedure.query(({ ctx }) => ({
      userId: ctx.auth.userId!,
      email: ctx.auth.email!,
      username: ctx.auth.username!,
    })),
  });
}
