// const { URL } = require('url');
// const { Project, ProjectMain, Constructor } = require('../../db/models');
// const { uploadFileToS3, deleteFileFromS3 } = require('../../s3Utils/s3Service');

// async function projectRouter(fastify, opts) {
//   // ------------------ Вспомогательные функции ------------------
//   const syncProjectMain = async (projectId) => {
//     const project = await Project.findByPk(projectId);
//     if (project) {
//       const projectMainEntry = await ProjectMain.findOne({ where: { IdProject: project.id } });
//       if (projectMainEntry) {
//         await projectMainEntry.update({
//           project: project.toJSON(),
//           IdProject: project.id,
//         });
//       }
//     } else {
//       await ProjectMain.destroy({ where: { IdProject: projectId } });
//     }
//   };

//   const extractFileNameAndFolderFromUrl = (url) => {
//     if (!url.includes('http')) {
//       return { fileName: url, folder: 'images/imageAdd' };
//     }
//     try {
//       const urlObj = new URL(url);
//       const { pathname } = urlObj;
//       const parts = pathname.split('/').filter(Boolean);
//       if (parts.length >= 2) {
//         const folder = parts.slice(0, -1).join('/');
//         const fileName = parts[parts.length - 1];
//         return { fileName, folder };
//       }
//       return { fileName: parts[0], folder: 'images/imageAdd' };
//     } catch (error) {
//       console.error(`Ошибка извлечения данных из URL: ${url}`, error);
//       return null;
//     }
//   };

//   const deleteImageFromS3 = async (fileUrl) => {
//     const result = extractFileNameAndFolderFromUrl(fileUrl);
//     if (result) {
//       let { fileName, folder } = result;
//       fileName = decodeURIComponent(fileName);
//       folder = decodeURIComponent(folder);
//       try {
//         await deleteFileFromS3(fileName, folder);
//       } catch (error) {
//         console.error(`Ошибка при удалении файла ${fileName}:`, error);
//       }
//     }
//   };

//   const updateDynamicBlocksContent = (blocks, newImages) => {
//     let imageIndex = 0;
//     return blocks.map((blockGroup) =>
//       blockGroup.map((block) => {
//         if (block.type === 'file' && Array.isArray(block.value)) {
//           const updatedValues = block.value.map((val) => {
//             if (typeof val === 'string' && (val.startsWith('blob:') || val.startsWith('temp_'))) {
//               const newImage = newImages[imageIndex];
//               imageIndex += 1;
//               return newImage;
//             }
//             return val;
//           });
//           return { ...block, value: updatedValues };
//         }
//         return block;
//       }),
//     );
//   };

//   // ------------------ POST /postzapros ------------------
//   fastify.post('/postzapros', async (req, reply) => {
//     try {
//       // Сбор файлов и полей из multipart
//       const parts = req.parts();
//       const files = {
//         dropPhoto: [],
//         photoAva: [],
//         imageOpen: [],
//         imageClose: [],
//         dynamicImages: [],
//       };
//       const fields = {};

//       for await (const part of parts) {
//         if (part.file) {
//           if (!files[part.fieldname]) files[part.fieldname] = [];
//           files[part.fieldname].push(part);
//         } else {
//           fields[part.fieldname] = part.value;
//         }
//       }

//       // Dynamic images
//       const dynamicImageTitles = files.dynamicImages.length
//         ? await Promise.all(
//             files.dynamicImages.map((file) => uploadFileToS3(file, 'images/imageAdd')),
//           )
//         : [];

//       let dynamicBlocksContent = null;
//       if (fields.dynamicBlocksJSON) {
//         try {
//           dynamicBlocksContent = JSON.parse(fields.dynamicBlocksJSON);
//         } catch (error) {
//           return reply.code(400).send({ message: 'Неверный формат данных для dynamicBlocksJSON' });
//         }
//       }

//       // dropPhoto (галерея)
//       const imageTitles = files.dropPhoto.length
//         ? await Promise.all(files.dropPhoto.map((file) => uploadFileToS3(file, 'images/imageAdd')))
//         : [];

