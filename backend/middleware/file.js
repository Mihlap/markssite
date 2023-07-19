const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'images/imageAdd/');
  },
  filename(req, file, cb) {
    const uniqueSuffix = uuidv4();
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const types = ['image/png', 'image/jpeg', 'image/jpg', 'image/HEIC', 'image/mp4'];

const fileFilter = (req, file, cb) => {
  if (types.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


module.exports = multer({ storage, fileFilter });
