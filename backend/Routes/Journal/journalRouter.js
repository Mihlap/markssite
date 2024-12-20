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
      return {
        fileName,
        folder,
      };
    }
    return {
      fileName: parts[0],
      folder: 'images/imageJournal',
    };
  } catch (error) {
    console.error(`Ошибка извлечения данных из URL: ${url}`, error);
    return null;
  }
};

const deleteImageFromS3 = async (fileUrl) => {
  const result = extractFileNameAndFolderFromUrl(fileUrl);
  if (result) {
    let { fileName, folder } = result;
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
      } = req.body;

      if (!title || title.trim() === '') {
        return res.status(400).json({ message: 'Поле "title" обязательно для заполнения.' });
      }

      const parsedAuthors = JSON.parse(authors || '[]');
      const parsedOrganizations = JSON.parse(organizations || '[]');
      const parsedLocations = JSON.parse(locations || '[]');
      const parsedCategory = JSON.parse(category || '[]');

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
      });

      if (req.files && req.files.authorImages) {
        const fileUploadPromises = req.files.authorImages.map(async (file) => {
          const fileUrl = await uploadFileToS3(file, 'images/imageJournal');
          return fileUrl;
        });

        const uploadedFiles = await Promise.all(fileUploadPromises);

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
      } = req.body;

      const journal = await Journal.findByPk(journalId);

      if (!journal) {
        return res.status(404).json({ message: 'Запись не найдена' });
      }

      const parsedAuthors = JSON.parse(authors || '[]');
      const parsedOrganizations = JSON.parse(organizations || '[]');
      const parsedLocations = JSON.parse(locations || '[]');
      const parsedCategory = JSON.parse(category || '[]');

      const currentAttachments = journal.attachments || [];
        const currentImages = currentAttachments
          .filter((url) => typeof url === 'string')
          .map((url) => url.split('/').pop());

      const newImages = parsedAuthors
        .map((author) => author.image)
        .filter((url) => typeof url === 'string');
      const newImageFileNames = newImages.map((url) => url.split('/').pop());

      const imagesToDelete = currentImages.filter((image) => !newImageFileNames.includes(image));

      await Promise.all(imagesToDelete.map((image) => deleteImageFromS3(image)));

    
      let uploadedFiles = [];
      if (req.files && req.files.authorImages) {
        const fileUploadPromises = req.files.authorImages.map(async (file) => {
          const fileUrl = await uploadFileToS3(file, 'images/imageJournal');
          return fileUrl;
        });
        uploadedFiles = await Promise.all(fileUploadPromises);
      }

      const updatedAttachments = [
        ...currentAttachments.filter((attachment) => newImages.includes(attachment)),
        ...uploadedFiles,
      ];

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
      });

      res.status(200).json({ message: 'Запись успешно обновлена', journal });
    } catch (error) {
      console.error('Ошибка при обновлении записи:', error);
      res.status(500).json({ message: 'Ошибка при обновлении записи', error: error.message });
    }
  },
);



// Получение всех записей
router.get('/getzapros', async (req, res) => {
  try {
    const data = await Journal.findAll({
      order: [['id', 'DESC']],
    });

    res.json(data);
  } catch (error) {
    console.error('Ошибка при получении записи:', error);
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

   if (journal.authors) {
     journal.authors = journal.authors.map((author, index) => ({
       ...author,
       image:
         typeof author.image === 'string' && author.image.startsWith('http')
           ? author.image
           : journal.attachments?.[index] || null,
     }));
   }
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
            console.log(`Файл ${fileName} удалён из ${folder}`);
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
