const express = require('express');
require('dotenv').config();
const fs = require('fs');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const rateLimit = require('express-rate-limit');

const authRouter = require('./Routes/authRouter');
const newStaffsRouter = require('./Routes/newStaffsRouter');
const legendRouter = require('./Routes/legendRouter');
const projectRouter = require('./Routes/Project/projectRouter');
const articleRouter = require('./Routes/Articles/articleRouter');
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

const app = express();
const PORT = Number(process.env.PORT || 3002);

const sessionsPath = path.join(__dirname, 'sessions');
if (!fs.existsSync(sessionsPath)) fs.mkdirSync(sessionsPath, { recursive: true });

app.set('trust proxy', 1);

const isProduction = process.env.NODE_ENV === 'production';
const cookieSecure =
  process.env.COOKIE_SECURE != null ? process.env.COOKIE_SECURE === '1' : isProduction;

const sessionConfig = {
  name: 'user_marks_group',
  secret: process.env.SESSION_SECRET ?? 'dunno',
  resave: false,
  saveUninitialized: false,
  store: new FileStore({
    path: sessionsPath,
    retries: 0,
    logFn: () => {},
  }),
  cookie: {
    maxAge: 10 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    secure: cookieSecure,
  },
};

app.use(
  cors({
    origin: ['https://marksgroup.ru', 'https://www.marksgroup.ru', 'http://localhost:3000'],
    credentials: true,
  }),
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5000,
    message: 'Слишком много запросов с этого IP, попробуйте позже',
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

const imagesPath = path.join(__dirname, 'images');
const videoPath = path.join(__dirname, 'images/video');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/images', express.static(imagesPath, { maxAge: '5d' }));
app.use('/videos', express.static(videoPath, { maxAge: '5d', immutable: true }));
app.use('/public/assets', express.static(path.join(__dirname, 'assets'), { maxAge: '5d' }));

app.use(session(sessionConfig));

app.use('/api/auth', authRouter);
app.use('/api/legend', legendRouter);
app.use('/api-stuffs', newStaffsRouter);
app.use('/api-project', projectRouter);
app.use('/api-article', articleRouter);
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (res.headersSent) return next(err);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Старт server --->🔥 ${PORT} (http) 🔥<---`);
});
