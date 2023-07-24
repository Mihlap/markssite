const express = require('express');
const { ProjectMain } = require('../db/models');

const router = express.Router();

// POST-запрос по маршруту '/search-publication-one'
router.post('/search-project', async (req, res) => {
  try {
    const publicationData = req.body;
    console.log(publicationData);

    // Здесь вместо `publication: publicationData` вы можете использовать просто `publicationData`
    const newPublication = await ProjectMain.create(publicationData);

    res.status(201).json(newPublication);
  } catch (error) {
    console.error('Ошибка при сохранении в базе данных:', error);
    res.status(500).json({ error: 'Ошибка при сохранении в базе данных' });
  }
});

router.get('/search-project/getzapros', async (req, res) => {
  try {
    const data = await ProjectMain.findAll();
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
