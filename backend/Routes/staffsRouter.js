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


router.get('/staffs/category/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const staff = await Staff.findByPk(id);
    if (staff) {
      res.json(staff);
      // console.log(staff, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    } else {
      res.status(404).json({ message:  'Карточка сотрудника не найдена'  });
    }
  } catch (error) {
    console.error('Ошибка получения карточки сотрудника:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

module.exports = router;

