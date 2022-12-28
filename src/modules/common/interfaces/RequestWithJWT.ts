import { Request } from 'express';
import { Role } from '~modules/users/roles/role.enum';

interface RequestWithJWT extends Request {
  user: {
    userId: string;
    email: string;
    emailIsConfirmed: boolean;
    roles: Role[];
  };
}

export default RequestWithJWT;
