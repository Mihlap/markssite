const express = require('express');
// eslint-disable-next-line
const path = require("path");
const fs = require("fs");
const { Articles } = require("../../db/models");
const fileMiddleware = require("../../middleware/fileArticle");

const router = express.Router();


router.get('/getzapros', async (req, res) => {
  try {
    const data = await Articles.findAll();
    res.json(data);
   } catch (error) {
    console.log(error);
  }
});

router.post(
  '/postzapros',
  fileMiddleware.fields([
    { name: 'dropPhoto', maxCount: 4 },
    { name: 'photoAva', maxCount: 1 },
    { name: 'imageOpen', maxCount: 1 },
    { name: 'imageClose', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log(req.files); // Output file information to the console
      const imageTitles = req.files.dropPhoto.map((file) => file.filename).join(', ');
      const imageProjects = req.files.photoAva ? req.files.photoAva[0].filename : null;
      const imageOpens = req.files.imageOpen ? req.files.imageOpen[0].filename : null;
      const imageCloses = req.files.imageClose ? req.files.imageClose[0].filename : null;

      // console.log(imageCloses);
      await Articles.create({
        title: req.body.title,
        author: req.body.author,
        city: req.body.city,
        dataMonthYear: req.body.dataMonthYear,
        imageTitle: imageTitles,
        titleTextBlock: req.body.titleTextBlock,
        descriptionArticle: req.body.descriptionArticle,
        imageAuthor: imageProjects,
        imageOpen: imageOpens,
        textBlock: req.body.textBlock,
        imageClose: imageCloses,
      });

      res.status(200).json({ message: 'Данные успешно сохранены' });
    } catch (error) {
      console.log(error); // Output error to the console
      res.status(500).json({ message: 'Произошла ошибка при сохранении данных' });
    }
  },
);


router.delete('/deletezapros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Articles.findByPk(id);

    // Удаление фотографий из imageTitle
    const imageNames = post.imageTitle.split(', ');
    imageNames.forEach((imageName) => {
      const imagePath = path.join(__dirname, '..', 'images/imageArticle', imageName);
      fs.unlinkSync(imagePath);
    });

    // Удаление фотографий из imageAuthor
    const projectImageNames = post.imageAuthor.split(', ');
    projectImageNames.forEach((imageName) => {
      const imagePath = path.join(__dirname, '..', 'images/imageArticle', imageName);
      fs.unlinkSync(imagePath);
    });

    // Удаление фотографии из imageOpen
    if (post.imageOpen) {
      const imagePath = path.join(__dirname, '..', 'images/imageArticle', post.imageOpen);
      fs.unlinkSync(imagePath);
    }

    // Удаление фотографии из imageClose
    if (post.imageClose) {
      const imagePath = path.join(__dirname, '..', 'images/imageArticle', post.imageClose);
      fs.unlinkSync(imagePath);
    }

    // Удаление поста
    await Articles.destroy({ where: { id } });
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});



module.exports = router;