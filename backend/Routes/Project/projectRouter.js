const express = require('express');
const { URL } = require('url');
const { Op } = require('sequelize');
const { Project, ProjectMain, Constructor } = require('../../db/models');
const fileMiddleware = require('../../middleware/file');
const { convertToWebp } = require('../../utils/convertToWebp');
const {
  uploadFileToS3,
  deleteFileFromS3
} = require('../../s3Utils/s3Service');
const { logResourceActionFromSession, buildS3LogInfo } = require('../../utils/fileLogger');

const router = express.Router();

const syncProjectMain = async (projectId) => {
  const project = await Project.findByPk(projectId);
  if (project) {
    const projectMainEntry = await ProjectMain.findOne({
      where: {
        IdProject: project.id,
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
        IdProject: projectId,
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
    const { pathname } = urlObj;
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
    let { fileName, folder } = result;
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
          if (typeof val === 'string' && !val.startsWith('http')) {
            const newImage = newImages[imageIndex];
            imageIndex += 1;
            return newImage;
          }
          return val;
        });
        return {
          ...block,
          value: updatedValues,
        };
      }
      return block;
    }),
  );
};

router.get('/all', async (req, res) => {
  try {
    const { page = 1, limit = 12, view, city } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (view && view !== 'Все') where.viewConstruction = { [Op.like]: `%${view}%` };
    if (city) where.countryCity = { [Op.like]: `%${city}%` };

    const { count, rows } = await Project.findAndCountAll({
      where,
      include: [Constructor],
      order: [['id', 'DESC']],
      limit: Number(limit),
      offset: Number(offset),
    });

    res.json({
      data: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.',
    });
  }
});

router.post(
  '/',
  fileMiddleware.fields([
    {
      name: 'dropPhoto',
      maxCount: 4,
    },
    {
      name: 'photoAva',
      maxCount: 1,
    },
    {
      name: 'imageOpen',
      maxCount: 1,
    },
    {
      name: 'imageClose',
      maxCount: 1,
    },
    {
      name: 'dynamicImages',
      maxCount: 100,
    },
  ]),
  async (req, res) => {
    try {
      const s3LogInfo = buildS3LogInfo(req, 'project');
      let dynamicBlocksContent = null;

      const dynamicImageTitles = req.files.dynamicImages
        ? await Promise.all(
            req.files.dynamicImages.map(async (file) => {
              const fileToUpload = file.mimetype.startsWith('image/')
                ? await convertToWebp(file)
                : file;
              return uploadFileToS3(fileToUpload, 'images/imageAdd', s3LogInfo);
            }),
          )
        : [];

      if (req.body.dynamicBlocksJSON) {
        try {
          dynamicBlocksContent = JSON.parse(req.body.dynamicBlocksJSON);
        } catch (error) {
          console.error('Ошибка при разборе dynamicBlocksJSON:', error);
          return res.status(400).json({
            message: 'Неверный формат данных для dynamicBlocksJSON',
          });
        }
      }

      const imageTitles = req.files.dropPhoto
        ? await Promise.all(
            req.files.dropPhoto.map(async (file) => {
              const converted = await convertToWebp(file);
              return uploadFileToS3(converted, 'images/imageAdd', s3LogInfo);
            }),
          )
        : [];

      const imageProjects = req.files.photoAva
        ? await uploadFileToS3(await convertToWebp(req.files.photoAva[0]), 'images/imageAdd', s3LogInfo)
        : null;
      const imageOpens = req.files.imageOpen
        ? await uploadFileToS3(await convertToWebp(req.files.imageOpen[0]), 'images/imageAdd', s3LogInfo)
        : null;
      const imageCloses = req.files.imageClose
        ? await uploadFileToS3(await convertToWebp(req.files.imageClose[0]), 'images/imageAdd', s3LogInfo)
        : null;

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

      const updatedDynamicBlocksContent = dynamicBlocksContent
        ? updateDynamicBlocksContent(dynamicBlocksContent, dynamicImageTitles)
        : dynamicBlocksContent;

      await Constructor.create({
        data: updatedDynamicBlocksContent,
        image: dynamicImageTitles.join(', '),
        idBlock: createdProject.id,
      });

      logResourceActionFromSession(req, {
        action: 'CREATE',
        resourceType: 'project',
        resourceId: createdProject.id.toString(),
        resourceName: createdProject.title || 'Проект',
      });

      res.status(200).json({
        message: 'Данные успешно сохранены',
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'Произошла ошибка при сохранении данных',
      });
    }
  },
);

