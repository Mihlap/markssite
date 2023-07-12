const express = require('express');

const router = express.Router();

router.get('*', (req, res) => {
    const initState = {user: req.session.user}
    res.render('Layout', initState);
})


module.exports = router;