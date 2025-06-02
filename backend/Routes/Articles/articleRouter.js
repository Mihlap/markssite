// /* eslint-disable no-restricted-syntax, no-await-in-loop */
// const { URL } = require('url');
// const { Articles, ConstructorArticles } = require('../../db/models');
// const { uploadFileToS3, deleteFileFromS3 } = require('../../s3Utils/s3Service');

// function extractFileNameAndFolderFromUrl(fileUrl) {
//   if (!fileUrl.includes('http')) return { fileName: fileUrl, folder: 'images/imageArticle' };
//   try {
//     const urlObj = new URL(fileUrl);
//     const parts = urlObj.pathname.split('/').filter(Boolean);
//     if (parts.length >= 2) {
//       const folder = parts.slice(0, -1).join('/');
//       const fileName = parts.pop();
//       return { fileName, folder };
//     }
//     return { fileName: parts[0], folder: 'images/imageArticle' };
//   } catch (err) {
//     console.error(`Ошибка извлечения данных из URL: ${fileUrl}`, err);
//     return null;
//   }
// }

// async function removeFileFromS3(fileUrl) {
//   const info = extractFileNameAndFolderFromUrl(fileUrl);
//   if (!info) return;
//   let { fileName, folder } = info;
//   fileName = decodeURIComponent(fileName);
//   folder = decodeURIComponent(folder);
//   try {
//     await deleteFileFromS3(fileName, folder);
//   } catch (err) {
//     console.error(`Ошибка при удалении файла ${fileName}:`, err);
//   }
// }

// function updateDynamicBlocksContent(blocks, newImages) {
//   let idx = 0;
//   return blocks.map((group) =>
//     group.map((block) => {
//       if (block.type === 'file' && Array.isArray(block.value)) {
//         const values = block.value.map((val) => {
//           if (typeof val === 'string' && (val.startsWith('blob:') || val.startsWith('temp_'))) {
//             const img = newImages[idx];
//             idx += 1;
//             return img;
//           }
//           return val;
//         });
//         return { ...block, value: values };
//       }
//       return block;
//     }),
//   );
// }

// async function articleRouter(fastify, options) { 
//   fastify.post('/postzapros', async (request, reply) => {
//     try {
//       const body = {};
//       const filesMap = {};
//       for await (const part of request.parts()) {
//         if (part.file) {
//           filesMap[part.fieldname] = filesMap[part.fieldname] || [];
//           filesMap[part.fieldname].push(part);
//         } else {
//           body[part.fieldname] = part.value;
//         }
//       }
    
//       const dynParts = filesMap.dynamicImages || [];
//       const dynUrls = await Promise.all(
//         dynParts.map(async (p) => {
//           const buf = await p.toBuffer();
//           return uploadFileToS3(
//             { buffer: buf, originalname: p.filename, mimetype: p.mimetype },
//             'images/imageArticle',
//           );
//         }),
//       );
//       let dynamicBlocks = [];
//       if (body.dynamicBlocksJSON) {
//         try {
//           dynamicBlocks = JSON.parse(body.dynamicBlocksJSON);
//         } catch (_) {
//           return reply.code(400).send({ message: 'Неверный формат dynamicBlocksJSON' });
//         }
//       }
     
//       const dropParts = filesMap.dropPhoto || [];
//       const dropUrls = await Promise.all(
//         dropParts.map(async (p) => {
//           const buf = await p.toBuffer();
//           return uploadFileToS3(
//             { buffer: buf, originalname: p.filename, mimetype: p.mimetype },
//             'images/imageArticle',
//           );
//         }),
//       );
//       const ava = filesMap.photoAva?.[0];
//       const open = filesMap.imageOpen?.[0];
//       const close = filesMap.imageClose?.[0];
//       const imageAvaUrl = ava
//         ? await uploadFileToS3(
//             { buffer: await ava.toBuffer(), originalname: ava.filename, mimetype: ava.mimetype },
//             'images/imageArticle',
//           )
//         : null;
//       const imageOpenUrl = open
//         ? await uploadFileToS3(
//             { buffer: await open.toBuffer(), originalname: open.filename, mimetype: open.mimetype },
//             'images/imageArticle',
//           )
//         : null;
//       const imageCloseUrl = close
//         ? await uploadFileToS3(
//             {
//               buffer: await close.toBuffer(),
//               originalname: close.filename,
//               mimetype: close.mimetype,
//             },
//             'images/imageArticle',
//           )
//         : null;
   
