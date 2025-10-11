import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as { id: number; email: string; role: string; isPremium: boolean };

    console.log('AdminGuard: Checking user:', user);
    if (!user || !['ADMIN', 'SUPERADMIN'].includes(user.role)) {
      console.log('AdminGuard: Access denied, role:', user?.role);
      throw new ForbiddenException('Admin access required');
    }
    return true;
  }
}