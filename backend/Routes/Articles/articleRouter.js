const express = require('express');
const {
  URL
} = require('url');
const {
  Articles,
  ConstructorArticles
} = require('../../db/models');
const fileMiddleware = require('../../middleware/file');
const {
  uploadFileToS3,
  deleteFileFromS3
} = require('../../s3Utils/s3Service');

const router = express.Router();

const extractFileNameAndFolderFromUrl = (url) => {

  // Если это не полный URL, значит это локальный путь файла
  if (!url.includes('http')) {
    return {
      fileName: url,
      folder: 'images/imageArticle',
    };
  }

  try {
    // Обрабатываем только корректные URL с протоколом
    const urlObj = new URL(url);
    const {
      pathname
    } = urlObj;
    const parts = pathname.split('/').filter(Boolean);

    if (parts.length >= 2) {
      const folder = parts.slice(0, -1).join('/');
      const fileName = parts[parts.length - 1];
      return {
        fileName,
        folder,
      };
    }
    return {
      fileName: parts[0],
      folder: 'images/imageArticle',
    };
  } catch (error) {
    console.error(`Ошибка извлечения данных из URL: ${url}`, error);
    return null;
  }
};



const deleteImageFromS3 = async (fileUrl) => {
  const result = extractFileNameAndFolderFromUrl(fileUrl);
  if (result) {
    let {
      fileName,
      folder
    } = result;
    fileName = decodeURIComponent(fileName);
    folder = decodeURIComponent(folder);
    try {
      const response = await deleteFileFromS3(fileName, folder);
      console.log(`Файл ${fileName} успешно удалён с S3:`, response);
    } catch (error) {
      console.error(`Ошибка при удалении файла ${fileName}:`, error);
    }
  } else {
    console.log(`Не удалось извлечь имя файла и папку из URL: ${fileUrl}`);
  }
};


