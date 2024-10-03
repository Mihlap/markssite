const express = require('express');
// eslint-disable-next-line
const path = require('path');
const { URL } = require('url');
const {
  Project,
  ProjectMain,
  Constructor
} = require('../../db/models');
const fileMiddleware = require('../../middleware/fileEvent');
const {
  uploadFileToS3,
  deleteFileFromS3
} = require('../../s3Utils/s3Service');

const router = express.Router();

// const projectImagesPath = path.join(__dirname, 'images/projectFoto');

const syncProjectMain = async (projectId) => {
  const project = await Project.findByPk(projectId);
  if (project) {
    const projectMainEntry = await ProjectMain.findOne({
      where: {
        IdProject: project.id
      },
    });
    if (projectMainEntry) {
      await projectMainEntry.update({
        project: project.toJSON(),
        IdProject: project.id,
      });
    }
  } else {
    await ProjectMain.destroy({
      where: {
        IdProject: projectId
      },
    });
  }
};


const extractFileNameAndFolderFromUrl = (url) => {
  console.log('URL для извлечения:', url); 
  if (!url.includes('http')) {
    return {
      fileName: url,
      folder: 'images/imageAdd',
    };
  }

  try {
    const urlObj = new URL(url);
    const { pathname } = urlObj;
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      const folder = parts.slice(0, -1).join('/');
      const fileName = parts[parts.length - 1];
      console.log('Извлечено имя файла:', fileName, 'и папка:', folder); 
      return {
        fileName,
        folder
      };
    }
    const fileName = parts[0];
    return {
      fileName,
      folder: ''
    };
  } catch (error) {
    console.error(`Ошибка извлечения данных из URL: ${url}`, error);
    return null;
  }
};



