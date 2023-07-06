const express = require('express');
const { Staff } = require('../db/models');

const router = express.Router();

router.get('/staffs', async (req, res) => {
  try {
    const data = await Staff.findAll();
     res.json(data);
  // console.log(data);
  } catch (error) {
    console.error('Ошибка получения данных сотрудников:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

module.exports = router;

