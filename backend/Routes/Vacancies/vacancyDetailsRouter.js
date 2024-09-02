const express = require('express');
const multerMiddleware = require('../../middleware/file');   
const { VacancyMainSlideCard } = require('../../db/models');

const router = express.Router();

// const projectImagesPath = path.join(__dirname, 'images/projectFoto');

router.put('/update-slide/:id',   multerMiddleware.single('photoAva'), async (req, res) => {
  try {
    const { id } = req.params;
    const { card1, card2, card3 } = req.body;
    const slide = await VacancyMainSlideCard.findByPk(id);

    if (!slide) {
      return res.status(404).json({ message: "Слайд не найден" });
    }

    // const deleteImageEdit = async (imageName) => {
    //   const imagePath = path.join(__dirname, '..', '..', 'images', 'imageAdd', imageName);
    //   try {
    //     await fs.promises.unlink(imagePath);
    //   } catch (error) {
    //     if (error.code === 'ENOENT') {
    //       // console.log(`Файл ${imageName} не найден, возможно, уже удален.`);
    //     } else {
    //       console.error(`Ошибка при удалении изображения ${imageName}:`, error);
    //     }
    //   }
    // };


    const updatedSlide = await slide.update({
      photoAva: req.file ? `/images/slideCard/${req.file.filename}` : slide.photoAva,
      cardData: { card1, card2, card3 }
    });

    res.json({ message: "Слайд успешно обновлен", data: updatedSlide });
  } catch (error) {
    console.error('Ошибка при обновлении слайда:', error);
    res.status(500).json({ error: "Ошибка сервера при обновлении слайда" });
  }
});

router.post('/save-vacancy-details',  multerMiddleware.single('photoAva'), async (req, res) => {
  let details;
  try {
    details = JSON.parse(req.body.details);
  } catch (error) {
    return res.status(400).json({ error: 'Некорректные данные: не удалось распарсить JSON' });
  }

  if (!details || !details.card1 || !details.card2 || !details.card3) {
    return res.status(400).json({ error: 'Некорректные данные: отсутствуют необходимые поля' });
  }

  const photoAva = req.file ? `/images/slideCard/${req.file.filename}` : '';

  const cardData = {
    card1: details.card1,
    card2: details.card2,
    card3: details.card3,
  };

  try {
    // Сохраняем photoAva как строку и cardData как JSON
    const newSlide = await VacancyMainSlideCard.create({
      photoAva,
      cardData,
      hidden: false, // или любое значение по умолчанию
    });

    res.status(200).json({ message: 'Детали вакансии сохранены успешно.', data: newSlide });
  } catch (error) {
    console.error('Ошибка при сохранении деталей вакансии:', error);
    res.status(500).json({ error: 'Ошибка при обработке вашего запроса', details: error.errors });
  }
});


router.get('/get-slides', async (req, res) => {
  try {
    const data = await VacancyMainSlideCard.findAll({ order: [['id', 'ASC']] });
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


// router.put('/update-slide/:id', async (req, res) => {
//   console.log('ID для обновления:', req.params.id);
//   console.log('Данные для обновления:', req.body);

//   try {
//     const { id } = req.params;
//     const data = req.body;

//     const slide = await VacancyMainSlideCard.findByPk(id);
//     if (!slide) {
//       console.log('Слайд не найден:', id);
//       return res.status(404).json({ message: "Слайд не найден" });
//     }

//     // Обновляем данные слайда
//     const updatedSlide = await slide.update(data);
//     console.log('Обновленный слайд:', updatedSlide);

//     res.json({ message: "Слайд успешно обновлен", slide: updatedSlide });
//   } catch (error) {
//     console.error('Ошибка при обновлении слайда:', error);
//     res.status(500).json({ error: "Ошибка сервера при обновлении слайда" });
//   }
// });




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
    console.error('Некорректный идентификатор слайда:', id);
    return res.status(400).json({ error: "Некорректный идентификатор слайда." });
  }

  try {
    const result = await VacancyMainSlideCard.destroy({ where: { id } });
    if (result > 0) {
      res.json({ message: "Слайд удален", id });
    } else {
      console.error('Слайд с таким ID не найден:', id);
      res.status(404).json({ error: "Слайд не найден." });
    }
  } catch (error) {
    console.error('Ошибка при удалении слайда:', error);
    res.status(500).json({ error: "Ошибка при удалении слайда." });
  }
});


module.exports = router;