//       const imageProjects = files.photoAva.length
//         ? await uploadFileToS3(files.photoAva[0], 'images/imageAdd')
//         : null;
//       const imageOpens = files.imageOpen.length
//         ? await uploadFileToS3(files.imageOpen[0], 'images/imageAdd')
//         : null;
//       const imageCloses = files.imageClose.length
//         ? await uploadFileToS3(files.imageClose[0], 'images/imageAdd')
//         : null;

//       const createdProject = await Project.create({
//         title: fields.title,
//         selectCompetencies: fields.selectCompetencies,
//         countryCity: fields.countryCity,
//         monthYear: fields.monthYear,
//         viewConstruction: fields.viewConstruction,
//         style: fields.radioValue,
//         titleTextBlock: fields.titleTextBlock,
//         descriptionProject: fields.descriptionProject,
//         totalArea: fields.totalArea,
//         siteArea: fields.siteArea,
//         floors: fields.floors,
//         altitude: fields.altitude,
//         constructionVolume: fields.constructionVolume,
//         location: fields.location,
//         degreeParticipation: fields.degreeParticipation,
//         statusObject: fields.statusObject,
//         customer: fields.customer,
//         publication: fields.publication,
//         linkToPublication: fields.linkToPublication,
//         publicationTwo: fields.publicationTwo,
//         linkToPublicationTwo: fields.linkToPublicationTwo,
//         awards: fields.awards,
//         headingTextBlock: fields.headingTextBlock,
//         textBlock: fields.textBlock,
//         numberOfLanes: fields.numberOfLanes,
//         long: fields.long,
//         imageTitle: imageTitles.join(', '),
//         imageProject: imageProjects,
//         imageOpen: imageOpens,
//         imageClose: imageCloses,
//       });

//       await Constructor.create({
//         data: dynamicBlocksContent,
//         image: dynamicImageTitles.join(', '),
//         idBlock: createdProject.id,
//       });

//       reply.code(200).send({ message: 'Данные успешно сохранены' });
//     } catch (error) {
//       req.log.error(error);
//       reply.code(500).send({ message: 'Произошла ошибка при сохранении данных' });
//     }
//   });

//   // ------------------ PUT /updatezapros/:projectId ------------------
//   fastify.put('/updatezapros/:projectId', async (req, reply) => {
//     try {
//       const { projectId } = req.params;

//       // Собираем файлы и поля
//       const parts = req.parts();
//       const files = {
//         dropPhoto: [],
//         photoAva: [],
//         imageOpen: [],
//         imageClose: [],
//         dynamicImages: [],
//       };
//       const fields = {};

//       for await (const part of parts) {
//         if (part.file) {
//           if (!files[part.fieldname]) files[part.fieldname] = [];
//           files[part.fieldname].push(part);
//         } else {
//           fields[part.fieldname] = part.value;
//         }
//       }

//       const projectToUpdate = await Project.findByPk(projectId, { include: [Constructor] });
//       if (!projectToUpdate) {
//         return reply.code(404).send({ message: 'Проект не найден' });
//       }

//       const currentImageTitles = projectToUpdate.imageTitle
//         ? projectToUpdate.imageTitle.split(', ').map((item) => item.trim())
//         : [];
//       const currentImageProjects = projectToUpdate.imageProject
//         ? [projectToUpdate.imageProject]
//         : [];
//       const currentImageOpens = projectToUpdate.imageOpen ? [projectToUpdate.imageOpen] : [];
//       const currentImageCloses = projectToUpdate.imageClose ? [projectToUpdate.imageClose] : [];

//       // Новые изображения для загрузки на S3
//       const imageTitlesNew = files.dropPhoto.length
//         ? await Promise.all(files.dropPhoto.map((file) => uploadFileToS3(file, 'images/imageAdd')))
//         : [];

//       const imageProjectNew = files.photoAva.length
//         ? await uploadFileToS3(files.photoAva[0], 'images/imageAdd')
//         : null;
//       const imageOpenNew = files.imageOpen.length
//         ? await uploadFileToS3(files.imageOpen[0], 'images/imageAdd')
//         : null;
//       const imageCloseNew = files.imageClose.length
//         ? await uploadFileToS3(files.imageClose[0], 'images/imageAdd')
//         : null;

