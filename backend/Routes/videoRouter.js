const express = require('express');

const router = express.Router();

const path = require('path');

router.get('/videos/:videoName', (req, res) => {
  const { videoName } = req.params;
  const videoPath = path.join(__dirname, './images/video', videoName);

  res.sendFile(videoPath);
});

module.exports = router;
