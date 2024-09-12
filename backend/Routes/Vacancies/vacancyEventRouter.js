/* eslint-disable no-await-in-loop */
const express = require('express');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const fileMiddleware = require('../../middleware/fileEvent');   
const { VacancyMainEvent } = require('../../db/models');

const router = express.Router();

const eventImagesPath = path.join(__dirname, '../../images/eventAdd');

router.put('/update-event/:id', fileMiddleware.fields([{ name: 'files', maxCount: 1 }]), 
  async (req, res) => {
    const deleteImageIfUnused = async (imageName, currentEventId) => {
      const imagePath = path.join(eventImagesPath, imageName);
      try {
          const otherEventsWithImage = await VacancyMainEvent.findOne({
          where: { photoAva: imageName, id: { [Op.ne]: currentEventId } },
        });
     
        if (!otherEventsWithImage) {
          await fs.promises.unlink(imagePath);
          // console.log(`Изображение успешно удалено: ${imageName}`);
        } else {
          // console.log(`Изображение ${imageName} используется в других слайдах и не будет удалено.`);
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.warn(`Файл уже был удален: ${imageName}`);
        } else if (error.code === 'EPERM') {
          console.error(`Ошибка при удалении изображения ${imageName}: Недостаточно прав доступа.`);
        } else {
          console.error(`Ошибка при удалении изображения ${imageName}:`, error);
        }
      }
    };

    try {
      const { id } = req.params;
      const details = JSON.parse(req.body.details);
      const event = await VacancyMainEvent.findByPk(id);

      if (!event) {
        return res.status(404).json({ message: "Мероприятие не найдено" });
      }

      const oldImage = event.files;  

       if (req.body.removeFiles === 'true' && event.files) {
        await deleteImageIfUnused(event.files, id);
        event.files = '';
      }

        if (req.files && req.files['files']) {     
          event.files = req.files['files'][0].filename; 
      }

      await event.update({
        photoAva: event.files,
        eventData: details,
      });

      if (oldImage && oldImage !== event.files) {
        await deleteImageIfUnused(oldImage, id);
      }

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
  fileMiddleware.fields([{
  name: 'files',
  maxCount: 1
    },
  ]), async (req, res) => {
  let details;
  try {
    details = JSON.parse(req.body.details);
  } catch (error) {
    return res.status(400).json({ error: 'Некорректные данные: не удалось распарсить JSON' });
  }

  if (!details) {
    return res.status(400).json({ error: 'Некорректные данные: отсутствуют необходимые поля' });
  }

  const files = req.files && req.files['files'] ? req.files['files'][0].filename : '';
  const title = req.body.title; 

 
  try {
    const newEvent = await VacancyMainEvent.create({
      title,
      eventData: details.eventData,
      hidden: false,
      files
    });

    res.status(200).json({ message: 'Детали вакансии сохранены успешно.', data: newEvent });
  } catch (error) {
    console.error('Ошибка при сохранении деталей вакансии:', error);
    res.status(500).json({ error: 'Ошибка при обработке вашего запроса', details: error.errors });
  }
});




router.get('/get-events', async (req, res) => {
  try {
    const data = await VacancyMainEvent.findAll({ order: [['order', 'ASC']] });
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

router.get('/getimage/:imageName', (req, res) => {
  const {
    imageName
  } = req.params;
  const imagePath = path.join(eventImagesPath, imageName);

  res.set('Cache-Control', 'public, max-age=432000'); // 432000 секунд = 5 дней

  res.sendFile(imagePath);
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



router.delete('/delete-event/:id', async (req, res) => {
  const { id } = req.params;

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
       const otherEventsWithImage = await VacancyMainEvent.findOne({
        where: { files: event.files, id: { [Op.ne]: id } } 
      });

      if (!otherEventsWithImage && event.files) {
        const imagePath = path.join(eventImagesPath, event.files);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(`Ошибка при удалении изображения ${event.files}:`, err);
          }
        });
      }

      res.json({ message: "Мероприятие удалено", id });
    } else {
      res.status(500).json({ error: "Ошибка при удалении мероприятия." });
    }
  } catch (error) {
    res.status(500).json({ error: "Ошибка при удалении мероприятия." });
  }
});

module.exports = router;