//       const imageTitlesFromClient = fields.imageTitle
//         ? fields.imageTitle.split(',').map((item) => item.trim())
//         : [];
//       const imageProjectFromClient = fields.imageProject ? [fields.imageProject] : [];
//       const imageOpenFromClient = fields.imageOpen ? [fields.imageOpen] : [];
//       const imageCloseFromClient = fields.imageClose ? [fields.imageClose] : [];

//       const updatedImageTitles = [...imageTitlesFromClient, ...imageTitlesNew];
//       const updatedImageProjects = imageProjectNew ? [imageProjectNew] : imageProjectFromClient;
//       const updatedImageOpens = imageOpenNew ? [imageOpenNew] : imageOpenFromClient;
//       const updatedImageCloses = imageCloseNew ? [imageCloseNew] : imageCloseFromClient;

//       const extractFileName = (url) => url.split('/').pop().split('?')[0];
//       const normalizedCurrentImages = [
//         ...currentImageTitles,
//         ...currentImageProjects,
//         ...currentImageOpens,
//         ...currentImageCloses,
//       ]
//         .filter(Boolean)
//         .map(extractFileName);

//       const normalizedUpdatedImages = [
//         ...updatedImageTitles,
//         ...updatedImageProjects,
//         ...updatedImageOpens,
//         ...updatedImageCloses,
//       ]
//         .filter(Boolean)
//         .map(extractFileName);

//       const imagesToRemove = normalizedCurrentImages.filter(
//         (image) => !normalizedUpdatedImages.includes(image),
//       );
//       await Promise.all(imagesToRemove.map(deleteImageFromS3));

//       await projectToUpdate.update({
//         title: fields.title,
//         selectCompetencies: fields.selectCompetencies,
//         countryCity: fields.countryCity,
//         monthYear: fields.monthYear,
//         viewConstruction: fields.viewConstruction,
//         style: fields.radioValue,
//         titleTextBlock: fields.titleTextBlock,
//         descriptionProject: fields.descriptionProject,
//         totalArea: fields.totalArea,
//         siteArea: fields.siteArea,
//         floors: fields.floors,
//         altitude: fields.altitude,
//         constructionVolume: fields.constructionVolume,
//         location: fields.location,
//         degreeParticipation: fields.degreeParticipation,
//         statusObject: fields.statusObject,
//         customer: fields.customer,
//         publication: fields.publication,
//         linkToPublication: fields.linkToPublication,
//         publicationTwo: fields.publicationTwo,
//         linkToPublicationTwo: fields.linkToPublicationTwo,
//         awards: fields.awards,
//         headingTextBlock: fields.headingTextBlock,
//         textBlock: fields.textBlock,
//         numberOfLanes: fields.numberOfLanes,
//         long: fields.long,
//         imageTitle: updatedImageTitles.join(', '),
//         imageProject: updatedImageProjects[0] || null,
//         imageOpen: updatedImageOpens[0] || null,
//         imageClose: updatedImageCloses[0] || null,
//       });

//       const existingConstructor = await Constructor.findOne({ where: { idBlock: projectId } });
//       const dynamicBlocksContent = fields.dynamicBlocksJSON
//         ? JSON.parse(fields.dynamicBlocksJSON)
//         : [];

//       const dynamicImagesNew = files.dynamicImages.length
//         ? await Promise.all(
//             files.dynamicImages.map((file) => uploadFileToS3(file, 'images/imageAdd')),
//           )
//         : [];

//       const existingDynamicImages =
//         existingConstructor && existingConstructor.image
//           ? existingConstructor.image.split(', ').map((img) => img.trim())
//           : [];

//       const allDynamicImages = [...existingDynamicImages, ...dynamicImagesNew];
//       const updatedDynamicBlocksContent = updateDynamicBlocksContent(
//         dynamicBlocksContent,
//         allDynamicImages,
//       );

//       const extractImages = (blocks) =>
//         blocks
//           .flatMap((blockGroup) => blockGroup)
//           .filter((block) => block.type === 'file' && Array.isArray(block.value))
//           .flatMap((block) => block.value)
//           .filter(Boolean);

