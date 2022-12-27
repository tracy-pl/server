import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  mongo: {
    host: process.env.MONGO_HOST,
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    database: process.env.MONGO_DATABASE,
    mongoDbUrl: process.env.MONGO_DB_URL,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
}));
