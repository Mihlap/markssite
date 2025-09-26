const express = require('express');
const { sequelize, StaffNew } = require('../db/models');
const { Op } = require('sequelize');
const router = express.Router();

router.get('/stuffs', async (req, res) => {
  try {
    const { category, includeHidden } = req.query;

    const where = {};
    const showHidden = String(includeHidden).toLowerCase() === 'true';
    if (!showHidden) where.isVisible = true;
    if (category) where.category = { [Op.contains]: [category] };

    const rows = await StaffNew.findAll({
      where,
      order: [
        ['sortIndex', 'ASC'],
        ['createdAt', 'ASC'],
      ],
    });

    const out =
      !showHidden && category
        ? rows.filter((r) => {
            const vbc = r.visibilityByCategory || {};       
            return vbc[category] !== false;
          })
        : rows;

    res.json(out);
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
    const row = await StaffNew.create(payload);
    res.status(201).json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка создания карточки' });
  }
});

router.patch('/stuffs/:id/visibility', async (req, res) => {
  try {
    const { id } = req.params;
    const { isVisible, category } = req.body;

    const row = await StaffNew.findByPk(id);
    if (!row) return res.status(404).json({ error: 'Карточка не найдена' });

    if (category) {
      const vbc = { ...(row.visibilityByCategory || {}) };
      vbc[category] = !!isVisible;
      await row.update({ visibilityByCategory: vbc });
      return res.json({ id, category, isVisible: !!isVisible });
    }
 
    await row.update({ isVisible: !!isVisible });
    return res.json({ id, isVisible: !!isVisible });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка смены видимости' });
  }
});

router.put('/stuffs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    if (payload.category && !Array.isArray(payload.category)) {
      payload.category = [payload.category];
    }
    const [cnt] = await StaffNew.update(payload, { where: { id } });
    if (!cnt) return res.status(404).json({ error: 'Карточка не найдена' });
    const row = await StaffNew.findByPk(id);
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка обновления карточки' });
  }
});

router.patch('/stuffs/reorder', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items } = req.body;
    for (const it of items) {
      await StaffNew.update({ sortIndex: it.sortIndex }, { where: { id: it.id }, transaction: t });
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
    const src = await StaffNew.findByPk(req.params.id);
    if (!src) return res.status(404).json({ error: 'Карточка не найдена' });
    const data = src.toJSON();
    delete data.id;
    data.sortIndex = (data.sortIndex ?? 0) + 1;
    const copy = await StaffNew.create(data);
    res.status(201).json({ copiedId: copy.id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка копирования' });
  }
});

router.delete('/stuffs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cnt = await StaffNew.destroy({ where: { id } });
    if (!cnt) return res.status(404).json({ error: 'Карточка не найдена' });
    res.json({ id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка удаления' });
  }
});

module.exports = router;
