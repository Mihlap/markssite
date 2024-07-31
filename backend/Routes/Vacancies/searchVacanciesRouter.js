const express = require('express');
const { VacanciesMain } = require('../../db/models');

const router = express.Router();

// POST-запрос по маршруту '/search-publication-one'
router.post('/search-vacancy', async (req, res) => {
  try {
    const publicationData = req.body;
    const IdVacancies = req.body.vacancy.id;

    // Save the project data to the database
    const savedVacancy = await VacanciesMain.create({
      vacancy: publicationData,
      IdVacancy: IdVacancies,
    });

    // Send back the ID of the saved project
    res.status(200).json({ message: 'Данные успешно сохранены', vacancyId: savedVacancy.id });
  } catch (error) {
    console.error('Ошибка при сохранении в базе данных:', error);
    res.status(500).json({ error: 'Ошибка при сохранении в базу данных' });
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
