const express = require('express');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const fileMiddleware = require('../../middleware/file');
const { VacancyMainEvent } = require('../../db/models');
const { uploadFileToS3, deleteFileFromS3 } = require('../../s3Utils/s3Service');
const { logResourceAction } = require('../../utils/fileLogger');

const router = express.Router();

function getFileNameFromUrl(url) {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 1];
}

const deleteImageIfUnused = async (imageUrl, currentEventId, logInfo = null) => {
  try {
    const otherEventsWithImage = await VacancyMainEvent.findOne({
      where: { files: { [Op.contains]: [imageUrl] }, id: { [Op.ne]: currentEventId } },
    });

    if (!otherEventsWithImage) {
      const fileName = getFileNameFromUrl(imageUrl);
      await deleteFileFromS3(fileName, 'images/imageEvent', logInfo);
    }
  } catch (error) {
    console.error(`Ошибка при удалении изображения ${imageUrl}:`, error);
  }
};

router.put('/update-event/:id', fileMiddleware.fields([{ name: 'files', maxCount: 500 }]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const userInfo = req.session?.user ? {
        userName: req.session.user.name,
        userId: req.session.user.id.toString(),
        resourceType: 'vacancy-event',
        resourceId: id,
      } : null;

      const { title, videoUrls, removedFiles } = req.body;
      const eventData = JSON.parse(videoUrls);

      const event = await VacancyMainEvent.findByPk(id);

      if (!event) {
        return res.status(404).json({ message: "Мероприятие не найдено" });
      }

      const oldTitle = event.title;
      const oldFiles = event.files || [];
      const oldEventData = JSON.stringify(event.eventData || []);
      const newEventDataStr = JSON.stringify(eventData || []);

      const removedFilesArray = removedFiles ? JSON.parse(removedFiles) : [];
      const hasRemovedFiles = removedFilesArray.length > 0;
      const hasNewFiles = req.files && req.files['files'] && req.files['files'].length > 0;

      let newFiles = [];
      if (hasNewFiles) {
        const newFilesPromises = req.files['files'].map((file) => uploadFileToS3(file, 'images/imageEvent', userInfo));
        newFiles = await Promise.all(newFilesPromises);
      }

      const finalFiles = hasRemovedFiles || hasNewFiles
        ? [...newFiles, ...oldFiles.filter((file) => !removedFilesArray.includes(file))]
        : oldFiles;

      const hasChanges =
        oldTitle !== title ||
        oldEventData !== newEventDataStr ||
        JSON.stringify(oldFiles) !== JSON.stringify(finalFiles);

      if (removedFiles) {
        // eslint-disable-next-line no-restricted-syntax
        for (const fileUrl of removedFilesArray) {
          // eslint-disable-next-line no-await-in-loop
          await deleteImageIfUnused(fileUrl, id, userInfo);
        }
      }

      await event.update({
        title,
        files: finalFiles,
        eventData,
      });

      logResourceAction({
        action: 'UPDATE',
        userName: req.session?.user?.name || 'Неизвестный',
        userId: req.session?.user?.id?.toString() || 'N/A',
        resourceType: 'vacancy-event',
        resourceId: id,
        resourceName: title || event.title,
        hasChanges,
      });

      res.json({ message: "Слайд успешно обновлен", data: event });
    } catch (error) {
      console.error('Ошибка при обновлении слайда:', error);
      res.status(500).json({ error: "Ошибка сервера при обновлении слайда" });
    }
  }
);

router.put('/update-event-order', async (req, res) => {
  const { events } = req.body;

  if (!Array.isArray(events)) {
    return res.status(400).json({ error: 'Некорректные данные: ожидался массив мероприятий' });
  }

  try {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < events.length; i++) {
      const { id, order } = events[i];
      // eslint-disable-next-line no-await-in-loop
      await VacancyMainEvent.update({ order }, { where: { id } });
    }

    const updatedFiles = await VacancyMainEvent.findAll({
      order: [['order', 'ASC']],
    });

    res.json({ message: 'Порядок мероприятий успешно обновлен', events: updatedFiles });
  } catch (error) {
    console.error('Ошибка при обновлении порядка мероприятий:', error);
    res.status(500).json({ error: 'Ошибка сервера при обновлении порядка мероприятий' });
  }
});

