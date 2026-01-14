const { Upload } = require('@aws-sdk/lib-storage');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, BUCKET_NAME } = require('./s3Client');
const { logFileAction } = require('../utils/fileLogger');

/**
 * Загружает файл на S3
 * @param {Object} file - Файл из multer
 * @param {string} folder - Папка для загрузки
 * @param {Object} logInfo - Информация для логирования
 * @param {string} logInfo.userName - Имя пользователя
 * @param {string} logInfo.userId - ID пользователя
 * @param {string} logInfo.resourceType - Тип ресурса
 * @param {string} logInfo.resourceId - ID ресурса
 * @returns {Promise<string>} URL загруженного файла
 */
async function uploadFileToS3(file, folder, logInfo = null) {
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

    logFileAction({
      action: 'UPLOAD',
      userName: logInfo?.userName || null,
      userId: logInfo?.userId || null,
      fileName,
      filePath: folder,
      fileUrl,
      resourceType: logInfo?.resourceType || null,
      resourceId: logInfo?.resourceId || null,
    });
    
    return fileUrl; 
  } catch (err) {
    console.error('Ошибка при загрузке файла на S3:', err);
    throw err;
  }
}

/**
 * Удаляет файл с S3
 * @param {string} fileName - Имя файла
 * @param {string} folder - Папка файла
 * @param {Object} logInfo - Информация для логирования
 * @param {string} logInfo.userName - Имя пользователя
 * @param {string} logInfo.userId - ID пользователя
 * @param {string} logInfo.resourceType - Тип ресурса
 * @param {string} logInfo.resourceId - ID ресурса
 */
async function deleteFileFromS3(fileName, folder, logInfo = null) {
  const key = `${folder}/${fileName}`; 
  const deleteParams = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(deleteParams));    
 
    logFileAction({
      action: 'DELETE',
      userName: logInfo?.userName || null,
      userId: logInfo?.userId || null,
      fileName,
      filePath: folder,
      resourceType: logInfo?.resourceType || null,
      resourceId: logInfo?.resourceId || null,
    });
  } catch (err) {
    console.error('Ошибка при удалении файла с S3:', err);
    throw err;
  }
}

module.exports = { uploadFileToS3, deleteFileFromS3 };
