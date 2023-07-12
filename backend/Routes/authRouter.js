const express = require('express');
const { User } = require('../db/models');
const bcrypt = require('bcrypt');

const authRouter = express.Router();


authRouter.post('/signup', async (req, res) => {
    const { userName, password } = req.body

    const hashpass = await bcrypt.hash(password, 10);

   const [foundUser,created] = await User.findOrCreate({
      where: {
        userName,
        },
        defaults: {
            userName,
            hashpass
        },
   });
    
    if (!created) return res.status(401).json({
        message: "этот name уже используется!"
    })

    req.session.user = foundUser;

    res.sendStatus(200);
});


module.exports = authRouter;