router.post('/save-event-details',
  fileMiddleware.fields([
    { name: 'files', maxCount: 500 },
    { name: 'videos', maxCount: 100 },
  ]), async (req, res) => {
    const userInfo = req.session?.user ? {
      userName: req.session.user.name,
      userId: req.session.user.id.toString(),
      resourceType: 'vacancy-event',
    } : null;

    let details;
    try {
      details = JSON.parse(req.body.details);
    } catch (error) {
      return res.status(400).json({ error: 'Некорректные данные: не удалось распарсить JSON' });
    }

    if (!details || !details.eventData || !Array.isArray(details.eventData)) {
      return res.status(400).json({ error: 'Некорректные данные: отсутствуют необходимые поля' });
    }

    const { eventData } = details;
    const files = [];

    if (req.files && req.files.files) {
      // eslint-disable-next-line no-restricted-syntax
      for (const file of req.files.files) {
        // eslint-disable-next-line no-await-in-loop
        const fileUrl = await uploadFileToS3(file, 'images/imageEvent', userInfo);
        files.push(fileUrl);
      }
    }
    const { title } = req.body;

    try {
      await VacancyMainEvent.increment('order', { by: 1, where: {} });

      const newEvent = await VacancyMainEvent.create({
        title,
        hidden: false,
        files,
        eventData,
        order: 0
      });

      logResourceAction({
        action: 'CREATE',
        userName: req.session?.user?.name || 'Неизвестный',
        userId: req.session?.user?.id?.toString() || 'N/A',
        resourceType: 'vacancy-event',
        resourceId: newEvent.id.toString(),
        resourceName: title || 'Мероприятие',
      });

      res.status(200).json({ message: 'Детали мероприятия сохранены успешно.', data: newEvent });
    } catch (error) {
      console.error('Ошибка при сохранении деталей мероприятий:', error);
      res.status(500).json({ error: 'Ошибка при обработке вашего запроса', details: error.errors });
    }
  });

router.get('/get-events', async (req, res) => {
  try {
    const data = await VacancyMainEvent.findAll({
      order: [
        ['order', 'ASC']
      ]
    });
    res.json(data);
  } catch (error) {
    console.error('Произошла ошибка при получении данных.');
    res.status(500).json({ error: "Ошибка сервера при получении данных" });
  }
});

router.get('/get-event/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const event = await VacancyMainEvent.findByPk(id);
    if (!event) {
      res.status(404).json({ message: "Меропиятие не найден" });
    } else {
      res.json(event);
    }
  } catch (error) {
    console.error("Ошибка сервера при получении данных мероприятий:", error);
    res.status(500).json({ error: "Ошибка сервера при получении данных мероприятий" });
  }
});

router.put('/toggle-event/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { hidden } = req.body;

    const event = await VacancyMainEvent.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Мероприятие не найдено' });
    }

    const hasChanges = event.hidden !== hidden;

    const updated = await VacancyMainEvent.update({ hidden }, {
      where: { id }
    });

    if (updated) {
      logResourceAction({
        action: 'UPDATE',
        userName: req.session?.user?.name || 'Неизвестный',
        userId: req.session?.user?.id?.toString() || 'N/A',
        resourceType: 'vacancy-event',
        resourceId: id,
        resourceName: event.title || 'Мероприятие',
        hasChanges,
      });

      res.json({ message: 'Статус мероприятий успешно обновлен', id, hidden });
    } else {
      res.status(404).json({ error: 'Мероприятие не найдено' });
    }
  } catch (error) {
    console.error('Ошибка обновления статуса мероприятий:', error);
    res.status(500).json({ message: 'Ошибка сервера при обновлении статуса мероприятий' });
  }
});

router.delete('/delete-event/:id', async (req, res) => {
  const { id } = req.params;

  const userInfo = req.session?.user ? {
    userName: req.session.user.name,
    userId: req.session.user.id.toString(),
    resourceType: 'vacancy-event',
    resourceId: id,
  } : null;

  // eslint-disable-next-line radix, no-restricted-globals
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "Некорректный идентификатор мероприятия." });
  }
  try {
    const event = await VacancyMainEvent.findByPk(id);

    if (!event) {
      return res.status(404).json({ error: "Мероприятие не найдено." });
    }

    const result = await VacancyMainEvent.destroy({ where: { id } });

      if (result) {
        if (event.files && Array.isArray(event.files)) {
          // eslint-disable-next-line no-restricted-syntax
          for (const fileUrl of event.files) {
            const fileName = getFileNameFromUrl(fileUrl);
            // eslint-disable-next-line no-await-in-loop
            await deleteFileFromS3(fileName, 'images/imageEvent', userInfo);
          }
        }

        logResourceAction({
          action: 'DELETE',
          userName: req.session?.user?.name || 'Неизвестный',
          userId: req.session?.user?.id?.toString() || 'N/A',
          resourceType: 'vacancy-event',
          resourceId: id,
          resourceName: event.title || 'Мероприятие',
        });

        res.json({ message: "Мероприятие удалено", id });
    } else {
      res.status(500).json({ error: "Ошибка при удалении мероприятия." });
    }
  } catch (error) {
    console.error('Ошибка при удалении мероприятия:', error);
    res.status(500).json({ error: "Ошибка при удалении мероприятия." });
  }
});

module.exports = router;