//       const article = await Articles.create({
//         title: body.title,
//         author: body.author,
//         city: body.city,
//         dataMonthYear: body.dataMonthYear,
//         selectCompetencies: body.selectCompetencies,
//         titleTextBlock: body.titleTextBlock,
//         descriptionArticle: body.descriptionArticle,
//         textBlock: body.textBlock,
//         imageTitle: dropUrls.join(', '),
//         imageAuthor: imageAvaUrl,
//         imageOpen: imageOpenUrl,
//         imageClose: imageCloseUrl,
//       });

//       await ConstructorArticles.create({
//         data: dynamicBlocks,
//         image: dynUrls.join(', '),
//         idBlock: article.id,
//       });

//       return reply.code(200).send({ message: 'Данные успешно сохранены' });
//     } catch (err) {
//       fastify.log.error('Ошибка POST /postzapros:', err);
//       return reply.code(500).send({ message: 'Ошибка при сохранении данных' });
//     }
//   });

//   fastify.put('/editzapros/:articleId', async (request, reply) => {
//     try {
//       const { articleId } = request.params;
//       const body = {};
//       const filesMap = {};
//       for await (const part of request.parts()) {
//         if (part.file) {
//           filesMap[part.fieldname] = filesMap[part.fieldname] || [];
//           filesMap[part.fieldname].push(part);
//         } else {
//           body[part.fieldname] = part.value;
//         }
//       }

//       const art = await Articles.findByPk(articleId, { include: [ConstructorArticles] });
//       if (!art) {
//         return reply.code(404).send({ message: 'Статья не найдена' });
//       }

//       const {
//         title,
//         author,
//         city,
//         dataMonthYear,
//         selectCompetencies,
//         titleTextBlock,
//         descriptionArticle,
//         textBlock,
//         dynamicBlocksJSON,
//       } = body;

//       const currTitles = art.imageTitle?.split(', ').map((s) => s.trim()) || [];
//       const currAuthors = art.imageAuthor ? [art.imageAuthor] : [];
//       const currOpens = art.imageOpen ? [art.imageOpen] : [];
//       const currCloses = art.imageClose ? [art.imageClose] : [];
    
//       const newTitles = filesMap.dropPhoto
//         ? await Promise.all(
//             filesMap.dropPhoto.map(async (p) =>
//               uploadFileToS3(
//                 { buffer: await p.toBuffer(), originalname: p.filename, mimetype: p.mimetype },
//                 'images/imageArticle',
//               ),
//             ),
//           )
//         : [];
//       const newAuthor = filesMap.photoAva?.[0]
//         ? await uploadFileToS3(
//             {
//               buffer: await filesMap.photoAva[0].toBuffer(),
//               originalname: filesMap.photoAva[0].filename,
//               mimetype: filesMap.photoAva[0].mimetype,
//             },
//             'images/imageArticle',
//           )
//         : null;
//       const newOpen = filesMap.imageOpen?.[0]
//         ? await uploadFileToS3(
//             {
//               buffer: await filesMap.imageOpen[0].toBuffer(),
//               originalname: filesMap.imageOpen[0].filename,
//               mimetype: filesMap.imageOpen[0].mimetype,
//             },
//             'images/imageArticle',
//           )
//         : null;
//       const newClose = filesMap.imageClose?.[0]
//         ? await uploadFileToS3(
//             {
//               buffer: await filesMap.imageClose[0].toBuffer(),
//               originalname: filesMap.imageClose[0].filename,
//               mimetype: filesMap.imageClose[0].mimetype,
//             },
//             'images/imageArticle',
//           )
//         : null;
    
