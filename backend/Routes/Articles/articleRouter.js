const express = require('express');
// eslint-disable-next-line
const path = require('path');
const fs = require('fs');
const {
  Articles,
  BlockHeadingTitle,
  TextBlockArticles,
  FrameBlock,
  ImageToDescriptionArticles,
} = require('../../db/models');
const fileMiddleware = require('../../middleware/fileArticle');

const router = express.Router();

router.get('/getzapros', async (req, res) => {
  try {
    const data = await Articles.findAll({
      include: [BlockHeadingTitle, TextBlockArticles, FrameBlock, ImageToDescriptionArticles], // Включение двух связанных моделей
    });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post(
  '/postzapros',
  fileMiddleware.fields([
    { name: 'dropPhoto', maxCount: 4 },
    { name: 'photoAva', maxCount: 1 },
    { name: 'imageOpen', maxCount: 1 },
    { name: 'imageClose', maxCount: 1 },
    { name: "imageToDescriptionArticlesImg", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log(req.files); // Output file information to the console
      const imageTitles = req.files.dropPhoto.map((file) => file.filename).join(', ');
      const imageProjects = req.files.photoAva ? req.files.photoAva[0].filename : null;
      const imageOpens = req.files.imageOpen ? req.files.imageOpen[0].filename : null;
      const imageCloses = req.files.imageClose ? req.files.imageClose[0].filename : null;
      const imageToDescriptionArticlesImgs = req.files.imageToDescriptionArticlesImg
        ? req.files.imageToDescriptionArticlesImg[0].filename
        : null;

      
      console.log(imageCloses, '<<--imageCloses');
      console.log(imageToDescriptionArticlesImgs, '<<--imageToDescriptionArticlesImgs');

      const createdArticle = await Articles.create({
        title: req.body.title,
        author: req.body.author,
        city: req.body.city,
        dataMonthYear: req.body.dataMonthYear,
        selectCompetencies: req.body.selectCompetencies,
        imageTitle: imageTitles,
        titleTextBlock: req.body.titleTextBlock,
        descriptionArticle: req.body.descriptionArticle,
        imageAuthor: imageProjects,
        imageOpen: imageOpens,
        textBlock: req.body.textBlock,
        imageClose: imageCloses,
      });

      if (req.body.blockHeadingTitle && req.body.blockHeadingText) {
        await BlockHeadingTitle.create({
          title: req.body.blockHeadingTitle,
          text: req.body.blockHeadingText,
          idBlock: createdArticle.id, // Ссылка на созданную статью
        });
      }

      if (req.body.textBlockArticles) {
        await TextBlockArticles.create({
          text: req.body.textBlockArticles,
          idBlock: createdArticle.id, // Ссылка на созданную статью
        });
      }
      if (req.body.frameBlock) {
        await FrameBlock.create({
          text: req.body.frameBlock,
          idBlock: createdArticle.id,
        });
      }

        await ImageToDescriptionArticles.create({
          image: imageToDescriptionArticlesImgs,
          text: req.body.imageToDescriptionArticlesText,
          idBlock: createdArticle.id,
        });
      

      res.status(200).json({ message: 'Данные успешно сохранены' });
    } catch (error) {
      console.log(error); // Output error to the console
      res.status(500).json({ message: 'Произошла ошибка при сохранении данных' });
    }
  },
);

// эта функция нужна для того, чтоб удалять из imageTitle фотографии есть там не массив 
const deleteImage = (imageName) => {
  const imagePath = path.join(__dirname, '..', 'images/imageArticle', imageName);
  console.log(`Trying to delete file: ${imagePath}`);
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
};

router.delete('/deletezapros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Articles.findByPk(id);

    // Удаление фотографий из imageTitle
    if (post.imageTitle) {
      const imageNames = post.imageTitle.includes(', ')
        ? post.imageTitle.split(', ')
        : [post.imageTitle];
      imageNames.forEach(deleteImage);
    }

    // Удаление фотографий из imageAuthor
    if (post.imageAuthor) {
      const projectImageNames = post.imageAuthor.includes(', ')
        ? post.imageAuthor.split(', ')
        : [post.imageAuthor];
      projectImageNames.forEach(deleteImage);
    }

    // Удаление фотографии из imageOpen
    if (post.imageOpen) {
      deleteImage(post.imageOpen);
    }

    // Удаление фотографии из imageClose
    if (post.imageClose) {
      deleteImage(post.imageClose);
    }

    // Удаление связанных элементов из других таблиц
    await BlockHeadingTitle.destroy({ where: { idBlock: id } });
    await TextBlockArticles.destroy({ where: { idBlock: id } });
    await FrameBlock.destroy({ where: { idBlock: id } });
     await ImageToDescriptionArticles.destroy({ where: { idBlock: id } });

    // Удаление поста
    await Articles.destroy({ where: { id } });
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});


module.exports = router;
