const multer = require('multer');

const storage = multer.memoryStorage();

const types = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/heic',
  'image/HEIC',
  'image/avif',
  'image/webp',
  'video/mp4',
  'video/mpeg',
  'video/quicktime',
  'video/MOV',
  'application/pdf',
];

const SUPPORTED_READABLE = 'PNG, JPG, HEIC, AVIF, WebP, MP4, PDF';

const fileFilter = (req, file, cb) => {
  if (types.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Неподдерживаемый тип файла: ${file.mimetype}. Разрешённые типы: ${SUPPORTED_READABLE}`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = upload;

