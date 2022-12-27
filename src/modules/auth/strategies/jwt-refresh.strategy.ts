import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.refreshSecret'),
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    payload: {
      sub: string;
    },
  ): Promise<{ userId: string; refreshToken: string }> {
    const refreshToken = request.headers['authorization'].split(' ')[1];

    return { userId: payload.sub, refreshToken };
  }
}
