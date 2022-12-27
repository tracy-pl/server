import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser>(err, user: TUser, info): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException(info.message);
    }
    return user;
  }
}
