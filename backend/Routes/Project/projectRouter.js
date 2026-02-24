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
  if (!url.includes('http')) {
    return {
      fileName: url,
      folder: 'images/imageAdd',
    };
  }

  try {
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
  '/postzapros-new',
  fileMiddleware.fields([
    { name: 'dropPhoto', maxCount: 4 },
    { name: 'photoAva', maxCount: 1 },
    { name: 'imageOpen', maxCount: 1 },
    { name: 'imageClose', maxCount: 1 },
    { name: 'constructorImages', maxCount: 100 },
  ]),
  async (req, res) => {
    try {
      // Загружаем обычные фото
      const imageTitles = req.files.dropPhoto
        ? await Promise.all(req.files.dropPhoto.map((f) => uploadFileToS3(f, 'images/imageAdd')))
        : [];
      const imageProject = req.files.photoAva
        ? await uploadFileToS3(req.files.photoAva[0], 'images/imageAdd')
        : null;
      const imageOpen = req.files.imageOpen
        ? await uploadFileToS3(req.files.imageOpen[0], 'images/imageAdd')
        : null;
      const imageClose = req.files.imageClose
        ? await uploadFileToS3(req.files.imageClose[0], 'images/imageAdd')
        : null;

      // Загружаем картинки конструктора и строим map: originalname → s3Url
      const constructorImageMap = {};
      if (req.files.constructorImages) {
        await Promise.all(
          req.files.constructorImages.map(async (file) => {
            const url = await uploadFileToS3(file, 'images/imageAdd');
            constructorImageMap[file.originalname] = url;
          })
        );
      }

      // Парсим блоки конструктора и подставляем S3 URL вместо имён файлов
      let constructorBlocks = [];
      if (req.body.constructorBlocksJSON) {
        const parsed = JSON.parse(req.body.constructorBlocksJSON);
        constructorBlocks = parsed.map((block) => {
          if (block.type === 'imageWithDesc' && block.image && constructorImageMap[block.image]) {
            return { ...block, image: constructorImageMap[block.image] };
          }
          return block;
        });
      }

      const constructorImageUrls = Object.values(constructorImageMap);

      // Сохраняем проект
      const createdProject = await Project.create({
        title: req.body.title,
        selectCompetencies: req.body.selectCompetencies,
        countryCity: req.body.countryCity,
        monthYear: req.body.monthYear,
        viewConstruction: req.body.viewConstruction,
        titleTextBlock: req.body.titleTextBlock,
        descriptionProject: req.body.descriptionProject,
        totalArea: req.body.totalArea,
        siteArea: req.body.siteArea,
        floors: req.body.floors,
        altitude: req.body.altitude,
        constructionVolume: req.body.constructionVolume,
        numberOfLanes: req.body.numberOfLanes,
        long: req.body.long,
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
        imageTitle: imageTitles.join(', '),
        imageProject,
        imageOpen,
        imageClose,
      });

      // Сохраняем конструктор
      await Constructor.create({
        data: constructorBlocks,
        image: constructorImageUrls.join(', '),
        idBlock: createdProject.id,
      });

      console.log('=== postzapros-new: project created, id:', createdProject.id);
      console.log('constructorBlocks:', JSON.stringify(constructorBlocks, null, 2));

      res.status(200).json({ message: 'Данные успешно сохранены' });
    } catch (error) {
      console.error('Ошибка postzapros-new:', error);
      res.status(500).json({ message: 'Произошла ошибка при сохранении данных' });
    }
  }
);

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

      const currentImageTitles = projectToUpdate.imageTitle ? projectToUpdate.imageTitle.split(', ').map((item) => item.trim()) : [];
      const currentImageProjects = projectToUpdate.imageProject ? [projectToUpdate.imageProject] : [];
      const currentImageOpens = projectToUpdate.imageOpen ? [projectToUpdate.imageOpen] : [];
      const currentImageCloses = projectToUpdate.imageClose ? [projectToUpdate.imageClose] : [];

      const imageTitlesNew = req.files.dropPhoto ? await Promise.all(req.files.dropPhoto.map((file) => uploadFileToS3(file, 'images/imageAdd'))) : [];
      const imageProjectNew = req.files.photoAva ? await uploadFileToS3(req.files.photoAva[0], 'images/imageAdd') : null;
      const imageOpenNew = req.files.imageOpen ? await uploadFileToS3(req.files.imageOpen[0], 'images/imageAdd') : null;
      const imageCloseNew = req.files.imageClose ? await uploadFileToS3(req.files.imageClose[0], 'images/imageAdd') : null;

      const imageTitlesFromClient = req.body.imageTitle ? req.body.imageTitle.split(',').map((item) => item.trim()) : [];
      const imageProjectFromClient = req.body.imageProject ? [req.body.imageProject] : [];
      const imageOpenFromClient = req.body.imageOpen ? [req.body.imageOpen] : [];
      const imageCloseFromClient = req.body.imageClose ? [req.body.imageClose] : [];

      const updatedImageTitles = [...imageTitlesFromClient, ...imageTitlesNew];
      const updatedImageProjects = imageProjectNew ? [imageProjectNew] : imageProjectFromClient;
      const updatedImageOpens = imageOpenNew ? [imageOpenNew] : imageOpenFromClient;
      const updatedImageCloses = imageCloseNew ? [imageCloseNew] : imageCloseFromClient;

      const extractFileName = (url) => url.split('/').pop().split('?')[0];

      const normalizedCurrentImages = [...currentImageTitles, ...currentImageProjects, ...currentImageOpens, ...currentImageCloses]
        .filter(Boolean)
        .map(extractFileName);

      const normalizedUpdatedImages = [...updatedImageTitles, ...updatedImageProjects, ...updatedImageOpens, ...updatedImageCloses]
        .filter(Boolean)
        .map(extractFileName);

      const imagesToRemove = normalizedCurrentImages.filter((image) => !normalizedUpdatedImages.includes(image));

      await Promise.all(imagesToRemove.map(deleteImageFromS3));

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

      const dynamicImagesNew = req.files.dynamicImages ?
        await Promise.all(
          req.files.dynamicImages.map(async (file) => {
            const {
              fileUrl
            } = await uploadFileToS3(file, 'images/imageAdd');
            return fileUrl;
          })
        ) : [];

      const existingDynamicImages = existingConstructor && existingConstructor.image ?
        existingConstructor.image.split(', ').map((img) => img.trim()) : [];

      const allDynamicImages = [...existingDynamicImages, ...dynamicImagesNew];

      const updatedDynamicBlocksContent = updateDynamicBlocksContent(
        dynamicBlocksContent,
        allDynamicImages
      );

      const extractImages = (blocks) =>
        blocks
          .flatMap((blockGroup) => blockGroup)
          .filter((block) => block.type === 'file' && Array.isArray(block.value))
          .flatMap((block) => block.value)
          .filter(Boolean);

      const newDynamicImages = extractImages(updatedDynamicBlocksContent).map((img) => img.trim());

      const normalizedExistingDynamicImages = existingDynamicImages.map(extractFileName);
      const normalizedNewDynamicImages = newDynamicImages.map(extractFileName);

      const imagesToRemoveFromDynamicBlocks = normalizedExistingDynamicImages.filter((image) => !normalizedNewDynamicImages.includes(image));

      await Promise.all(imagesToRemoveFromDynamicBlocks.map(deleteImageFromS3));

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
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);

    if (page && limit && page > 0 && limit > 0) {
      const offset = (page - 1) * limit;

      const { count, rows } = await Project.findAndCountAll({
        include: [Constructor],
        order: [
          ['id', 'DESC']
        ],
        limit,
        offset,
      });

      res.json({
        data: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      });
    } else {
      const data = await Project.findAll({
        include: [Constructor],
        order: [
          ['id', 'DESC']
        ]
      });

      res.json(data);
    }
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

    if (deleteConstructorImg?.image) {
      const imageConstructorNames = deleteConstructorImg.image.split(', ').map((img) => img.trim());
      await extractAndDeleteImages(imageConstructorNames);
    }

    if (post.imageTitle) {
      const imageTitleNames = post.imageTitle.split(', ').map((img) => img.trim());
      await extractAndDeleteImages(imageTitleNames);
    }

    if (post.imageProject) {
      await extractAndDeleteImages([post.imageProject]);
    }

    if (post.imageOpen) {
      await extractAndDeleteImages([post.imageOpen]);
    }

    if (post.imageClose) {
      await extractAndDeleteImages([post.imageClose]);
    }

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
