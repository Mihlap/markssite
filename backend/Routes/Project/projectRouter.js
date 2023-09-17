const express = require('express');
// eslint-disable-next-line
const path = require('path');
const fs = require('fs');
const { Project, Constructor } = require('../../db/models');
const fileMiddleware = require('../../middleware/file');

const router = express.Router();

router.post(
  '/postzapros',
  fileMiddleware.fields([
    { name: 'dropPhoto', maxCount: 4 },
    { name: 'photoAva', maxCount: 1 },
    { name: 'imageOpen', maxCount: 1 },
    { name: 'imageClose', maxCount: 1 },
    { name: 'dynamicImages', maxCount: 30 },
  ]),
  async (req, res) => {
    try {
      const dynamicImageTitles = req.files.dynamicImages
        ? req.files.dynamicImages.map((file) => file.filename).join(', ')
        : null;
      const dynamicBlocksContent = JSON.parse(req.body.dynamicBlocksJSON);
      const imageTitles = req.files.dropPhoto.map((file) => file.filename).join(', ');
      const imageProjects = req.files.photoAva ? req.files.photoAva[0].filename : null;
      const imageOpens = req.files.imageOpen ? req.files.imageOpen[0].filename : null;
      const imageCloses = req.files.imageClose ? req.files.imageClose[0].filename : null;

      // console.log(req.body, '<<-- reg.BODY');
      // console.log(imageTitles, '<<-- imageTitles');
      console.log(req.files, '<<-- reg.FILES');
      console.log(dynamicBlocksContent);

      const createdArticle = await Project.create({
        title: req.body.title,
        selectCompetencies: req.body.selectCompetencies,
        countryCity: req.body.countryCity,
        monthYear: req.body.monthYear,
        viewConstruction: req.body.viewConstruction,
        style: req.body.radioValue,
        imageTitle: imageTitles,
        imageProject: imageProjects,
        titleTextBlock: req.body.titleTextBlock,
        descriptionProject: req.body.descriptionProject,
        totalArea: req.body.totalArea,
        siteArea: req.body.siteArea,
        floors: req.body.floors,
        altitude: req.body.altitude,
        constructionVolume: req.body.constructionVolume,
        location: req.body.location,
        degreeParticipation: req.body.degreeParticipation,
        statusObject: req.body.statusObject,
        customer: req.body.customer,
        publication: req.body.publication,
        linkToPublication: req.body.linkToPublication,
        publicationTwo: req.body.publicationTwo,
        linkToPublicationTwo: req.body.linkToPublicationTwo,
        awards: req.body.awards,
        imageOpen: imageOpens,
        textBlock: req.body.textBlock,
        imageClose: imageCloses,
      });

      await Constructor.create({
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
    const data = await Project.findAll({
      include: [Constructor],
    });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get('/getzapros-filter', async (req, res) => {
  try {
    const { viewConstruction } = req.query;
    let data;

    if (viewConstruction && viewConstruction !== 'Все') {
      data = await Project.findAll({
        where: { viewConstruction },
      });
    } else {
      data = await Project.findAll();
    }

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Произошла ошибка при получении проектов.' });
  }
});
// эта функция нужна для того, чтоб удалять из imageTitle фотографии есть там не массив
const deleteImage = (imageName) => {
  const imagePath = path.join(__dirname, '..', '..', 'images', 'imageAdd', imageName);

  //  console.log(`Пытаюсь удалить изображение по пути: ${imagePath}`);

  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error(`Ошибка при удалении изображения ${imageName}:`, err);
    } else {
      //  console.log(`Изображение ${imageName} успешно удалено.`);
    }
  });
};

router.delete('/deletezapros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Project.findByPk(id);


    // Удаление фотографий из imageTitle
    if (post.imageTitle) {
      const imageTitleNames = post.imageTitle.includes(', ')
        ? post.imageTitle.split(', ')
        : [post.imageTitle];
      imageTitleNames.forEach(deleteImage);
    }

    // Удаление фотографий из imageProject
    if (post.imageProject) {
      const projectImageNames = post.imageProject.includes(', ')
        ? post.imageProject.split(', ')
        : [post.imageProject];
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

    //  const constructors = await Constructor.findAll({ where: { idBlock: id } });
    //  constructors.forEach((constructor) => {
    //    if (constructor.image) {
    //      deleteImage(constructor.image);
    //    }
    //  });

    // Удаление связанных элементов из других таблиц
    await Constructor.destroy({ where: { idBlock: id } });

    // Удаление поста
    await Project.destroy({ where: { id } });
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;
