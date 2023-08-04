const express = require('express');
const { PublicationOne } = require('../../db/models');

const router = express.Router();

router.post('/left', async (req, res) => {
  try {
    const publicationData = req.body;
    const IdArticles = req.body.publication.id;

    const newPublication = await PublicationOne.create({
      publication: publicationData,
      IdArticle: IdArticles,
    });

    res.status(200).json(newPublication);
  } catch (error) {
    console.log('Ошибка при попытке записать публикацию в левую колонку', error);
    res.status(500).json({ error: 'Ошибка при сохранении в базу данных' });
  }
});


router.get('/left-get', async (req, res) => {
    try {
        const data = await PublicationOne.findAll();
        res.json(data);
    } catch (error) {
        console.log(error);
    }
});

router.delete('/left-delete/:IdArticle', async (req, res) => {
  try {
    const { IdArticle } = req.params;
    await PublicationOne.destroy({ where: { IdArticle } });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.put('/left-update', async (req, res) => {
  try {
    const publicationData = req.body;
    const IdArticles = publicationData.id;
    delete publicationData.id;

    const updatedPublication = await PublicationOne.update(publicationData, {
      where: { IdArticle: IdArticles },
      returning: true,
    });

    res.status(200).json(updatedPublication[1][0]);
  } catch (error) {
    console.log('Error updating the publication:', error);
    res.status(500).json({ error: 'Error updating the publication in the database' });
  }
});



module.exports = router;
