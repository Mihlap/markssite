const express = require('express');
const { URL } = require('url');
const { sequelize, StaffNew, ConstructorStaffNew } = require('../db/models');
const { Op } = require('sequelize');
const fileMiddleware = require('../middleware/file');
const { uploadFileToS3, deleteFileFromS3 } = require('../s3Utils/s3Service');

const router = express.Router();

const extractFileNameAndFolderFromUrl = (url) => {
  if (!url) return null;
  if (!/^https?:\/\//i.test(url)) {
    const clean = decodeURIComponent(url).replace(/^\/+/, '');
    const parts = clean.split('/').filter(Boolean);
    const fileName = parts.pop();
    const folderRoot = clean.startsWith('images/imageStaff')
      ? 'images/imageStaff'
      : 'images/imageStaff/imagesFolder';
    const rest = parts.join('/');
    const folder = rest || folderRoot;
    return { fileName, folder };
  }
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    if (!parts.length) return null;
    const fileName = decodeURIComponent(parts[parts.length - 1]);
    const folderPath = decodeURIComponent(parts.slice(0, -1).join('/'));
    const folder = folderPath.startsWith('images/imageStaff')
      ? folderPath
      : folderPath || 'images/imageStaff/imagesFolder';
    return { fileName, folder };
  } catch {
    return null;
  }
};

const deleteImageFromS3Safe = async (fileUrlOrKey) => {
  const parsed = extractFileNameAndFolderFromUrl(fileUrlOrKey);
  if (!parsed) return;
  const { fileName, folder } = parsed;
  try {
    await deleteFileFromS3(fileName, folder);
  } catch {}
};

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
      include: [
        {
          model: ConstructorStaffNew,
          as: 'ConstructorStaffNews',
          separate: true,
          order: [['id', 'ASC']],
        },
      ],
    });

    const out =
      !showHidden && category
        ? rows.filter((r) => (r.visibilityByCategory || {})[category] !== false)
        : rows;

    res.json(out);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка получения списка сотрудников' });
  }
});

router.post('/stuffs', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.category && !Array.isArray(payload.category)) payload.category = [payload.category];
    const row = await StaffNew.create(payload);
    const full = await StaffNew.findByPk(row.id, {
      include: [
        {
          model: ConstructorStaffNew,
          as: 'ConstructorStaffNews',
          separate: true,
          order: [['id', 'ASC']],
        },
      ],
    });
    res.status(201).json(full);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка создания карточки' });
  }
});

router.post('/upload', fileMiddleware.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Файл не передан' });
    const key = await uploadFileToS3(req.file, 'images/imageStaff');
    res.json({ filename: key });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Не удалось загрузить файл' });
  }
});

router.post('/stuffs-mp', fileMiddleware.any(), async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const meta = req.body?.meta ? JSON.parse(req.body.meta) : {};
    const category = Array.isArray(meta.category)
      ? meta.category
      : meta.category
      ? [meta.category]
      : [];

    const staff = await StaffNew.create(
      {
        name: String(meta.name || '').trim(),
        position: meta.position || '',
        description: meta.description || '',
        category,
        isVisible: meta.isVisible ?? true,
        sortIndex: meta.sortIndex ?? 0,
        userId: meta.userId ?? null,
        visibilityByCategory: meta.visibilityByCategory || {},
      },
      { transaction: t },
    );

    const photoAvaFile = (req.files || []).find((f) => f.fieldname === 'photoAva');
    if (photoAvaFile) {
      const key = await uploadFileToS3(photoAvaFile, 'images/imageStaff');
      await staff.update({ img: key }, { transaction: t });
    }

    const filesMap = {};
    for (const f of req.files || []) {
      const m = f.fieldname.match(/^dynamic_block_(\d+)_input_(\d+)(\[\])?$/);
      if (!m) continue;
      const b = Number(m[1]);
      const i = Number(m[2]);
      filesMap[b] ??= {};
      filesMap[b][i] ??= [];
      const savedKey = await uploadFileToS3(f, `images/imageStaff/imagesFolder/blocks/${b}_${i}`);
      filesMap[b][i].push(savedKey);
    }

    const dynamicBlocks = Array.isArray(meta.dynamicBlocks) ? meta.dynamicBlocks : [];
    for (let b = 0; b < dynamicBlocks.length; b++) {
      const inputs = dynamicBlocks[b].map((inp, i) => {
        if (filesMap[b]?.[i]?.length) {
          const arr = filesMap[b][i];
          return { ...inp, value: arr.length === 1 ? arr[0] : arr };
        }
        return inp;
      });

      let image = null;
      const firstFileIdx = inputs.findIndex(
        (x) => x.type === 'file' && (typeof x.value === 'string' || Array.isArray(x.value)),
      );
      if (firstFileIdx >= 0) {
        const v = inputs[firstFileIdx].value;
        image = Array.isArray(v) ? v[0] ?? null : v;
      }

      await ConstructorStaffNew.create(
        { staffNewId: staff.id, data: inputs, image },
        { transaction: t },
      );
    }

    await t.commit();

    const full = await StaffNew.findByPk(staff.id, {
      include: [
        {
          model: ConstructorStaffNew,
          as: 'ConstructorStaffNews',
          separate: true,
          order: [['id', 'ASC']],
        },
      ],
    });
    res.status(201).json(full);
  } catch (e) {
    await t.rollback();
    console.error(e);
    res.status(500).json({ error: 'Ошибка создания карточки (multipart)' });
  }
});

