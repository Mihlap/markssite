const express = require('express');
const {
  URL
} = require('url');
const { Op } = require('sequelize');
const {
  Articles,
  ConstructorArticles,
  PublicationOne,
  PublicationTwo,
} = require('../../db/models');
const fileMiddleware = require('../../middleware/file');
const {
  uploadFileToS3,
  deleteFileFromS3
} = require('../../s3Utils/s3Service');
const { logResourceActionFromSession, buildS3LogInfo } = require('../../utils/fileLogger');
const { extractBlockFileUrls } = require('../../utils/extractBlockFileUrls');

const router = express.Router();

const extractFileNameAndFolderFromUrl = (url) => {

  if (!url.includes('http')) {
    return {
      fileName: url,
      folder: 'images/imageArticle',
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
      folder: 'images/imageArticle',
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

const collectReferencedImageUrls = async (excludedArticleId) => {
  const referenced = new Set();
  const excludedId = Number(excludedArticleId);

  const articles = await Articles.findAll({
    attributes: ['id', 'imageTitle', 'imageAuthor', 'imageOpen', 'imageClose'],
  });

  articles.forEach((article) => {
    if (article.id === excludedId) return;
    [article.imageTitle, article.imageAuthor, article.imageOpen, article.imageClose].forEach((value) => {
      if (!value) return;
      value.split(',').forEach((item) => {
        const trimmed = item.trim();
        if (trimmed) referenced.add(trimmed);
      });
    });
  });

  const constructors = await ConstructorArticles.findAll({
    attributes: ['idBlock', 'image', 'data'],
  });

  constructors.forEach((constructor) => {
    if (constructor.idBlock === excludedId) return;
    if (constructor.image) {
      constructor.image.split(',').forEach((item) => {
        const trimmed = item.trim();
        if (trimmed) referenced.add(trimmed);
      });
    }
    extractBlockFileUrls(constructor.data).forEach((url) => referenced.add(url));
  });

  return referenced;
};

const updateDynamicBlocksContent = (blocks, newImages) => {
  let imageIndex = 0;
  return blocks.map((blockGroup) =>
    blockGroup.map((block) => {
      if (block.type === 'file' && Array.isArray(block.value)) {
        const updatedValues = block.value.map((val) => {
          if (typeof val === 'string' && val.length > 0 && !val.startsWith('http')) {
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
      const s3LogInfo = buildS3LogInfo(req, 'article');
      let dynamicBlocksContent = null;

      const dynamicImageTitles = req.files.dynamicImages ?
        await Promise.all(
          req.files.dynamicImages.map(async (file) => {
            const fileUrl = await uploadFileToS3(file, 'images/imageArticle', s3LogInfo);
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
            const fileUrl = await uploadFileToS3(file, 'images/imageArticle', s3LogInfo);
            return fileUrl;
          })
        ) : [];

      const imageProjects = req.files.photoAva ?
        await uploadFileToS3(req.files.photoAva[0], 'images/imageArticle', s3LogInfo) :
        null;
      const imageOpens = req.files.imageOpen ?
        await uploadFileToS3(req.files.imageOpen[0], 'images/imageArticle', s3LogInfo) :
        null;
      const imageCloses = req.files.imageClose ?
        await uploadFileToS3(req.files.imageClose[0], 'images/imageArticle', s3LogInfo) :
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

      const updatedDynamicBlocksContent = dynamicBlocksContent
        ? updateDynamicBlocksContent(dynamicBlocksContent, dynamicImageTitles)
        : null;

      await ConstructorArticles.create({
        data: updatedDynamicBlocksContent,
        image: dynamicImageTitles.join(', '),
        idBlock: createdArticle.id,
      });

      logResourceActionFromSession(req, {
        action: 'CREATE',
        resourceType: 'article',
        resourceId: createdArticle.id.toString(),
        resourceName: createdArticle.title || 'Статья',
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

      const s3LogInfo = buildS3LogInfo(req, 'article', articleId);

      const currentImageTitles = articleToUpdate.imageTitle ? articleToUpdate.imageTitle.split(', ').map((item) => item.trim()) : [];
      const currentImageAuthors = articleToUpdate.imageAuthor ? [articleToUpdate.imageAuthor] : [];
      const currentImageOpens = articleToUpdate.imageOpen ? [articleToUpdate.imageOpen] : [];
      const currentImageCloses = articleToUpdate.imageClose ? [articleToUpdate.imageClose] : [];

      const imageTitlesNew = req.files.dropPhoto ? await Promise.all(req.files.dropPhoto.map((file) => uploadFileToS3(file, 'images/imageArticle', s3LogInfo))) : [];
      const imageAuthorNew = req.files.photoAva ? await uploadFileToS3(req.files.photoAva[0], 'images/imageArticle', s3LogInfo) : null;
      const imageOpenNew = req.files.imageOpen ? await uploadFileToS3(req.files.imageOpen[0], 'images/imageArticle', s3LogInfo) : null;
      const imageCloseNew = req.files.imageClose ? await uploadFileToS3(req.files.imageClose[0], 'images/imageArticle', s3LogInfo) : null;

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

      const updatedImageTitles = [...imageTitlesFromClient, ...imageTitlesNew];
      const updatedImageAuthors = imageAuthorNew ? [imageAuthorNew] : imageAuthorFromClient;
      const updatedImageOpens = imageOpenNew ? [imageOpenNew] : imageOpenFromClient;
      const updatedImageCloses = imageCloseNew ? [imageCloseNew] : imageCloseFromClient;

      const extractFileName = (url) => url.split('/').pop().split('?')[0];

      const referencedUrls = await collectReferencedImageUrls(articleId);
      const referencedFileNames = new Set([...referencedUrls].map(extractFileName));

      const normalizedCurrentImages = [...currentImageTitles, ...currentImageAuthors, ...currentImageOpens, ...currentImageCloses]
        .filter(Boolean)
        .map(extractFileName);

      const normalizedUpdatedImages = [...updatedImageTitles, ...updatedImageAuthors, ...updatedImageOpens, ...updatedImageCloses]
        .filter(Boolean)
        .map(extractFileName);

      const imagesToRemove = normalizedCurrentImages
        .filter((image) => !normalizedUpdatedImages.includes(image))
        .filter((fileName) => !referencedFileNames.has(fileName));

      await Promise.all(imagesToRemove.map((url) => deleteImageFromS3(url, s3LogInfo)));

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

      const existingConstructor = await ConstructorArticles.findOne({
        where: {
          idBlock: articleId
        }
      });

      const dynamicBlocksContent = req.body.dynamicBlocksJSON ?
        JSON.parse(req.body.dynamicBlocksJSON) :
        [];

      const dynamicImagesNew = req.files.dynamicImages ?
        await Promise.all(
          req.files.dynamicImages.map(async (file) => {
            const fileUrl = await uploadFileToS3(file, 'images/imageArticle', s3LogInfo);
            return fileUrl;
          })) : [];

      const existingDynamicImages = existingConstructor && existingConstructor.image ?
        existingConstructor.image.split(', ').map((img) => img.trim()) : [];

      const updatedDynamicBlocksContent = updateDynamicBlocksContent(
        dynamicBlocksContent,
        dynamicImagesNew
      );

      const extractImages = (blocks) =>
        blocks
          .flatMap((blockGroup) => blockGroup)
          .filter((block) => block.type === 'file' && Array.isArray(block.value))
          .flatMap((block) => block.value)
          .filter(Boolean);

      const keptDynamicImages = extractImages(dynamicBlocksContent)
        .map((img) => img.trim())
        .filter((img) => img.startsWith('http'));
   
      const finalDynamicImages = [...keptDynamicImages, ...dynamicImagesNew];

      const normalizedExistingDynamicImages = existingDynamicImages.map(extractFileName);
      const normalizedFinalDynamicImages = finalDynamicImages.map(extractFileName);

      const imagesToRemoveFromDynamicBlocks = normalizedExistingDynamicImages
        .filter((image) => !normalizedFinalDynamicImages.includes(image))
        .filter((fileName) => !referencedFileNames.has(fileName));

      await Promise.all(imagesToRemoveFromDynamicBlocks.map((url) => deleteImageFromS3(url, s3LogInfo)));

      if (existingConstructor) {
        await existingConstructor.update({
          data: updatedDynamicBlocksContent,
          image: finalDynamicImages.join(', ')
        });
      } else {
        await ConstructorArticles.create({
          data: updatedDynamicBlocksContent,
          image: finalDynamicImages.join(', '),
          idBlock: articleId
        });
      }

      logResourceActionFromSession(req, {
        action: 'UPDATE',
        resourceType: 'article',
        resourceId: articleId.toString(),
        resourceName: req.body.title || articleToUpdate.title || 'Статья',
        hasChanges: true,
      });

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
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);
    const type = typeof req.query.type === 'string' ? req.query.type.trim() : '';

    const where = {};
    if (type && type !== 'Все') {
      where.selectCompetencies = { [Op.like]: `%${type}%` };
    }

    if (page && limit && page > 0 && limit > 0) {
      const offset = (page - 1) * limit;
      
      const { count, rows } = await Articles.findAndCountAll({
        where,
        order: [['id', 'DESC']],
        limit,
        offset,
      });

      res.json({
        data: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit) || 0,
        },
      });
    } else {
      const data = await Articles.findAll({
        where,
        include: [ConstructorArticles],
        order: [['id', 'DESC']],
      });

      res.json(data);
    }
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
    if (!post) {
      return res.status(404).json({ message: 'Статья не найдена' });
    }
    const deleteConstructorImg = await ConstructorArticles.findOne({
      where: {
        idBlock: id
      }
    });

    const referencedUrls = await collectReferencedImageUrls(id);

    const extractAndDeleteImages = async (imageUrls) => {
      const normalizedUrls = [...new Set(imageUrls.map((url) => url.trim()).filter(Boolean))];
      // eslint-disable-next-line no-restricted-syntax
      for (const imageUrl of normalizedUrls) {
        if (referencedUrls.has(imageUrl)) {
          console.log(`Файл ${imageUrl} ещё используется в других записях — пропуск удаления`);
          // eslint-disable-next-line no-continue
          continue;
        }
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

    if (deleteConstructorImg?.data) {
      await extractAndDeleteImages(extractBlockFileUrls(deleteConstructorImg.data));
    }

    if (post.imageTitle) {
      const imageTitleNames = post.imageTitle.split(', ').map((img) => img.trim());
      await extractAndDeleteImages(imageTitleNames);
    }

    if (post.imageAuthor) {
      await extractAndDeleteImages([post.imageAuthor]);
    }

    if (post.imageOpen) {
      await extractAndDeleteImages([post.imageOpen]);
    }

    if (post.imageClose) {
      await extractAndDeleteImages([post.imageClose]);
    }

    await ConstructorArticles.destroy({
      where: {
        idBlock: id
      }
    });
    await PublicationOne.destroy({ where: { IdArticle: id } });
    await PublicationTwo.destroy({ where: { IdArticle: id } });
    await Articles.destroy({
      where: {
        id
      }
    });

    logResourceActionFromSession(req, {
      action: 'DELETE',
      resourceType: 'article',
      resourceId: id.toString(),
      resourceName: post?.title || 'Статья',
    });

    res.sendStatus(200);
  } catch (error) {
    console.error('Ошибка при удалении проекта:', error);
    res.sendStatus(500);
  }
});

module.exports = router;
