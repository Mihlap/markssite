/* eslint-disable no-await-in-loop */
const express = require('express');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const fileMiddleware = require('../../middleware/fileSlideCard');   
const { VacancyMainSlideCard } = require('../../db/models');

const router = express.Router();

const slideCardImagesPath = path.join(__dirname, '../../images/slideCard');

router.put('/update-slide/:id', fileMiddleware.fields([{ name: 'photoAva', maxCount: 1 }]), 
  async (req, res) => {
    const deleteImageIfUnused = async (imageName, currentSlideId) => {
      const imagePath = path.join(slideCardImagesPath, imageName);
      try {
          const otherSlidesWithImage = await VacancyMainSlideCard.findOne({
          where: { photoAva: imageName, id: { [Op.ne]: currentSlideId } },
        });
     
        if (!otherSlidesWithImage) {
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
      const slide = await VacancyMainSlideCard.findByPk(id);

      if (!slide) {
        return res.status(404).json({ message: "Слайд не найден" });
      }

      const oldImage = slide.photoAva;  

       if (req.body.removePhotoAva === 'true' && slide.photoAva) {
        await deleteImageIfUnused(slide.photoAva, id);
        slide.photoAva = '';
      }

        if (req.files && req.files['photoAva']) {     
        slide.photoAva = req.files['photoAva'][0].filename; 
      }

      await slide.update({
        photoAva: slide.photoAva,
        cardData: details,
      });

      if (oldImage && oldImage !== slide.photoAva) {
        await deleteImageIfUnused(oldImage, id);
      }

      res.json({ message: "Слайд успешно обновлен", data: slide });
    } catch (error) {
      console.error('Ошибка при обновлении слайда:', error);
      res.status(500).json({ error: "Ошибка сервера при обновлении слайда" });
    }
  }
);




router.put('/update-slides-order', async (req, res) => {
  const { slides } = req.body;

  if (!Array.isArray(slides)) {
    return res.status(400).json({ error: 'Некорректные данные: ожидался массив слайдов' });
  }

  try {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < slides.length; i++) {
      const { id, order } = slides[i];     

      await VacancyMainSlideCard.update({ order }, { where: { id } });
    }

    const updatedSlides = await VacancyMainSlideCard.findAll({
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
    const newSlide = await VacancyMainSlideCard.create({
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
    const data = await VacancyMainSlideCard.findAll({ order: [['order', 'ASC']] });
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
    const slide = await VacancyMainSlideCard.findByPk(id);
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
  const imagePath = path.join(slideCardImagesPath, imageName);

  res.set('Cache-Control', 'public, max-age=432000'); // 432000 секунд = 5 дней

  res.sendFile(imagePath);
});


router.put('/toggle-slide/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { hidden } = req.body;
   
    const updated = await VacancyMainSlideCard.update({ hidden }, {
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
    const slide = await VacancyMainSlideCard.findByPk(id);

    if (!slide) {
      return res.status(404).json({ error: "Слайд не найден." });
    }

    const result = await VacancyMainSlideCard.destroy({ where: { id } });

    if (result > 0) {
       const otherSlidesWithImage = await VacancyMainSlideCard.findOne({
        where: { photoAva: slide.photoAva, id: { [Op.ne]: id } } 
      });

      if (!otherSlidesWithImage && slide.photoAva) {
        const imagePath = path.join(slideCardImagesPath, slide.photoAva);
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



module.exports = router;
