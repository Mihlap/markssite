const express = require('express');
require('dotenv').config();
const https = require('https');
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
const PORT = process.env.PORT || 5000;

const sslKeyPath = '/SSL Marksgroup/certificate.key';
const sslCertPath = '/SSL Marksgroup/certificate.crt';
const useHttps = fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath);

const sessionsPath = path.join(__dirname, 'sessions');
if (!fs.existsSync(sessionsPath)) {
  fs.mkdirSync(sessionsPath, { recursive: true });
}

function resolveClientBuildPath() {
  const candidates = [
    path.join(__dirname, '..', 'frontend', 'build'),
    path.join(__dirname, 'build'),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, 'index.html'))) return dir;
  }
  return candidates[0];
}

const clientBuildPath = resolveClientBuildPath();
const clientIndexHtml = path.join(clientBuildPath, 'index.html');

app.set('trust proxy', 1);

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
    secure: useHttps,
  },
};

app.use(
  cors({
    origin: [
      'https://www.marksgroup.ru',
      'https://marksgroup.ru',
      'http://localhost:3002',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
  }),
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://mc.yandex.ru https://yastatic.net https://api-maps.yandex.ru https://*.maps.yandex.net https://*.api-maps.yandex.ru",
      "style-src 'self' 'unsafe-inline' https://yastatic.net",
      "img-src 'self' data: blob: https:",
      "media-src 'self' blob: https:",
      "font-src 'self' data: https://yastatic.net",
      "connect-src 'self' https: http://localhost:* http://127.0.0.1:*",
      "frame-src 'self' https:",
      "worker-src 'self' blob:",
      "child-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
    ].join('; '),
  );
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

if (!fs.existsSync(clientIndexHtml)) {
  console.error(
    `[static] Нет ${clientIndexHtml}. На сервере: cd ../frontend && npm run build && pm2 restart RUmg`,
  );
} else {
  console.log(`[static] SPA: ${clientBuildPath}`);
}
app.use(express.static(clientBuildPath));

app.get('*', (req, res, next) => {
  const p = req.path || '';
  if (p.startsWith('/api') || p.startsWith('/search')) {
    return next();
  }
  if (!fs.existsSync(clientIndexHtml)) {
    return res
      .status(503)
      .type('text/plain')
      .send(`SPA build missing: ${clientIndexHtml}\nRun: cd frontend && npm run build`);
  }
  return res.sendFile(clientIndexHtml);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (res.headersSent) return next(err);
  res.status(500).send('Something went wrong!');
});

const onListen = () => {
  console.log(`Старт server --->🔥 ${PORT} (${useHttps ? 'https' : 'http'}) 🔥<---`);
};

if (useHttps) {
  https
    .createServer(
      {
        key: fs.readFileSync(sslKeyPath),
        cert: fs.readFileSync(sslCertPath),
      },
      app,
    )
    .listen(PORT, '127.0.0.1', onListen);
} else {
  app.listen(PORT, '127.0.0.1', onListen);
}
