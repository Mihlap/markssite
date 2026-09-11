const express = require('express');
const nodemailer = require('nodemailer');
const multer = require("multer");

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf" ||
    file.mimetype.startsWith("application/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Недопустимый тип файла"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const dotenv = require('dotenv');

dotenv.config();

const mailRouter = express.Router();

const transporter = nodemailer.createTransport({
  pool: true,
  host: 'smtp.mail.ru',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 30000,
});

mailRouter.post('/submitFooterForm', async (req, res) => {
  const formData = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'Новый запрос',
    text: `
    Задача: ${formData.text}
    Имя: ${formData.name}
    Телефон: ${formData.tel}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Форма успешно отправлена');
  } catch (error) {
    console.error('Ошибка отправки письма:', error);
    res.status(500).send('Ошибка при отправке формы');
  }
});

mailRouter.post('/submitForm', async (req, res) => {
  const formData = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'Новая форма от клиента',
    text: `
    Имя: ${formData.name}
    Телефон: ${formData.phone}
    Задача: ${formData.task}
    Согласие на обработку данных: ${formData.consentGiven ? 'Да' : 'Нет'}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Форма успешно отправлена');
  } catch (error) {
    console.error('Ошибка отправки письма:', error);
    res.status(500).send('Ошибка при отправке формы');
  }
});

const transporterSubscribe = nodemailer.createTransport({
  pool: true,
  host: 'smtp.mail.ru',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 30000,
});

// eslint-disable-next-line consistent-return
mailRouter.post('/subscribe', (req, res) => {
  const { email } = req.body;

  const isValidEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email);

  if (!isValidEmail) {
    return res.status(400).json({ message: 'Некорректный Email' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'Подписка на новости',
    text: `Подписка на новости: ${email}`,
  };

  transporterSubscribe.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Ошибка отправки письма:', error);
      return res.status(500).json({ message: 'Ошибка отправки письма' });
    }
    console.log(`Email отправлен: ${info.response}`);
    return res.status(200).json({ message: 'Письмо успешно отправлено' });
  });
});

const transportPortal = nodemailer.createTransport({
  pool: true,
  host: 'smtp.mail.ru',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_PORTAL_USER,
    pass: process.env.EMAIL_PORTAL_PASS,
  },
  connectionTimeout: 500,
});

// будет удален /portalSubmitForm
mailRouter.post('/portalSubmitForm', upload.array('resumeFiles', 2), (req, res) => {

  const formData = req.body;
  const resumeFiles = req.files;

  const emailBody = `
  Имя: ${formData.name ? formData.name : ''}
  Телефон: ${formData.phone ? formData.phone : ''}
  ${formData.city ? `Город: ${formData.city}` : ''}
  ${formData.choose ? `Выбранное направление: ${formData.choose}` : ''}
  Сопроводительное письмо: ${formData.letter ? formData.letter : ''}
  Ссылка на резюме/портфолио: ${formData.resume ? formData.resume : ''}
`;

  const mailOptions = {
    from: process.env.EMAIL_PORTAL_USER,
    to: process.env.EMAIL_PORTAL_USER,
    subject: formData.title ? `Заявка на вакансию: ${formData.title}` : "Заявка на вакансию",
    text: emailBody,
    attachments: [],
  };

  if (resumeFiles) {
    resumeFiles.forEach((file, index) => {
      mailOptions.attachments.push({
        filename: `${index + 1}.pdf`,
        content: file.buffer,
      });
      delete resumeFiles[index].buffer;
    });
  }

  transportPortal.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Ошибка отправки письма:', error);
      return res.status(500).json({ message: 'Ошибка отправки письма' });
    }
    console.log(`Email отправлен: ${info.response}`);
    return res.status(200).json({ message: 'Письмо успешно отправлено' });
  });
});

mailRouter.post('/portalSubmitForm/v2', upload.array('resumeFiles', 2), async (req, res) => {
  // Быстрый режим для просмотра UI-обработки ошибок: /portalSubmitForm/v2?forceError=true
  if (req.query.forceError === 'true') {
    return res.status(400).json({
      errors: {
        name: 'Имя уже используется',
        city: 'Город не принят сервером',
      },
    });
  }

  const { name = '', phone = '', city = '', choose = '', letter = '', resume = '', title = '' } = req.body;
  const resumeFiles = req.files;

  const errors = {};

  if (!name.trim()) {
    errors.name = 'Имя обязательно';
  } else if (name.trim().length > 50) {
    errors.name = 'Максимум 50 символов';
  }

  const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
  if (!phone.trim()) {
    errors.phone = 'Телефон обязателен';
  } else if (!phoneRegex.test(phone)) {
    errors.phone = 'Некорректный телефон';
  }

  if (city && city.trim().length > 50) {
    errors.city = 'Максимум 50 символов';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const emailBody = `
  Имя: ${name || ''}
  Телефон: ${phone || ''}
  ${city ? `Город: ${city}` : ''}
  ${choose ? `Выбранное направление: ${choose}` : ''}
  Сопроводительное письмо: ${letter || ''}
  Ссылка на резюме/портфолио: ${resume || ''}
`;

  const mailOptions = {
    from: process.env.EMAIL_PORTAL_USER,
    to: process.env.EMAIL_PORTAL_USER,
    subject: title ? `Заявка на вакансию: ${title}` : 'Заявка на вакансию',
    text: emailBody,
    attachments: [],
  };

  if (resumeFiles) {
    resumeFiles.forEach((file, index) => {
      mailOptions.attachments.push({
        filename: file.originalname || `${index + 1}.pdf`,
        content: file.buffer,
      });
      delete resumeFiles[index].buffer;
    });
  }

  try {
    const info = await transportPortal.sendMail(mailOptions);
    console.log(`Email отправлен: ${info.response}`);
    return res.status(200).json({ message: 'Письмо успешно отправлено' });
  } catch (error) {
    console.error('Ошибка отправки письма:', error);
    return res.status(500).json({ message: 'Ошибка отправки письма' });
  }
});

module.exports = mailRouter;
