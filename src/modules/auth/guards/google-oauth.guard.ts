import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class GoogleOauthGuard extends AuthGuard('googleOAuth') {
  constructor() {
    super({
      prompt: 'select_account',
    });
  }
  handleRequest<TUser>(err, user: TUser): TUser {
    if (err) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
