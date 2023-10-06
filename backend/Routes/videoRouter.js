const express = require("express");
const fs = require('fs');
const path = require("path");
const { Constructor } = require('../db/models');
const videoUpload = require('../middleware/fileVideo'); 

const router = express.Router();

const destinationPath = path.join(__dirname, "../images/video");

// Проверяем существование пути, если не существует, создаем
if (!fs.existsSync(destinationPath)){
    fs.mkdirSync(destinationPath, { recursive: true });
}

router.post(`/upload-video`, videoUpload.single("video"), async (req, res) => {
  try {

    const videoPath = path.join(destinationPath, req.file.originalname);
   
    const constructor = await Constructor.create({
      videoPath,
    });

    return res.status(200).send(constructor);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
