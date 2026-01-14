/* eslint-disable camelcase */
const express = require('express');
const { URL } = require('url');
const { Journal } = require('../../db/models');
const fileMiddleware = require('../../middleware/file');
const { uploadFileToS3, deleteFileFromS3 } = require('../../s3Utils/s3Service');
const { logResourceAction } = require('../../utils/fileLogger');

const router = express.Router();

const extractFileNameAndFolderFromUrl = (url) => {
  if (!url.includes('http') && !url.includes('https')) {
    return {
      fileName: url,
      folder: 'images/imageJournal',
    };
  }
  try {
    const cleanUrl = url.split('?')[0];
    const urlObj = new URL(cleanUrl);
    const { pathname } = urlObj;
    const parts = pathname.split('/').filter(Boolean);
    if (!parts.length) {
      return null;
    }

    const fileName = parts[parts.length - 1];
    let folder = parts.slice(0, -1).join('/');

    if (fileName.toLowerCase().endsWith('.pdf')) {
      folder = 'images/imageJournal/documents';
    } else if (!folder) {
      folder = 'images/imageJournal';
    }

    return { fileName, folder };
  } catch (error) {
    console.error(`Ошибка извлечения данных из URL: ${url}`, error);
    return null;
  }
};

router.post('/uploadMarkdownFile', fileMiddleware.single('markdownFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не найден в запросе' });
    }
   
    const userInfo = req.session?.user ? {
      userName: req.session.user.name,
      userId: req.session.user.id.toString(),
      resourceType: 'journal',
    } : null;

    const timestamp = Date.now();
    const originalName = req.file.originalname;
    const fileExtension = originalName.substring(originalName.lastIndexOf('.'));
    const uniqueFileName = `${timestamp}${fileExtension}`;

    let uploadFolder = 'images/imageJournal/imageMarkdown';
    if (req.file.mimetype === 'application/pdf') {
      uploadFolder = 'images/imageJournal/documents';
    }

    const fileForUpload = { ...req.file, originalname: uniqueFileName };

    const uploadedUrl = await uploadFileToS3(fileForUpload, uploadFolder, userInfo);

    return res.status(200).json({
      message: 'Файл успешно загружен',
      url: uploadedUrl,
    });
  } catch (error) {
    console.error('Ошибка при загрузке файла в /uploadMarkdownFile:', error);
    return res.status(500).json({ message: 'Ошибка загрузки файла', error: error.message });
  }
});

router.post(
  '/postzapros',
  fileMiddleware.fields([
    { name: 'authorImages', maxCount: 100 },
    { name: 'markdownImages', maxCount: 100 },
  ]),
  async (req, res) => {
    try {   
      const userInfo = req.session?.user ? {
        userName: req.session.user.name,
        userId: req.session.user.id.toString(),
        resourceType: 'journal',
      } : null;

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
          req.files.authorImages.map(async (file) => uploadFileToS3(file, 'images/imageJournal', userInfo)),
        );

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
   
      if (req.session?.user) {
        logResourceAction({
          action: 'CREATE',
          userName: req.session.user.name,
          userId: req.session.user.id.toString(),
          resourceType: 'journal',
          resourceId: journal.id.toString(),
          resourceName: title || 'Запись журнала',
        });
      }

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
    const { url } = match.groups;
    if (url.endsWith('.pdf') || url.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
      links.push(url);
    }
  }
  return [...new Set(links)];
}

