import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '~modules/users/roles/role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.accessSecret'),
    });
  }

  async validate(payload: {
    email: string;
    sub: string;
    emailIsConfirmed: boolean;
    roles: Role[];
  }): Promise<{
    userId: string;
    email: string;
    emailIsConfirmed: boolean;
    roles: Role[];
  }> {
    //add revoked tokens check

    return {
      userId: payload.sub,
      email: payload.email,
      emailIsConfirmed: payload.emailIsConfirmed,
      roles: payload.roles,
    };
  }
}
