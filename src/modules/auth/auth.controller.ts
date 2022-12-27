import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { User } from '~modules/common/schemas/user.schema';
import { Provider } from '~modules/users/providers/providers.enum';
import RequestWithJWT from '~modules/common/interfaces/RequestWithJWT';
import { MailConfirmationService } from '../mail/mailConfirmation.service';

import { AuthService } from './auth.service';
import {
  ConfirmDroppasswordRequest,
  DroppasswordRequest,
  EmailTokenRequest,
  LoginRequest,
  RegisterRequest,
} from './dto/requests.dto';
import { LoginResponse } from './dto/responses.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailConfirmationService: MailConfirmationService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: RequestWithJWT,
    @Body() _body: LoginRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const { accessToken, refreshToken } = await this.authService.createTokens(
      req.user,
    );
    res.header('accessToken', accessToken);
    res.header('refreshToken', refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Post('register')
  async register(@Body() credentials: RegisterRequest): Promise<void> {
    return this.authService.registerUser({
      ...credentials,
      provider: Provider.Local,
    });
  }

  @Get('confirm-email')
  async decodeToken(@Query() query: EmailTokenRequest): Promise<LoginResponse> {
    const email = await this.mailConfirmationService.getEmailFromToken(
      query.token,
    );
    const user = await this.mailConfirmationService.confirmEmail(email);
    return this.authService.createTokens(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('resend-confirm-email')
  async resendEmailConfirmLink(
    @Request() req: Request & { user: User },
  ): Promise<void> {
    this.authService.sendVerificationLink(req.user.email);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @Post('logout')
  async getProfile(@Request() req): Promise<void> {
    return this.authService.saveEmptyRefreshToken(req.user.userId);
  }

  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth('refreshToken')
  @Post('refresh')
  async refresh(@Request() req): Promise<LoginResponse> {
    return this.authService.compareRefreshToken(
      req.user.refreshToken,
      req.user.userId,
    );
  }

  @Post('droppassword')
  async droppasword(@Body() body: DroppasswordRequest): Promise<void> {
    const res = this.authService.sendDropPasswordToken(body.email);

    return res;
  }

  @Post('confirm-drop-password')
  async confirmDropPassword(
    @Body() body: ConfirmDroppasswordRequest,
  ): Promise<void> {
    const res = this.authService.updatePassword(body.token, body.password);
    return res;
  }
}
