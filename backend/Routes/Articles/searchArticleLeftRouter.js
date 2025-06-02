// const { PublicationOne } = require('../../db/models');

// async function searchArticleLeft(fastify, options) {
//   fastify.post('/left', async (request, reply) => {
//     try {
//       const publicationData = request.body;
//       const IdArticles = publicationData.publication.id;

//       const newPublication = await PublicationOne.create({
//         publication: publicationData,
//         IdArticle: IdArticles,
//       });

//       return reply.code(200).send(newPublication);
//     } catch (error) {
//       fastify.log.error('Ошибка при записи публикации в левую колонку:', error);
//       return reply.code(500).send({ error: 'Ошибка при сохранении в базу данных' });
//     }
//   });

//   fastify.get('/left-get', async (request, reply) => {
//     try {
//       const data = await PublicationOne.findAll();
//       return reply.send(data);
//     } catch (error) {
//       fastify.log.error('Ошибка при получении публикаций:', error);
//       return reply.code(500).send({ error: 'Ошибка при чтении из базы данных' });
//     }
//   });

//   fastify.delete('/left-delete/:IdArticle', async (request, reply) => {
//     try {
//       const { IdArticle } = request.params;
//       await PublicationOne.destroy({ where: { IdArticle } });
//       return reply.code(200).send();
//     } catch (error) {
//       fastify.log.error('Ошибка при удалении публикации:', error);
//       return reply.code(500).send({ error: 'Ошибка при удалении из базы данных' });
//     }
//   });

//   fastify.put('/left-update', async (request, reply) => {
//     try {
//       const publicationData = request.body;
//       const IdArticles = publicationData.publication.id;

//       await PublicationOne.update(
//         {
//           publication: publicationData,
//           IdArticle: IdArticles,
//         },
//         { where: {} },
//       );

//       return reply.code(200).send();
//     } catch (error) {
//       fastify.log.error('Ошибка при обновлении публикации в левой колонке:', error);
//       return reply.code(500).send({ error: 'Ошибка при обновлении данных в базе данных' });
//     }
//   });
// }

// module.exports = searchArticleLeft;

const express = require('express');
const { PublicationOne } = require('../../db/models');

const router = express.Router();

router.post('/left', async (req, res) => {
  try {
    const publicationData = req.body;
    const IdArticles = req.body.publication.id;

    const newPublication = await PublicationOne.create({
      publication: publicationData,
      IdArticle: IdArticles,
    });

    res.status(200).json(newPublication);
  } catch (error) {
    console.log('Ошибка при попытке записать публикацию в левую колонку', error);
    res.status(500).json({ error: 'Ошибка при сохранении в базу данных' });
  }
});

router.get('/left-get', async (req, res) => {
    try {
      const data = await PublicationOne.findAll();
        res.json(data);
    } catch (error) {
        console.log(error);
    }
});

router.delete('/left-delete/:IdArticle', async (req, res) => {
  try {
    const { IdArticle } = req.params;
    await PublicationOne.destroy({ where: { IdArticle } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// ручка замены публиации  👇
router.put('/left-update', async (req, res) => {
  try {
    const publicationData = req.body;
    const IdArticles = req.body.publication.id;

    await PublicationOne.update(
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
