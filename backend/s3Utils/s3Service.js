const { Upload } = require('@aws-sdk/lib-storage');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, BUCKET_NAME } = require('./s3Client');

async function uploadFileToS3(file, folder = 'uploads') {
  const fileName = `${Date.now()}-${file.originalname}`;
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: `${folder}/${fileName}`, // Уникальный путь и имя файла в S3
    Body: file.buffer,  // Содержимое файла
    ContentType: file.mimetype, // MIME-тип файла
    ACL: 'public-read', // Публичный доступ
  };

  try {
    const upload = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    const data = await upload.done();
    const fileUrl = `https://${BUCKET_NAME}.s3.timeweb.cloud/${folder}/${fileName}`;

    // console.log(data, 'data здесь');    

    return fileUrl; 
  } catch (err) {
    console.error('Ошибка при загрузке файла на S3:', err);
    throw err;
  }
}

async function deleteFileFromS3(fileName, folder = 'uploads') {
  const deleteParams = {
    Bucket: BUCKET_NAME,
    Key: `${folder}/${fileName}`, 
  };

  try {
    await s3Client.send(new DeleteObjectCommand(deleteParams));
  } catch (err) {
    console.error('Ошибка при удалении файла с S3:', err);
    throw err;
  }
}

module.exports = { uploadFileToS3, deleteFileFromS3 };
