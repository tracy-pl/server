import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  tokenSecret: process.env.EMAIL_TOKEN_SECRET,
  tokenExpiresIn: '2160s',
  confirmationUrl: `${process.env.API_URL}/auth/confirm-email`,
  dropPasswordUrl: `${process.env.WEB_APP_URL}/auth/update-password`,
  service: process.env.EMAIL_SERVICE,
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true' || false,
  sender: process.env.EMAIL_SENDER,
}));
