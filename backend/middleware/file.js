const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'images/');
  },
  filename(req, file, cb) {
    const uniqueSuffix = uuidv4();
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const types = ['image/png', 'image/jpeg', 'image/jpg', 'image/HEIC'];

const fileFilter = (req, file, cb) => {
  if (types.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Для массива файлов
const uploadArray = multer({ storage, fileFilter }).array('dropPhoto', 4);

// Для одного файла
const uploadSingle = multer({ storage, fileFilter }).single('photoAva');

module.exports = { uploadArray, uploadSingle };
