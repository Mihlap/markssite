// const { Op } = require('sequelize');
// const { VacancyMainEvent } = require('../../db/models');
// const { uploadFileToS3, deleteFileFromS3 } = require('../../s3Utils/s3Service');

// async function vacancyEventRouter(fastify, options) {
//   /* eslint-disable no-restricted-syntax, no-await-in-loop */
//   /* eslint-disable no-restricted-syntax, no-await-in-loop */
//   async function parseMultipart(parts) {
//     const files = {};
//     const fields = {};

//     // Используем while вместо for-await-of, но отключаем правила линтера для этого блока
//     const iterator = parts[Symbol.asyncIterator]();
//     let result = await iterator.next();
//     while (!result.done) {
//       const part = result.value;
//       if (part.file) {
//         if (!files[part.fieldname]) files[part.fieldname] = [];
//         const buffer = await part.toBuffer();
//         files[part.fieldname].push({ ...part, buffer });
//       } else {
//         fields[part.fieldname] = part.value;
//       }
//       result = await iterator.next();
//     }
//     return { files, fields };
//   }
//   /* eslint-enable no-restricted-syntax, no-await-in-loop */

//   // Извлечение имени файла из URL
//   function getFileNameFromUrl(url) {
//     const parts = url.split('/');
//     return parts[parts.length - 1];
//   }

//   // Удаление изображения из S3, если больше нигде не используется
//   async function deleteImageIfUnused(imageUrl, currentEventId) {
//     try {
//       const other = await VacancyMainEvent.findOne({
//         where: { files: { [Op.contains]: [imageUrl] }, id: { [Op.ne]: currentEventId } },
//       });
//       if (!other && imageUrl) {
//         const fileName = getFileNameFromUrl(imageUrl);
//         await deleteFileFromS3(fileName, 'images/imageEvent');
//       }
//     } catch (err) {
//       console.error(`Ошибка при удалении изображения ${imageUrl}:`, err);
//     }
//   }

//   // Обновление мероприятия
//   fastify.put('/update-event/:id', async (request, reply) => {
//     const { id } = request.params;
//     const { files, fields } = await parseMultipart(request.parts());
//     try {
//       const { title, videoUrls, removedFiles } = fields;
//       const eventData = videoUrls ? JSON.parse(videoUrls) : [];

//       const event = await VacancyMainEvent.findByPk(id);
//       if (!event) {
//         return reply.code(404).send({ message: 'Мероприятие не найдено' });
//       }

//       const oldFiles = event.files || [];

//       if (removedFiles) {
//         const removedArray = JSON.parse(removedFiles);
//         await Promise.all(removedArray.map((fileUrl) => deleteImageIfUnused(fileUrl, id)));
//         event.files = oldFiles.filter((f) => !removedArray.includes(f));
//       }

//       if (files.files) {
//         const newFiles = await Promise.all(
//           files.files.map((f) => uploadFileToS3(f, 'images/imageEvent')),
//         );
//         event.files = [...newFiles, ...oldFiles];
//       }

//       await event.update({ title, files: event.files, eventData });
//       reply.send({ message: 'Слайд успешно обновлен', data: event });
//     } catch (error) {
//       console.error('Ошибка при обновлении мероприятия:', error);
//       reply.code(500).send({ error: 'Ошибка сервера при обновлении мероприятия' });
//     }
//   });

//   // Обновление порядка мероприятий
//   fastify.put('/update-event-order', async (request, reply) => {
//     const { events } = request.body;
//     if (!Array.isArray(events)) {
//       return reply.code(400).send({ error: 'Некорректные данные: ожидался массив мероприятий' });
//     }
//     await Promise.all(
//       events.map((evt, i) =>
//         VacancyMainEvent.update({ order: evt.order }, { where: { id: evt.id } }),
//       ),
//     );
//     const updated = await VacancyMainEvent.findAll({ order: [['order', 'ASC']] });
//     reply.send({ message: 'Порядок мероприятий успешно обновлен', events: updated });
//   });

