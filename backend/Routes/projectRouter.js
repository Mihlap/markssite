const express = require('express');
// eslint-disable-next-line
const { Project } = require("../db/models");
const { uploadArray, uploadSingle } = require('../middleware/file');
// const path = require('path');
// const fs = require('fs');

const router = express.Router();


router.get('/getzapros', async (req, res) => {
  try {
    const data = await Project.findAll();
    res.json(data);
    console.log( res.json(data));
  } catch (error) {
    console.log(error);
  }
});

router.post('/postzapros', uploadArray, uploadSingle, async (req, res, next) => {
  try {
    const imageProjectResult = req.file ? req.file.filename : null;

    await Project.create({
      title: req.body.title,
      selectCompetencies: req.body.selectCompetencies,
      countryCity: req.body.countryCity,
      monthYear: req.body.monthYear,
      viewConstruction: req.body.viewConstruction,
      style: req.body.radioValue,
      imageTitle: req.files.map((file) => file.filename).join(', '),
      imageProject: imageProjectResult,
    });

    res.status(200).send('Запись успешно сохранена!');
  } catch (error) {
    next(error);
  }
});




module.exports = router;