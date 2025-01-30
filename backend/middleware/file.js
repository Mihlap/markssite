const multer = require('multer');

const storage = multer.memoryStorage();

const types = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/HEIC',
  'image/avif',
  'video/mp4',
  'video/mpeg',
  'video/quicktime',
  'video/MOV',
  'application/pdf',
];

const fileFilter = (req, file, cb) => {
  if (types.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = upload;



