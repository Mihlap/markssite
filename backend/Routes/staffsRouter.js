// const { Staff } = require('../db/models');

// async function staffsRouter(fastify, options) {
//   fastify.get('/stuffs', async (request, reply) => {
//     try {
//       const data = await Staff.findAll();
//       return reply.send(data);
//     } catch (error) {
//       request.log.error('Ошибка получения данных сотрудников:', error);
//       return reply.code(500).send({ error: 'Внутренняя ошибка сервера' });
//     }
//   });
// }

// module.exports = staffsRouter;

const express = require('express');
const { Staff } = require('../db/models');

const router = express.Router();

router.get('/stuffs', async (req, res) => {
  try {
    const data = await Staff.findAll();

    res.json(data);
  } catch (error) {
    console.error('Ошибка получения данных сотрудников:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

module.exports = router;