//   // Создание нового мероприятия
//   fastify.post('/save-event-details', async (request, reply) => {
//     const { files, fields } = await parseMultipart(request.parts());
//     let details;
//     try {
//       details = JSON.parse(fields.details);
//     } catch {
//       return reply.code(400).send({ error: 'Некорректные данные: не удалось распарсить JSON' });
//     }
//     if (!details.eventData || !Array.isArray(details.eventData)) {
//       return reply.code(400).send({ error: 'Некорректные данные: отсутствуют необходимые поля' });
//     }
//     const { eventData } = details;
//     const uploaded = files.files
//       ? await Promise.all(files.files.map((f) => uploadFileToS3(f, 'images/imageEvent')))
//       : [];
//     const { title } = fields;
//     try {
//       await VacancyMainEvent.increment('order', { by: 1, where: {} });
//       const newEvent = await VacancyMainEvent.create({
//         title,
//         hidden: false,
//         files: uploaded,
//         eventData,
//         order: 0,
//       });
//       reply.code(200).send({ message: 'Детали мероприятия сохранены успешно.', data: newEvent });
//     } catch (error) {
//       console.error('Ошибка при сохранении мероприятий:', error);
//       reply.code(500).send({ error: 'Ошибка при обработке вашего запроса', details: error.errors });
//     }
//   });

//   // Получение всех мероприятий
//   fastify.get('/get-events', async (request, reply) => {
//     try {
//       const data = await VacancyMainEvent.findAll({ order: [['order', 'ASC']] });
//       reply.send(data);
//     } catch (error) {
//       console.error('Ошибка при получении данных мероприятий:', error);
//       reply.code(500).send({ error: 'Ошибка сервера при получении данных' });
//     }
//   });

//   // Получение одного мероприятия
//   fastify.get('/get-event/:id', async (request, reply) => {
//     const { id } = request.params;
//     try {
//       const event = await VacancyMainEvent.findByPk(id);
//       if (!event) {
//         return reply.code(404).send({ message: 'Мероприятие не найдено' });
//       }
//       reply.send(event);
//     } catch (error) {
//       console.error('Ошибка сервера при получении мероприятия:', error);
//       reply.code(500).send({ error: 'Ошибка сервера при получении данных мероприятий' });
//     }
//   });

//   // Переключение скрытия мероприятия
//   fastify.put('/toggle-event/:id', async (request, reply) => {
//     const { id } = request.params;
//     const { hidden } = request.body;
//     try {
//       const [count] = await VacancyMainEvent.update({ hidden }, { where: { id } });
//       if (count) {
//         reply.send({ message: 'Статус мероприятий успешно обновлен', id, hidden });
//       } else {
//         reply.code(404).send({ error: 'Мероприятие не найдено' });
//       }
//     } catch (error) {
//       console.error('Ошибка обновления статуса мероприятия:', error);
//       reply.code(500).send({ message: 'Ошибка сервера при обновлении статуса мероприятий' });
//     }
//   });

//   // Удаление мероприятия и файлов из S3
//   fastify.delete('/delete-event/:id', async (request, reply) => {
//     const { id } = request.params;
//     if (!id || isNaN(parseInt(id, 10))) {
//       return reply.code(400).send({ error: 'Некорректный идентификатор мероприятия.' });
//     }
//     try {
//       const event = await VacancyMainEvent.findByPk(id);
//       if (!event) {
//         return reply.code(404).send({ error: 'Мероприятие не найдено.' });
//       }
//       const filesList = event.files || [];
//       await VacancyMainEvent.destroy({ where: { id } });
//       await Promise.all(
//         filesList.map((fileUrl) => {
//           const fileName = getFileNameFromUrl(fileUrl);
//           return deleteFileFromS3(fileName, 'images/imageEvent');
//         }),
//       );
//       reply.send({ message: 'Мероприятие удалено', id });
//     } catch (error) {
//       console.error('Ошибка при удалении мероприятия:', error);
//       reply.code(500).send({ error: 'Ошибка при удалении мероприятия.' });
//     }
//   });
// };

