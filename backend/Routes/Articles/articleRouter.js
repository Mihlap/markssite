const express = require('express');
// eslint-disable-next-line
const path = require('path');
const fs = require('fs');
const {
  Articles,
  ConstructorArticles
} = require('../../db/models');
const fileMiddleware = require('../../middleware/fileArticle');

const router = express.Router();


router.post(
  '/postzapros',
  fileMiddleware.fields([{
      name: 'dropPhoto',
      maxCount: 4
    },
    {
      name: 'photoAva',
      maxCount: 1
    },
    {
      name: 'imageOpen',
      maxCount: 1
    },
    {
      name: 'imageClose',
      maxCount: 1
    },
    {
      name: 'dynamicImages',
      maxCount: 50
    },
  ]),
  async (req, res) => {
    try {
      const dynamicImageTitles = req.files.dynamicImages ?
        req.files.dynamicImages.map((file) => file.filename).join(', ') :
        null;
      let dynamicBlocksContent = null;

      if (req.body.dynamicBlocksJSON) {
        try {
          dynamicBlocksContent = JSON.parse(req.body.dynamicBlocksJSON);
        } catch (error) {
          console.error('Ошибка при разборе dynamicBlocksJSON:', error);
          return res.status(400).json({
            message: 'Неверный формат данных для dynamicBlocksJSON'
          });
        }
      }

      const imageTitles = req.files.dropPhoto ?
        req.files.dropPhoto.map((file) => file.filename).join(', ') :
        null;
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
        // authorId:
      });

      await ConstructorArticles.create({
        data: dynamicBlocksContent,
        image: dynamicImageTitles,
        idBlock: createdArticle.id,
      });

      res.status(200).json({
        message: 'Данные успешно сохранены'
      });
    } catch (error) {
      console.log(error); // Output error to the console
      res.status(500).json({
        message: 'Произошла ошибка при сохранении данных'
      });
    }
  },
);

router.put(
  '/editzapros/:articleId',
  fileMiddleware.fields([{
      name: 'dropPhoto',
      maxCount: 4
    },
    {
      name: 'photoAva',
      maxCount: 1
    },
    {
      name: 'imageOpen',
      maxCount: 1
    },
    {
      name: 'imageClose',
      maxCount: 1
    },
    {
      name: 'dynamicImages',
      maxCount: 50
    },
  ]),
  async (req, res) => {
    const deleteImageEdit = async (imageName) => {
      const imagePath = path.join(__dirname, '..', '..', 'images', 'imageArticle', imageName);

      try {
        await fs.promises.unlink(imagePath);
        console.log(`Изображение ${imageName} успешно удалено.`);
      } catch (error) {
        if (error.code === 'ENOENT') {
          // console.log(`Файл ${imageName} не найден, возможно, уже удален.`);
        } else {
          console.error(`Ошибка при удалении изображения ${imageName}:`, error);
        }
      }
    };

    try {
      const {
        articleId
      } = req.params;
      // console.log('Received PUT request to update article with ID:', articleId);
      const articleToUpdate = await Articles.findByPk(articleId);

      if (!articleToUpdate) {
        console.error('Article not found for ID:', articleId);
        return res.status(404).json({
          message: 'Статья не найдена'
        });
      }

      // Обработка загрузки файлов и других данных также, как в маршруте POST

      const imageTitles = req.files.dropPhoto ?
        req.files.dropPhoto.map((file) => file.filename).join(', ') :
        null;

      let imageTitlesFromClient = req.body.imageTitle;
      if (Array.isArray(imageTitlesFromClient)) {
        imageTitlesFromClient = imageTitlesFromClient.join(', '); // Если это массив, объедините его в строку
      };

      const imageAuthorFromClient = req.body.imageAuthor;
      const imageOpensFromClient = req.body.imageOpen;
      let imageClosesFromClient = req.body.imageClose;
      if (Array.isArray(imageClosesFromClient)) {
        imageClosesFromClient = imageClosesFromClient.join(); // Если это массив, объедините его в строку
      };

      const imageTitlesArrayFromClient = imageTitlesFromClient ? imageTitlesFromClient.split(',').map(item => item.trim()) : [];
      const imageTitlesNew = imageTitlesArrayFromClient.length > 0 ?
        imageTitlesArrayFromClient.join(', ') :
        null;


      const imageAuthors = req.files.photoAva ? req.files.photoAva[0].filename : imageAuthorFromClient;
      const imageOpens = req.files.imageOpen ? req.files.imageOpen[0].filename : imageOpensFromClient;
      const imageCloses = req.files.imageClose ? req.files.imageClose[0].filename : imageClosesFromClient;
      const currentImageAuthors = articleToUpdate.imageAuthor ? [articleToUpdate.imageAuthor] : [];
      const currentImageTitles = articleToUpdate.imageTitle ? articleToUpdate.imageTitle.split(', ') : [];
      const currentImageOpens = articleToUpdate.imageOpen ? [articleToUpdate.imageOpen] : [];
      const currentImageCloses = articleToUpdate.imageClose ? [articleToUpdate.imageClose] : [];


      // Получение изображений для сохранения
      const imagesToKeep = [
        ...imageTitlesArrayFromClient,
        imageAuthors,
        imageOpens,
        imageCloses,
      ].filter(Boolean);

      // Получение изображений для удаления
      const imagesToDelete = [
        ...currentImageTitles,
        ...currentImageAuthors,
        ...currentImageOpens,
        ...currentImageCloses,
      ];
      // Получение изображений для удаления (те, которые больше не используются)
      const imagesToRemove = imagesToDelete.filter((image) => !imagesToKeep.includes(image));
      const oldImageTitles = articleToUpdate.imageTitle ? articleToUpdate.imageTitle.split(', ') : [];



      // Обновление существующей статьи
      await articleToUpdate.update({
        title: req.body.title,
        author: req.body.author,
        city: req.body.city,
        dataMonthYear: req.body.dataMonthYear,
        selectCompetencies: req.body.selectCompetencies,
        titleTextBlock: req.body.titleTextBlock,
        descriptionArticle: req.body.descriptionArticle,
        textBlock: req.body.textBlock,
        imageTitle: imageTitles || imageTitlesNew || currentImageTitles.join(', '),
        imageAuthor: imageAuthors || null,
        imageOpen: imageOpens || currentImageOpens,
        imageClose: imageCloses || currentImageCloses,
      });

      const updatedImageTitles = articleToUpdate.imageTitle ? articleToUpdate.imageTitle.split(', ') : [];


      const imagesToRemoveAfterUpdate = oldImageTitles.filter((image) => !updatedImageTitles.includes(image));

      await Promise.all(imagesToRemove.map(deleteImageEdit));
      await Promise.all(imagesToRemoveAfterUpdate.map(deleteImageEdit));


      // Поиск или создание данных конструктора
      const existingConstructor = await ConstructorArticles.findOne({
        where: {
          idBlock: articleId
        }
      });

      const dynamicBlocksContent = req.body.dynamicBlocksJSON ? JSON.parse(req.body.dynamicBlocksJSON) : [];
      const existingImages = existingConstructor ? existingConstructor.image.split(', ') : [];

      // Функция для извлечения всех изображений из вложенных структур
      const extractImages = (blocks) => blocks
        .flatMap(blockGroup => blockGroup)
        .filter(block => block.type === 'file' && Array.isArray(block.value))
        .flatMap(block => block.value);

      // Извлечение изображений из dynamicBlocksContent
      const newDynamicImages = extractImages(dynamicBlocksContent);

      // Определение изображений, которые больше не связаны с динамическими блоками
      const imagesToRemoveFromDynamicBlocks = existingImages.filter(image =>
        !newDynamicImages.includes(image)
      );

      await Promise.all(imagesToRemoveFromDynamicBlocks.map(deleteImageEdit));


      if (existingConstructor) {
        await existingConstructor.update({
          data: dynamicBlocksContent,
          image: newDynamicImages.join(', '),
        });
      } else {
        await ConstructorArticles.create({
          data: dynamicBlocksContent,
          image: newDynamicImages.join(', '),
          idBlock: articleId,
        });
      }
      res.status(200).json({
        message: 'Статья успешно обновлена'
      });
    } catch (error) {
      console.error('Error while updating article:', error);
      res.status(500).json({
        message: 'Ошибка при обновлении статьи',
        error: error.message
      });
    }
  }
);