//       let clientTitles = [];
//       if (typeof body.imageTitle === 'string') {
//         clientTitles = body.imageTitle.split(',').map((s) => s.trim());
//       } else if (Array.isArray(body.imageTitle)) {
//         clientTitles = body.imageTitle.map((s) => s.trim());
//       }
//       const clientAuthors = body.imageAuthor ? [body.imageAuthor] : [];
//       const clientOpens = body.imageOpen ? [body.imageOpen] : [];
//       const clientCloses = body.imageClose ? [body.imageClose] : [];

//       const updTitles = [...clientTitles, ...newTitles];
//       const updAuthors = newAuthor ? [newAuthor] : clientAuthors;
//       const updOpens = newOpen ? [newOpen] : clientOpens;
//       const updCloses = newClose ? [newClose] : clientCloses;
      
//       const normCurr = [...currTitles, ...currAuthors, ...currOpens, ...currCloses]
//         .map((u) => extractFileNameAndFolderFromUrl(u)?.fileName)
//         .filter(Boolean);
//       const normUpd = [...updTitles, ...updAuthors, ...updOpens, ...updCloses]
//         .map((u) => extractFileNameAndFolderFromUrl(u)?.fileName)
//         .filter(Boolean);
//       for (const fn of normCurr.filter((f) => !normUpd.includes(f))) {
//         await removeFileFromS3(fn);
//       }
   
//       await art.update({
//         title,
//         author,
//         city,
//         dataMonthYear,
//         selectCompetencies,
//         titleTextBlock,
//         descriptionArticle,
//         textBlock,
//         imageTitle: updTitles.join(', '),
//         imageAuthor: updAuthors[0] || null,
//         imageOpen: updOpens[0] || null,
//         imageClose: updCloses[0] || null,
//       });
    
//       const existingCons = await ConstructorArticles.findOne({ where: { idBlock: articleId } });
//       let dynBlocks = [];
//       try {
//         dynBlocks = dynamicBlocksJSON ? JSON.parse(dynamicBlocksJSON) : [];
//       } catch (_) {
//         return reply.code(400).send({ message: 'Неверный формат dynamicBlocksJSON' });
//       }
//       const newDynParts = filesMap.dynamicImages || [];
//       const newDynUrls = await Promise.all(
//         newDynParts.map(async (p) =>
//           uploadFileToS3(
//             { buffer: await p.toBuffer(), originalname: p.filename, mimetype: p.mimetype },
//             'images/imageArticle',
//           ),
//         ),
//       );
//       const existImgs = existingCons?.image?.split(', ').map((s) => s.trim()) || [];
//       const normExistDyn = existImgs
//         .map((u) => extractFileNameAndFolderFromUrl(u)?.fileName)
//         .filter(Boolean);
//       const normNewDyn = newDynUrls
//         .map((u) => extractFileNameAndFolderFromUrl(u)?.fileName)
//         .filter(Boolean);
//       for (const fn of normExistDyn.filter((f) => !normNewDyn.includes(f))) {
//         await removeFileFromS3(fn);
//       }
//       const updatedContent = updateDynamicBlocksContent(dynBlocks, [...existImgs, ...newDynUrls]);
//       if (existingCons) {
//         await existingCons.update({ data: updatedContent, image: newDynUrls.join(', ') });
//       } else {
//         await ConstructorArticles.create({
//           data: updatedContent,
//           image: newDynUrls.join(', '),
//           idBlock: articleId,
//         });
//       }

//       return reply.code(200).send({ message: 'Статья успешно обновлена' });
//     } catch (err) {
//       fastify.log.error('Ошибка PUT /editzapрос:', err);
//       return reply.code(500).send({ message: 'Ошибка при обновлении статьи', error: err.message });
//     }
//   });

