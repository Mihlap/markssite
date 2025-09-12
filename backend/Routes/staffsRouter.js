const express = require('express');
const { sequelize, Staff } = require('../db/models');
const { Op } = require('sequelize');
const router = express.Router();

// router.get('/stuffs', async (req, res) => {
//   try {
//     const data = await Staff.findAll();

//     res.json(data);
//   } catch (error) {
//     console.error('Ошибка получения данных сотрудников:', error);
//     res.status(500).json({ error: 'Внутренняя ошибка сервера' });
//   }
// });

router.get('/stuffs', async (req, res) => {
  try {
    const { category, includeHidden } = req.query;

    const where = {};
    const showHidden = String(includeHidden).toLowerCase() === 'true';
    if (!showHidden) where.isVisible = true;

    if (category) {
      where.category = { [Op.contains]: [category] };
    }

    const rows = await Staff.findAll({
      where,
      order: [
        ['sortIndex', 'ASC'],
        ['createdAt', 'ASC'],
      ],
    });

    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка получения списка сотрудников' });
  }
});

router.post('/stuffs', async (req, res) => {
  try {
    const payload = req.body;
    if (payload.category && !Array.isArray(payload.category)) {
      payload.category = [payload.category];
    }
    const row = await Staff.create(payload);
    res.status(201).json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка создания карточки' });
  }
});

router.put('/stuffs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    if (payload.category && !Array.isArray(payload.category)) {
      payload.category = [payload.category];
    }
    const [cnt] = await Staff.update(payload, { where: { id } });
    if (!cnt) return res.status(404).json({ error: 'Карточка не найдена' });
    const row = await Staff.findByPk(id);
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка обновления карточки' });
  }
});

router.patch('/stuffs/:id/visibility', async (req, res) => {
  try {
    const { id } = req.params;
    const { isVisible } = req.body;
    const [cnt] = await Staff.update({ isVisible: !!isVisible }, { where: { id } });
    if (!cnt) return res.status(404).json({ error: 'Карточка не найдена' });
    res.json({ id, isVisible: !!isVisible });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка смены видимости' });
  }
});

router.patch('/stuffs/reorder', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items } = req.body;
    for (const it of items) {
      await Staff.update({ sortIndex: it.sortIndex }, { where: { id: it.id }, transaction: t });
    }
    await t.commit();
    res.json({ ok: true });
  } catch (e) {
    await t.rollback();
    console.error(e);
    res.status(500).json({ error: 'Ошибка смены порядка' });
  }
});

router.post('/stuffs/:id/copy', async (req, res) => {
  try {
    const src = await Staff.findByPk(req.params.id);
    if (!src) return res.status(404).json({ error: 'Карточка не найдена' });
    const data = src.toJSON();
    delete data.id;
    data.sortIndex = (data.sortIndex ?? 0) + 1;
    const copy = await Staff.create(data);
    res.status(201).json({ copiedId: copy.id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка копирования' });
  }
});

router.delete('/stuffs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cnt = await Staff.destroy({ where: { id } });
    if (!cnt) return res.status(404).json({ error: 'Карточка не найдена' });
    res.json({ id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка удаления' });
  }
});

module.exports = router;
