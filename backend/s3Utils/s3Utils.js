const { S3Client } = require('@aws-sdk/client-s3'); 

const s3Client = new S3Client({
  region: 'ru-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  endpoint: 'https://s3.timeweb.cloud',
  forcePathStyle: true,
});

module.exports = { s3Client };
