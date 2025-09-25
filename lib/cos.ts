import COS from 'cos-nodejs-sdk-v5';

export const cos = new COS({
    SecretId: process.env.TENCENT_SECRET_ID as string,
    SecretKey: process.env.TENCENT_SECRET_KEY as string,
});

export const BUCKET = process.env.TENCENT_BUCKET as string;
export const REGION = process.env.TENCENT_REGION as string;