router.put(
  '/:projectId',
  fileMiddleware.fields([
    {
      name: 'dropPhoto',
      maxCount: 4,
    },
    {
      name: 'photoAva',
      maxCount: 1,
    },
    {
      name: 'imageOpen',
      maxCount: 1,
    },
    {
      name: 'imageClose',
      maxCount: 1,
    },
    {
      name: 'dynamicImages',
      maxCount: 100,
    },
  ]),
  async (req, res) => {
    try {
      const { projectId } = req.params;
      const projectToUpdate = await Project.findByPk(projectId, {
        include: [Constructor],
      });

      const s3LogInfo = buildS3LogInfo(req, 'project', projectId);

      if (!projectToUpdate) {
        return res.status(404).json({
          message: 'Проект не найден',
        });
      }

      const currentImageTitles = projectToUpdate.imageTitle
        ? projectToUpdate.imageTitle.split(', ').map((item) => item.trim())
        : [];
      const currentImageProjects = projectToUpdate.imageProject
        ? [projectToUpdate.imageProject]
        : [];
      const currentImageOpens = projectToUpdate.imageOpen ? [projectToUpdate.imageOpen] : [];
      const currentImageCloses = projectToUpdate.imageClose ? [projectToUpdate.imageClose] : [];

      const imageTitlesNew = req.files.dropPhoto
        ? await Promise.all(
            req.files.dropPhoto.map(async (file) =>
              uploadFileToS3(await convertToWebp(file), 'images/imageAdd', s3LogInfo),
            ),
          )
        : [];
      const imageProjectNew = req.files.photoAva
        ? await uploadFileToS3(await convertToWebp(req.files.photoAva[0]), 'images/imageAdd', s3LogInfo)
        : null;
      const imageOpenNew = req.files.imageOpen
        ? await uploadFileToS3(await convertToWebp(req.files.imageOpen[0]), 'images/imageAdd', s3LogInfo)
        : null;
      const imageCloseNew = req.files.imageClose
        ? await uploadFileToS3(await convertToWebp(req.files.imageClose[0]), 'images/imageAdd', s3LogInfo)
        : null;

      const imageTitlesFromClient = req.body.imageTitle
        ? req.body.imageTitle.split(',').map((item) => item.trim())
        : [];
      const imageProjectFromClient = req.body.imageProject ? [req.body.imageProject] : [];
      const imageOpenFromClient = req.body.imageOpen ? [req.body.imageOpen] : [];
      const imageCloseFromClient = req.body.imageClose ? [req.body.imageClose] : [];

      const updatedImageTitles = [...imageTitlesFromClient, ...imageTitlesNew];
      const updatedImageProjects = imageProjectNew ? [imageProjectNew] : imageProjectFromClient;
      const updatedImageOpens = imageOpenNew ? [imageOpenNew] : imageOpenFromClient;
      const updatedImageCloses = imageCloseNew ? [imageCloseNew] : imageCloseFromClient;

      const extractFileName = (url) => url.split('/').pop().split('?')[0];

      const normalizedCurrentImages = [
        ...currentImageTitles,
        ...currentImageProjects,
        ...currentImageOpens,
        ...currentImageCloses,
      ]
        .filter(Boolean)
        .map(extractFileName);

      const normalizedUpdatedImages = [
        ...updatedImageTitles,
        ...updatedImageProjects,
        ...updatedImageOpens,
        ...updatedImageCloses,
      ]
        .filter(Boolean)
        .map(extractFileName);

      const imagesToRemove = normalizedCurrentImages.filter(
        (image) => !normalizedUpdatedImages.includes(image),
      );

      await Promise.all(imagesToRemove.map((url) => deleteImageFromS3(url, s3LogInfo)));

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

      const dynamicBlocksContent = req.body.dynamicBlocksJSON
        ? JSON.parse(req.body.dynamicBlocksJSON)
        : [];

      const dynamicImagesNew = req.files.dynamicImages
        ? await Promise.all(
            req.files.dynamicImages.map(async (file) => {
              const fileToUpload = file.mimetype.startsWith('image/')
                ? await convertToWebp(file)
                : file;
              return uploadFileToS3(fileToUpload, 'images/imageAdd', s3LogInfo);
            }),
          )
        : [];

      const existingDynamicImages =
        existingConstructor && existingConstructor.image
          ? existingConstructor.image.split(', ').map((img) => img.trim())
          : [];

      const allDynamicImages = [...existingDynamicImages, ...dynamicImagesNew];

      const updatedDynamicBlocksContent = updateDynamicBlocksContent(
        dynamicBlocksContent,
        allDynamicImages,
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

      const imagesToRemoveFromDynamicBlocks = normalizedExistingDynamicImages.filter(
        (image) => !normalizedNewDynamicImages.includes(image),
      );

      await Promise.all(imagesToRemoveFromDynamicBlocks.map((url) => deleteImageFromS3(url, s3LogInfo)));

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

      logResourceActionFromSession(req, {
        action: 'UPDATE',
        resourceType: 'project',
        resourceId: projectId.toString(),
        resourceName: req.body.title || projectToUpdate.title || 'Проект',
        hasChanges: true,
      });

      res.status(200).json({
        message: 'Данные успешно обновлены',
      });
    } catch (error) {
      console.error('Ошибка при обновлении проекта:', error);
      res.status(500).json({
        message: 'Произошла ошибка при обновлении данных',
      });
    }
  },
);

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Project.findByPk(id);
    const deleteConstructorImg = await Constructor.findOne({
      where: {
        idBlock: id,
      },
    });

    const normalizeFileName = (url) => url.split('/').pop().split('?')[0];

    const extractAndDeleteImages = async (imageUrls) => {
      const normalizedUrls = [...new Set(imageUrls.map(normalizeFileName))];
      // eslint-disable-next-line no-restricted-syntax
      for (const imageUrl of normalizedUrls) {
        const result = extractFileNameAndFolderFromUrl(imageUrl);
        if (result) {
          const { fileName, folder } = result;
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
        idBlock: id,
      },
    });
    await ProjectMain.destroy({
      where: {
        IdProject: id,
      },
    });
    await Project.destroy({
      where: {
        id,
      },
    });

    logResourceActionFromSession(req, {
      action: 'DELETE',
      resourceType: 'project',
      resourceId: id.toString(),
      resourceName: post?.title || 'Проект',
    });

    logResourceActionFromSession(req, {
      action: 'DELETE',
      resourceType: 'project',
      resourceId: id.toString(),
      resourceName: post?.title || 'Проект',
    });

    res.sendStatus(200);
  } catch (error) {
    console.error('Ошибка при удалении проекта:', error);
    res.sendStatus(500);
  }
});

