// const fs = require('fs');
// const path = require('path');
// const { pipeline } = require('stream/promises');
// const { Constructor } = require('../db/models');

// async function videoRouter(fastify, options) {
//   const dest = path.join(__dirname, '../images/video');
//   if (!fs.existsSync(dest)) {
//     fs.mkdirSync(dest, { recursive: true });
//   }

 
//   fastify.post('/upload-video', async (request, reply) => {  
//     const { file: partStream, filename, mimetype } = await request.file();
    
//     if (!filename || !mimetype.startsWith('video/')) {
//       return reply.code(400).send({ error: 'Недопустимый тип файла' });
//     }

//     const videoPath = path.join(dest, filename);

//     try {
//       await pipeline(partStream, fs.createWriteStream(videoPath));
    
//       const record = await Constructor.create({ videoPath });

//       return reply.code(200).send(record);
//     } catch (err) {
//       request.log.error('Ошибка загрузки видео:', err);
//       return reply.code(500).send({ error: 'Ошибка сервера при загрузке видео' });
//     }
//   });

 
//   fastify.get('/:filename', async (request, reply) => {

//     const { filename } = request.params;
//     const filepath = path.join(dest, filename);

//     try {
//       const stats = await fs.promises.stat(filepath);

//       if (!stats.isFile()) {
//         return reply.code(404).send('File not found');
//       }
//       // Кэшируем 5 дней
//       reply.header('Cache-Control', 'public, max-age=432000');

//       return reply.send(fs.createReadStream(filepath));
//     } catch (err) {
//       request.log.error('Ошибка при отдаче видео:', err);
//       const code = err.code === 'ENOENT' ? 404 : 500;
//       const msg = err.code === 'ENOENT' ? 'File not found' : 'Internal Server Error';
//       return reply.code(code).send(msg);
//     }
//   });
// }

// module.exports = videoRouter;

const express = require("express");
const fs = require('fs');
const path = require("path");
const { Constructor } = require('../db/models');
const videoUpload = require('../middleware/fileVideo');

const router = express.Router();

const destinationPath = path.join(__dirname, "../images/video");

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

router.get('/:videoName', async (req, res) => {
  const { videoName } = req.params;
  const videoPath = path.join(__dirname, 'images/video', videoName);

  try {
    const stats = await fs.promises.stat(videoPath);

    if (stats.isFile()) {
      const stream = fs.createReadStream(videoPath);
      stream.pipe(res);
    } else {
      res.status(404).send('File not found');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:filename', async (req, res) => {
  const { filename } = req.params;

 const videoPath = path.join(destinationPath, filename);

  try {
    const stats = await fs.promises.stat(videoPath);

    if (stats.isFile()) {

      res.sendFile(videoPath, {
        maxAge: '5d',
        headers: {
          'Cache-Control': 'public, max-age=432000', // 432000 секунд = 5 дней
        },
      });
    } else {
      res.status(404).send('File not found');
    }
  } catch (error) {
    console.error('ошибка запроса в роутере', error);

    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