const deleteImageFromS3 = async (imageUrl) => {
  const result = extractFileNameAndFolderFromUrl(imageUrl);
  if (result) {
    const { fileName, folder } = result;
    console.log(`Удаление файла: ${fileName} из папки: ${folder}`);
    try {
      await deleteFileFromS3(fileName, folder);
      console.log(`Файл ${fileName} успешно удалён.`);
    } catch (error) {
      console.error(`Ошибка при удалении файла ${fileName}:`, error);
    }
  } else {
    console.log(`Не удалось извлечь имя файла и папку из URL: ${imageUrl}`);
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
        return { ...block, value: updatedValues };
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
            const fileUrl = await uploadFileToS3(file, 'images/imageAdd');
            return fileUrl;
          })
        ) :
        [];


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
            const fileUrl = await uploadFileToS3(file, 'images/imageAdd');
            return fileUrl;
          })
        ) :
        [];

      const imageProjects = req.files.photoAva ?
        await uploadFileToS3(req.files.photoAva[0], 'images/imageAdd') :
        null;
      const imageOpens = req.files.imageOpen ?
        await uploadFileToS3(req.files.imageOpen[0], 'images/imageAdd') :
        null;
      const imageCloses = req.files.imageClose ?
        await uploadFileToS3(req.files.imageClose[0], 'images/imageAdd') :
        null;

      const createdProject = await Project.create({
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
        imageTitle: imageTitles.join(', '),
        imageProject: imageProjects,
        imageOpen: imageOpens,
        imageClose: imageCloses,
      });

      await Constructor.create({
        data: dynamicBlocksContent,  
        image: dynamicImageTitles.join(', '),
        idBlock: createdProject.id,
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
  '/updatezapros/:projectId',
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
        projectId
      } = req.params;
      // Поиск проекта по id
      const projectToUpdate = await Project.findByPk(projectId, {
        include: [Constructor],
      });

      if (!projectToUpdate) {
        return res.status(404).json({
          message: 'Проект не найден',
        });
      }

      // Загрузка новых файлов на S3 и получение URL
      const imageTitlesNew = req.files.dropPhoto ?
        await Promise.all(
          req.files.dropPhoto.map((file) => uploadFileToS3(file, 'images/imageAdd'))
        ) :
        [];

      const imageProjectNew = req.files.photoAva ?
        await uploadFileToS3(req.files.photoAva[0], 'images/imageAdd') :
        null;

      const imageOpenNew = req.files.imageOpen ?
        await uploadFileToS3(req.files.imageOpen[0], 'images/imageAdd') :
        null;

      const imageCloseNew = req.files.imageClose ?
        await uploadFileToS3(req.files.imageClose[0], 'images/imageAdd') :
        null;
      
          // Загрузка новых динамических изображений на S3
          const dynamicImagesNew = req.files.dynamicImages
          ? await Promise.all(
              req.files.dynamicImages.map(async (file) => {
                const { fileUrl } = await uploadFileToS3(file, 'images/imageAdd');
                return fileUrl;
              })
            )
          : [];

      // Получение текущих изображений из базы данных
      const currentImageTitles = projectToUpdate.imageTitle ?
        projectToUpdate.imageTitle.split(', ').map((item) => item.trim()) :
        [];
      const currentImageProjects = projectToUpdate.imageProject ?
        [projectToUpdate.imageProject] :
        [];
      const currentImageOpens = projectToUpdate.imageOpen ?
        [projectToUpdate.imageOpen] :
        [];
      const currentImageCloses = projectToUpdate.imageClose ?
        [projectToUpdate.imageClose] :
        [];

      // Получение изображений, которые пользователь хочет сохранить, из req.body
      const imageTitlesFromClient = req.body.imageTitle ?
        req.body.imageTitle.split(',').map((item) => item.trim()) :
        [];
      const imageProjectFromClient = req.body.imageProject ? [req.body.imageProject] : [];
      const imageOpenFromClient = req.body.imageOpen ? [req.body.imageOpen] : [];
      const imageCloseFromClient = req.body.imageClose ? [req.body.imageClose] : [];

      // Объединение старых и новых изображений
      const updatedImageTitles = [...imageTitlesFromClient, ...imageTitlesNew];
      const updatedImageProjects = imageProjectNew ? [imageProjectNew] : imageProjectFromClient;
      const updatedImageOpens = imageOpenNew ? [imageOpenNew] : imageOpenFromClient;
      const updatedImageCloses = imageCloseNew ? [imageCloseNew] : imageCloseFromClient;

      const normalizeUrl = (url) => url.trim().toLowerCase();

      // // Все изображения для сохранения
      // const imagesToKeep = [
      //   ...updatedImageTitles,
      //   ...updatedImageProjects,
      //   ...updatedImageOpens,
      //   ...updatedImageCloses,
      // ].filter(Boolean).map(normalizeUrl);

      // // Все текущие изображения
      // const imagesToDelete = [
      //   ...currentImageTitles,
      //   ...currentImageProjects,
      //   ...currentImageOpens,
      //   ...currentImageCloses,
      // ].filter(Boolean).map(normalizeUrl);

      // // Получение изображений для удаления (те, которые больше не используются)
      // const imagesToRemove = imagesToDelete.filter((image) => !imagesToKeep.includes(image));     
      
            // Получение изображений для удаления (те, которые больше не используются)
      const imagesToRemove = currentImageTitles
        .concat(currentImageProjects, currentImageOpens, currentImageCloses)
        .filter(image => !updatedImageTitles.includes(image) &&
          !updatedImageProjects.includes(image) &&
          !updatedImageOpens.includes(image) &&
          !updatedImageCloses.includes(image));

      // Удаление старых изображений из S3
      await Promise.all(imagesToRemove.map(deleteImageFromS3));

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
        imageTitle: updatedImageTitles.join(', '),
        imageProject: updatedImageProjects[0] || null,
        imageOpen: updatedImageOpens[0] || null,
        imageClose: updatedImageCloses[0] || null,
      });

      const existingConstructor = await Constructor.findOne({
        where: {
          idBlock: projectId,
        },
      });      
      
      const dynamicBlocksContent = req.body.dynamicBlocksJSON ?
        JSON.parse(req.body.dynamicBlocksJSON) :
        [];

        const updatedDynamicBlocksContent = updateDynamicBlocksContent(
          dynamicBlocksContent,
          dynamicImagesNew
      );      

      const existingImages =
      existingConstructor && existingConstructor.image
        ? existingConstructor.image.split(', ').map((img) => img.trim())
        : [];

      const extractImages = (blocks) =>
           blocks
           .flatMap((blockGroup) => blockGroup)
           .filter((block) => block.type === 'file' && Array.isArray(block.value))
             .flatMap((block) => block.value)
             .filter(Boolean);
      
     
      
      const newDynamicImages = extractImages(updatedDynamicBlocksContent).map((img) => img.trim());     

      // Определение изображений, которые больше не связаны с динамическими блоками
      const imagesToRemoveFromDynamicBlocks = existingImages.filter(
        (image) => !newDynamicImages.map(normalizeUrl).includes(normalizeUrl(image))
      )      


          console.log('existingImages:', existingImages);
          console.log('newDynamicImages:', newDynamicImages);
          console.log('imagesToRemoveFromDynamicBlocks:', imagesToRemoveFromDynamicBlocks);

      // Удаление старых динамических изображений из S3
      await Promise.all(imagesToRemoveFromDynamicBlocks.map(deleteImageFromS3));

      // Обновление или создание записи в Constructor
      if (existingConstructor) {
        await existingConstructor.update({
          data: updatedDynamicBlocksContent,
          image: newDynamicImages.join(', '),
        });
      } else {
        await Constructor.create({
          data: updatedDynamicBlocksContent, 
          image: newDynamicImages.join(', '),
          idBlock: projectId,
        });
      }

      await syncProjectMain(projectId);

      res.status(200).json({
        message: 'Данные успешно обновлены',
      });
    } catch (error) {
      console.error('Ошибка при обновлении проекта:', error);
      res.status(500).json({
        message: 'Произошла ошибка при обновлении данных',
      });
    }
  }
);


