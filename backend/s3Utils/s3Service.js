const { Upload } = require('@aws-sdk/lib-storage');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, BUCKET_NAME } = require('./s3Client');

async function uploadFileToS3(file, folder) {
  const fileName = file.originalname;
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: `${folder}/${fileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  try {
    const upload = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    await upload.done();
    const fileUrl = `https://${BUCKET_NAME}.s3.timeweb.cloud/${folder}/${fileName}`;

    return fileUrl; 
  } catch (err) {
    console.error('Ошибка при загрузке файла на S3:', err);
    throw err;
  }
}

async function deleteFileFromS3(fileName, folder) {
 const key = `${folder}/${fileName}`; 
  const deleteParams = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(deleteParams));
  } catch (err) {
    console.error('Ошибка при удалении файла с S3:', err);
    throw err;
  }
}

module.exports = { uploadFileToS3, deleteFileFromS3 };
