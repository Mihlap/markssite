const express = require('express');
// eslint-disable-next-line
const { Articles } = require("../db/models");
// const path = require('path');
// const fs = require('fs');

const router = express.Router();


router.get('/getzapros', async (req, res) => {
  try {
    const data = await Articles.findAll();
    res.json(data);
   } catch (error) {
    console.log(error);
  }
});


module.exports = router;