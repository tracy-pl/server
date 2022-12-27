import { Request } from 'express';

interface RequestWithJWT extends Request {
  user: { userId: string; email: string; emailIsConfirmed: boolean };
}

export default RequestWithJWT;
