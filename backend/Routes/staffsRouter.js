const express = require('express');
const { Staff } = require('../db/models');

const router = express.Router();

router.get('/stuffs', async (req, res) => {
  try {
    const data = await Staff.findAll();
    res.set('Cache-Control', 'public, max-age=432000'); // 432000 секунд = 5 дней

    res.json(data);
  } catch (error) {
    console.error('Ошибка получения данных сотрудников:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

module.exports = router;
