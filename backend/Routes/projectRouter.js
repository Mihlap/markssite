const express = require('express');
// eslint-disable-next-line
const { Project } = require("../db/models");
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


router.post(
  '/postzapros',
  fileMiddleware.fields([
    { name: 'dropPhoto', maxCount: 4 },
    { name: 'photoAva', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log(req.files); // Output file information to the console
      const imageTitles = req.files.dropPhoto.map((file) => file.filename).join(', ');
      const imageProjects = req.files.photoAva ? req.files.photoAva[0].filename : null;

      console.log(imageProjects);
      await Project.create({
        title: req.body.title,
        selectCompetencies: req.body.selectCompetencies,
        countryCity: req.body.countryCity,
        monthYear: req.body.monthYear,
        viewConstruction: req.body.viewConstruction,
        style: req.body.radioValue,
        imageTitle: imageTitles,
        imageProject: imageProjects,
      });

      res.status(200).json({ message: 'Данные успешно сохранены' });
    } catch (error) {
      console.log(error); // Output error to the console
      res.status(500).json({ message: 'Произошла ошибка при сохранении данных' });
    }
  },
);


module.exports = router;