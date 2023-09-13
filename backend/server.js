const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const indexRouter = require('./routes/indexRouter');
const authRouter = require('./routes/authRouter');
const staffsRouter = require('./routes/staffsRouter');
const projectRouter = require('./routes/Project/projectRouter');
const articleRouter = require('./routes/Articles/articleRouter');
const searchRouter = require('./routes/Project/searchRouter');
const searchArticleLeft = require('./routes/Articles/searchArticleLeftRouter');
const searchArticleRight = require('./routes/Articles/searchArticleRightRouter');
const mailRouter = require('./routes/mailRouter');
const toggleRouter = require('./routes/toggle/toggleRouter');

const app = express();
const PORT = process.env.PORT || 5000;

const sessionConfig = {
  name: 'user_marks_group',
  secret: process.env.SESSION_SECRET ?? 'lox',
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

app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);


app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/images/imageAdd', express.static(path.join(__dirname, 'images/imageAdd')));
app.use('/public/assets', express.static(path.join(__dirname, 'assets')));
app.use(session(sessionConfig));
// app.use(express.static(path.join(__dirname, 'build')));


// Добавьте этот блок кода здесь
app.use((req, res, next) => {
  // console.log('Session: ', req.session);
  next();
});


app.get('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api-stuffs', staffsRouter);
app.use('/api-project', projectRouter);
app.use('/api-article', articleRouter);
app.use('/search', searchRouter);
app.use('/search-article', searchArticleLeft);
app.use('/search-articles', searchArticleRight);
app.use('/api-mail', mailRouter);
app.use('/api/toggle', toggleRouter);

app.listen(PORT, () => {
  console.log(`Старт server --->🔥 ${PORT} 🔥<---`);
});
