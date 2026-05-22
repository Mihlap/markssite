const express = require('express');
const { PublicationTwo } = require('../../db/models');
const { logResourceActionFromSession } = require('../../utils/fileLogger');

const router = express.Router();

router.post('/right', async (req, res) => {
  try {
    const publicationData = req.body;
    const IdArticles = req.body.publication.id;

    const newPublication = await PublicationTwo.create({
      publication: publicationData,
      IdArticle: IdArticles,
    });

    logResourceActionFromSession(req, {
      action: 'CREATE',
      resourceType: 'article_publication_right',
      resourceId: IdArticles?.toString(),
      resourceName: publicationData?.publication?.title || 'Публикация (правая колонка)',
    });

    res.status(200).json(newPublication);
  } catch (error) {
    console.log('Ошибка при попытке записать публикацию в правую колонку', error);
    res.status(500).json({ error: 'Ошибка при сохранении в базу данных' });
  }
});

router.get('/right-get', async (req, res) => {
  try {
    const data = await PublicationTwo.findAll();
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.delete('/right-delete/:IdArticle', async (req, res) => {
  try {
    const { IdArticle } = req.params;
    await PublicationTwo.destroy({ where: { IdArticle } });

    logResourceActionFromSession(req, {
      action: 'DELETE',
      resourceType: 'article_publication_right',
      resourceId: IdArticle,
      resourceName: 'Публикация (правая колонка)',
    });

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.put('/right-update', async (req, res) => {
  try {
    const publicationData = req.body;
    const IdArticles = req.body.publication.id;

    await PublicationTwo.update(
      {
        publication: publicationData,
        IdArticle: IdArticles,
      },
      { where: {} },
    );

    logResourceActionFromSession(req, {
      action: 'UPDATE',
      resourceType: 'article_publication_right',
      resourceId: IdArticles?.toString(),
      resourceName: publicationData?.publication?.title || 'Публикация (правая колонка)',
      hasChanges: true,
    });

    res.sendStatus(200);
  } catch (error) {
    console.log('Ошибка при попытке обновить публикацию в правой колонке', error);
    res.status(500).json({ error: 'Ошибка при обновлении данных в базе данных' });
  }
});

module.exports = router;
