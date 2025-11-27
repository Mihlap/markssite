const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
  console.log('Route hit', req.method, req.url);
  console.log(req.session.user);
  next();
});

module.exports = router;
