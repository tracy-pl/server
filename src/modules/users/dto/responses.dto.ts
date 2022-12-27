import { Role } from '../roles/role.enum';

export class UserResponseDto {
  email: string;
  roles: Role[];
}
