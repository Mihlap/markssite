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

      const parsedAuthors = authors ? JSON.parse(authors) : [];
      const parsedOrganizations = organizations ? JSON.parse(organizations) : [];
      const parsedLocations = locations ? JSON.parse(locations) : [];
      const parsedCategory = category ? JSON.parse(category) : [];

      const currentAttachments = journal.attachments || [];
      console.log('Текущие вложения:', currentAttachments);

      const normalizeUrl = (url) => url.split('/').pop().split('?')[0];

      const normalizedCurrentAttachments = currentAttachments.map(normalizeUrl);

      const newFiles = req.files.authorImages
        ? await Promise.all(
            req.files.authorImages.map((file) => uploadFileToS3(file, 'images/imageJournal')),
          )
        : [];

      console.log('Загружены новые файлы:', newFiles);

      const updatedAuthors = parsedAuthors.map((author) => {
        const normalizedImage = author.image ? normalizeUrl(author.image) : null;

        // Проверяем, если новое изображение передано
        const isNewImage = req.files.authorImages?.some(
          (file) => file.originalname === normalizeUrl(author.image),
        );

        if (isNewImage) {
          const newFile = newFiles.shift(); // Берём новое изображение
          return { ...author, image: newFile }; // Обновляем автора с новым изображением
        }

        // Если изображение автора уже есть в текущих вложениях, оставляем его
        if (normalizedImage && normalizedCurrentAttachments.includes(normalizedImage)) {
          return author;
        }

        // Если изображение отсутствует, оставляем поле `image` null
        return { ...author, image: null };
      });

      const updatedAttachments = [...currentAttachments, ...newFiles].map((file) =>
        typeof file === 'string' ? file : file.Location,
      ); 

      console.log('Обновлённые вложения:', updatedAttachments);

      const attachmentsToRemove = currentAttachments.filter(
        (attachment) =>
          !updatedAttachments.some(
            (updatedAttachment) => normalizeUrl(updatedAttachment) === normalizeUrl(attachment),
          ),
      );

      // Удаляем файлы, которые больше не нужны
      await Promise.all(
        attachmentsToRemove.map(async (url) => {
          try {
            await deleteImageFromS3(url);
            console.log('Удалено из S3:', url);
          } catch (error) {
            console.error('Ошибка при удалении из S3:', error);
          }
        }),
      );

      await journal.update({
        title,
        publication_date,
        category: parsedCategory,
        issue_number: issue_number ? parseInt(issue_number, 10) : null,
        authors: updatedAuthors,
        organizations: parsedOrganizations,
        locations: parsedLocations,
        markdown_content,
        attachments: updatedAttachments,
        imageKey,
      });

      res.status(200).json({ message: 'Запись успешно обновлена', journal });
    } catch (error) {
      console.error('Ошибка при обновлении записи:', error);
      res.status(500).json({ message: 'Ошибка обновления', error: error.message });
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

      console.log('Данные записи из базы:', journal);

   
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
