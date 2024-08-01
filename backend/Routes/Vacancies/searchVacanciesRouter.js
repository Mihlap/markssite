const express = require('express');
const { VacanciesMain } = require('../../db/models');

const router = express.Router();

// POST-запрос по маршруту
router.post('/search-vacancy', async (req, res) => {
  const { vacancy, IdVacancy } = req.body;
  try {
    const existingEntry = await VacanciesMain.findOne({ where: { IdVacancy } });
    if (existingEntry) {
      // Обновляем существующую запись
      await existingEntry.update({ vacancy });
    } else {
      // Создаем новую запись
      await VacanciesMain.create({ vacancy, IdVacancy });
    }
    res.status(200).json({ message: 'Вакансия сохранена/обновлена успешно.' });
  } catch (error) {
    console.error('Ошибка при сохранении вакансии:', error);
    res.status(500).json({ error: 'Ошибка при обработке вашего запроса' });
  }
});

router.get('/search-vacancy/getzapros', async (req, res) => {
  try {
    const data = await VacanciesMain.findAll();
    
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});


router.delete('/search-vacancy/deletezapros/:IdVacancy', async (req, res) => {
  try {
    const { IdVacancy } = req.params;
    await VacanciesMain.destroy({ where: { IdVacancy } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


router.put('/search-vacancy-replacement', async (req, res) => {
  try {
    const updatedVacancies = req.body;

    // Update the order of each project in the database
    for (let i = 0; i < updatedVacancies.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await VacanciesMain.update({ order: i },
        { where: { id: updatedVacancies[i].id } }
      );
    }

    // Fetch the updated data from the database and send it back
    const data = await VacanciesMain.findAll();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
