const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const staffsRouter = require("./routes/staffsRouter");
const projectRouter = require("./routes/projectRouter");
const authRouter = require("./routes/authRouter");
const indexRouter = require("./routes/indexRouter");



const app = express();
const PORT = process.env.PORT || 5000;


const sessionConfig = {
  name: 'user_marks_group',
  secret: process.env.SESSION_SECRET ?? 'lox',
  resave: true,
  saveUninitialized: false,
  store: new FileStore(),
  cookie: {
    maxAge: 1000 * 60 * 60 * 12,
    httpOnly: true,
    sameSite: 'lax', // 'lax' или 'strict' для HTTP
    secure: false, // false для HTTP
    // sameSite: 'none', // 'none' для HTTPS
    // secure: true, // true для HTTPS
  },
};

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);


app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "images"))); 
app.use(session(sessionConfig));

// Добавьте этот блок кода здесь
app.use((req, res, next) => {
    console.log('Session: ', req.session);
    next();
});

app.use('/api', staffsRouter);
app.use('/api-project', projectRouter);
app.use('/api/auth', authRouter);
app.get('/', indexRouter);


app.listen(PORT, () => {
  console.log(`Старт server --->🔥 ${PORT} 🔥<---`);
});



