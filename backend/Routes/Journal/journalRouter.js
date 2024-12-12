const express = require('express');
const { URL } = require('url');
const { Journal, AttachmentsJournal } = require('../../db/models');
const fileMiddleware = require('../../middleware/file');
const { uploadFileToS3, deleteFileFromS3 } = require('../../s3Utils/s3Service');

const router = express.Router();

if (!Journal || !AttachmentsJournal) {
  console.error('Ошибка загрузки моделей Journals или AttachmentsJournal');
}

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
  fileMiddleware.fields([
    { name: 'authorImages', maxCount: 100 },
  ]),
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
        // markdown_content,
        editor_id,
      } = req.body;

      const parsedAuthors = authors ? JSON.parse(authors) : [];
      const parsedOrganizations = organizations ? JSON.parse(organizations) : [];
      const parsedLocations = locations ? JSON.parse(locations) : [];

      const journal = await Journal.create({
        title,
        publication_date,
        category,
        issue_number,
        authors: parsedAuthors,
        organizations: parsedOrganizations,
        locations: parsedLocations,
        // markdown_content,
        editor_id,
      });

      if (req.files.authorImages) {
        const attachmentPromises = req.files.authorImages.map(async (file) => {
          const fileUrl = await uploadFileToS3(file, 'images/imageJournal');
          return AttachmentsJournal.create({
            journal_id: journal.id,
            file_type: file.mimetype,
            file_url: fileUrl,
            file_name: file.originalname,
          });
        });

        await Promise.all(attachmentPromises);
      }

      res.status(200).json({ message: 'Данные успешно сохранены', journal });
    } catch (error) {
      console.error('Ошибка при создании записи:', error);
      res.status(500).json({ message: 'Ошибка при создании записи', error: error.message });
    }
  }
);

router.put(
  '/editzapros/:journalId',
  fileMiddleware.fields([
    { name: 'authorImages', maxCount: 100 },
  ]),
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
        // markdown_content,
        editor_id,
      } = req.body;

      const journal = await Journal.findByPk(journalId, {
        include: { model: AttachmentsJournal, as: 'attachments' },
      });

      if (!journal) {
        return res.status(404).json({ message: 'Запись не найдена' });
      }

      const parsedAuthors = authors ? JSON.parse(authors) : [];
      const parsedOrganizations = organizations ? JSON.parse(organizations) : [];
      const parsedLocations = locations ? JSON.parse(locations) : [];

      await journal.update({
        title,
        publication_date,
        category,
        issue_number,
        authors: parsedAuthors,
        organizations: parsedOrganizations,
        locations: parsedLocations,
        // markdown_content,
        editor_id,
      });

      if (req.files.authorImages) {
        const attachmentPromises = req.files.authorImages.map(async (file) => {
          const fileUrl = await uploadFileToS3(file, 'images/imageJournal');
          return AttachmentsJournal.create({
            journal_id: journal.id,
            file_type: file.mimetype,
            file_url: fileUrl,
            file_name: file.originalname,
          });
        });

        await Promise.all(attachmentPromises);
      }

      res.status(200).json({ message: 'Запись успешно обновлена' });
    } catch (error) {
      console.error('Ошибка при обновлении записи:', error);
      res.status(500).json({ message: 'Ошибка при обновлении записи', error: error.message });
    }
  }
);


router.get('/getzapros', async (req, res) => {
  try {
    if (!Journal) {
      throw new Error('Модель Journals не определена');
    }

    const data = await Journal.findAll({
      order: [['id', 'DESC']],
      include: { model: AttachmentsJournal, as: 'attachments' },
    });

    const result = data.map((journal) => ({
      ...journal.toJSON(),
      authors: journal.authors ? JSON.parse(journal.authors) : [],
    }));

    res.json(result);
  } catch (error) {
    console.error('Ошибка при получении записей:', error);
    res.status(500).json({ message: 'Ошибка при получении записей', error: error.message });
  }
});



router.delete('/deletezapros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const journal = await Journal.findByPk(id, {
      include: { model: AttachmentsJournal, as: 'attachments' },
    });

    if (!journal) {
      return res.status(404).json({ message: 'Запись не найдена' });
    }

    const deletePromises = journal.attachments.map(async (attachment) => {
      await deleteImageFromS3(attachment.file_url);
      return attachment.destroy();
    });

    await Promise.all(deletePromises);

    await journal.destroy();

    res.status(200).json({ message: 'Запись успешно удалена' });
  } catch (error) {
    console.error('Ошибка при удалении записи:', error);
    res.status(500).json({ message: 'Ошибка при удалении записи', error: error.message });
  }
});

module.exports = router;
