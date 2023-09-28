const express = require('express');
// eslint-disable-next-line
const path = require('path');
const fs = require('fs');
const { Articles, ConstructorArticles } = require('../../db/models');
const fileMiddleware = require('../../middleware/fileArticle');

const router = express.Router();


router.post(
  '/postzapros',
  fileMiddleware.fields([
    { name: 'dropPhoto', maxCount: 4 },
    { name: 'photoAva', maxCount: 1 },
    { name: 'imageOpen', maxCount: 1 },
    { name: 'imageClose', maxCount: 1 },
    { name: 'dynamicImages', maxCount: 50 },
  ]),
  async (req, res) => {
    try {
      const dynamicImageTitles = req.files.dynamicImages
        ? req.files.dynamicImages.map((file) => file.filename).join(', ')
        : null;
      let dynamicBlocksContent = null;

      if (req.body.dynamicBlocksJSON) {
        try {
          dynamicBlocksContent = JSON.parse(req.body.dynamicBlocksJSON);
        } catch (error) {
          console.error('Ошибка при разборе dynamicBlocksJSON:', error);
          return res.status(400).json({ message: 'Неверный формат данных для dynamicBlocksJSON' });
        }
      }

      const imageTitles = req.files.dropPhoto
        ? req.files.dropPhoto.map((file) => file.filename).join(', ')
        : null;
      const imageProjects = req.files.photoAva ? req.files.photoAva[0].filename : null;
      const imageOpens = req.files.imageOpen ? req.files.imageOpen[0].filename : null;
      const imageCloses = req.files.imageClose ? req.files.imageClose[0].filename : null;

      // console.log(req.body, '<<-- reg.BODY');
      // console.log(imageTitles, '<<-- imageTitles');
      // console.log(req.files, '<<-- reg.FILES');
      // console.log(dynamicBlocksContent);

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

      await ConstructorArticles.create({
        data: dynamicBlocksContent,
        image: dynamicImageTitles,
        idBlock: createdArticle.id,
      });

      res.status(200).json({ message: 'Данные успешно сохранены' });
    } catch (error) {
      console.log(error); // Output error to the console
      res.status(500).json({ message: 'Произошла ошибка при сохранении данных' });
    }
  },
);

router.get('/getzapros', async (req, res) => {
  try {
    const data = await Articles.findAll({
      include: [ConstructorArticles],
    });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

const deleteImage = (imageName) => {
  const imagePath = path.join(__dirname, '..', '..', 'images', 'imageArticle', imageName);

  // console.log(`Пытаюсь удалить изображение по пути: ${imagePath}`);

  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error(`Ошибка при удалении изображения ${imageName}:`, err);
    } else {
      // console.log(`Изображение ${imageName} успешно удалено.`);
    }
  });
};
  
  router.delete('/deletezapros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Articles.findByPk(id);
    const deleteConstructorImg = await ConstructorArticles.findByPk(id);

     if (deleteConstructorImg.image) {
      //  console.log('ЗАШЕЛ СЮДА');
       const imageConstructorNames = deleteConstructorImg.image.includes(', ')
         ? deleteConstructorImg.image.split(', ')
         : [deleteConstructorImg.image];
       imageConstructorNames.forEach(deleteImage);
     }

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
    await ConstructorArticles.destroy({ where: { idBlock: id } });

    // Удаление поста
    await Articles.destroy({ where: { id } });
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});


module.exports = router;
