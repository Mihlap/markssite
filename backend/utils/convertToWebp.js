const sharp = require('sharp');

const convertToWebp = async (file) => {
  const buffer = await sharp(file.buffer).webp({ quality: 82 }).toBuffer();

  return {
    ...file,
    buffer,
    originalname: file.originalname.replace(/\.[^.]+$/, '.webp'),
    mimetype: 'image/webp',
  };
};

module.exports = { convertToWebp };
