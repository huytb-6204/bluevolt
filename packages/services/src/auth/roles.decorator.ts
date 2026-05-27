import { SetMetadata } from "@nestjs/common";
import type { Role } from "./auth.service.js";

export const ROLES_KEY = "roles";

/**
 * Restrict a route to one or more roles.
 * Usage: @Roles("ADMIN", "SUPERADMIN")
 * Must be combined with JwtAuthGuard + RolesGuard.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