router.get('/featured', async (req, res) => {
  try {
    const data = await ProjectMain.findAll({ order: [['order', 'ASC']] });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.post('/featured', async (req, res) => {
  try {
    const project = req.body.project;
    const saved = await ProjectMain.create({ project, IdProject: project.id });

    logResourceActionFromSession(req, {
      action: 'CREATE',
      resourceType: 'project_main',
      resourceId: saved.id.toString(),
      resourceName: project?.title || 'Проект (главная)',
    });

    res.status(200).json({ message: 'OK', projectId: saved.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при сохранении данных' });
  }
});

router.put('/featured/order', async (req, res) => {
  try {
    const list = (Array.isArray(req.body) ? req.body : []).filter(
      (item) => item?.IdProject != null,
    );
    for (let i = 0; i < list.length; i++) {
      await ProjectMain.update({ order: i }, { where: { IdProject: list[i].IdProject } });
    }
    const updated = await ProjectMain.findAll({ order: [['order', 'ASC']] });
    logResourceActionFromSession(req, {
      action: 'UPDATE',
      resourceType: 'project_main',
      resourceName: 'Порядок проектов на главной',
      hasChanges: true,
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.delete('/featured/:id', async (req, res) => {
  try {
    await ProjectMain.destroy({ where: { IdProject: req.params.id } });

    logResourceActionFromSession(req, {
      action: 'DELETE',
      resourceType: 'project_main',
      resourceId: req.params.id.toString(),
      resourceName: 'Проект (главная)',
    });

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [Constructor],
    });
    if (!project) return res.status(404).json({ error: 'Проект не найден' });
    res.json(project);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.' });
  }
});

module.exports = router;
