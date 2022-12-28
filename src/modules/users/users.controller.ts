import { Express } from 'express';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetId } from '../common/dto/requests.dto';

import MongooseClassSerializerInterceptor from '../common/interceptors/mongooseClassSerializer.interceptor';

import { Role } from './roles/role.enum';
import { Roles } from './roles/roles.decorator';
import { User } from '../common/schemas/user.schema';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PatchProfileDTO } from './dto/requests.dto';
import RequestWithJWT from '../common/interfaces/RequestWithJWT';

@Controller('users')
@ApiTags('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin)
  getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('profile')
  // @UseGuards(EmailConfirmationGuard)
  getProfile(@Request() req): Promise<User> {
    return this.usersService.findById(req.user.userId);
  }

  @Patch('profile')
  async update(
    @Body() profile: PatchProfileDTO,
    @Request() req: RequestWithJWT,
  ): Promise<User> {
    return this.usersService.updateProfile(req.user.userId, {
      about: profile.about,
      name: profile.name,
    });
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param() params: GetId): Promise<void> {
    const { id } = params;
    return this.usersService.remove(id);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string }> {
    let savedFile;
    try {
      savedFile = await this.usersService.addAvatar(
        req.user.userId,
        file.buffer,
        file.originalname,
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
    return { url: savedFile.url };
  }
}
