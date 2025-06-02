// const { PublicationTwo } = require('../../db/models');

// async function searchArticleRight(fastify, options) {
//   fastify.post('/right', async (request, reply) => {
//     try {
//       const publicationData = request.body;
//       const IdArticles = publicationData.publication.id;

//       const newPublication = await PublicationTwo.create({
//         publication: publicationData,
//         IdArticle: IdArticles,
//       });

//       return reply.code(200).send(newPublication);
//     } catch (error) {
//       fastify.log.error('Ошибка при записи публикации в правую колонку:', error);
//       return reply.code(500).send({ error: 'Ошибка при сохранении в базу данных' });
//     }
//   });

//   fastify.get('/right-get', async (request, reply) => {
//     try {
//       const data = await PublicationTwo.findAll();
//       return reply.send(data);
//     } catch (error) {
//       fastify.log.error('Ошибка при получении публикаций правой колонки:', error);
//       return reply.code(500).send({ error: 'Ошибка при чтении из базы данных' });
//     }
//   });

//   fastify.delete('/right-delete/:IdArticle', async (request, reply) => {
//     try {
//       const { IdArticle } = request.params;
//       await PublicationTwo.destroy({ where: { IdArticle } });
//       return reply.code(200).send();
//     } catch (error) {
//       fastify.log.error('Ошибка при удалении публикации правой колонки:', error);
//       return reply.code(500).send({ error: 'Ошибка при удалении из базы данных' });
//     }
//   });

//   fastify.put('/right-update', async (request, reply) => {
//     try {
//       const publicationData = request.body;
//       const IdArticles = publicationData.publication.id;

//       await PublicationTwo.update(
//         { publication: publicationData, IdArticle: IdArticles },
//         { where: {} },
//       );

//       return reply.code(200).send();
//     } catch (error) {
//       fastify.log.error('Ошибка при обновлении публикации правой колонки:', error);
//       return reply.code(500).send({ error: 'Ошибка при обновлении данных в базе данных' });
//     }
//   });
// }

// module.exports = searchArticleRight;

const express = require('express');
const { PublicationTwo } = require('../../db/models');

const router = express.Router();

router.post('/right', async (req, res) => {
  try {
    const publicationData = req.body;
    const IdArticles = req.body.publication.id;

    const newPublication = await PublicationTwo.create({
      publication: publicationData,
      IdArticle: IdArticles,
    });

    res.status(200).json(newPublication);
  } catch (error) {
    console.log('Ошибка при попытке записать публикацию в левую колонку', error);
    res.status(500).json({ error: 'Ошибка при сохранении в базу данных' });
  }
});

router.get('/right-get', async (req, res) => {
  try {
      const data = await PublicationTwo.findAll();
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.delete('/right-delete/:IdArticle', async (req, res) => {
  try {
    const { IdArticle } = req.params;
    await PublicationTwo.destroy({ where: { IdArticle } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// ручка замены публиации  👇
router.put('/right-update', async (req, res) => {
  try {
    const publicationData = req.body;
    const IdArticles = req.body.publication.id;

    await PublicationTwo.update(
      {
        publication: publicationData,
        IdArticle: IdArticles,
      },
      { where: {} },
    );

    res.sendStatus(200);
  } catch (error) {
    console.log('Ошибка при попытке обновить публикацию в левой колонке', error);
    res.status(500).json({ error: 'Ошибка при обновлении данных в базе данных' });
  }
});

module.exports = router;
