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
    return res.status(400).json({ error: 'Некорректные данные: отсутствуют необходимые поля' });
  }

  // Обработка photoAva, чтобы сохранить его как строку
  const photoAva = Array.isArray(details.photoAva) && details.photoAva.length > 0
    ? details.photoAva[0].url || '' // предполагается, что photoAva - это массив объектов с ключом `url`
    : '';

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

router.put('/update-slide/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const slide = await VacancyMainSlideCard.findByPk(id);
    if (slide) {
      await slide.update(data);
      res.json({ message: "Слайд обновлен", id, data: slide });
    } else {
      res.status(404).json({ message: "Слайд не найден" });
    }
  } catch (error) {
    res.status(500).json({ error: "Ошибка при обновлении слайда." });
  }
});


router.patch('/api-vacancyDetails/toggle-slide/:id', async (req, res) => {
  const { id } = req.params;
  const { hidden } = req.body;

  console.log('Попытка изменить видимость слайда:', id, hidden);

  if (!id) {
    return res.status(400).send('ID не передан');
  }

  try {
    const slide = await VacancyMainSlideCard.findByPk(id);
    if (slide) {
      slide.hidden = hidden;
      await slide.save();
      console.log('Слайд обновлен:', slide);
      res.json({ id: slide.id, hidden: slide.hidden });
    } else {
      console.log('Слайд не найден:', id);
      res.status(404).send('Слайд не найден');
    }
  } catch (error) {
    console.error('Ошибка сервера при попытке изменить видимость:', error);
    res.status(500).send('Ошибка сервера');
  }
});



router.delete('/delete-slide/:id', async (req, res) => {
  const id = req.params.id;

  console.log('Получен запрос на удаление слайда с ID:', id);

  if (!id || isNaN(parseInt(id))) { 
    console.error('Некорректный идентификатор слайда:', id);
    return res.status(400).json({ error: "Некорректный идентификатор слайда." });
  }

  try {
    const result = await VacancyMainSlideCard.destroy({ where: { id } });
    if (result > 0) {
      console.log('Слайд с ID удален:', id);
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
