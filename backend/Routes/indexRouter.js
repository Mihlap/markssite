const express = require('express');

const router = express.Router();

router.get('*', (req, res, next) => {
  console.log('Route hit');
  console.log(req.session.user);
  const initState = { user: req.session.user };
  res.render('Layout', initState);
});



module.exports = router;