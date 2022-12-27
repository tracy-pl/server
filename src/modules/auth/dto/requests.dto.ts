import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginRequest {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class RegisterRequest {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}

export class EmailTokenRequest {
  @IsNotEmpty()
  @IsString()
  token: string;
}

export class DroppasswordRequest {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}

export class ConfirmDroppasswordRequest {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
}
