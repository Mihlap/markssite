const express = require('express');
const { PublicationOne } = require('../db/models');

const router = express.Router();

// POST-запрос по маршруту '/search-publication-one'
router.post('/search-publication-one', async (req, res) => {
  try {
    const publicationData = req.body;
    // Здесь publicationData содержит объект с данными, которые вы отправили из редакса
    console.log(publicationData);
    // Создаем запись в базе данных с помощью модели PublicationOne
    const newPublication = await PublicationOne.create({
      publication: publicationData,
    });

    // Отправляем успешный ответ с данными, которые мы только что сохранили в базе данных
    res.status(201).json(newPublication);
  } catch (error) {
    // Если возникла ошибка, отправляем ошибку клиенту
    console.error('Ошибка при сохранении в базе данных:', error);
    res.status(500).json({ error: 'Ошибка при сохранении в базе данных' });
  }
});

module.exports = router;
