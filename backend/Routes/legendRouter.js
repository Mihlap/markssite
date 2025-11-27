const express = require('express');
const router = express.Router();

const { Legend, ConstructorLegend, User } = require('../db/models');

router.get('/', async (req, res, next) => {
  try {
    const legends = await Legend.findAll({
      order: [
        ['order', 'DESC'],       
      ],
    });

    res.json(legends);
  } catch (err) {
    console.error('GET /api/legend error:', err);
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const legend = await Legend.findByPk(req.params.id, {
      include: [
        { model: ConstructorLegend },
        { model: User, as: 'author', attributes: ['id', 'name', 'userName'] },
      ],
    });

    if (!legend) return res.status(404).json({ message: 'Legend not found' });

    res.json(legend);
  } catch (err) { 
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const t = await Legend.sequelize.transaction();
  try {
    const { year, title, img, description, hidden, order, userId, constructor } = req.body;

    const legend = await Legend.create(
      {
        year,
        title,
        img: img || null,
        description: description || null,
        hidden: !!hidden,
        order: order ?? 0,
        userId: userId || null,
      },
      { transaction: t },
    );

    let constructorRow = null;

    if (constructor && (constructor.data || constructor.image)) {
      constructorRow = await ConstructorLegend.create(
        {
          legendId: legend.id,
          data: constructor.data || null,
          image: constructor.image || null,
        },
        { transaction: t },
      );
    }

    await t.commit();

    const fullLegend = await Legend.findByPk(legend.id, {
      include: [
        { model: ConstructorLegend },
        { model: User, as: 'author', attributes: ['id', 'name', 'userName'] },
      ],
    });

    res.status(201).json(fullLegend);
  } catch (err) {
    await t.rollback();
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  const t = await Legend.sequelize.transaction();
  try {
    const id = req.params.id;
    const { year, title, img, description, hidden, order, userId, constructor } = req.body;

    const legend = await Legend.findByPk(id, { transaction: t });
    if (!legend) {
      await t.rollback();
      return res.status(404).json({ message: 'Legend not found' });
    }

    await legend.update(
      {
        year: year ?? legend.year,
        title: title ?? legend.title,
        img: img !== undefined ? img : legend.img,
        description: description !== undefined ? description : legend.description,
        hidden: hidden !== undefined ? hidden : legend.hidden,
        order: order ?? legend.order,
        userId: userId !== undefined ? userId : legend.userId,
      },
      { transaction: t },
    );

    if (constructor) {
      const { data, image } = constructor;

      let constructorRow = await ConstructorLegend.findOne({
        where: { legendId: legend.id },
        transaction: t,
      });

      if (!constructorRow) {
        constructorRow = await ConstructorLegend.create(
          {
            legendId: legend.id,
            data: data || null,
            image: image || null,
          },
          { transaction: t },
        );
      } else {
        await constructorRow.update(
          {
            data: data !== undefined ? data : constructorRow.data,
            image: image !== undefined ? image : constructorRow.image,
          },
          { transaction: t },
        );
      }
    }

    await t.commit();

    const fullLegend = await Legend.findByPk(id, {
      include: [
        { model: ConstructorLegend },
        { model: User, as: 'author', attributes: ['id', 'name', 'userName'] },
      ],
    });

    res.json(fullLegend);
  } catch (err) {
    await t.rollback();
    next(err);
  }
});

router.patch('/:id/hidden', async (req, res, next) => {
  try {
    const { hidden } = req.body;
    const legend = await Legend.findByPk(req.params.id);
    if (!legend) return res.status(404).json({ message: 'Legend not found' });

    await legend.update({ hidden: !!hidden });
    res.json(legend);
  } catch (err) {
    next(err);
  }
});

router.patch('/order/bulk', async (req, res, next) => {
  const t = await Legend.sequelize.transaction();
  try {
    const items = req.body;
    if (!Array.isArray(items)) {
      await t.rollback();
      return res.status(400).json({ message: 'Body must be array of {id, order}' });
    }

    for (const { id, order } of items) {
      if (id == null || order == null) continue;
      await Legend.update({ order }, { where: { id }, transaction: t });
    }

    await t.commit();
    const legends = await Legend.findAll({
      order: [
        ['order', 'ASC'],
        ['year', 'DESC'],
      ],
    });
    res.json(legends);
  } catch (err) {
    await t.rollback();
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  const t = await Legend.sequelize.transaction();
  try {
    const id = req.params.id;

    await ConstructorLegend.destroy({ where: { legendId: id }, transaction: t });
    const deleted = await Legend.destroy({ where: { id }, transaction: t });

    await t.commit();

    if (!deleted) return res.status(404).json({ message: 'Legend not found' });
    res.json({ message: 'Deleted', id });
  } catch (err) {
    await t.rollback();
    next(err);
  }
});

module.exports = router;
