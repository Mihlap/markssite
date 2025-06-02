// const { ProjectMain } = require('../../db/models');

// async function searchRouter(fastify, options) {

//   // Create a new ProjectMain entry
//   fastify.post('/search-project', async (request, reply) => {
//     try {
//       const publicationData = request.body;
//       const IdProjects = publicationData.project.id;

//       const savedProject = await ProjectMain.create({
//         project: publicationData,
//         IdProject: IdProjects,
//       });

//       return reply
//         .code(200)
//         .send({ message: 'Данные успешно сохранены', projectId: savedProject.id });
//     } catch (error) {
//       console.error('Ошибка при сохранении в базе данных:', error);
//       return reply.code(500).send({ error: 'Ошибка при сохранении в базу данных' });
//     }
//   });

//   // Get all ProjectMain entries
//   fastify.get('/search-project/getzapros', async (request, reply) => {
//     try {
//       const data = await ProjectMain.findAll();
//       return reply.send(data);
//     } catch (error) {
//       console.error('Ошибка при получении данных:', error);
//       return reply.code(500).send({ error: 'Ошибка при получении данных' });
//     }
//   });

//   // Delete ProjectMain by IdProject
//   fastify.delete('/search-project/deletezapros/:IdProject', async (request, reply) => {
//     try {
//       const { IdProject } = request.params;
//       await ProjectMain.destroy({ where: { IdProject } });
//       return reply.code(200).send();
//     } catch (error) {
//       console.error('Ошибка при удалении записи:', error);
//       return reply.code(500).send();
//     }
//   });

//   // Update ordering of ProjectMain entries
//   fastify.put('/search-project-replacement', async (request, reply) => {
//     try {
//       const updatedProjects = request.body;
//       /* eslint-disable no-await-in-loop */
//       for (let i = 0; i < updatedProjects.length; i+=1) {
//         await ProjectMain.update({ order: i }, { where: { id: updatedProjects[i].id } });
//       }
//       /* eslint-enable no-await-in-loop */

//       const data = await ProjectMain.findAll();
//       return reply.send(data);
//     } catch (error) {
//       console.error('Ошибка при обновлении порядка:', error);
//       return reply.code(500).send();
//     }
//   });
// };

// module.exports = searchRouter;

const express = require('express');
const { ProjectMain } = require('../../db/models');

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
    res.status(500).json({ error: 'Ошибка при сохранении в базу данных' });
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

router.put('/search-project-replacement', async (req, res) => {
  try {
    const updatedProjects = req.body;

    // Update the order of each project in the database
    for (let i = 0; i < updatedProjects.length; i++) {
      await ProjectMain.update({ order: i },
        { where: { id: updatedProjects[i].id } }
      );
    }

    // Fetch the updated data from the database and send it back
    const data = await ProjectMain.findAll();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
