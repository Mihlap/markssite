/* eslint-disable no-await-in-loop */
const express = require('express');
const path = require('path');
const fs = require('fs');
const fileMiddleware = require('../../middleware/fileEvent');   
const { VacancyMainEvent } = require('../../db/models');

const router = express.Router();

const eventImagesPath = path.join(__dirname, '../../images/event');

router.put('/update-slide/:id', fileMiddleware.fields([{ name: 'photoAva', maxCount: 1 }]), 
  async (req, res) => {
  // Функция удаления изображения
  const deleteImageEdit = async (imageName) => {
    const imagePath = path.join(eventImagesPath, imageName);
    try {
      await fs.promises.unlink(imagePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Файл уже был удален ранее, это нормально
      } else {
        console.error(`Ошибка при удалении изображения ${imageName}:`, error);
      }
    }
  };

  try {
    const { id } = req.params;
    const details = JSON.parse(req.body.details);
    const slide = await VacancyMainEvent.findByPk(id);

    if (!slide) {
      return res.status(404).json({ message: "Слайд не найден" });
    }

    if (req.files && req.files['photoAva']) {
     
      await deleteImageEdit(slide.photoAva);
      slide.photoAva = req.files['photoAva'][0].filename;
    }

    await slide.update({
        photoAva: slide.photoAva,
        cardData: details,
      });

    res.json({ message: "Слайд успешно обновлен", data: slide });
  } catch (error) {
    console.error('Ошибка при обновлении слайда:', error);
    res.status(500).json({ error: "Ошибка сервера при обновлении слайда" });
  }
});

router.put('/update-slides-order', async (req, res) => {
  const { slides } = req.body;

  if (!Array.isArray(slides)) {
    return res.status(400).json({ error: 'Некорректные данные: ожидался массив слайдов' });
  }

  try {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < slides.length; i++) {
      const { id, order } = slides[i];     

      await VacancyMainEvent.update({ order }, { where: { id } });
    }

    const updatedSlides = await VacancyMainEvent.findAll({
      order: [['order', 'ASC']],
    });

    res.json({ message: 'Порядок слайдов успешно обновлен', slides: updatedSlides });
  } catch (error) {
    console.error('Ошибка при обновлении порядка слайдов:', error);
    res.status(500).json({ error: 'Ошибка сервера при обновлении порядка слайдов' });
  }
});



router.post('/save-vacancy-details',
  fileMiddleware.fields([{
  name: 'photoAva',
  maxCount: 1
    },
  ]), async (req, res) => {
  let details;
  try {
    details = JSON.parse(req.body.details);
  } catch (error) {
    return res.status(400).json({ error: 'Некорректные данные: не удалось распарсить JSON' });
  }

  if (!details || !details.card1 || !details.card2 || !details.card3) {
    return res.status(400).json({ error: 'Некорректные данные: отсутствуют необходимые поля' });
  }

  const photoAva = req.files && req.files['photoAva'] ? req.files['photoAva'][0].filename : '';

  const cardData = {
    card1: details.card1,
    card2: details.card2,
    card3: details.card3,
  };

  try {
    const newSlide = await VacancyMainEvent.create({
      cardData,
      hidden: false,
      photoAva
    });

    res.status(200).json({ message: 'Детали вакансии сохранены успешно.', data: newSlide });
  } catch (error) {
    console.error('Ошибка при сохранении деталей вакансии:', error);
    res.status(500).json({ error: 'Ошибка при обработке вашего запроса', details: error.errors });
  }
});




router.get('/get-slides', async (req, res) => {
  try {
    const data = await VacancyMainEvent.findAll({ order: [['order', 'ASC']] });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Произошла ошибка при получении данных.'
    });
  }
});



router.get('/get-slide/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const slide = await VacancyMainEvent.findByPk(id);
    if (!slide) {
      res.status(404).json({ message: "Слайд не найден" });
    } else {
      res.json(slide);
    }
  } catch (error) {
    console.error("Ошибка сервера при получении данных слайда:", error);
    res.status(500).json({ error: "Ошибка сервера при получении данных слайда" });
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


router.put('/toggle-slide/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { hidden } = req.body;
   
    const updated = await VacancyMainEvent.update({ hidden }, {
      where: { id }
    });

    if (updated) {
      res.json({ message: 'Статус вакансии успешно обновлен', id, hidden });
    } else {
      res.status(404).json({ error: 'Вканансии не найдено' });
    }
  } catch (error) {
    console.error('Ошибка обновления статуса вакансии:', error);
    res.status(500).json({ message: 'Ошибка сервера при обновлении статуса вакансии' });
  }
});



router.delete('/delete-slide/:id', async (req, res) => {
  const id = req.params.id; 

  if (!id || isNaN(parseInt(id))) { 
    return res.status(400).json({ error: "Некорректный идентификатор слайда." });
  }

  try {
    // Сначала находим слайд, чтобы получить информацию об изображении
    const slide = await VacancyMainEvent.findByPk(id);

    if (!slide) {
      return res.status(404).json({ error: "Слайд не найден." });
    }

    // Удаляем слайд из базы данных
    const result = await VacancyMainEvent.destroy({ where: { id } });

    if (result > 0) {
      // Если слайд успешно удален из базы данных, удаляем связанное изображение
      if (slide.photoAva) {
        const imagePath = path.join(eventImagesPath, slide.photoAva);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(`Ошибка при удалении изображения ${slide.photoAva}:`, err);
          }
        });
      }

      res.json({ message: "Слайд удален", id });
    } else {
      res.status(500).json({ error: "Ошибка при удалении слайда." });
    }
  } catch (error) {
    res.status(500).json({ error: "Ошибка при удалении слайда." });
  }
});


module.exports = router;
