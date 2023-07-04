const express = require('express');
const Staff = require('../db/models/staff');

const router = express.Router();

router.get('/staffs', async (req, res) => {
  try {
    const staffs = await Staff.findAll();
    // console.log(staffs, "++++++++++++++++++++++++++++++++++++++++++++++++++");
    res.json({ data: staffs });
  } catch (error) {
    console.error('Ошибка получения данных сотрудников:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

module.exports = router;