router.put('/stuffs-mp/:id', fileMiddleware.any(), async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const staff = await StaffNew.findByPk(id, {
      include: [{ model: ConstructorStaffNew, as: 'ConstructorStaffNews' }],
    });
    if (!staff) return res.status(404).json({ error: 'Карточка не найдена' });

    const meta = req.body?.meta ? JSON.parse(req.body.meta) : {};
    const category = Array.isArray(meta.category)
      ? meta.category
      : meta.category
      ? [meta.category]
      : [];

    const oldAvatar = staff.img || null;
    const oldDynamicImages = (staff.ConstructorStaffNews || []).flatMap((c) => {
      const imgs = [];
      if (c.image) imgs.push(c.image);
      const filesInBlocks = (Array.isArray(c.data) ? c.data : [])
        .flatMap((group) => (Array.isArray(group) ? group : []))
        .filter((inp) => inp?.type === 'file' && Array.isArray(inp.value))
        .flatMap((inp) => inp.value)
        .filter(Boolean);
      return [...imgs, ...filesInBlocks];
    });

    const newPhotoAva = (req.files || []).find((f) => f.fieldname === 'photoAva');
    let newAvatarKey = oldAvatar;
    if (newPhotoAva) newAvatarKey = await uploadFileToS3(newPhotoAva, 'images/imageStaff');

    const filesMap = {};
    for (const f of req.files || []) {
      const m = f.fieldname.match(/^dynamic_block_(\d+)_input_(\d+)(\[\])?$/);
      if (!m) continue;
      const b = Number(m[1]);
      const i = Number(m[2]);
      filesMap[b] ??= {};
      filesMap[b][i] ??= [];
      const savedKey = await uploadFileToS3(f, `images/imageStaff/imagesFolder/blocks/${b}_${i}`);
      filesMap[b][i].push(savedKey);
    }

    const incomingBlocks = Array.isArray(meta.dynamicBlocks) ? meta.dynamicBlocks : [];
    const mergedBlocks = incomingBlocks.map((group, b) =>
      (Array.isArray(group) ? group : []).map((inp, i) => {
        if (filesMap[b]?.[i]?.length) {
          const arr = filesMap[b][i];
          return { ...inp, value: arr.length === 1 ? arr[0] : arr };
        }
        return inp;
      }),
    );

    const actualDynamicFiles = mergedBlocks
      .flatMap((group) => (Array.isArray(group) ? group : []))
      .filter((inp) => inp?.type === 'file' && Array.isArray(inp.value))
      .flatMap((inp) => inp.value)
      .filter(Boolean);

    await staff.update(
      {
        name: String(meta.name || '').trim(),
        position: meta.position || '',
        description: meta.description || '',
        category,
        isVisible: meta.isVisible ?? true,
        sortIndex: meta.sortIndex ?? 0,
        userId: meta.userId ?? null,
        visibilityByCategory: meta.visibilityByCategory || {},
        img: newAvatarKey,
      },
      { transaction: t },
    );

    await ConstructorStaffNew.destroy({ where: { staffNewId: id }, transaction: t });
    for (const group of mergedBlocks) {
      let image = null;
      const firstFileIdx = group.findIndex(
        (x) => x.type === 'file' && (typeof x.value === 'string' || Array.isArray(x.value)),
      );
      if (firstFileIdx >= 0) {
        const v = group[firstFileIdx].value;
        image = Array.isArray(v) ? v[0] ?? null : v;
      }
      await ConstructorStaffNew.create({ staffNewId: id, data: group, image }, { transaction: t });
    }

    await t.commit();

    const oldAll = [
      ...new Set([...(oldDynamicImages || []), ...(oldAvatar ? [oldAvatar] : [])]),
    ].filter(Boolean);
    const newAll = [
      ...new Set([...(actualDynamicFiles || []), ...(newAvatarKey ? [newAvatarKey] : [])]),
    ].filter(Boolean);
    const toDelete = oldAll
      .map((v) => (typeof v === 'string' ? v.trim() : v))
      .filter(Boolean)
      .filter((v) => !newAll.includes(v));
    await Promise.all(toDelete.map(deleteImageFromS3Safe));

    const full = await StaffNew.findByPk(id, {
      include: [
        {
          model: ConstructorStaffNew,
          as: 'ConstructorStaffNews',
          separate: true,
          order: [['id', 'ASC']],
        },
      ],
    });
    res.json(full);
  } catch (e) {
    await t.rollback();
    console.error(e);
    res.status(500).json({ error: 'Ошибка обновления карточки (multipart)' });
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
    const payload = { ...req.body };
    if (payload.category && !Array.isArray(payload.category)) payload.category = [payload.category];

    const [cnt] = await StaffNew.update(payload, { where: { id } });
    if (!cnt) return res.status(404).json({ error: 'Карточка не найдена' });

    const row = await StaffNew.findByPk(id, {
      include: [
        {
          model: ConstructorStaffNew,
          as: 'ConstructorStaffNews',
          separate: true,
          order: [['id', 'ASC']],
        },
      ],
    });
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка обновления карточки' });
  }
});

