// async function indexRouter(fastify, options) {
//   fastify.get('/*', async (request, reply) => {
//     fastify.log.info('Route hit');
//     fastify.log.info(request.session.user);
//     return reply.sendFile('index.html');
//   });
// }
// module.exports = indexRouter;

const express = require('express');

const router = express.Router();

router.get('*', (req, res, next) => {
  console.log('Route hit');
  console.log(req.session.user);
  // const initState = { user: req.session.user };
  // res.render('Layout', initState);
});

module.exports = router;