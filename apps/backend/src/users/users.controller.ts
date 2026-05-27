import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { IsIn, IsOptional, IsString } from "class-validator";
import {
  JwtAuthGuard,
  RolesGuard,
  Roles,
  ROLES,
  type Role,
} from "@repo/services";
import { AuthAppService } from "../auth/auth-app.service.js";

class UpdateRoleDto {
  @IsString()
  @IsIn(ROLES as unknown as string[])
  role!: Role;
}

class ListUsersQueryDto {
  @IsOptional()
  @IsString()
  skip?: string;

  @IsOptional()
  @IsString()
  take?: string;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN", "SUPERADMIN")
@Controller("users")
export class UsersController {
  constructor(private readonly service: AuthAppService) {}

  @Get()
  list(@Query() query: ListUsersQueryDto) {
    const skip = query.skip ? parseInt(query.skip, 10) : 0;
    const take = query.take ? parseInt(query.take, 10) : 50;
    return this.service.listUsers(
      Number.isNaN(skip) ? 0 : skip,
      Number.isNaN(take) ? 50 : take,
    );
  }

  @Patch(":id/role")
  setRole(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.service.setUserRole(id, dto.role);
  }
}
