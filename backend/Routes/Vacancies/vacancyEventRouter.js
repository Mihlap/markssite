const express = require('express');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const fileMiddleware = require('../../middleware/fileEvent');   
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