//   fastify.get('/getzapros', async (request, reply) => {
//     try {
//       const data = await Articles.findAll({
//         include: [ConstructorArticles],
//         order: [['id', 'DESC']],
//       });
//       return reply.send(data);
//     } catch (err) {
//       fastify.log.error('Ошибка GET /getzapros:', err);
//       return reply.code(500).send();
//     }
//   });

//   fastify.get('/getdynamicdata/:articleId', async (request, reply) => {
//     try {
//       const { articleId } = request.params;
//       const cons = await ConstructorArticles.findOne({ where: { idBlock: articleId } });
//       if (!cons) return reply.code(404).send({ message: 'Динамические данные не найдены' });
//       return reply.send({ dynamicData: cons.data, dynamicImages: cons.image.split(', ') });
//     } catch (err) {
//       fastify.log.error('Ошибка GET /getdynamicdata:', err);
//       return reply.code(500).send({ message: 'Ошибка при получении динамических данных' });
//     }
//   });

//   fastify.delete('/deletezapros/:id', async (request, reply) => {
//     try {
//       const { id } = request.params;
//       const art = await Articles.findByPk(id);
//       const cons = await ConstructorArticles.findOne({ where: { idBlock: id } });
//       const urlsToDelete = [];
//       if (cons?.image) urlsToDelete.push(...cons.image.split(', '));
//       if (art?.imageTitle) urlsToDelete.push(...art.imageTitle.split(', '));
//       if (art?.imageAuthor) urlsToDelete.push(art.imageAuthor);
//       if (art?.imageOpen) urlsToDelete.push(art.imageOpen);
//       if (art?.imageClose) urlsToDelete.push(art.imageClose);
//       const uniqueFiles = [
//         ...new Set(
//           urlsToDelete.map((u) => extractFileNameAndFolderFromUrl(u)?.fileName).filter(Boolean),
//         ),
//       ];
//       for (const fn of uniqueFiles) {
//         await removeFileFromS3(fn);
//       }
//       await ConstructorArticles.destroy({ where: { idBlock: id } });
//       await Articles.destroy({ where: { id } });
//       return reply.code(200).send();
//     } catch (err) {
//       fastify.log.error('Ошибка DELETE /deletezapros:', err);
//       return reply.code(500).send();
//     }
//   });
// };

// module.exports = articleRouter;

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

      // Нормализация URL для корректного сравнения (на основе имени файла)
      const extractFileName = (url) => url.split('/').pop().split('?')[0];

      const normalizedCurrentImages = [...currentImageTitles, ...currentImageAuthors, ...currentImageOpens, ...currentImageCloses]
        .filter(Boolean)
        .map(extractFileName);

      const normalizedUpdatedImages = [...updatedImageTitles, ...updatedImageAuthors, ...updatedImageOpens, ...updatedImageCloses]
        .filter(Boolean)
        .map(extractFileName);

      // Поиск изображений для удаления (те, которые больше не используются)
      const imagesToRemove = normalizedCurrentImages.filter((image) => !normalizedUpdatedImages.includes(image));

      // Удаление старых изображений из S3
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
        JSON.parse(req.body.dynamicBlocksJSON) :
        [];

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

      // Нормализованные массивы динамических изображений
      const normalizedExistingDynamicImages = existingDynamicImages.map(extractFileName);
      const normalizedNewDynamicImages = newDynamicImages.map(extractFileName);

      // Удаление старых динамических изображений
      const imagesToRemoveFromDynamicBlocks = normalizedExistingDynamicImages.filter((image) => !normalizedNewDynamicImages.includes(image));

      // Удаление старых динамических изображений из S3
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
    if (post.imageAuthor) {
      await extractAndDeleteImages([post.imageAuthor]);
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
    await ConstructorArticles.destroy({
      where: {
        idBlock: id
      }
    });
    await Articles.destroy({
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
