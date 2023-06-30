const multer = require("multer");

const videoStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});

const videoTypes = [
  "video/mp4",
  "video/mpeg",
  "video/quicktime",
  // добавьте другие поддерживаемые типы видео
];

const videoFileFilter = (req, file, cb) => {
  if (videoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({ storage: videoStorage, fileFilter: videoFileFilter });