// router.get('/getimage/:imageName', (req, res) => {
//   const {
//     imageName
//   } = req.params;
//   const imagePath = path.join(projectImagesPath, imageName);

//   res.set('Cache-Control', 'public, max-age=432000'); // 432000 секунд = 5 дней

//   res.sendFile(imagePath);
// });


router.get('/getzapros', async (req, res) => {
  try {
    const data = await Project.findAll({
      include: [Constructor],
      order: [
        ['id', 'DESC']
      ]
    });

    // res.set('Cache-Control', 'public, max-age=432000'); // 432000 секунд = 5 дней

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.'
    });
  }
});

router.get('/getzapros-filter', async (req, res) => {
  try {
    const {
      viewConstruction
    } = req.query;
    let data;

    if (viewConstruction && viewConstruction !== 'Все') {
      data = await Project.findAll({
        where: {
          viewConstruction
        },
      });
    } else {
      data = await Project.findAll();
    }

    // res.set('Cache-Control', 'public, max-age=432000'); // 432000 секунд = 5 дней

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Произошла ошибка при получении проектов.'
    });
  }
});

router.get('/getdynamicdata/:projectId', async (req, res) => {
  try {
    const {
      projectId
    } = req.params;

    // Найти данные конструктора по id проекта
    const constructorData = await Constructor.findOne({
      where: {
        idBlock: projectId
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
    const post = await Project.findByPk(id);
    const deleteConstructorImg = await Constructor.findOne({
      where: {
        idBlock: id
      }
    });

    console.log('Удаляем проект с id:', id);

    // Удаление изображений из Constructor
    if (deleteConstructorImg?.image) {
      const imageConstructorNames = deleteConstructorImg.image.includes(', ') ?
        deleteConstructorImg.image.split(', ') :
        [deleteConstructorImg.image];
      
        console.log('Изображения в Constructor для удаления:', imageConstructorNames)

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
      
        console.log('Изображения из imageTitle для удаления:', imageTitleNames);

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

    // Удаление фотографий из imageProject
    if (post.imageProject) {
      const projectImageNames = [post.imageProject];

      console.log('Изображения из imageProject для удаления:', projectImageNames);

      await Promise.all(
        projectImageNames.map(async (imageUrl) => {
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

      console.log('Изображение из imageOpen для удаления:', post.imageOpen);

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
      
      console.log('Изображение из imageClose для удаления:', post.imageClose);

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
    await Constructor.destroy({
      where: {
        idBlock: id,
      },
    });

    await ProjectMain.destroy({
      where: {
        IdProject: id,
      },
    });

    // Удаление поста
    await Project.destroy({
      where: {
        id,
      },
    });

    res.sendStatus(200);
  } catch (e) {
    console.error('Ошибка при удалении проекта:', e);
    res.sendStatus(500);
  }
});


module.exports = router;