router.get('/stuffs/:id/dynamic', async (req, res) => {
  try {
    const { id } = req.params;
    const cons = await ConstructorStaffNew.findAll({
      where: { staffNewId: id },
      order: [['id', 'ASC']],
    });
    res.json({
      dynamicData: cons.map((c) => c.data),
      dynamicImages: cons.map((c) => c.image).filter(Boolean),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка получения динамических данных' });
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
    const src = await StaffNew.findByPk(req.params.id, {
      include: [{ model: ConstructorStaffNew, as: 'ConstructorStaffNews' }],
    });
    if (!src) return res.status(404).json({ error: 'Карточка не найдена' });
    const data = src.toJSON();
    delete data.id;
    data.sortIndex = (data.sortIndex ?? 0) + 1;
    const copy = await StaffNew.create(data);
    for (const c of src.ConstructorStaffNews || []) {
      await ConstructorStaffNew.create({ staffNewId: copy.id, data: c.data, image: c.image });
    }
    res.status(201).json({ copiedId: copy.id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка копирования' });
  }
});

router.delete('/stuffs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.query;

    const staff = await StaffNew.findByPk(id, {
      include: [{ model: ConstructorStaffNew, as: 'ConstructorStaffNews' }],
    });
    if (!staff) return res.status(404).json({ error: 'Карточка не найдена' });

    if (category) {
      const cur = Array.isArray(staff.category) ? staff.category : [];
      if (!cur.includes(category)) {
        return res.json({ id, removed: false, reason: 'not-in-category' });
      }
      const next = cur.filter((c) => c !== category);
      const vbc = { ...(staff.visibilityByCategory || {}) };
      delete vbc[category];

      await staff.update({ category: next, visibilityByCategory: vbc });

      if (next.length === 0) {
        const files = [];
        if (staff.img) files.push(staff.img);
        for (const c of staff.ConstructorStaffNews || []) {
          if (c.image) files.push(c.image);
          const fileInputs = (Array.isArray(c.data) ? c.data : [])
            .flatMap((group) => (Array.isArray(group) ? group : []))
            .filter((inp) => inp?.type === 'file' && Array.isArray(inp.value))
            .flatMap((inp) => inp.value)
            .filter(Boolean);
          files.push(...fileInputs);
        }
        const unique = [
          ...new Set(files.map((x) => (typeof x === 'string' ? x.trim() : x)).filter(Boolean)),
        ];
        await Promise.all(unique.map(deleteImageFromS3Safe));
        await ConstructorStaffNew.destroy({ where: { staffNewId: id } });
        await StaffNew.destroy({ where: { id } });
        return res.json({ id, deleted: true, categoryRemoved: category });
      }

      return res.json({ id, categoryRemoved: category, remainingCategories: next });
    }

    const files = [];
    if (staff.img) files.push(staff.img);
    for (const c of staff.ConstructorStaffNews || []) {
      if (c.image) files.push(c.image);
      const fileInputs = (Array.isArray(c.data) ? c.data : [])
        .flatMap((group) => (Array.isArray(group) ? group : []))
        .filter((inp) => inp?.type === 'file' && Array.isArray(inp.value))
        .flatMap((inp) => inp.value)
        .filter(Boolean);
      files.push(...fileInputs);
    }
    const unique = [
      ...new Set(files.map((x) => (typeof x === 'string' ? x.trim() : x)).filter(Boolean)),
    ];
    await Promise.all(unique.map(deleteImageFromS3Safe));
    await ConstructorStaffNew.destroy({ where: { staffNewId: id } });
    await StaffNew.destroy({ where: { id } });

    res.json({ id, deleted: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка удаления' });
  }
});

module.exports = router;
