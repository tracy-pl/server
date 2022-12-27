import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest<TUser>(err, user: TUser): TUser {
    if (err || !user) {
      throw new UnauthorizedException('Wrong email or password');
    }
    return user;
  }
}