// module.exports = vacancyEventRouter;

const express = require('express');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const fileMiddleware = require('../../middleware/file');
const { VacancyMainEvent } = require('../../db/models');
const { uploadFileToS3, deleteFileFromS3 } = require('../../s3Utils/s3Service');

const router = express.Router();

function getFileNameFromUrl(url) {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 1];
}

const deleteImageIfUnused = async (imageUrl, currentEventId) => {
  try {
     const otherEventsWithImage = await VacancyMainEvent.findOne({
      where: { files: { [Op.contains]: [imageUrl] }, id: { [Op.ne]: currentEventId } },
    });

     if (!otherEventsWithImage) {
      const fileName = getFileNameFromUrl(imageUrl);
      await deleteFileFromS3(fileName, 'images/imageEvent');
    }
  } catch (error) {
    console.error(`Ошибка при удалении изображения ${imageUrl}:`, error);
  }
};

router.put('/update-event/:id', fileMiddleware.fields([{ name: 'files', maxCount: 500 }]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const { title, videoUrls, removedFiles } = req.body;
      const eventData = JSON.parse(videoUrls);

      const event = await VacancyMainEvent.findByPk(id);

      if (!event) {
        return res.status(404).json({ message: "Мероприятие не найдено" });
      }

      const oldFiles = event.files || [];

     if (removedFiles) {
        const removedFilesArray = JSON.parse(removedFiles);
        // eslint-disable-next-line no-restricted-syntax
        for (const fileUrl of removedFilesArray) {
          // eslint-disable-next-line no-await-in-loop
          await deleteImageIfUnused(fileUrl, id);
        }
        event.files = event.files.filter((file) => !removedFilesArray.includes(file));
      }

      // Загрузка новых файлов в S3
      if (req.files && req.files['files']) {
        const newFilesPromises = req.files['files'].map((file) => uploadFileToS3(file, 'images/imageEvent'));
        const newFiles = await Promise.all(newFilesPromises);
        event.files = [...newFiles, ...oldFiles];
      }

       await event.update({
        title,
        files: event.files,
        eventData,
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
  let details;
  try {
    details = JSON.parse(req.body.details);
  } catch (error) {
    return res.status(400).json({ error: 'Некорректные данные: не удалось распарсить JSON' });
  }

  if (!details || !details.eventData || !Array.isArray(details.eventData)) {
    return res.status(400).json({ error: 'Некорректные данные: отсутствуют необходимые поля' });
  }

    const {eventData} = details;
    const files = [];

     // Загрузка файлов в S3
     if (req.files && req.files.files) {
      // eslint-disable-next-line no-restricted-syntax
      for (const file of req.files.files) {
        // eslint-disable-next-line no-await-in-loop
        const fileUrl = await uploadFileToS3(file, 'images/imageEvent');
        files.push(fileUrl);
      }
    }
  const {title} = req.body;

  try {
      await VacancyMainEvent.increment('order', { by: 1, where: {} });

     const newEvent = await VacancyMainEvent.create({
        title,
        hidden: false,
        files,
        eventData,
        order: 0
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
    res.status(500).json({ error: "Ошибка сервера при получении данных"  });
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

    const updated = await VacancyMainEvent.update({ hidden }, {
      where: { id }
    });

    if (updated) {
      res.json({ message: 'Статус мероприятий успешно обновлен', id, hidden });
    } else {
      res.status(404).json({ error: 'Мероприятие не найдено' });
    }
  } catch (error) {
    console.error('Ошибка обновления статуса мероприятий:', error);
    res.status(500).json({ message: 'Ошибка сервера при обновлении статуса мероприятий' });
  }
});

// удаление из s3 хранилище

router.delete('/delete-event/:id', async (req, res) => {
  const { id } = req.params;

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
          await deleteFileFromS3(fileName, 'images/imageEvent');
        }
      }

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
