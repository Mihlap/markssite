const express = require('express');
const { ProjectMain } = require('../../db/models');
const { logResourceActionFromSession } = require('../../utils/fileLogger');

const router = express.Router();

router.post('/search-project', async (req, res) => {
  try {
    const publicationData = req.body.project;
    const IdProjects = publicationData.id;
    const saved = await ProjectMain.create({
      project: publicationData,
      IdProject: IdProjects,
    });

    logResourceActionFromSession(req, {
      action: 'CREATE',
      resourceType: 'project_main',
      resourceId: IdProjects?.toString(),
      resourceName: publicationData?.title || 'Проект (главная)',
    });

    res.status(200).json({ message: 'OK', projectId: saved.id });
  } catch (err) {
    console.error('Ошибка при создании проекта:', err);
    res.status(500).json({ error: 'Ошибка при сохранении данных' });
  }
});

router.get('/search-project/getzapros', async (req, res) => {
  try {
    const data = await ProjectMain.findAll({ order: [['order', 'ASC']] });
    res.json(data);
  } catch (err) {
    console.error('Ошибка при получении проектов:', err);
    res.sendStatus(500);
  }
});

router.delete('/search-project/deletezapros/:IdProject', async (req, res) => {
  try {
    const { IdProject } = req.params;
    await ProjectMain.destroy({ where: { IdProject } });

    logResourceActionFromSession(req, {
      action: 'DELETE',
      resourceType: 'project_main',
      resourceId: IdProject,
      resourceName: 'Проект (главная)',
    });

    res.sendStatus(200);
  } catch (err) {
    console.error('Ошибка при удалении проекта:', err);
    res.sendStatus(500);
  }
});

router.put('/search-project-replacement', async (req, res) => {
  try {
    const incoming = Array.isArray(req.body)
      ? req.body
      : Array.isArray(req.body.updatedProjects)
      ? req.body.updatedProjects
      : [];

    const list = incoming.filter((item) => item && item.IdProject != null);

    for (let i = 0; i < list.length; i++) {
      const pk = list[i].IdProject;
      await ProjectMain.update({ order: i }, { where: { IdProject: pk } });
    }

    logResourceActionFromSession(req, {
      action: 'UPDATE',
      resourceType: 'project_main',
      resourceName: 'Порядок проектов на главной',
      hasChanges: true,
    });

    const updatedData = await ProjectMain.findAll({ order: [['order', 'ASC']] });
    res.json(updatedData);
  } catch (err) {
    console.error('Ошибка при обновлении порядка проектов:', err);
    res.sendStatus(500);
  }
});

module.exports = router;