//       const newDynamicImages = extractImages(updatedDynamicBlocksContent).map((img) => img.trim());

//       const normalizedExistingDynamicImages = existingDynamicImages.map(extractFileName);
//       const normalizedNewDynamicImages = newDynamicImages.map(extractFileName);

//       const imagesToRemoveFromDynamicBlocks = normalizedExistingDynamicImages.filter(
//         (image) => !normalizedNewDynamicImages.includes(image),
//       );
//       await Promise.all(imagesToRemoveFromDynamicBlocks.map(deleteImageFromS3));

//       if (existingConstructor) {
//         await existingConstructor.update({
//           data: updatedDynamicBlocksContent,
//           image: newDynamicImages.join(', '),
//         });
//       } else {
//         await Constructor.create({
//           data: updatedDynamicBlocksContent,
//           image: newDynamicImages.join(', '),
//           idBlock: projectId,
//         });
//       }

//       await syncProjectMain(projectId);

//       reply.code(200).send({ message: 'Данные успешно обновлены' });
//     } catch (error) {
//       req.log.error(error);
//       reply.code(500).send({ message: 'Произошла ошибка при обновлении данных' });
//     }
//   });

//   // ------------------ GET /getzapros ------------------
//   fastify.get('/getzapros', async (req, reply) => {
//     try {
//       const data = await Project.findAll({
//         include: [Constructor],
//         order: [['id', 'DESC']],
//       });
//       reply.send(data);
//     } catch (error) {
//       fastify.log.error(error);
//       reply.code(500).send({ error: 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.' });
//     }
//   });

//   // ------------------ GET /getzapros-filter ------------------
//   fastify.get('/getzapros-filter', async (req, reply) => {
//     try {
//       const { viewConstruction } = req.query;
//       let data;
//       if (viewConstruction && viewConstruction !== 'Все') {
//         data = await Project.findAll({ where: { viewConstruction } });
//       } else {
//         data = await Project.findAll();
//       }
//       reply.send(data);
//     } catch (error) {
//       fastify.log.error(error);
//       reply.code(500).send({ error: 'Произошла ошибка при получении проектов.' });
//     }
//   });

//   // ------------------ GET /getdynamicdata/:projectId ------------------
//   fastify.get('/getdynamicdata/:projectId', async (req, reply) => {
//     try {
//       const { projectId } = req.params;
//       const constructorData = await Constructor.findOne({ where: { idBlock: projectId } });
//       if (!constructorData) {
//         return reply.code(404).send({ message: 'Динамические данные не найдены' });
//       }
//       reply.send({
//         dynamicData: constructorData.data,
//         dynamicImages: constructorData.image ? constructorData.image.split(', ') : [],
//       });
//     } catch (error) {
//       fastify.log.error(error);
//       reply.code(500).send({ message: 'Произошла ошибка при получении динамических данных' });
//     }
//   });

//   // ------------------ DELETE /deletezapros/:id ------------------
//   fastify.delete('/deletezapros/:id', async (req, reply) => {
//     try {
//       const { id } = req.params;
//       const post = await Project.findByPk(id);
//       const deleteConstructorImg = await Constructor.findOne({ where: { idBlock: id } });

//       const normalizeFileName = (url) => url.split('/').pop().split('?')[0];
//       const extractAndDeleteImages = async (imageUrls) => {
//         const normalizedUrls = [...new Set(imageUrls.map(normalizeFileName))];
//         for (const imageUrl of normalizedUrls) {
//           const result = extractFileNameAndFolderFromUrl(imageUrl);
//           if (result) {
//             const { fileName, folder } = result;
//             try {
//               await deleteFileFromS3(fileName, folder);
//             } catch (error) {
//               fastify.log.error(`Ошибка при удалении файла ${fileName}:`, error);
//             }
//           }
//         }
//       };

