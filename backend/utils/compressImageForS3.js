const sharp = require('sharp');

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const MAX_SIDE = 1920;

const isImage = (file) => Boolean(file?.mimetype?.startsWith('image/') && file?.buffer);

async function compressImageForS3(file, maxBytes = MAX_IMAGE_BYTES) {
  if (!isImage(file)) return file;
  if (file.buffer.length <= maxBytes) return file;

  // SVG/битые/неподдерживаемые форматы не должны валить загрузку формы
  try {
    const baseName = String(file.originalname || 'image').replace(/\.[^.]+$/, '') || 'image';
    let quality = 82;
    let buffer = file.buffer;

    while (quality >= 40) {
      buffer = await sharp(file.buffer)
        .rotate()
        .resize({
          width: MAX_SIDE,
          height: MAX_SIDE,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality })
        .toBuffer();

      if (buffer.length <= maxBytes) {
        return {
          ...file,
          buffer,
          size: buffer.length,
          mimetype: 'image/webp',
          originalname: `${baseName}.webp`,
        };
      }

      quality -= 12;
    }

    buffer = await sharp(file.buffer)
      .rotate()
      .resize({
        width: 1280,
        height: 1280,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 60 })
      .toBuffer();

    return {
      ...file,
      buffer,
      size: buffer.length,
      mimetype: 'image/webp',
      originalname: `${baseName}.webp`,
    };
  } catch (err) {
    console.error('compressImageForS3: оставляем исходный файл', err.message);
    return file;
  }
}

module.exports = { compressImageForS3, MAX_IMAGE_BYTES };
