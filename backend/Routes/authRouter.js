const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../db/models');
const { logAdminLogin, logAdminLogout } = require('../utils/fileLogger');

const authRouter = express.Router();

function isValidIp(ip) {
  if (!ip || typeof ip !== 'string') return false;
  
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
  
  const trimmed = ip.trim();  

  if (ipv4Regex.test(trimmed)) {
    const parts = trimmed.split('.');
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  }
  
  if (ipv6Regex.test(trimmed) || trimmed === '::1') {
    return true;
  }
  
  return false;
}

function getRealClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(ip => ip.trim()).filter(ip => ip);
    if (ips.length > 0) {
      const firstIp = normalizeIp(ips[0]);
       if (isValidIp(firstIp)) {
        return firstIp;
      }
    }
  }
 
  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    const normalized = normalizeIp(realIp.trim());
    if (isValidIp(normalized)) {
      return normalized;
    }
  }

  const cfIp = req.headers['cf-connecting-ip'];
  if (cfIp) {
    const normalized = normalizeIp(cfIp.trim());
    if (isValidIp(normalized)) {
      return normalized;
    }
  }

  const clientIp = req.headers['x-client-ip'];
  if (clientIp) {
    const normalized = normalizeIp(clientIp.trim());
    if (isValidIp(normalized)) {
      return normalized;
    }
  }

  const trueClientIp = req.headers['true-client-ip'];
  if (trueClientIp) {
    const normalized = normalizeIp(trueClientIp.trim());
    if (isValidIp(normalized)) {
      return normalized;
    }
  }

  const socketIp = req.socket?.remoteAddress || req.connection?.remoteAddress;
  if (socketIp) {
    const normalized = normalizeIp(socketIp);
    return normalized;
  }

  return 'N/A';
}

function normalizeIp(ip) {

  if (!ip) return 'N/A';

  ip = ip.trim();

  if (ip === '::1') {
    return '127.0.0.1';
  }

  if (ip.startsWith('::ffff:')) {
    return ip.replace('::ffff:', '');
  }

  if (ip.startsWith('[') && ip.endsWith(']')) {
    const innerIp = ip.slice(1, -1);
    if (innerIp === '::1') {
      return '127.0.0.1';
    }
    if (innerIp.startsWith('::ffff:')) {
      return innerIp.replace('::ffff:', '');
    }
    return innerIp;
  }

  return ip;
}

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
  
    const ipAddress = getRealClientIp(req);
   
    logAdminLogin({
      userName: foundUser.userName,
      userId: foundUser.id,
      ipAddress,
    });

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
      req.session.destroy(() => { });
      res.clearCookie('user_marks_group');
    }

    return res.status(200).json({ id: userId, ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка при удалении пользователя' });
  }
});

authRouter.get('/logout', (req, res) => { 
  const userData = req.session.user ? {
    userName: req.session.user.name,
    userId: req.session.user.id,
  } : null;

  const ipAddress = getRealClientIp(req);

  if (userData) {
    logAdminLogout({
      userName: userData.userName,
      userId: userData.userId,
      ipAddress,
    });
  }

  req.session.destroy(() => { });
  res.clearCookie('user_marks_group');
  res.sendStatus(200);
});

module.exports = authRouter;
