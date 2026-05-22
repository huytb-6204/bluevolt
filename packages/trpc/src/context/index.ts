import { Request, Response } from "express";

export interface AuthData {
  userId: string | null;
  isAuthenticated: boolean;
  email: string | null;
  username: string | null;
}

export interface TRPCContext {
  req: Request;
  res: Response;
  auth: AuthData;
}
