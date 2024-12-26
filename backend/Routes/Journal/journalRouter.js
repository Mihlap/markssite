/* eslint-disable camelcase */
const express = require('express');
const { URL } = require('url');
const { Journal } = require('../../db/models');
const fileMiddleware = require('../../middleware/file');
const { uploadFileToS3, deleteFileFromS3 } = require('../../s3Utils/s3Service');

const router = express.Router();

const extractFileNameAndFolderFromUrl = (url) => {
  if (!url.includes('http')) {
    return {
      fileName: url,
      folder: 'images/imageJournal',
    };
  }

  try {
    const urlObj = new URL(url);
    const { pathname } = urlObj;
    const parts = pathname.split('/').filter(Boolean);

    if (parts.length >= 2) {
      const folder = parts.slice(0, -1).join('/');
      const fileName = parts[parts.length - 1];
      return { fileName, folder };
    }

    return { fileName: parts[0], folder: 'images/imageJournal' };
  } catch (error) {
    console.error(`Ошибка извлечения данных из URL: ${url}`, error);
    return null;
  }
};

const deleteImageFromS3 = async (fileUrl) => {
  const result = extractFileNameAndFolderFromUrl(fileUrl);
  if (result) {
    const { fileName, folder } = result;
    try {
      await deleteFileFromS3(decodeURIComponent(fileName), decodeURIComponent(folder));
      console.log(`Файл ${fileName} успешно удалён из S3`);
    } catch (error) {
      console.error(`Ошибка при удалении файла ${fileName}:`, error);
    }
  } else {
    console.log(`Не удалось извлечь имя файла и папку из URL: ${fileUrl}`);
  }
};

// Создание новой записи
router.post(
  '/postzapros',
  fileMiddleware.fields([{ name: 'authorImages', maxCount: 100 }]),
  async (req, res) => {
    try {
      const {
        title,
        publication_date,
        category,
        issue_number,
        authors,
        organizations,
        locations,
        markdown_content,
        editorId,
        imageKey,
      } = req.body;

      if (!title || title.trim() === '') {
        return res.status(400).json({ message: 'Поле "title" обязательно для заполнения.' });
      }

      const parsedAuthors = Object.values(JSON.parse(authors || '{}'));
      const parsedOrganizations = JSON.parse(organizations || '[]');
      const parsedLocations = JSON.parse(locations || '[]');
      const parsedCategory = JSON.parse(category || '[]');
      const parsedImageKey = imageKey; 

      const journal = await Journal.create({
        title,
        publication_date: publication_date || null,
        category: parsedCategory,
        issue_number: issue_number ? parseInt(issue_number, 10) : null,
        authors: parsedAuthors,
        organizations: parsedOrganizations,
        locations: parsedLocations,
        markdown_content: markdown_content || null,
        editorId: editorId ? parseInt(editorId, 10) : null,
        imageKey: parsedImageKey,
      });

      if (req.files && req.files.authorImages) {
        const uploadedFiles = await Promise.all(
          req.files.authorImages.map(async (file) => uploadFileToS3(file, 'images/imageJournal')),
        );
        journal.attachments = uploadedFiles;
        await journal.save();
      }

      res.status(201).json({ message: 'Запись успешно создана', journal });
    } catch (error) {
      console.error('Ошибка при создании записи:', error);
      res.status(500).json({ message: 'Ошибка при создании записи', error: error.message });
    }
  },
);

