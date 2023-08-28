const express = require('express');
const nodemailer = require('nodemailer');


const mailRouter = express.Router();

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru', 
  port: 587, 
  secure: false,
  auth: {
    user: 'mikhail.test.mail@mail.ru', 
    pass: '3K12y5sR77PSddNDDe9J', 
  },
});

mailRouter.post('/submitForm', async (req, res) => {
  const formData = req.body;

  const mailOptions = {
    from: 'mikhail.test.mail@mail.ru', 
    to: 'mikhail.test.mail@mail.ru', 
    subject: 'Новая форма от клиента', // Тема письма
    text: `
      Имя: ${formData.name}
      Телефон: ${formData.phone}
      Задача: ${formData.task}
      Согласие на обработку данных: ${formData.consentGiven ? 'Да' : 'Нет'}
    `,
  };

  // console.log(res, '===============');
  try {
    // Отправка письма
    await transporter.sendMail(mailOptions);
    res.status(200).send('Форма успешно отправлена');
  } catch (error) {
    console.error('Ошибка отправки письма:', error);
    res.status(500).send('Ошибка при отправке формы');
  }
});


module.exports = mailRouter;
