const express = require('express');
require('dotenv').config();
// const https = require('https');
// const fs = require('fs');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
/* eslint-disable import/no-extraneous-dependencies */
const rateLimit = require('express-rate-limit');

const indexRouter = require('./Routes/indexRouter');
const authRouter = require('./Routes/authRouter');
// const staffsRouter = require('./Routes/staffsRouter');
const newStaffsRouter = require('./Routes/newStaffsRouter');
const projectRouter = require('./Routes/Project/projectRouter');
const articleRouter = require('./Routes/Articles/articleRouter');
const searchRouter = require('./Routes/Project/searchRouter');
const searchArticleLeft = require('./Routes/Articles/searchArticleLeftRouter');
const searchArticleRight = require('./Routes/Articles/searchArticleRightRouter');
const mailRouter = require('./Routes/mailRouter');
const toggleRouter = require('./Routes/toggle/toggleRouter');
const videoRouter = require('./Routes/videoRouter');
const vacancyRouter = require('./Routes/Vacancies/vacancyRouter');
const searchVacanciesRouter = require('./Routes/Vacancies/searchVacanciesRouter');
const vacancyDetailsRouter = require('./Routes/Vacancies/vacancyDetailsRouter');
const vacancyEventRouter = require('./Routes/Vacancies/vacancyEventRouter');
const journalRouter = require('./Routes/Journal/journalRouter');

// const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 5000;

const sessionConfig = {
  name: 'user_marks_group',
  secret: process.env.SESSION_SECRET ?? 'dunno',
  resave: true,
  saveUninitialized: false,
  store: new FileStore(),
  cookie: {
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 дней в миллисекундах
    httpOnly: true,
    sameSite: 'lax', // 'lax' или 'strict' для HTTP
    secure: false, // false для HTTP
    // sameSite: 'none', // 'none' для HTTPS
    // secure: true, // true для HTTPS
  },
};

app.use(cors({
  origin: [
    'https://www.marksgroup.ru',
    'https://marksgroup.ru',
    'http://localhost:3002',
    'http://localhost:3000',
  ],
  credentials: true,
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Content-Security-Policy', 'default-src \'self\'');
  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5000, // максимум 5000 запросов с одного IP за 15 минут
  message: 'Слишком много запросов с этого IP, попробуйте позже',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

const imagesPath = path.join(__dirname, 'images');
const videoPath = path.join(__dirname, 'images/video');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(imagesPath, { maxAge: '5d' }));
app.use('/videos', express.static(videoPath, { maxAge: '5d', immutable: true, }));
app.use('/public/assets', express.static(path.join(__dirname, 'assets'), { maxAge: '5d' }));
app.use(session(sessionConfig));
app.use(express.static(path.join(__dirname, 'build')));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.get('/', indexRouter);
app.use('/api/auth', authRouter);
// app.use('/api-stuffs', staffsRouter);
app.use('/api-stuffs', newStaffsRouter);
app.use('/api-project', projectRouter);
app.use('/api-article', articleRouter);
app.use('/search', searchRouter);
app.use('/search', searchVacanciesRouter);
app.use('/search-article', searchArticleLeft);
app.use('/search-articles', searchArticleRight);
app.use('/api-mail', mailRouter);
app.use('/api/toggle', toggleRouter);
app.use('/api/video', videoRouter);
app.use('/api-vacancy', vacancyRouter);
app.use('/api-vacancyDetails', vacancyDetailsRouter);
app.use('/api-events', vacancyEventRouter);
app.use('/api-journal', journalRouter);
app.use('/api-upload', journalRouter);

// const sslKeyPath = '/SSL Marksgroup/certificate.key';
// const sslCertPath = '/SSL Marksgroup/certificate.crt';

// const credentials = {
//   key: fs.readFileSync(sslKeyPath),
//   cert: fs.readFileSync(sslCertPath),
// };

// const httpServer = http.createServer(app);
// const httpsServer = https.createServer(credentials, app);

// app.listen(PORT, () => {
//   console.log(`HTTP server started on port ${PORT}`);
// });

// httpsServer.listen(PORT, () => {
//   console.log(`HTTP server started on port ${PORT}`);
// });

app.listen(PORT, () => {
  console.log(`Старт server --->🔥 ${PORT} 🔥<---`);
});
