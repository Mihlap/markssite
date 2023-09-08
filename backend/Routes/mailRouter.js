const express = require('express');
const nodemailer = require('nodemailer');

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
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 30000,
});


mailRouter.post('/submitForm', async (req, res) => {
  const formData = req.body;
  
  const mailOptions = {
    from: 'mikhail.test.mail@mail.ru', 
    to: 'mikhail.test.mail@mail.ru', 
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

// ______________Подписка______________________

const transporterSubscribe = nodemailer.createTransport({
  pool: true,
  host: 'smtp.mail.ru', 
  port: 587, 
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 30000,
});

// eslint-disable-next-line consistent-return
mailRouter.post("/subscribe", (req, res) => {
  const { email } = req.body;

   const isValidEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email);

  if (!isValidEmail) {
    return res.status(400).json({ message: "Некорректный Email" });
  }

  const mailOptions = {
    from: 'mikhail.test.mail@mail.ru', 
    to: 'mikhail.test.mail@mail.ru', 
    subject: "Подписка на новости",
    text: `Подписка на новости: ${email}`,
  };

  transporterSubscribe.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Ошибка отправки письма:", error);
      return res.status(500).json({ message: "Ошибка отправки письма" });
    } 
      console.log(`Email отправлен: ${info.response}`);
      return res.status(200).json({ message: "Письмо успешно отправлено" });
    
  });
});

module.exports = mailRouter;