// Обновление записи
router.put(
  '/editzapros/:journalId',
  fileMiddleware.fields([{ name: 'authorImages', maxCount: 100 }]),
  async (req, res) => {
    try {
      console.log('req.body:', req.body);
      console.log('req.files:', req.files);

      const { journalId } = req.params;
      const {
        title,
        publication_date,
        category,
        issue_number,
        authors,
        organizations,
        locations,
        markdown_content,
        imageKey,
      } = req.body;

      const journal = await Journal.findByPk(journalId);
      if (!journal) {
        return res.status(404).json({ message: 'Запись не найдена' });
      }

      let parsedAuthors = authors ? JSON.parse(authors) : [];
      const parsedOrganizations = organizations ? JSON.parse(organizations) : [];
      const parsedLocations = locations ? JSON.parse(locations) : [];
      const parsedCategory = category ? JSON.parse(category) : [];

      parsedAuthors = parsedAuthors.map((author) => {
        if (author.image && author.image.startsWith('blob:')) {
          return { ...author, image: undefined };
        }
        return author;
      });

      const currentAttachments = journal.attachments || [];
      const keepUrls = Array.isArray(parsedAuthors)
        ? parsedAuthors.map((author) => author.image).filter((url) => typeof url === 'string')
        : [];

      console.log('currentAttachments:', currentAttachments);
      console.log('keepUrls:', keepUrls);

      const attachmentsToKeep =
        Array.isArray(currentAttachments) && Array.isArray(keepUrls)
          ? currentAttachments.filter((oldUrl) => keepUrls.includes(oldUrl))
          : [];

      let newUploadedFiles = [];
      if (req.files && req.files.authorImages) {
        newUploadedFiles = await Promise.all(
          req.files.authorImages.map(async (file) => {
            const uploadedUrl = await uploadFileToS3(file, 'images/imageJournal');
            console.log('Загруженный URL:', uploadedUrl);
            return uploadedUrl;
          }),
        );
      }

         let i = 0;
         parsedAuthors = parsedAuthors?.map((author) => {     
           if (!author.image && newUploadedFiles[i]) {
             author.image = newUploadedFiles[i];
             i++;
           }
           return author;
         });


      const updatedAttachments = [...attachmentsToKeep, ...newUploadedFiles];

     const attachmentsToDelete = currentAttachments.filter(
       (oldUrl) => !attachmentsToKeep.includes(oldUrl),
     );
     await Promise.all(attachmentsToDelete.map((url) => deleteImageFromS3(url)));

      await journal.update({
        title,
        publication_date,
        category: parsedCategory,
        issue_number: issue_number ? parseInt(issue_number, 10) : null,
        authors: parsedAuthors,
        organizations: parsedOrganizations,
        locations: parsedLocations,
        markdown_content,
        attachments: updatedAttachments,
        imageKey,
      });

      console.log('Запись успешно обновлена:', journal.dataValues);
      return res.status(200).json({ message: 'Запись успешно обновлена', journal });
    } catch (error) {
      console.error('Ошибка при обновлении записи:', error);
      return res.status(500).json({ message: 'Ошибка обновления', error: error.message });
    }
  },
);



// Получение всех записей
router.get('/getzapros', async (req, res) => {
  try {
    const data = await Journal.findAll({ order: [['id', 'DESC']] });
    res.json(data);
  } catch (error) {
    console.error('Ошибка при получении записей:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});


// Получение одной записи
router.get('/getzapros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const journal = await Journal.findByPk(id);

    if (!journal) {
      return res.status(404).json({ message: 'Запись не найдена' });
    }

    // if (journal.authors) {
    //   journal.authors = journal.authors.map((author, index) => ({
    //     ...author,
    //     image:
    //       typeof author.image === 'string' && author.image.startsWith('http')
    //         ? author.image
    //         : journal.attachments?.[index] || null,
    //   }));
    // }
    res.json(journal);
  } catch (error) {
    console.error('Ошибка при получении записи:', error.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удаление записи
router.delete('/deletezapros/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Journal.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: 'Запись не найдена' });
    }

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
          } catch (error) {
            console.error(`Ошибка при удалении файла ${fileName}:`, error);
          }
        } else {
          console.log(`Не удалось извлечь имя файла и папку из URL: ${imageUrl}`);
        }
      }
    };

    if (post.attachments) {
      const attachmentUrls = post.attachments;
      await extractAndDeleteImages(attachmentUrls);
    }

    await Journal.destroy({
      where: {
        id,
      },
    });

    res.sendStatus(200);
  } catch (error) {
    console.error('Ошибка при удалении проекта:', error);
    res.sendStatus(500);
  }
});

module.exports = router;
