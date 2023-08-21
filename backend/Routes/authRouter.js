const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../db/models');

const authRouter = express.Router();

authRouter.post('/signup', async(req, res) => {
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
  // вот тут вы вкладываем в сессию данные пользователя и его id из объекта sessionData

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

authRouter.post('/login', async(req, res) => {
    const { userName, password } = req.body; 

    const foundUser = await User.findOne({ where: { userName } });

    if (!foundUser) return res.status(401).json({ message: 'пользователь не найден' })
    
    if (await bcrypt.compare(password, foundUser.hashpass)) {

        const sessionData = {
          name: foundUser.userName,
          id: foundUser.id,
        };

        req.session.user = sessionData; 

        return res.sendStatus(200);
    }

    return res.status(401).json({ message: 'неправильный name пользователя или пароль' });
})

authRouter.get('/user', (req, res) => {
  if (req.session.user) {
    res.status(200).json(req.session.user);
  } else {
    res.status(401).json({ message: 'Пользователь не авторизован' });
  }
});


authRouter.get('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('user_marks_group');
    res.sendStatus(200);
});

module.exports = authRouter;
