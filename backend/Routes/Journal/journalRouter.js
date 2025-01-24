/* eslint-disable camelcase */
const express = require('express');
const { URL } = require('url');
const { Journal } = require('../../db/models');
const fileMiddleware = require('../../middleware/file');
const { uploadFileToS3, deleteFileFromS3 } = require('../../s3Utils/s3Service');

const router = express.Router();

const extractFileNameAndFolderFromUrl = (url) => {
  if (!url.includes('http') && !url.includes('https')) {
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

router.post('/upload', fileMiddleware.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' });
    }

    // Загружаем файл в S3
    const fileUrl = await uploadFileToS3(req.file, 'images/imageJournal/imageMarkdown');

    res.status(201).json({ url: fileUrl });
  } catch (error) {
    console.error('Ошибка при загрузке файла:', error);
    res.status(500).json({ message: 'Ошибка загрузки файла', error: error.message });
  }
});

// POST /postzapros
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

      const parsedAuthors = authors ? Object.values(JSON.parse(authors)) : [];
      const parsedOrganizations = JSON.parse(organizations || '[]');
      const parsedLocations = JSON.parse(locations || '[]');
      const parsedCategory = JSON.parse(category || '[]');
      const parsedImageKey = imageKey || null;

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

        // Присваиваем изображения авторам
        const updatedParsedAuthors = parsedAuthors.map((author, i) => {
          const updatedAuthor = { ...author };
          if (uploadedFiles[i]) {
            updatedAuthor.image = uploadedFiles[i];
          }
          return updatedAuthor;
        });

        journal.authors = updatedParsedAuthors;
        journal.attachments = uploadedFiles;
      }

      await journal.save();

      return res.status(201).json({ message: 'Запись успешно создана', journal });
    } catch (error) {
      console.error('Ошибка при создании записи:', error);
      return res.status(500).json({ message: 'Ошибка при создании записи', error: error.message });
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

      // Парсим данные из тела запроса
      const parsedAuthors = authors ? JSON.parse(authors) : [];
      const parsedOrganizations = JSON.parse(organizations || '[]');
      const parsedLocations = JSON.parse(locations || '[]');
      const parsedCategory = JSON.parse(category || '[]');
      const currentAttachments = journal.attachments || [];

      // Загружаем новые файлы, если есть конечно
      let uploadedFiles = [];
      if (req.files && req.files.authorImages) {
        uploadedFiles = await Promise.all(
          req.files.authorImages.map((file) => uploadFileToS3(file, 'images/imageJournal')),
        );        
      }

      // Обновление изображения при изменении
      const updatedAuthors = parsedAuthors.map((author) => {
        const file = uploadedFiles.find((uploadedFile) => uploadedFile.includes(author.id));
        const updatedImage = file || author.image;

        if (!updatedImage) return { ...author, image: null };

        // Удаляем все старые временные метки
        const cleanImagePath = updatedImage.split('?timestamp=')[0];

        // Добавляем новую временную метку
        return {
          ...author,
          image: `${cleanImagePath}?timestamp=${Date.now()}`,
        };
      });   

      // Обновляем список вложений
      const updatedAttachments = updatedAuthors.map((author) => author.image).filter(Boolean);

      // Удаляем старые файлы из S3, которые больше не используются
      const attachmentsToRemove = currentAttachments.filter(
        (attachment) =>
          !updatedAttachments.some((updatedAttachment) => {
            const cleanAttachment = attachment.split('?timestamp=')[0];
            const cleanUpdatedAttachment = updatedAttachment.split('?timestamp=')[0];
            return cleanAttachment === cleanUpdatedAttachment;
          }),
      );

      await Promise.all(
        attachmentsToRemove.map(async (url) => {
          try {
            // Извлекаем имя файла для удаления
            const fileName = url.split('/').pop().split('?')[0];
            await deleteFileFromS3(fileName, 'images/imageJournal');
          } catch (error) {
            console.error('Ошибка при удалении из S3:', error);
          }
        }),
      );

      // Обновляем запись в базе данных
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

    res.json({
      ...journal.toJSON(),
      authors: Array.isArray(journal.authors) ? journal.authors : [],
    });
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
