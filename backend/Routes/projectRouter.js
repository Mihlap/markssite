const express = require('express');
// eslint-disable-next-line
const { Project } = require("../db/models/project");
const fileMiddleware = require('../middleware/file');
// const path = require('path');
// const fs = require('fs');

const router = express.Router();


router.get('/getzapros', async (req, res) => {
  try {
    const data = await Project.findAll();
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.post('/postzapros', fileMiddleware.array('dropPhoto', 4), async (req, res) => {
  try {
    await Project.create({
      title: req.body.title,
      selectCompetencies: req.body.selectCompetencies,
      countryCity: req.body.countryCity,
    //   image: req.files.map((file) => file.originalname).join(', '), // Объединяем имена фотографий через запятую
      // video: req.files.find((file) => file.fieldname === "dropVideo").filename,
    });

    res.status(200).json({ message: 'Данные успешно сохранены' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Произошла ошибка при сохранении данных' });
  }
});


module.exports = router;