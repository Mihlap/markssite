require('dotenv').config();
const { S3Client } = require('@aws-sdk/client-s3');

const ACCESS_KEY = process.env.S3_ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

const s3Client = new S3Client({
  region: "ru-1",
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true, 
});

module.exports = { s3Client, BUCKET_NAME };