router.put(
  '/editzapros/:journalId',
  fileMiddleware.fields([
    { name: 'authorImages', maxCount: 100 },
    { name: 'markdownImages', maxCount: 100 },
  ]),
  async (req, res) => {
    try {
      const { journalId } = req.params;
   
      const userInfo = req.session?.user ? {
        userName: req.session.user.name,
        userId: req.session.user.id.toString(),
        resourceType: 'journal',
        resourceId: journalId,
      } : null;

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

      const normalizeValue = (value, existingValue) => {
        if (value === undefined || value === null) {
          return existingValue ?? '';
        }
        return String(value);
      };

      const normalizeAuthorsForComparison = (authorsArray) => {
        return JSON.stringify(
          authorsArray.map((author) => ({
            ...author,
            image: author.image ? author.image.split('?timestamp=')[0] : null,
          }))
        );
      };

      const normalizeAttachmentsForComparison = (attachmentsArray) => {
        return JSON.stringify(
          attachmentsArray.map((attachment) => attachment.split('?timestamp=')[0])
        );
      };

      const oldTitle = normalizeValue(journal.title, '');
      const oldPublicationDate = journal.publication_date ? String(journal.publication_date) : '';
      const oldCategory = JSON.stringify(journal.category || []);
      const oldIssueNumber = journal.issue_number !== null && journal.issue_number !== undefined ? String(journal.issue_number) : '';
      const oldOrganizations = JSON.stringify(journal.organizations || []);
      const oldLocations = JSON.stringify(journal.locations || []);
      const oldMarkdown = journal.markdown_content || '';
      const oldImageKey = normalizeValue(journal.imageKey, '');
      const oldAuthors = normalizeAuthorsForComparison(journal.authors || []);
      const oldAttachments = normalizeAttachmentsForComparison(journal.attachments || []);

      const parsedAuthors = authors ? JSON.parse(authors) : [];
      const parsedOrganizations = JSON.parse(organizations || '[]');
      const parsedLocations = JSON.parse(locations || '[]');
      const parsedCategory = JSON.parse(category || '[]');
      const currentAttachments = journal.attachments || [];

      let uploadedFiles = [];
      if (req.files && req.files.authorImages) {
        uploadedFiles = await Promise.all(
          req.files.authorImages.map((file) => uploadFileToS3(file, 'images/imageJournal', userInfo)),
        );
      }

      const updatedAuthors = parsedAuthors.map((author) => {
        const file = uploadedFiles.find((uploadedFile) => uploadedFile.includes(author.id));
        const updatedImage = file || author.image;

        if (!updatedImage) return { ...author, image: null };

        const cleanImagePath = updatedImage.split('?timestamp=')[0];

        return {
          ...author,
          image: `${cleanImagePath}?timestamp=${Date.now()}`,
        };
      });

      const updatedAttachments = updatedAuthors.map((author) => author.image).filter(Boolean);

      const newTitle = normalizeValue(title, oldTitle);
      const newPublicationDate = publication_date ? String(publication_date) : '';
      const newCategory = JSON.stringify(parsedCategory);
      const newIssueNumber = issue_number ? String(parseInt(issue_number, 10)) : '';
      const newOrganizations = JSON.stringify(parsedOrganizations);
      const newLocations = JSON.stringify(parsedLocations);
      const newMarkdownContent = normalizeValue(newMarkdown, oldMarkdown);
      const newImageKey = normalizeValue(imageKey, oldImageKey);
      const newAuthors = normalizeAuthorsForComparison(updatedAuthors);
      const newAttachments = normalizeAttachmentsForComparison(updatedAttachments);

      const oldLinks = extractMarkdownLinks(oldMarkdown);
      const newLinks = extractMarkdownLinks(newMarkdownContent);

      const removedLinks = oldLinks.filter((link) => !newLinks.includes(link));

      removedLinks.forEach(async (link) => {
        const result = extractFileNameAndFolderFromUrl(link);
        if (result) {
          const decodedFileName = decodeURIComponent(result.fileName);
          await deleteFileFromS3(decodedFileName, result.folder, userInfo);
        } else {
          console.error('Не удалось извлечь данные из ссылки:', link);
        }
      });

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
            await deleteFileFromS3(fileName, 'images/imageJournal', userInfo);
          } catch (error) {
            console.error('Ошибка при удалении из S3:', error);
          }
        }),
      );

      const oldPdfLinks = oldLinks.filter((link) => link.endsWith('.pdf'));
      const newPdfLinks = newLinks.filter((link) => link.endsWith('.pdf'));
      const removedPdfLinks = oldPdfLinks.filter((link) => !newPdfLinks.includes(link));

      removedPdfLinks.forEach(async (link) => {
        const result = extractFileNameAndFolderFromUrl(link);
        if (result) {
          const decodedFileName = decodeURIComponent(result.fileName);
          await deleteFileFromS3(decodedFileName, result.folder, userInfo);
        } else {
          console.error('Не удалось извлечь данные из PDF-ссылки:', link);
        }
      });

      const hasChanges =
        oldTitle !== newTitle ||
        oldPublicationDate !== newPublicationDate ||
        oldCategory !== newCategory ||
        oldIssueNumber !== newIssueNumber ||
        oldOrganizations !== newOrganizations ||
        oldLocations !== newLocations ||
        oldMarkdown !== newMarkdownContent ||
        oldImageKey !== newImageKey ||
        oldAuthors !== newAuthors ||
        oldAttachments !== newAttachments;

      await journal.update({
        title: newTitle || journal.title,
        publication_date: newPublicationDate || publication_date || null,
        category: parsedCategory,
        issue_number: newIssueNumber ? parseInt(newIssueNumber, 10) : null,
        authors: updatedAuthors,
        organizations: parsedOrganizations,
        locations: parsedLocations,
        markdown_content: newMarkdownContent || journal.markdown_content,
        attachments: updatedAttachments,
        imageKey: newImageKey || journal.imageKey,
      });
  
      if (req.session?.user) {
        logResourceAction({
          action: 'UPDATE',
          userName: req.session.user.name,
          userId: req.session.user.id.toString(),
          resourceType: 'journal',
          resourceId: journalId,
          resourceName: title || journal.title,
          hasChanges,
        });
      }

      res.status(200).json({ message: 'Запись успешно обновлена', journal });
    } catch (error) {
      console.error('Ошибка при обновлении записи:', error);
      res.status(500).json({ message: 'Ошибка обновления', error: error.message });
    }
  },
);

