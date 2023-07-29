const express = require('express');
const { ProjectMain } = require('../db/models');

const router = express.Router();

// POST-запрос по маршруту '/search-publication-one'
router.post('/search-project', async (req, res) => {
  try {
    const publicationData = req.body;
    const IdProjects = req.body.project.id;

    // Save the project data to the database
    const savedProject = await ProjectMain.create({
      project: publicationData,
      IdProject: IdProjects,
    });

    // Send back the ID of the saved project
    res.status(200).json({ message: 'Данные успешно сохранены', projectId: savedProject.id });
  } catch (error) {
    console.error('Ошибка при сохранении в базе данных:', error);
    res.status(500).json({ error: 'Ошибка при сохранении в базе данных' });
  }
});

router.get('/search-project/getzapros', async (req, res) => {
  try {
    const data = await ProjectMain.findAll();
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.delete('/search-project/deletezapros/:IdProject', async (req, res) => {
  try {
    const { IdProject } = req.params;
    await ProjectMain.destroy({ where: { IdProject } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
