import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  publicBucketName: process.env.AWS_PUBLIC_BUCKET_NAME,
  bucketUrl: `https://${process.env.AWS_PUBLIC_BUCKET_NAME}.s3.amazonaws.com`,
  bucketUrlRegion: `https://${process.env.AWS_PUBLIC_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
  formActionUrl: `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_PUBLIC_BUCKET_NAME}`,
}));