//       if (deleteConstructorImg?.image) {
//         const imageConstructorNames = deleteConstructorImg.image
//           .split(', ')
//           .map((img) => img.trim());
//         await extractAndDeleteImages(imageConstructorNames);
//       }
//       if (post.imageTitle) {
//         const imageTitleNames = post.imageTitle.split(', ').map((img) => img.trim());
//         await extractAndDeleteImages(imageTitleNames);
//       }
//       if (post.imageProject) {
//         await extractAndDeleteImages([post.imageProject]);
//       }
//       if (post.imageOpen) {
//         await extractAndDeleteImages([post.imageOpen]);
//       }
//       if (post.imageClose) {
//         await extractAndDeleteImages([post.imageClose]);
//       }

//       await Constructor.destroy({ where: { idBlock: id } });
//       await ProjectMain.destroy({ where: { IdProject: id } });
//       await Project.destroy({ where: { id } });

//       reply.code(200).send({ message: 'Проект успешно удалён' });
//     } catch (error) {
//       fastify.log.error('Ошибка при удалении проекта:', error);
//       reply.code(500).send({ message: 'Ошибка при удалении проекта' });
//     }
//   });
// }

// module.exports = projectRouter;

const express = require('express');
const {
  URL
} = require('url');
const {
  Project,
  ProjectMain,
  Constructor
} = require('../../db/models');
const fileMiddleware = require('../../middleware/file');
const {
  uploadFileToS3,
  deleteFileFromS3
} = require('../../s3Utils/s3Service');

const router = express.Router();

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

  // Если это не полный URL, значит это локальный путь файла
  if (!url.includes('http')) {
    return {
      fileName: url,
      folder: 'images/imageAdd',
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
      folder: 'images/imageAdd',
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
            const fileUrl = await uploadFileToS3(file, 'images/imageAdd');
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
            const fileUrl = await uploadFileToS3(file, 'images/imageAdd');
            return fileUrl;
          })
        ) : [];

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
      const projectToUpdate = await Project.findByPk(projectId, {
        include: [Constructor],
      });

      if (!projectToUpdate) {
        return res.status(404).json({
          message: 'Проект не найден',
        });
      }

      // Получение текущих изображений
      const currentImageTitles = projectToUpdate.imageTitle ? projectToUpdate.imageTitle.split(', ').map((item) => item.trim()) : [];
      const currentImageProjects = projectToUpdate.imageProject ? [projectToUpdate.imageProject] : [];
      const currentImageOpens = projectToUpdate.imageOpen ? [projectToUpdate.imageOpen] : [];
      const currentImageCloses = projectToUpdate.imageClose ? [projectToUpdate.imageClose] : [];

      // Новые изображения для загрузки на S3
      const imageTitlesNew = req.files.dropPhoto ? await Promise.all(req.files.dropPhoto.map((file) => uploadFileToS3(file, 'images/imageAdd'))) : [];
      const imageProjectNew = req.files.photoAva ? await uploadFileToS3(req.files.photoAva[0], 'images/imageAdd') : null;
      const imageOpenNew = req.files.imageOpen ? await uploadFileToS3(req.files.imageOpen[0], 'images/imageAdd') : null;
      const imageCloseNew = req.files.imageClose ? await uploadFileToS3(req.files.imageClose[0], 'images/imageAdd') : null;

      // Изображения от клиента
      const imageTitlesFromClient = req.body.imageTitle ? req.body.imageTitle.split(',').map((item) => item.trim()) : [];
      const imageProjectFromClient = req.body.imageProject ? [req.body.imageProject] : [];
      const imageOpenFromClient = req.body.imageOpen ? [req.body.imageOpen] : [];
      const imageCloseFromClient = req.body.imageClose ? [req.body.imageClose] : [];

      // Объединение старых и новых изображений
      const updatedImageTitles = [...imageTitlesFromClient, ...imageTitlesNew];
      const updatedImageProjects = imageProjectNew ? [imageProjectNew] : imageProjectFromClient;
      const updatedImageOpens = imageOpenNew ? [imageOpenNew] : imageOpenFromClient;
      const updatedImageCloses = imageCloseNew ? [imageCloseNew] : imageCloseFromClient;

      // Нормализация URL для корректного сравнения (на основе имени файла)
      const extractFileName = (url) => url.split('/').pop().split('?')[0];

      const normalizedCurrentImages = [...currentImageTitles, ...currentImageProjects, ...currentImageOpens, ...currentImageCloses]
        .filter(Boolean)
        .map(extractFileName);

      const normalizedUpdatedImages = [...updatedImageTitles, ...updatedImageProjects, ...updatedImageOpens, ...updatedImageCloses]
        .filter(Boolean)
        .map(extractFileName);

      // Поиск изображений для удаления (тех, которые больше не используются)
      const imagesToRemove = normalizedCurrentImages.filter((image) => !normalizedUpdatedImages.includes(image));

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

      // Загрузка новых динамических изображений на S3
      const dynamicImagesNew = req.files.dynamicImages ?
        await Promise.all(
          req.files.dynamicImages.map(async (file) => {
            const {
              fileUrl
            } = await uploadFileToS3(file, 'images/imageAdd');
            return fileUrl;
          })
        ) : [];

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

      // Извлечение всех динамических изображений
      const extractImages = (blocks) =>
        blocks
        .flatMap((blockGroup) => blockGroup)
        .filter((block) => block.type === 'file' && Array.isArray(block.value))
        .flatMap((block) => block.value)
        .filter(Boolean);

      const newDynamicImages = extractImages(updatedDynamicBlocksContent).map((img) => img.trim());

      // Нормализованные массивы динамических изображений
      const normalizedExistingDynamicImages = existingDynamicImages.map(extractFileName);
      const normalizedNewDynamicImages = newDynamicImages.map(extractFileName);

      // Удаление старых динамических изображений
      const imagesToRemoveFromDynamicBlocks = normalizedExistingDynamicImages.filter((image) => !normalizedNewDynamicImages.includes(image));

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