// Функция для обновления dynamicBlocksContent с новыми изображениями
const updateDynamicBlocksContent = (blocks, newImages) => {
  let imageIndex = 0;
  return blocks.map((blockGroup) =>
    blockGroup.map((block) => {
      if (block.type === 'file' && Array.isArray(block.value)) {
        const updatedValues = block.value.map((val) => {
          if (typeof val === 'string' && (val.startsWith('blob:') || val.startsWith('temp_'))) {
            const newImage = newImages[imageIndex];
            imageIndex += 1;
            return newImage;
          }
          return val;
        });
        return {
          ...block,
          value: updatedValues
        };
      }
      return block;
    })
  );
};


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
      maxCount: 100
    },
  ]),
  async (req, res) => {
    try {
      let dynamicBlocksContent = null;

      // Загрузка динамических изображений на S3 и получение URL
      const dynamicImageTitles = req.files.dynamicImages ?
        await Promise.all(
          req.files.dynamicImages.map(async (file) => {
            const fileUrl = await uploadFileToS3(file, 'images/imageArticle');
            return fileUrl;
          })
        ) : [];

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
      await Promise.all(
        req.files.dropPhoto.map(async (file) => {
          const fileUrl = await uploadFileToS3(file, 'images/imageArticle');
          return fileUrl;
        })
      ) : [];

        const imageProjects = req.files.photoAva ?
        await uploadFileToS3(req.files.photoAva[0], 'images/imageArticle') :
        null;
        const imageOpens = req.files.imageOpen ?
        await uploadFileToS3(req.files.imageOpen[0], 'images/imageArticle') :
        null;
      const imageCloses = req.files.imageClose ?
        await uploadFileToS3(req.files.imageClose[0], 'images/imageArticle') :
        null;

 
      const createdArticle = await Articles.create({
        title: req.body.title,
        author: req.body.author,
        city: req.body.city,
        dataMonthYear: req.body.dataMonthYear,
        selectCompetencies: req.body.selectCompetencies,
        titleTextBlock: req.body.titleTextBlock,
        descriptionArticle: req.body.descriptionArticle,
        textBlock: req.body.textBlock,
        imageTitle: imageTitles.join(', '),
        imageAuthor: imageProjects,
        imageOpen: imageOpens,
        imageClose: imageCloses,    
      });

      await ConstructorArticles.create({
        data: dynamicBlocksContent,
        image: dynamicImageTitles.join(', '),
        idBlock: createdArticle.id,
      });

      res.status(200).json({
        message: 'Данные успешно сохранены'
      });
    } catch (error) {
      console.log(error); 
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
      maxCount: 100
    },
  ]),
  async (req, res) => {
    try {
      const {
        articleId
      } = req.params;
       const articleToUpdate = await Articles.findByPk(articleId, {
        include: [ConstructorArticles],
      });

      if (!articleToUpdate) {
        console.error('Article not found for ID:', articleId);
        return res.status(404).json({
          message: 'Статья не найдена'
        });
      }


       // Получение текущих изображений
       const currentImageTitles = articleToUpdate.imageTitle ? articleToUpdate.imageTitle.split(', ').map((item) => item.trim()) : [];
       const currentImageAuthors = articleToUpdate.imageAuthor ? [articleToUpdate.imageAuthor] : [];
       const currentImageOpens = articleToUpdate.imageOpen ? [articleToUpdate.imageOpen] : [];
       const currentImageCloses = articleToUpdate.imageClose ? [articleToUpdate.imageClose] : [];
 
       // Загрузка новых изображений на S3
       const imageTitlesNew = req.files.dropPhoto ? await Promise.all(req.files.dropPhoto.map((file) => uploadFileToS3(file, 'images/imageArticle'))) : [];
       const imageAuthorNew = req.files.photoAva ? await uploadFileToS3(req.files.photoAva[0], 'images/imageArticle') : null;
       const imageOpenNew = req.files.imageOpen ? await uploadFileToS3(req.files.imageOpen[0], 'images/imageArticle') : null;
       const imageCloseNew = req.files.imageClose ? await uploadFileToS3(req.files.imageClose[0], 'images/imageArticle') : null;
 
       // Изображения от клиента
       let imageTitlesFromClient;
       if (typeof req.body.imageTitle === 'string') {
         imageTitlesFromClient = req.body.imageTitle.split(',').map(item => item.trim());
       } else if (Array.isArray(req.body.imageTitle)) {
         imageTitlesFromClient = req.body.imageTitle.map(item => item.trim());
       } else {
         imageTitlesFromClient = [];
       };
       const imageAuthorFromClient = req.body.imageAuthor ? [req.body.imageAuthor] : [];
       const imageOpenFromClient = req.body.imageOpen ? [req.body.imageOpen] : [];
       const imageCloseFromClient = req.body.imageClose ? [req.body.imageClose] : [];
 
       // Объединение старых и новых изображений
       const updatedImageTitles = [...imageTitlesFromClient, ...imageTitlesNew];
       const updatedImageAuthors = imageAuthorNew ? [imageAuthorNew] : imageAuthorFromClient;
       const updatedImageOpens = imageOpenNew ? [imageOpenNew] : imageOpenFromClient;
       const updatedImageCloses = imageCloseNew ? [imageCloseNew] : imageCloseFromClient;
 
       // Нормализация URL для корректного сравнения
       const normalizeUrl = (url) => decodeURIComponent(url.trim());

       const normalizedCurrentImages = [...currentImageTitles, ...currentImageAuthors, ...currentImageOpens, ...currentImageCloses].filter(Boolean).map(normalizeUrl);
       const normalizedUpdatedImages = [...updatedImageTitles, ...updatedImageAuthors, ...updatedImageOpens, ...updatedImageCloses].filter(Boolean).map(normalizeUrl);
 
       // Поиск изображений для удаления
       const imagesToRemove = normalizedCurrentImages.filter((image) => !normalizedUpdatedImages.includes(normalizeUrl(image)));
       await Promise.all(imagesToRemove.map(deleteImageFromS3));



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
        imageTitle: updatedImageTitles.join(', '),
        imageAuthor: updatedImageAuthors[0] || null,
        imageOpen: updatedImageOpens[0] || null,
        imageClose: updatedImageCloses[0] || null,
      });

    
      // Поиск или создание данных конструктора
      const existingConstructor = await ConstructorArticles.findOne({
        where: {
          idBlock: articleId
        }
      });

      const dynamicBlocksContent = req.body.dynamicBlocksJSON ? 
      JSON.parse(req.body.dynamicBlocksJSON) 
      : [];

        // Загрузка новых динамических изображений на S3
        const dynamicImagesNew = req.files.dynamicImages ? 
        await Promise.all(
          req.files.dynamicImages.map(async (file) => {
          const { 
            fileUrl 
          } = await uploadFileToS3(file, 'images/imageArticle');
          return fileUrl;
        })) : [];

     
       // Сохраняем текущие динамические изображения, если они уже существуют
       const existingDynamicImages = existingConstructor && existingConstructor.image ? 
       existingConstructor.image.split(', ').map((img) => img.trim()) : [];

           // Объединяем старые и новые динамические изображения
      const allDynamicImages = [...existingDynamicImages, ...dynamicImagesNew];

       // Обновляем контент динамических блоков
       const updatedDynamicBlocksContent = updateDynamicBlocksContent(
        dynamicBlocksContent,
        allDynamicImages
      );


          // Извлекаем изображения из динамических блоков
          const extractImages = (blocks) => 
            blocks
          .flatMap((blockGroup) => blockGroup)
          .filter((block) => block.type === 'file' && Array.isArray(block.value))
          .flatMap((block) => block.value)
          .filter(Boolean);

          const newDynamicImages = extractImages(dynamicBlocksContent).map((img) => img.trim());
    
          // Определение изображений, которые больше не связаны с динамическими блоками
          const imagesToRemoveFromDynamicBlocks = existingDynamicImages.filter((image) => 
            !newDynamicImages.map(normalizeUrl).includes(normalizeUrl(image)));

          await Promise.all(imagesToRemoveFromDynamicBlocks.map(deleteImageFromS3));


          if (existingConstructor) {
            await existingConstructor.update({
               data: updatedDynamicBlocksContent,
               image: newDynamicImages.join(', ')
               });
          } else {
            await ConstructorArticles.create({
               data: updatedDynamicBlocksContent,
               image: newDynamicImages.join(', '), 
               idBlock: articleId 
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



router.delete('/deletezapros/:id', async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const post = await Articles.findByPk(id);

    const deleteConstructorImg = await ConstructorArticles.findOne({
      where: {
        idBlock: id
      }
    });

  
    if (deleteConstructorImg?.image) {
      const imageConstructorNames = deleteConstructorImg.image.includes(', ') ?
        deleteConstructorImg.image.split(', ') :
        [deleteConstructorImg.image];
      
         await Promise.all(
        imageConstructorNames.map(async (imageUrl) => {
          const result = extractFileNameAndFolderFromUrl(imageUrl);
          if (result) {
            const {
              fileName,
              folder
            } = result;
            await deleteFileFromS3(fileName, folder);
          } else {
            console.log(`Не удалось извлечь имя файла и папку из URL: ${imageUrl}`);
          }
        })
      );
    }

    // Удаление фотографий из imageTitle
     if (post.imageTitle) {
      const imageTitleNames = post.imageTitle.includes(', ') ?
        post.imageTitle.split(', ') :
        [post.imageTitle];
      
      await Promise.all(
        imageTitleNames.map(async (imageUrl) => {
          const result = extractFileNameAndFolderFromUrl(imageUrl);
          if (result) {
            const {
              fileName,
              folder
            } = result;
            await deleteFileFromS3(fileName, folder);
          } else {
            console.log(`Не удалось извлечь имя файла и папку из URL: ${imageUrl}`);
          }
        })
      );
    }

    // Удаление фотографий из imageAuthor
     if (post.imageAuthor) {
      const imageTitleNames = post.imageAuthor.includes(', ') ?
        post.imageAuthor.split(', ') :
        [post.imageAuthor];
      
      await Promise.all(
        imageTitleNames.map(async (imageUrl) => {
          const result = extractFileNameAndFolderFromUrl(imageUrl);
          if (result) {
            const {
              fileName,
              folder
            } = result;
            await deleteFileFromS3(fileName, folder);
          } else {
            console.log(`Не удалось извлечь имя файла и папку из URL: ${imageUrl}`);
          }
        })
      );
    }

    // Удаление фотографии из imageOpen
    if (post.imageOpen) {
    const result = extractFileNameAndFolderFromUrl(post.imageOpen);
    if (result) {
      const {
        fileName,
        folder
      } = result;
      await deleteFileFromS3(fileName, folder);
    } else {
      console.log(`Не удалось извлечь имя файла и папку из URL: ${post.imageOpen}`);
    }
  }

    // Удаление фотографии из imageClose
    if (post.imageClose) {    
      const result = extractFileNameAndFolderFromUrl(post.imageClose);
      if (result) {
        const {
          fileName,
          folder
        } = result;
        await deleteFileFromS3(fileName, folder);
      } else {
        console.log(`Не удалось извлечь имя файла и папку из URL: ${post.imageClose}`);
      }
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