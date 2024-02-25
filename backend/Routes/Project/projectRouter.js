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

      const createdProject = await Project.create({
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
        idBlock: createdProject.id,
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
    { name: 'imageTitle', maxCount: 4 },
    { name: 'photoAva', maxCount: 1 },
    { name: 'imageOpen', maxCount: 1 },
    { name: 'imageClose', maxCount: 1 },
    { name: 'dynamicImages', maxCount: 50 },
  ]),
  async (req, res) => {
    const deleteImageEdit = async (imageName) => {
      const imagePath = path.join(__dirname, '..', '..', 'images', 'imageAdd', imageName);
    
      try {
        
        await fs.promises.unlink(imagePath);
        // console.log(`Изображение ${imageName} успешно удалено.`);
        
      } catch (error) {
        if (error.code === 'ENOENT') {
          // console.log(`Файл ${imageName} не найден, возможно, уже удален.`);
        } else {
          console.error(`Ошибка при удалении изображения ${imageName}:`, error);
        }
      }
    };
    

    try {
      const { projectId } = req.params;
      // console.log(`Обновление данных для проекта с ID ${projectId}`);

      // Поиск проекта по id
      const projectToUpdate = await Project.findByPk(projectId);

      if (!projectToUpdate) {
        return res.status(404).json({ message: 'Проект не найден' });
      }

   
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

      const imageProjectFromClient = req.body.imageProject; 
      const imageTitlesFromClient = req.body.imageTitle;
      const imageOpensFromClient = req.body.imageOpen;
      let imageClosesFromClient = req.body.imageClose;
      if (Array.isArray(imageClosesFromClient)) {
        imageClosesFromClient = imageClosesFromClient.join(', '); // Если это массив, объедините его в строку
      }

      const imageTitlesArrayFromClient = imageTitlesFromClient
        ? imageTitlesFromClient.split(',').map((item) => item.trim())
        : [];
      const imageTitlesNew =
        imageTitlesArrayFromClient.length > 0 ? imageTitlesArrayFromClient.join(', ') : null;

      const imageProjects = req.files.photoAva ? req.files.photoAva[0].filename : imageProjectFromClient;
      const imageOpens = req.files.imageOpen
        ? req.files.imageOpen[0].filename
        : imageOpensFromClient;
      const imageCloses = req.files.imageClose
        ? req.files.imageClose[0].filename
        : imageClosesFromClient;
      const currentImageTitles = projectToUpdate.imageTitle
        ? projectToUpdate.imageTitle.split(', ')
        : [];
      const currentImageProjects = projectToUpdate.imageProject ? [projectToUpdate.imageProject] : [];
      const currentImageOpens = projectToUpdate.imageOpen ? [projectToUpdate.imageOpen] : [];
      const currentImageCloses = projectToUpdate.imageClose ? [projectToUpdate.imageClose] : [];

      
      // Получение изображений для сохранения
      const imagesToKeep = [
        ...imageTitlesArrayFromClient,
        imageProjects,
        imageOpens,
        imageCloses,
      ].filter(Boolean);
      
      // Получение изображений для удаления
      const imagesToDelete = [
        ...currentImageTitles,
        ...currentImageProjects,
        ...currentImageOpens,
        ...currentImageCloses,
      ];
      // Получение изображений для удаления (те, которые больше не используются)
      const imagesToRemove = imagesToDelete.filter((image) => !imagesToKeep.includes(image));
      const oldImageTitles = projectToUpdate.imageTitle ? projectToUpdate.imageTitle.split(', ') : [];

           // Обновление данных проекта
      await projectToUpdate.update({
        title: req.body.title,
        selectCompetencies: req.body.selectCompetencies,
        countryCity: req.body.countryCity,
        monthYear: req.body.monthYear,
        viewConstruction: req.body.viewConstruction,
        style: req.body.radioValue,
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
        headingTextBlock: req.body.headingTextBlock,
        textBlock: req.body.textBlock,
        numberOfLanes: req.body.numberOfLanes,
        long: req.body.long,
        imageTitle: imageTitles || imageTitlesNew || currentImageTitles.join(', '),
        imageProject: imageProjects || currentImageProjects,
        imageOpen: imageOpens || currentImageOpens,
        imageClose: imageCloses || currentImageCloses,
      });

      const updatedImageTitles = projectToUpdate.imageTitle ? projectToUpdate.imageTitle.split(', ') : [];

      const imagesToRemoveAfterUpdate = oldImageTitles.filter((image) => !updatedImageTitles.includes(image));

      await Promise.all(imagesToRemove.map(deleteImageEdit));
      await Promise.all(imagesToRemoveAfterUpdate.map(deleteImageEdit));  
      
         
      // const dynamicImageTitles = req.files.dynamicImages
      // ? req.files.dynamicImages.map((file) => file.filename).join(', ')
      // : [];

      // const dynamicImageTitlesFromClient = typeof dynamicImageTitles === 'string' ? [dynamicImageTitles] : Array.isArray(dynamicImageTitles);
    

      // const newDynamicImageTitles =
      // dynamicImageTitlesFromClient.length > 0 ? dynamicImageTitlesFromClient.join(', ') : null;
      
      // const newDynamicImageTitlesArray = typeof newDynamicImageTitles === 'string'
      // ? [newDynamicImageTitles]
      // : newDynamicImageTitles || [];


      // const allImageTitles = [
      //   ...newDynamicImageTitlesArray,
      //   ...dynamicImageTitlesFromClient,
      // ];

      // console.log(allImageTitles, 'wwwwwwwwwwwwwwwwwwww');

      // Поиск или создание данных конструктора
  // Получение изображений из базы данных
const existingConstructor = await Constructor.findOne({ where: { idBlock: projectId } });
console.log(existingConstructor, '11111111111111111111');
const existingImageTitles = existingConstructor ? existingConstructor.image.split(', ') : [];
console.log(existingImageTitles, '222222222222222');
// Получение новых изображений из запроса
const dynamicImageTitles = req.files.dynamicImages ? req.files.dynamicImages.map((file) => file.filename) : [];
console.log(dynamicImageTitles, '33333333333333');
// Объединение старых и новых изображений
const allImageTitles = [...existingImageTitles, ...dynamicImageTitles].filter(Boolean);
console.log(allImageTitles, '444444444444444444');
// Обновление данных конструктора
if (existingConstructor) {
  const allImageTitlesString = allImageTitles.join(', ');
  await existingConstructor.update({
    data: dynamicBlocksContent,
    image: allImageTitlesString,
  });
} else {
  // Создание нового конструктора, если его не существует
  await Constructor.create({
    data: dynamicBlocksContent,
    image: allImageTitles.join(', '),
    idBlock: projectId,
  });
}
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
   res.json({
      dynamicData: constructorData.data,
      dynamicImages: constructorData.image.split(', '),
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

    if (deleteConstructorImg?.image) {
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






