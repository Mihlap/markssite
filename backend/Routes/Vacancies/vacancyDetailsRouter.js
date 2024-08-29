const express = require('express');
const { VacancyMainSlideCard } = require('../../db/models');

const router = express.Router();

router.post('/save-vacancy-details', async (req, res) => {
 let details;
  try {
    details = JSON.parse(req.body.details);
  } catch (error) {
    return res.status(400).json({ error: 'Некорректные данные: не удалось распарсить JSON' });
  }

  if (!details || !details.card1 || !details.card2 || !details.card3) {
    return res.status(400).json({ error: 'Некорректные данные' });
  }

  const photoAva = details.photoAva || null;

  console.log('photoAva:', photoAva);

  try {
    const cardData = {
      card1: details.card1,
      card2: details.card2,
      card3: details.card3,
    };

    const existingVacancy = await VacancyMainSlideCard.findOne();
    if (existingVacancy) {
       await VacancyMainSlideCard.create({ field1: photoAva, cardData });
    }

    res.status(200).json({ message: 'Детали вакансии сохранены успешно.' });
  } catch (error) {
    console.error('Ошибка при сохранении деталей вакансии:', error);
    res.status(500).json({ error: 'Ошибка при обработке вашего запроса' });
  }
});

router.get('/get-slides', async (req, res) => {
  try {
    const data = await VacancyMainSlideCard.findAll({ order: [['id', 'ASC']] });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Произошла ошибка при получении данных формы.'
    });
  }
});

router.put('/update-slide/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    // Обновите слайд в базе данных
    res.json({ message: "Слайд обновлен", id, data });
  } catch (error) {
    res.status(500).json({ error: "Ошибка при обновлении слайда." });
  }
});


router.patch('/toggle-slide/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const { hidden } = req.body;
  
      const updated = await VacancyMainSlideCard.update({ hidden }, {
        where: { id }
      });
  
      if (updated) {
        res.json({ message: 'Видимость слайда переключена', id, hidden });
      } else {
        res.status(404).json({ error: 'Слайда не найдено' });
      }
    // const { id } = req.params;
    // const slide = await VacancyMainSlideCard.findById(id);
    // slide.hidden = !slide.hidden;
    // await slide.save();
    // res.json({ message: "Видимость слайда переключена", id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при переключении видимости слайда." });
  }
});


router.delete('/delete-slide/:id', async (req, res) => {
  try {
    const { id } = req.params;
     await VacancyMainSlideCard.destroy({ where: { id } });
    res.json({ message: "Слайд удален", id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при удалении слайда." });
  }
});




module.exports = router;