router.get('/getzapros', async (req, res) => {
  try {
    const data = await Articles.findAll({
      include: [ConstructorArticles],
      order: [
        ['id', 'DESC']
      ]
    });

    //  res.set('Cache-Control', 'public, max-age=432000'); // 432000 секунд = 5 дней

    res.json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get('/getdynamicdata/:articleId', async (req, res) => {
  try {
    const {
      articleId
    } = req.params;

    // Найти данные конструктора по id проекта
    const constructorData = await ConstructorArticles.findOne({
      where: {
        idBlock: articleId
      },
    });

    if (!constructorData) {
      return res.status(404).json({
        message: 'Динамические данные не найдены'
      });
    }
    res.json({
      dynamicData: constructorData.data,
      dynamicImages: constructorData.image.split(', '),
    });
  } catch (error) {
    console.error('Ошибка при получении динамических данных:', error);
    res.status(500).json({
      message: 'Произошла ошибка при получении динамических данных'
    });
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
    const {
      id
    } = req.params;
    const post = await Articles.findByPk(id);

    const deleteConstructorImg = await ConstructorArticles.findByPk(id);

    if (deleteConstructorImg?.image) {
      //  console.log('ЗАШЕЛ СЮДА');
      const imageConstructorNames = deleteConstructorImg.image.includes(', ') ?
        deleteConstructorImg.image.split(', ') :
        [deleteConstructorImg.image];
      imageConstructorNames.forEach(deleteImage);
    }

    // Удаление фотографий из imageTitle
    if (post.imageTitle) {
      const imageNames = post.imageTitle.includes(', ') ?
        post.imageTitle.split(', ') :
        [post.imageTitle];
      imageNames.forEach(deleteImage);
    }

    // Удаление фотографий из imageAuthor
    if (post.imageAuthor) {
      const projectImageNames = post.imageAuthor.includes(', ') ?
        post.imageAuthor.split(', ') :
        [post.imageAuthor];
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
    await ConstructorArticles.destroy({
      where: {
        idBlock: id
      }
    });

    // Удаление поста
    await Articles.destroy({
      where: {
        id
      }
    });
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});


module.exports = router;
