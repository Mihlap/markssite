const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../db/models');

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
  try {
    const { userName, password } = req.body;
    const hashpass = await bcrypt.hash(password, 10);

    const [currentUser, created] = await User.findOrCreate({
      where: { userName },
      defaults: { userName, hashpass },
    });

    if (!created) {
      return res.status(401).json({ message: 'этот name уже используется!' });
    }

    const sessionData = { name: currentUser.userName, id: currentUser.id };
    req.session.user = sessionData;

    req.session.save((err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'Ошибка при сохранении сессии' });
      }
      return res.status(200).json(req.session.user);
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Ошибка регистрации' });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { userName, password } = req.body;

    const foundUser = await User.findOne({ where: { userName } });
    if (!foundUser) return res.status(401).json({ message: 'пользователь не найден' });

    const ok = await bcrypt.compare(password, foundUser.hashpass);
    if (!ok) return res.status(401).json({ message: 'неправильный name пользователя или пароль' });

    const sessionData = { name: foundUser.userName, id: foundUser.id };
    req.session.user = sessionData;

    return res.status(200).json(sessionData);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Ошибка авторизации' });
  }
});

authRouter.get('/user', (req, res) => {
  if (req.session.user) {
    return res.status(200).json(req.session.user);
  }
  return res.status(401).json({ message: 'Пользователь не авторизован' });
});

authRouter.get('/allUsers', async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'userName'] });
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка при получении пользователей' });
  }
});

authRouter.delete('/user/:id', async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: 'Некорректный id' });
    }

    const userToDelete = await User.findByPk(userId);
    if (!userToDelete) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    if (userToDelete.userName === 'Pokemon' || userToDelete.userName === 'obezyankaa') {
      return res.status(403).json({ message: 'Этого пользователя нельзя удалить' });
    }

    await User.destroy({ where: { id: userId } });

    if (req.session.user?.id === userId) {
      req.session.destroy(() => {});
      res.clearCookie('user_marks_group');
    }

    return res.status(200).json({ id: userId, ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка при удалении пользователя' });
  }
});

authRouter.get('/logout', (req, res) => {
  req.session.destroy(() => {});
  res.clearCookie('user_marks_group');
  res.sendStatus(200);
});

module.exports = authRouter;
