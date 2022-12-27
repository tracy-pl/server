import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { GoogleOauthGuard } from '../guards/google-oauth.guard';
import { GoogleUser } from './dto/GoogleUser.dto';

import { GoogleAuthService } from './google-auth.service';

@Controller()
export class GoogleAuthController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthService,
  ) {}

  @Get('googleauth')
  @UseGuards(GoogleOauthGuard)
  async googleAuth(): Promise<void> {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async google(@Req() req: Request & { user: GoogleUser }): Promise<unknown> {
    const jwtToken = await this.googleAuthenticationService.authenticate(
      req.user,
    );

    return jwtToken;
  }
}
