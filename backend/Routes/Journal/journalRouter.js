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

// Создание markdownFile POST /uploadMarkdownFile 
router.post(
  '/uploadMarkdownFile',
  fileMiddleware.single('markdownFile'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Файл не найден в запросе' });
      }

      // Определяем папку на основе типа файла
      let uploadFolder = 'images/imageJournal/imageMarkdown';
      if (req.file.mimetype === 'application/pdf') {
        uploadFolder = 'images/imageJournal/documents';
      }

      const uploadedUrl = await uploadFileToS3(req.file, uploadFolder);

      return res.status(200).json({
        message: 'Файл успешно загружен',
        url: uploadedUrl,
      });
    } catch (error) {
      console.error('Ошибка при загрузке файла в /uploadMarkdownFile:', error);
      return res.status(500).json({ message: 'Ошибка загрузки файла', error: error.message });
    }
  }
);


// POST /postzapros
router.post(
  '/postzapros',
  fileMiddleware.fields([
    { name: 'authorImages', maxCount: 100 },
    { name: 'markdownImages', maxCount: 100 },
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
        markdown_content,
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

function extractMarkdownLinks(markdownText) {
  const links = [];

  const imageRegex = /!\[[^\]]*\]\((?<url>[^)]+)\)/g;
  const linkRegex = /\[[^\]]*\]\((?<url>[^)]+)\)/g;

  // eslint-disable-next-line no-restricted-syntax
  for (const match of markdownText.matchAll(imageRegex)) {
    links.push(match.groups.url);
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const match of markdownText.matchAll(linkRegex)) {
    const {url} = match.groups;
    if (url.endsWith('.pdf') || url.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
      links.push(url);
    }
  }
  return [...new Set(links)];
}


// Обновление записи
router.put(
  '/editzapros/:journalId',
  fileMiddleware.fields([
    { name: 'authorImages', maxCount: 100 },
    { name: 'markdownImages', maxCount: 100 },
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
        markdown_content: newMarkdown,
        imageKey,
      } = req.body;

      const journal = await Journal.findByPk(journalId);
      if (!journal) {
        return res.status(404).json({ message: 'Запись не найдена' });
      }

      const oldMarkdown = journal.markdown_content || '';

      const oldLinks = extractMarkdownLinks(oldMarkdown);
      const newLinks = extractMarkdownLinks(newMarkdown);

      const removedLinks = oldLinks.filter((link) => !newLinks.includes(link));

      removedLinks.forEach(async (link) => {
       const result = extractFileNameAndFolderFromUrl(link);
       if (result) {
         const decodedFileName = decodeURIComponent(result.fileName);      
         await deleteFileFromS3(decodedFileName, result.folder);
       } else {
         console.error('Не удалось извлечь данные из ссылки:', link);
       }
     });

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
            const fileName = url.split('/').pop().split('?')[0];
            await deleteFileFromS3(fileName, 'images/imageJournal');
          } catch (error) {
            console.error('Ошибка при удалении из S3:', error);
          }
        }),
      );

      // Обработка PDF-файлов
      const oldPdfLinks = oldLinks.filter((link) => link.endsWith('.pdf'));
      const newPdfLinks = newLinks.filter((link) => link.endsWith('.pdf'));
      const removedPdfLinks = oldPdfLinks.filter((link) => !newPdfLinks.includes(link));

      // Удаляем старые PDF-файлы из S3
     removedPdfLinks.forEach(async (link) => {
       const result = extractFileNameAndFolderFromUrl(link);
       if (result) {
         const decodedFileName = decodeURIComponent(result.fileName); 
         await deleteFileFromS3(decodedFileName, result.folder);
       } else {
         console.error('Не удалось извлечь данные из PDF-ссылки:', link);
       }
     });

      // Обновляем запись в базе данных
      await journal.update({
        title,
        publication_date,
        category: parsedCategory,
        issue_number: issue_number ? parseInt(issue_number, 10) : null,
        authors: updatedAuthors,
        organizations: parsedOrganizations,
        locations: parsedLocations,
        markdown_content: newMarkdown,
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

   const normalizeFileName = (url) => {
      let decodedUrl = url;
      try {
        while (decodedUrl !== decodeURIComponent(decodedUrl)) {
          decodedUrl = decodeURIComponent(decodedUrl);
        }
        return decodedUrl.split('/').pop().split('?')[0];
      } catch (error) {
        console.error('Ошибка при декодировании URL:', url, error);
        return url.split('/').pop().split('?')[0];
      }
    };

    const extractAndDeleteFiles = async (fileUrls, isMarkdown = false, isPdf = false) => {
      const uniqueUrls = [...new Set(fileUrls.map(normalizeFileName))];

      await Promise.all(
        uniqueUrls.map(async (fileName) => {
          let { fileName: extractedFileName, folder } = extractFileNameAndFolderFromUrl(fileName);  
          if (isMarkdown) {
            folder = 'images/imageJournal/imageMarkdown';
          } else if (isPdf) {
            folder = 'images/imageJournal/documents';
          }

          try {     
            await deleteFileFromS3(extractedFileName, folder);
          } catch (error) {
            console.error(`Ошибка при удалении файла ${extractedFileName}:`, error);
          }
        }),
      );
    };

    // Удаляем файлы из attachments (основные файлы публикации)
    if (post.attachments) {
      const attachmentUrls = post.attachments;  
      await extractAndDeleteFiles(attachmentUrls, false, false);
    }

    // Извлекаем ссылки из Markdown (изображения + PDF)
    const markdownLinks = extractMarkdownLinks(post.markdown_content || '');   

    // Декодируем URL перед удалением
    const decodedMarkdownLinks = markdownLinks.map((url) => decodeURIComponent(url).split('?')[0]); 

    // Отдельно удаляем изображения и PDF-файлы из Markdown
    const markdownImages = decodedMarkdownLinks.filter((link) => !link.endsWith('.pdf'));
    const markdownPdfs = decodedMarkdownLinks.filter((link) => link.endsWith('.pdf'));

    await extractAndDeleteFiles(markdownImages, true, false);
    await extractAndDeleteFiles(markdownPdfs, false, true);
    await Journal.destroy({
      where: { id },
    });

    res.sendStatus(200);
  } catch (error) {
    console.error('Ошибка при удалении проекта:', error);
    res.sendStatus(500);
  }
});



module.exports = router;
