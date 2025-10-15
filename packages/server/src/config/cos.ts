import COS from 'cos-nodejs-sdk-v5';
import dotenv from 'dotenv';

dotenv.config();

export const cos = new COS({
  SecretId: process.env.TENCENT_SECRET_ID!,
  SecretKey: process.env.TENCENT_SECRET_KEY!,
  Region: process.env.COS_REGION || 'ap-beijing'
});

export const cosConfig = {
  videoBucket: process.env.COS_BUCKET_VIDEOS!,
  imageBucket: process.env.COS_BUCKET_IMAGES!,
  region: process.env.COS_REGION || 'ap-beijing',
  cdnDomain: process.env.CDN_DOMAIN
};

export default cos;