const express = require('express');
const { Staff } = require('../db/models');

const router = express.Router();

router.get('/stuffs', async (req, res) => {
  try {
    const data = await Staff.findAll();
    res.set('Cache-Control', 'no-store'); // Отключает кеширование
    res.json(data);
  } catch (error) {
    console.error('Ошибка получения данных сотрудников:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

module.exports = router;

