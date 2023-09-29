const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/api/getVideoSource/:videoName', (req, res) => {
  try {
    const {videoName} = req.params;
    const videoPath = path.join(__dirname, '..', 'images', 'video', videoName);

    res.sendFile(videoPath);
  } catch (error) {
    console.error('Ошибка получения видео:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

module.exports = router;
