import { IsEmail, IsUrl } from 'class-validator';

export class GoogleUser {
  @IsEmail()
  email: string;

  firstName: string;
  lastName: string;
  @IsUrl()
  picture: string;

  accessToken: string;
}
