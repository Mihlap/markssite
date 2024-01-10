const express = require('express');
// eslint-disable-next-line
const path = require('path');
const fs = require('fs');
const { Project, Constructor } = require('../../db/models');
const fileMiddleware = require('../../middleware/file');

const router = express.Router();

const projectImagesPath = path.join(__dirname, 'images/projectFoto');

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

      const createdPrpject = await Project.create({
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
        headingTextBlock: req.body.headingTextBlock,
        textBlock: req.body.textBlock,
        imageClose: imageCloses,
        numberOfLanes: req.body.numberOfLanes,
        long: req.body.long,
      });

      await Constructor.create({
        data: dynamicBlocksContent,
        image: dynamicImageTitles,
        idBlock: createdPrpject.id,
      });

      res.status(200).json({ message: 'Данные успешно сохранены' });
    } catch (error) {
      console.log(error); // Output error to the console
      res.status(500).json({ message: 'Произошла ошибка при сохранении данных' });
    }
  },
);

router.put(
  '/updatezapros/:projectId',
  fileMiddleware.fields([
    { name: 'dropPhoto', maxCount: 4 },
    { name: 'photoAva', maxCount: 1 },
    { name: 'imageOpen', maxCount: 1 },
    { name: 'imageClose', maxCount: 1 },
    { name: 'dynamicImages', maxCount: 50 },
  ]),
  async (req, res) => {
    try {
      const { projectId } = req.params;
      // console.log('projectIdйййййййййййййййййййййййййййййййй:', projectId);

      // Поиск проекта по id
      const projectToUpdate = await Project.findByPk(projectId);

      if (!projectToUpdate) {
        return res.status(404).json({ message: 'Проект не найден' });
      }

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

      // Обновление данных проекта
      await projectToUpdate.update({
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
        headingTextBlock: req.body.headingTextBlock,
        textBlock: req.body.textBlock,
        imageClose: imageCloses,
        numberOfLanes: req.body.numberOfLanes,
        long: req.body.long,
      });

      // Поиск или создание данных конструктора
      let existingConstructor = await Constructor.findOne({ where: { idBlock: projectId } });

      if (existingConstructor) {
        // Если конструктор существует, обновляем данные
        await existingConstructor.update({
          data: dynamicBlocksContent,
          image: dynamicImageTitles,
        });
      } else {
        // Если конструктор не существует, создаем новый
        existingConstructor = await Constructor.create({
          data: dynamicBlocksContent,
          image: dynamicImageTitles,
          idBlock: projectId,
        });
      }

      // остальной код обработки...

      res.status(200).json({ message: 'Данные успешно обновлены' });
    } catch (error) {
      console.error('Ошибка при обновлении проекта:', error);
      res.status(500).json({ message: 'Произошла ошибка при обновлении данных' });
    }
  },
);

router.get('/getimage/:imageName', (req, res) => {
  const { imageName } = req.params;
  const imagePath = path.join(projectImagesPath, imageName);

 res.set('Cache-Control', 'public, max-age=432000'); // 432000 секунд = 5 дней

  res.sendFile(imagePath);
});

router.get('/getzapros', async (req, res) => {
  try {
    const data = await Project.findAll({
      include: [Constructor],
    });
   
    // res.set('Cache-Control', 'public, max-age=432000'); // 432000 секунд = 5 дней

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.' });
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

    // res.set('Cache-Control', 'public, max-age=432000'); // 432000 секунд = 5 дней

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Произошла ошибка при получении проектов.' });
  }
});

router.get('/getdynamicdata/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    // Найти данные конструктора по id проекта
    const constructorData = await Constructor.findOne({
      where: { idBlock: projectId },
    });

    if (!constructorData) {
      return res.status(404).json({ message: 'Динамические данные не найдены' });
    }

    // Отправить данные в ответ
    res.json({
      dynamicData: constructorData.data,
      dynamicImages: constructorData.image,
    });
  } catch (error) {
    console.error('Ошибка при получении динамических данных:', error);
    res.status(500).json({ message: 'Произошла ошибка при получении динамических данных' });
  }
});


// эта функция нужна для того, чтоб удалять из imageTitle фотографии есть там не массив
const deleteImage = (imageName) => {
  const imagePath = path.join(__dirname, '..', '..', 'images', 'imageAdd', imageName);

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
    const post = await Project.findByPk(id);
    const deleteConstructorImg = await Constructor.findByPk(id);

    if (deleteConstructorImg.image) {
      // console.log('ЗАШЕЛ СЮДА');
      const imageConstructorNames = deleteConstructorImg.image.includes(', ')
        ? deleteConstructorImg.image.split(', ')
        : [deleteConstructorImg.image];
      imageConstructorNames.forEach(deleteImage);
    }

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






