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
];

const fileFilter = (req, file, cb) => {
  if (types.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({ storage, fileFilter });


