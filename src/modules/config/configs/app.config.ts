import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.APP_PORT || process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV,
  name: process.env.APP_NAME,
  workingDirectory: process.env.PWD || process.cwd(),
  apiUrl: process.env.API_URL,
  webAppUrl: process.env.WEB_APP_URL,
}));
