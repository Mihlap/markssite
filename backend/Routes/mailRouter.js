// const nodemailer = require('nodemailer');

// module.exports = async function mailRouter (fastify, options) {
//   const defaultTransport = nodemailer.createTransport({
//     pool: true,
//     host: 'smtp.mail.ru',
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//     connectionTimeout: 30000,
//   });

//   const subscribeTransport = nodemailer.createTransport({
//     pool: true,
//     host: 'smtp.mail.ru',
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//     connectionTimeout: 30000,
//   });

//   const portalTransport = nodemailer.createTransport({
//     pool: true,
//     host: 'smtp.mail.ru',
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.EMAIL_PORTAL_USER,
//       pass: process.env.EMAIL_PORTAL_PASS,
//     },
//     connectionTimeout: 500,
//   });

//   fastify.post('/submitFooterForm', async (request, reply) => {
//     const { text, name, tel } = request.body;
//     try {
//       await defaultTransport.sendMail({
//         from: process.env.EMAIL_USER,
//         to: process.env.EMAIL_USER,
//         subject: 'Новый запрос',
//         text: `Задача: ${text}\nИмя: ${name}\nТелефон: ${tel}`,
//       });
//       return reply.code(200).send('Форма успешно отправлена');
//     } catch (err) {
//       request.log.error('Ошибка отправки письма (footer):', err);
//       return reply.code(500).send('Ошибка при отправке формы');
//     }
//   });

//   fastify.post('/submitForm', async (request, reply) => {
//     const { name, phone, task, consentGiven } = request.body;
//     try {
//       await defaultTransport.sendMail({
//         from: process.env.EMAIL_USER,
//         to: process.env.EMAIL_USER,
//         subject: 'Новая форма от клиента',
//         text: `Имя: ${name}\nТелефон: ${phone}\nЗадача: ${task}\nСогласие: ${
//           consentGiven ? 'Да' : 'Нет'
//         }`,
//       });
//       return reply.code(200).send('Форма успешно отправлена');
//     } catch (err) {
//       request.log.error('Ошибка отправки письма (form):', err);
//       return reply.code(500).send('Ошибка при отправке формы');
//     }
//   });

//   fastify.post('/subscribe', async (request, reply) => {
//     const { email } = request.body;
//     const isValid = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email);
//     if (!isValid) {
//       return reply.code(400).send({ message: 'Некорректный Email' });
//     }
//     try {
//       await subscribeTransport.sendMail({
//         from: process.env.EMAIL_USER,
//         to: process.env.EMAIL_USER,
//         subject: 'Подписка на новости',
//         text: `Подписка на новости: ${email}`,
//       });
//       return reply.code(200).send({ message: 'Письмо успешно отправлено' });
//     } catch (err) {
//       request.log.error('Ошибка отправки подписки:', err);
//       return reply.code(500).send({ message: 'Ошибка отправки письма' });
//     }
//   });

//   fastify.post('/portalSubmitForm', async (request, reply) => {
//     const {
//       name = '',
//       phone = '',
//       city = '',
//       choose = '',
//       letter = '',
//       resume = '',
//       title = '',
//       resumeFiles = [],
//     } = request.body;

//     const files = Array.isArray(resumeFiles) ? resumeFiles : [resumeFiles];
  
//     const attachments = await Promise.all(
//       files
//         .filter(
//           (f) =>
//             f &&
//             (f.mimetype.startsWith('image/') ||
//               f.mimetype === 'application/pdf' ||
//               f.mimetype.startsWith('application/')),
//         )
//         .map(async (f) => ({
//           filename: f.filename || 'file',
//           content: await f.toBuffer(),
//           contentType: f.mimetype,
//         })),
//     );

//     const text = [
//       `Имя: ${name}`,
//       `Телефон: ${phone}`,
//       city && `Город: ${city}`,
//       choose && `Направление: ${choose}`,
//       `Сопроводительное письмо: ${letter}`,
//       `Ссылка на резюме/портфолио: ${resume}`,
//     ]
//       .filter(Boolean)
//       .join('\n');

//     try {
//       await portalTransport.sendMail({
//         from: process.env.EMAIL_PORTAL_USER,
//         to: process.env.EMAIL_PORTAL_USER,
//         subject: title ? `Заявка на вакансию: ${title}` : 'Заявка на вакансию',
//         text,
//         attachments,
//       });
//       return reply.code(200).send({ message: 'Письмо успешно отправлено' });
//     } catch (err) {
//       request.log.error('Ошибка отправки portal формы:', err);
//       return reply.code(500).send({ message: 'Ошибка отправки письма' });
//     }
//   });
// };

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

// ______________Подписка______________________

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

// ______________HR portal______________________

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

module.exports = mailRouter;
