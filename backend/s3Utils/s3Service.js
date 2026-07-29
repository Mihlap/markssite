const { Upload } = require('@aws-sdk/lib-storage');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, BUCKET_NAME } = require('./s3Client');
const { logFileAction } = require('../utils/fileLogger');
const { compressImageForS3 } = require('../utils/compressImageForS3');

async function uploadFileToS3(file, folder, logInfo = null) {
  const prepared = await compressImageForS3(file);
  const fileName = prepared.originalname;
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: `${folder}/${fileName}`,
    Body: prepared.buffer,
    ContentType: prepared.mimetype,
    ACL: 'public-read',
  };

  try {
    const upload = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    await upload.done();
    const fileUrl = `https://${BUCKET_NAME}.s3.timeweb.cloud/${folder}/${fileName}`;

    if (logInfo?.userName && logInfo?.userId) {
      logFileAction({
        action: 'UPLOAD',
        userName: logInfo.userName,
        userId: logInfo.userId,
        fileName,
        filePath: folder,
        fileUrl,
        resourceType: logInfo.resourceType || null,
        resourceId: logInfo.resourceId || null,
      });
    }

    return fileUrl;
  } catch (err) {
    console.error('Ошибка при загрузке файла на S3:', err);
    throw err;
  }
}

async function deleteFileFromS3(fileName, folder, logInfo = null) {
  const key = `${folder}/${fileName}`;
  const deleteParams = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(deleteParams));

    if (logInfo?.userName && logInfo?.userId) {
      logFileAction({
        action: 'DELETE',
        userName: logInfo.userName,
        userId: logInfo.userId,
        fileName,
        filePath: folder,
        resourceType: logInfo.resourceType || null,
        resourceId: logInfo.resourceId || null,
      });
    }
  } catch (err) {
    console.error('Ошибка при удалении файла с S3:', err);
    throw err;
  }
}

module.exports = { uploadFileToS3, deleteFileFromS3 };
