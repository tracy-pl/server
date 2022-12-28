import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from '~modules/users/roles/role.enum';
import { ROLES_KEY } from '~modules/users/roles/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) return true;

    const req = context.switchToHttp().getRequest();

    return requiredRoles.some((role) => req.user?.roles?.includes(role));
  }
}
