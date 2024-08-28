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
      await existingVacancy.update({ field1: photoAva, cardData });
    } else {
      await VacancyMainSlideCard.create({ field1: photoAva, cardData });
    }

    res.status(200).json({ message: 'Детали вакансии сохранены успешно.' });
  } catch (error) {
    console.error('Ошибка при сохранении деталей вакансии:', error);
    res.status(500).json({ error: 'Ошибка при обработке вашего запроса' });
  }
});

module.exports = router;