router.get('/getzapros', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);

    if (page && limit && page > 0 && limit > 0) {
      const offset = (page - 1) * limit;

      const { count, rows } = await Journal.findAndCountAll({
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
          totalPages: Math.ceil(count / limit),
        },
      });
    } else {
      const data = await Journal.findAll({ order: [['id', 'DESC']] });
      res.json(data);
    }
  } catch (error) {
    console.error('Ошибка при получении записей:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

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

router.delete('/delete-file', async (req, res) => {
  try {  
    const userInfo = req.session?.user ? {
      userName: req.session.user.name,
      userId: req.session.user.id.toString(),
      resourceType: 'journal',
    } : null;

    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: 'URL не предоставлен' });
    }
    const result = extractFileNameAndFolderFromUrl(url);
    if (!result) {
      return res.status(400).json({ message: 'Невозможно определить данные из URL' });
    }
    const { fileName, folder } = result;
    await deleteFileFromS3(fileName, folder, userInfo);
    res.status(200).json({ message: 'Файл удалён' });
  } catch (error) {
    console.error('Ошибка при удалении файла:', error);
    res.status(500).json({ message: 'Ошибка удаления файла', error: error.message });
  }
});

router.delete('/deletezapros/:id', async (req, res) => {
  try {
    const { id } = req.params;
  
    const userInfo = req.session?.user ? {
      userName: req.session.user.name,
      userId: req.session.user.id.toString(),
      resourceType: 'journal',
      resourceId: id,
    } : null;

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
          // eslint-disable-next-line prefer-const
          let { fileName: extractedFileName, folder } = extractFileNameAndFolderFromUrl(fileName);
          if (isMarkdown) {
            folder = 'images/imageJournal/imageMarkdown';
          } else if (isPdf) {
            folder = 'images/imageJournal/documents';
          }

          try {
            await deleteFileFromS3(extractedFileName, folder, userInfo);
          } catch (error) {
            console.error(`Ошибка при удалении файла ${extractedFileName}:`, error);
          }
        }),
      );
    };

    if (post.attachments) {
      const attachmentUrls = post.attachments;
      await extractAndDeleteFiles(attachmentUrls, false, false);
    }

    const markdownLinks = extractMarkdownLinks(post.markdown_content || '');
    const decodedMarkdownLinks = markdownLinks.map((url) => decodeURIComponent(url).split('?')[0]);
    const markdownImages = decodedMarkdownLinks.filter((link) => !link.endsWith('.pdf'));
    const markdownPdfs = decodedMarkdownLinks.filter((link) => link.endsWith('.pdf'));

    await extractAndDeleteFiles(markdownImages, true, false);
    await extractAndDeleteFiles(markdownPdfs, false, true);
    await Journal.destroy({
      where: { id },
    });
  
    if (req.session?.user) {
      logResourceAction({
        action: 'DELETE',
        userName: req.session.user.name,
        userId: req.session.user.id.toString(),
        resourceType: 'journal',
        resourceId: id,
        resourceName: post.title || 'Запись журнала',
      });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Ошибка при удалении проекта:', error);
    res.sendStatus(500);
  }
});

module.exports = router;
