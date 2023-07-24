const express = require('express');
const { PublicationOne } = require('../db/models');

const router = express.Router();

// POST-запрос по маршруту '/search-publication-one'
router.post('/search-publication-one', async (req, res) => {
  try {
    const publicationData = req.body;
    console.log(publicationData);

    // Здесь вместо `publication: publicationData` вы можете использовать просто `publicationData`
    const newPublication = await PublicationOne.create(publicationData);

    res.status(201).json(newPublication);
  } catch (error) {
    console.error('Ошибка при сохранении в базе данных:', error);
    res.status(500).json({ error: 'Ошибка при сохранении в базе данных' });
  }
});

module.exports = router;
