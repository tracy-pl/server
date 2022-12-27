import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class PatchProfileDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @Matches(/^[a-zA-Z0-9\.]*$/, {
    message: 'No symbols in name',
  })
  name: string;

  @IsString()
  @IsOptional()
  @Matches(/^[a-zA-Z0-9\.\s\,]*$/, {
    message: 'Symbol forbidden',
  })
  about?: string;
}
