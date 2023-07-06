const express = require('express');
const { Staff } = require('../db/models');

const router = express.Router();

router.get('/staffs', async (req, res) => {
  try {
    const staff = await Staff.findAll();
     res.json({data: staff});
  
  } catch (error) {
    console.error('Ошибка получения данных сотрудников:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});


router.get('/staffs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const staff = await Staff.findByPk(id);
    if (staff) {
      res.json(staff);
      console.log(staff, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    } else {
      res.status(404).json({ message: 'Staff not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

