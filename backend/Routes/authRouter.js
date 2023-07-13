const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../db/models');

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
  const { userName, password } = req.body;

  const hashpass = await bcrypt.hash(password, 10);

  const [currentUser, created] = await User.findOrCreate({
    where: {
      userName,
    },
    defaults: {
      userName,
      hashpass,
    },
  });

  const sessionData = {
    name: currentUser.userName,
    id: currentUser.id,
  };

  req.session.user = sessionData; // Используйте ту же переменную сессии, которую вы пытаетесь получить позже

  if (!created) {
    return res.status(401).json({
      message: 'этот name уже используется!',
    });
  }

  req.session.save((err) => {
    // Сохраните сессию после добавления данных пользователя
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Ошибка при сохранении сессии' });
    } else {
      res.status(200).json(req.session.user);
    }
  });
});

module.exports = authRouter;
