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
const { logResourceAction } = require('../../utils/fileLogger');

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

const deleteImageFromS3 = async (fileUrl, logInfo = null) => {
  const result = extractFileNameAndFolderFromUrl(fileUrl);
  if (result) {
    let {
      fileName,
      folder
    } = result;
    fileName = decodeURIComponent(fileName);
    folder = decodeURIComponent(folder);
    try {
      await deleteFileFromS3(fileName, folder, logInfo);
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
      const userInfo = req.session?.user ? {
        userName: req.session.user.name,
        userId: req.session.user.id.toString(),
        resourceType: 'project',
      } : null;

      let dynamicBlocksContent = null;

      const dynamicImageTitles = req.files.dynamicImages ?
        await Promise.all(
          req.files.dynamicImages.map(async (file) => {
            const fileUrl = await uploadFileToS3(file, 'images/imageAdd', userInfo);
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
            const fileUrl = await uploadFileToS3(file, 'images/imageAdd', userInfo);
            return fileUrl;
          })
        ) : [];

      const imageProjects = req.files.photoAva ?
        await uploadFileToS3(req.files.photoAva[0], 'images/imageAdd', userInfo) :
        null;
      const imageOpens = req.files.imageOpen ?
        await uploadFileToS3(req.files.imageOpen[0], 'images/imageAdd', userInfo) :
        null;
      const imageCloses = req.files.imageClose ?
        await uploadFileToS3(req.files.imageClose[0], 'images/imageAdd', userInfo) :
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

      if (req.session?.user) {
        logResourceAction({
          action: 'CREATE',
          userName: req.session.user.name,
          userId: req.session.user.id.toString(),
          resourceType: 'project',
          resourceId: createdProject.id.toString(),
          resourceName: req.body.title || 'Проект',
        });
      }

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
      
      const userInfo = req.session?.user ? {
        userName: req.session.user.name,
        userId: req.session.user.id.toString(),
        resourceType: 'project',
        resourceId: projectId,
      } : null;

      const projectToUpdate = await Project.findByPk(projectId, {
        include: [Constructor],
      });

      if (!projectToUpdate) {
        return res.status(404).json({
          message: 'Проект не найден',
        });
      }

      const normalizeValue = (value, existingValue) => {
        if (value === undefined || value === null) {
          return existingValue ?? '';
        }
        return String(value);
      };

      const oldTitle = normalizeValue(projectToUpdate.title, '');
      const oldSelectCompetencies = normalizeValue(projectToUpdate.selectCompetencies, '');
      const oldCountryCity = normalizeValue(projectToUpdate.countryCity, '');
      const oldMonthYear = normalizeValue(projectToUpdate.monthYear, '');
      const oldViewConstruction = normalizeValue(projectToUpdate.viewConstruction, '');
      const oldStyle = normalizeValue(projectToUpdate.style, '');
      const oldTitleTextBlock = normalizeValue(projectToUpdate.titleTextBlock, '');
      const oldDescriptionProject = normalizeValue(projectToUpdate.descriptionProject, '');
      const oldTotalArea = normalizeValue(projectToUpdate.totalArea, '');
      const oldSiteArea = normalizeValue(projectToUpdate.siteArea, '');
      const oldFloors = normalizeValue(projectToUpdate.floors, '');
      const oldAltitude = normalizeValue(projectToUpdate.altitude, '');
      const oldConstructionVolume = normalizeValue(projectToUpdate.constructionVolume, '');
      const oldLocation = normalizeValue(projectToUpdate.location, '');
      const oldDegreeParticipation = normalizeValue(projectToUpdate.degreeParticipation, '');
      const oldStatusObject = normalizeValue(projectToUpdate.statusObject, '');
      const oldCustomer = normalizeValue(projectToUpdate.customer, '');
      const oldPublication = normalizeValue(projectToUpdate.publication, '');
      const oldLinkToPublication = normalizeValue(projectToUpdate.linkToPublication, '');
      const oldPublicationTwo = normalizeValue(projectToUpdate.publicationTwo, '');
      const oldLinkToPublicationTwo = normalizeValue(projectToUpdate.linkToPublicationTwo, '');
      const oldAwards = normalizeValue(projectToUpdate.awards, '');
      const oldHeadingTextBlock = normalizeValue(projectToUpdate.headingTextBlock, '');
      const oldTextBlock = normalizeValue(projectToUpdate.textBlock, '');
      const oldNumberOfLanes = normalizeValue(projectToUpdate.numberOfLanes, '');
      const oldLong = normalizeValue(projectToUpdate.long, '');

      const newTitle = normalizeValue(req.body.title, oldTitle);
      const newSelectCompetencies = normalizeValue(req.body.selectCompetencies, oldSelectCompetencies);
      const newCountryCity = normalizeValue(req.body.countryCity, oldCountryCity);
      const newMonthYear = normalizeValue(req.body.monthYear, oldMonthYear);
      const newViewConstruction = normalizeValue(req.body.viewConstruction, oldViewConstruction);
      const newStyle = normalizeValue(req.body.radioValue, oldStyle);
      const newTitleTextBlock = normalizeValue(req.body.titleTextBlock, oldTitleTextBlock);
      const newDescriptionProject = normalizeValue(req.body.descriptionProject, oldDescriptionProject);
      const newTotalArea = normalizeValue(req.body.totalArea, oldTotalArea);
      const newSiteArea = normalizeValue(req.body.siteArea, oldSiteArea);
      const newFloors = normalizeValue(req.body.floors, oldFloors);
      const newAltitude = normalizeValue(req.body.altitude, oldAltitude);
      const newConstructionVolume = normalizeValue(req.body.constructionVolume, oldConstructionVolume);
      const newLocation = normalizeValue(req.body.location, oldLocation);
      const newDegreeParticipation = normalizeValue(req.body.degreeParticipation, oldDegreeParticipation);
      const newStatusObject = normalizeValue(req.body.statusObject, oldStatusObject);
      const newCustomer = normalizeValue(req.body.customer, oldCustomer);
      const newPublication = normalizeValue(req.body.publication, oldPublication);
      const newLinkToPublication = normalizeValue(req.body.linkToPublication, oldLinkToPublication);
      const newPublicationTwo = normalizeValue(req.body.publicationTwo, oldPublicationTwo);
      const newLinkToPublicationTwo = normalizeValue(req.body.linkToPublicationTwo, oldLinkToPublicationTwo);
      const newAwards = normalizeValue(req.body.awards, oldAwards);
      const newHeadingTextBlock = normalizeValue(req.body.headingTextBlock, oldHeadingTextBlock);
      const newTextBlock = normalizeValue(req.body.textBlock, oldTextBlock);
      const newNumberOfLanes = normalizeValue(req.body.numberOfLanes, oldNumberOfLanes);
      const newLong = normalizeValue(req.body.long, oldLong);

      const currentImageTitles = projectToUpdate.imageTitle ? projectToUpdate.imageTitle.split(', ').map((item) => item.trim()) : [];
      const currentImageProjects = projectToUpdate.imageProject ? [projectToUpdate.imageProject] : [];
      const currentImageOpens = projectToUpdate.imageOpen ? [projectToUpdate.imageOpen] : [];
      const currentImageCloses = projectToUpdate.imageClose ? [projectToUpdate.imageClose] : [];

      const imageTitlesNew = req.files.dropPhoto ? await Promise.all(req.files.dropPhoto.map((file) => uploadFileToS3(file, 'images/imageAdd', userInfo))) : [];
      const imageProjectNew = req.files.photoAva ? await uploadFileToS3(req.files.photoAva[0], 'images/imageAdd', userInfo) : null;
      const imageOpenNew = req.files.imageOpen ? await uploadFileToS3(req.files.imageOpen[0], 'images/imageAdd', userInfo) : null;
      const imageCloseNew = req.files.imageClose ? await uploadFileToS3(req.files.imageClose[0], 'images/imageAdd', userInfo) : null;

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

      await Promise.all(imagesToRemove.map((imageUrl) => deleteImageFromS3(imageUrl, userInfo)));

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
            const fileUrl = await uploadFileToS3(file, 'images/imageAdd', userInfo);
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

      const oldImageTitle = projectToUpdate.imageTitle || '';
      const oldImageProject = projectToUpdate.imageProject || '';
      const oldImageOpen = projectToUpdate.imageOpen || '';
      const oldImageClose = projectToUpdate.imageClose || '';
      const oldDynamicBlocksData = existingConstructor ? JSON.stringify(existingConstructor.data || []) : '[]';
      const newDynamicBlocksData = JSON.stringify(updatedDynamicBlocksContent || []);

      const newImageTitle = updatedImageTitles.join(', ');
      const newImageProject = updatedImageProjects[0] || '';
      const newImageOpen = updatedImageOpens[0] || '';
      const newImageClose = updatedImageCloses[0] || '';

      const hasChanges =
        oldTitle !== newTitle ||
        oldSelectCompetencies !== newSelectCompetencies ||
        oldCountryCity !== newCountryCity ||
        oldMonthYear !== newMonthYear ||
        oldViewConstruction !== newViewConstruction ||
        oldStyle !== newStyle ||
        oldTitleTextBlock !== newTitleTextBlock ||
        oldDescriptionProject !== newDescriptionProject ||
        oldTotalArea !== newTotalArea ||
        oldSiteArea !== newSiteArea ||
        oldFloors !== newFloors ||
        oldAltitude !== newAltitude ||
        oldConstructionVolume !== newConstructionVolume ||
        oldLocation !== newLocation ||
        oldDegreeParticipation !== newDegreeParticipation ||
        oldStatusObject !== newStatusObject ||
        oldCustomer !== newCustomer ||
        oldPublication !== newPublication ||
        oldLinkToPublication !== newLinkToPublication ||
        oldPublicationTwo !== newPublicationTwo ||
        oldLinkToPublicationTwo !== newLinkToPublicationTwo ||
        oldAwards !== newAwards ||
        oldHeadingTextBlock !== newHeadingTextBlock ||
        oldTextBlock !== newTextBlock ||
        oldNumberOfLanes !== newNumberOfLanes ||
        oldLong !== newLong ||
        oldImageTitle !== newImageTitle ||
        oldImageProject !== newImageProject ||
        oldImageOpen !== newImageOpen ||
        oldImageClose !== newImageClose ||
        oldDynamicBlocksData !== newDynamicBlocksData ||
        JSON.stringify(normalizedExistingDynamicImages) !== JSON.stringify(normalizedNewDynamicImages);

      const imagesToRemoveFromDynamicBlocks = normalizedExistingDynamicImages.filter((image) => !normalizedNewDynamicImages.includes(image));

      await Promise.all(imagesToRemoveFromDynamicBlocks.map((imageUrl) => deleteImageFromS3(imageUrl, userInfo)));

      await projectToUpdate.update({
        title: newTitle || projectToUpdate.title,
        selectCompetencies: newSelectCompetencies || projectToUpdate.selectCompetencies,
        countryCity: newCountryCity || projectToUpdate.countryCity,
        monthYear: newMonthYear || projectToUpdate.monthYear,
        viewConstruction: newViewConstruction || projectToUpdate.viewConstruction,
        style: newStyle || projectToUpdate.style,
        titleTextBlock: newTitleTextBlock || projectToUpdate.titleTextBlock,
        descriptionProject: newDescriptionProject || projectToUpdate.descriptionProject,
        totalArea: newTotalArea || projectToUpdate.totalArea,
        siteArea: newSiteArea || projectToUpdate.siteArea,
        floors: newFloors || projectToUpdate.floors,
        altitude: newAltitude || projectToUpdate.altitude,
        constructionVolume: newConstructionVolume || projectToUpdate.constructionVolume,
        location: newLocation || projectToUpdate.location,
        degreeParticipation: newDegreeParticipation || projectToUpdate.degreeParticipation,
        statusObject: newStatusObject || projectToUpdate.statusObject,
        customer: newCustomer || projectToUpdate.customer,
        publication: newPublication || projectToUpdate.publication,
        linkToPublication: newLinkToPublication || projectToUpdate.linkToPublication,
        publicationTwo: newPublicationTwo || projectToUpdate.publicationTwo,
        linkToPublicationTwo: newLinkToPublicationTwo || projectToUpdate.linkToPublicationTwo,
        awards: newAwards || projectToUpdate.awards,
        headingTextBlock: newHeadingTextBlock || projectToUpdate.headingTextBlock,
        textBlock: newTextBlock || projectToUpdate.textBlock,
        numberOfLanes: newNumberOfLanes || projectToUpdate.numberOfLanes,
        long: newLong || projectToUpdate.long,
        imageTitle: newImageTitle,
        imageProject: newImageProject || null,
        imageOpen: newImageOpen || null,
        imageClose: newImageClose || null,
      });

      if (existingConstructor) {
        await existingConstructor.update({
          data: updatedDynamicBlocksContent,
          image: newDynamicImages.join(', '),
        });
      } else if (updatedDynamicBlocksContent && updatedDynamicBlocksContent.length > 0) {
        await Constructor.create({
          data: updatedDynamicBlocksContent,
          image: newDynamicImages.join(', '),
          idBlock: projectId,
        });
      }

      await syncProjectMain(projectId);
      
      if (req.session?.user) {
        logResourceAction({
          action: 'UPDATE',
          userName: req.session.user.name,
          userId: req.session.user.id.toString(),
          resourceType: 'project',
          resourceId: projectId,
          resourceName: req.body.title || projectToUpdate.title,
          hasChanges,
        });
      }

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
 
    const userInfo = req.session?.user ? {
      userName: req.session.user.name,
      userId: req.session.user.id.toString(),
      resourceType: 'project',
      resourceId: id,
    } : null;

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
            await deleteFileFromS3(fileName, folder, userInfo);
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

    if (req.session?.user) {
      logResourceAction({
        action: 'DELETE',
        userName: req.session.user.name,
        userId: req.session.user.id.toString(),
        resourceType: 'project',
        resourceId: id,
        resourceName: post.title || 'Проект',
      });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Ошибка при удалении проекта:', error);
    res.sendStatus(500);
  }
});

module.exports = router;
