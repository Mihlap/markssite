const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const staffsRouter = require('./Routes/staffsRouter');




const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "images")));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use('/api', staffsRouter);


app.listen(PORT, () => {
  console.log(`Старт 🏎️ 💨 ${PORT}`);
});