router.get('/getzapros', async (req, res) => {
  try {
    const data = await Project.findAll({
      include: [Constructor],
      order: [
        ['id', 'DESC']
      ]
    });

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

    const normalizeFileName = (url) => url.split('/').pop().split('?')[0];

    const extractAndDeleteImages = async (imageUrls) => {
      const normalizedUrls = [...new Set(imageUrls.map(normalizeFileName))];
      // eslint-disable-next-line no-restricted-syntax
      for (const imageUrl of normalizedUrls) {
        const result = extractFileNameAndFolderFromUrl(imageUrl);
        if (result) {
          const {
            fileName,
            folder
          } = result;
          try {
            // eslint-disable-next-line no-await-in-loop
            await deleteFileFromS3(fileName, folder);
            console.log(`Файл ${fileName} удалён из ${folder}`);
          } catch (error) {
            console.error(`Ошибка при удалении файла ${fileName}:`, error);
          }
        } else {
          console.log(`Не удалось извлечь имя файла и папку из URL: ${imageUrl}`);
        }
      }
    };

    // Удаление изображений из Constructor
    if (deleteConstructorImg?.image) {
      const imageConstructorNames = deleteConstructorImg.image.split(', ').map((img) => img.trim());
      await extractAndDeleteImages(imageConstructorNames);
    }

    // Удаление фотографий из imageTitle
    if (post.imageTitle) {
      const imageTitleNames = post.imageTitle.split(', ').map((img) => img.trim());
      await extractAndDeleteImages(imageTitleNames);
    }

    // Удаление фотографий из imageProject
    if (post.imageProject) {
      await extractAndDeleteImages([post.imageProject]);
    }

    // Удаление фотографии из imageOpen
    if (post.imageOpen) {
      await extractAndDeleteImages([post.imageOpen]);
    }

    // Удаление фотографии из imageClose
    if (post.imageClose) {
      await extractAndDeleteImages([post.imageClose]);
    }

    // Удаление связанных элементов из других таблиц
    await Constructor.destroy({
      where: {
        idBlock: id
      }
    });
    await ProjectMain.destroy({
      where: {
        IdProject: id
      }
    });
    await Project.destroy({
      where: {
        id
      }
    });

    res.sendStatus(200);
  } catch (error) {
    console.error('Ошибка при удалении проекта:', error);
    res.sendStatus(500);
  }
});

module.exports = router;
