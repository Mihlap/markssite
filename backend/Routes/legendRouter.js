const express = require('express');
const { URL } = require('url');
const crypto = require('crypto');
const { Op } = require('sequelize');

const router = express.Router();

const { Legend, ConstructorLegend, User } = require('../db/models');
const fileMiddleware = require('../middleware/file');
const { uploadFileToS3, deleteFileFromS3 } = require('../s3Utils/s3Service');
const { logResourceAction } = require('../utils/fileLogger');

const LEGEND_FILES_DIR = 'images/imageHistory';
const LEGEND_MD_IMAGES_DIR = 'images/imageHistory/imagesFolder/imageMarkdown';
const LEGEND_MD_DOCS_DIR = 'images/imageHistory/imagesFolder/documents';

const BUCKET_URL = (process.env.S3_PUBLIC_URL || process.env.S3_BUCKET_URL || '').replace(/\/+$/, '');

const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

const isHttp = (s) => typeof s === 'string' && /^https?:\/\//i.test(s);
const toPublicUrl = (raw) => {
  if (!raw) return null;
  if (isHttp(raw)) return raw;
  if (!BUCKET_URL) return String(raw);
  return `${BUCKET_URL}/${String(raw).replace(/^\/+/, '')}`;
};

function flattenInputs(data) {
  if (!Array.isArray(data)) return [];
  const flat = [];
  for (const it of data) {
    if (Array.isArray(it)) flat.push(...it);
    else if (it && typeof it === 'object') flat.push(it);
  }
  return flat;
}

function firstFileFromBlock(cons, blockId) {
  if (!Array.isArray(cons)) return null;

  for (const row of cons) {
    const flat = flattenInputs(row?.data);

    const belongsToBlock = flat.some((inp) => inp?.blockId === blockId);
    if (!belongsToBlock) continue;

    for (const inp of flat) {
      if (inp?.blockId !== blockId) continue;
      if (inp?.type !== 'file') continue;

      const v = inp?.value;
      if (!v) continue;

      return Array.isArray(v) ? (v[0] ?? null) : v;
    }

    if (row?.image) return row.image;
  }

  return null;
}

function firstFileFromConstructor(cons) {
  if (!Array.isArray(cons)) return null;

  for (const row of cons) {
    if (row?.image) return row.image;

    const flat = flattenInputs(row?.data);
    for (const inp of flat) {
      if (inp?.type !== 'file') continue;
      const v = inp?.value;
      if (!v) continue;
      return Array.isArray(v) ? (v[0] ?? null) : v;
    }
  }

  return null;
}

function withComputedUrls(legendInstanceOrPlain) {
  const legend = legendInstanceOrPlain?.toJSON ? legendInstanceOrPlain.toJSON() : legendInstanceOrPlain;
  const cons = legend?.ConstructorLegends || [];

  const avatarRaw = legend?.avatar || firstFileFromBlock(cons, 'personOfYear') || firstFileFromConstructor(cons);
  const previewRaw = legend?.previewImageUrl || legend?.img || null;

  return {
    ...legend,
    avatarUrl: toPublicUrl(avatarRaw),
    previewImageUrl: toPublicUrl(previewRaw),
  };
}

const extractFileNameAndFolderFromUrl = (url) => {
  if (!url) return null;

  if (!/^https?:\/\//i.test(url)) {
    const clean = decodeURIComponent(String(url)).replace(/^\/+/, '');
    const parts = clean.split('/').filter(Boolean);
    if (!parts.length) return null;
    const fileName = parts.pop();
    const folder = parts.join('/') || LEGEND_FILES_DIR;
    return { fileName, folder };
  }

  try {
    const u = new URL(url);
    const parts = decodeURIComponent(u.pathname).split('/').filter(Boolean);
    if (!parts.length) return null;
    const fileName = parts.pop();
    const folder = parts.join('/') || LEGEND_FILES_DIR;
    return { fileName, folder };
  } catch {
    return null;
  }
};

function extractMdFileNameAndFolder(url) {
  try {
    const clean = String(url).split('?')[0];
    let path;
    if (/^https?:\/\//i.test(clean)) {
      const u = new URL(clean);
      path = decodeURIComponent(u.pathname || '');
    } else {
      path = decodeURIComponent(clean);
    }
    const parts = path.split('/').filter(Boolean);
    if (!parts.length) return null;
    const fileName = parts.pop();
    const isPdf = /\.pdf$/i.test(fileName);
    const folder = isPdf ? LEGEND_MD_DOCS_DIR : LEGEND_MD_IMAGES_DIR;
    return { fileName, folder };
  } catch {
    return null;
  }
}

function extractMarkdownLinks(markdownText = '') {
  const links = [];
  const imgRe = /!\[[^\]]*\]\((?<url>[^)]+)\)/g;
  const linkRe = /\[[^\]]*\]\((?<url>[^)]+)\)/g;

  for (const m of markdownText.matchAll(imgRe)) {
    if (m.groups?.url) links.push(m.groups.url);
  }
  for (const m of markdownText.matchAll(linkRe)) {
    const u = m.groups?.url || '';
    if (u.endsWith('.pdf') || u.match(/\.(jpe?g|png|gif|bmp|webp|svg)$/i)) {
      links.push(u);
    }
  }
  return [...new Set(links)];
}

function collectMarkdownLinksFromConstructor(cons = []) {
  const all = [];
  for (const c of cons) {
    const inputs = flattenInputs(c?.data);
    for (const inp of inputs) {
      if (inp?.type === 'markdown' && typeof inp?.value === 'string') {
        all.push(...extractMarkdownLinks(inp.value));
      }
    }
  }
  return [...new Set(all)];
}

function buildHashedKey(file, folder) {
  let ext = '';
  if (file.originalname && file.originalname.includes('.')) {
    ext = file.originalname.slice(file.originalname.lastIndexOf('.'));
  } else if (file.mimetype === 'application/pdf') {
    ext = '.pdf';
  }
  let name;
  if (file.buffer && file.buffer.length) {
    const hash = crypto.createHash('sha1').update(file.buffer).digest('hex');
    name = `${hash}${ext}`;
  } else {
    const ts = Date.now();
    name = `${ts}${ext}`;
  }
  return { folder, fileName: name };
}

function normBasicFileKey(urlOrKey) {
  const p = extractFileNameAndFolderFromUrl(urlOrKey);
  if (!p?.fileName) return null;
  return `${p.folder}/${p.fileName}`;
}

function normMdFileKey(urlOrKey) {
  const p = extractMdFileNameAndFolder(urlOrKey);
  if (!p?.fileName) return null;
  return `${p.folder}/${p.fileName}`;
}

function collectStringRefsFromConstructorData(data) {
  const flat = flattenInputs(data);
  const out = [];

  for (const inp of flat) {
    if (!inp) continue;

    if (inp.type === 'file') {
      const arr = toArray(inp.value).filter(Boolean);
      out.push(...arr);
    }

    if (inp.type === 'markdown' && typeof inp.value === 'string') {
      out.push(...extractMarkdownLinks(inp.value));
    }
  }

  return out;
}

async function isAnyOtherLegendUsingBasicFile(basicKey, excludeLegendId) {
  if (!basicKey) return false;

  const whereLegend = excludeLegendId ? { id: { [Op.ne]: excludeLegendId } } : undefined;
  const whereConstructor = excludeLegendId ? { legendId: { [Op.ne]: excludeLegendId } } : undefined;

  const [legends, constructors] = await Promise.all([
    Legend.findAll({ attributes: ['id', 'img'], where: whereLegend }),
    ConstructorLegend.findAll({ attributes: ['legendId', 'image', 'data'], where: whereConstructor }),
  ]);

  for (const l of legends) {
    if (normBasicFileKey(l.img) === basicKey) return true;
  }

  for (const c of constructors) {
    if (normBasicFileKey(c.image) === basicKey) return true;

    const refs = collectStringRefsFromConstructorData(c.data);
    for (const r of refs) {
      if (normBasicFileKey(r) === basicKey) return true;
    }
  }

  return false;
}

async function isAnyOtherLegendUsingMdFile(mdKey, excludeLegendId) {
  if (!mdKey) return false;

  const whereConstructor = excludeLegendId ? { legendId: { [Op.ne]: excludeLegendId } } : undefined;

  const constructors = await ConstructorLegend.findAll({
    attributes: ['legendId', 'data'],
    where: whereConstructor,
  });

  for (const c of constructors) {
    const refs = collectStringRefsFromConstructorData(c.data);
    for (const r of refs) {
      if (normMdFileKey(r) === mdKey) return true;
    }
  }

  return false;
}

const deleteImageFromS3Safe = async (fileUrlOrKey, logInfo = null, excludeLegendId = null) => {
  const basicKey = normBasicFileKey(fileUrlOrKey);
  if (!basicKey) return;

  try {
    const usedSomewhereElse = await isAnyOtherLegendUsingBasicFile(basicKey, excludeLegendId);
    if (usedSomewhereElse) return;

    const parsed = extractFileNameAndFolderFromUrl(fileUrlOrKey);
    if (!parsed) return;

    await deleteFileFromS3(parsed.fileName, parsed.folder, logInfo);
  } catch { }
};

const deleteMarkdownFromS3Safe = async (url, logInfo = null, excludeLegendId = null) => {
  const mdKey = normMdFileKey(url);
  if (!mdKey) return;

  try {
    const usedSomewhereElse = await isAnyOtherLegendUsingMdFile(mdKey, excludeLegendId);
    if (usedSomewhereElse) return;

    const parsed = extractMdFileNameAndFolder(url);
    if (!parsed) return;

    await deleteFileFromS3(parsed.fileName, parsed.folder, logInfo);
  } catch { }
};

router.get('/', async (req, res, next) => {
  try {
    const legends = await Legend.findAll({
      order: [
        ['order', 'ASC'],
        ['year', 'DESC'],
      ],
      include: [
        { model: ConstructorLegend },
        { model: User, as: 'author', attributes: ['id', 'userName'] },
      ],
    });

    res.json(legends.map(withComputedUrls));
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
        { model: User, as: 'author', attributes: ['id', 'userName'] },
      ],
    });

    if (!legend) return res.status(404).json({ message: 'Legend not found' });

    res.json(withComputedUrls(legend));
  } catch (err) {
    console.error('GET /api/legend/:id error:', err);
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const t = await Legend.sequelize.transaction();
  try {
    const { year, title, img, description, hidden, order, userId, constructor } = req.body;

    let minOrder = await Legend.min('order', { transaction: t });
    if (typeof minOrder !== 'number' || Number.isNaN(minOrder)) {
      minOrder = 0;
    }
    const nextOrder = typeof order === 'number' ? order : minOrder - 1;

    const legend = await Legend.create(
      {
        year,
        title,
        img: img || null,
        description: description || null,
        hidden: !!hidden,
        order: nextOrder,
        userId: userId || null,
      },
      { transaction: t }
    );

    if (constructor && (constructor.data || constructor.image)) {
      await ConstructorLegend.create(
        {
          legendId: legend.id,
          data: constructor.data || null,
          image: constructor.image || null,
        },
        { transaction: t }
      );
    }

    await t.commit();

    let fullLegend = legend;
    try {
      const withIncludes = await Legend.findByPk(legend.id, {
        include: [
          { model: ConstructorLegend },
          { model: User, as: 'author', attributes: ['id', 'userName'] },
        ],
      });
      if (withIncludes) fullLegend = withIncludes;
    } catch (fetchErr) {
      console.error('POST /api/legend: error in Legend.findByPk after commit:', fetchErr, fetchErr.original || '');
    }

    if (req.session?.user) {
      logResourceAction({
        action: 'CREATE',
        userName: req.session.user.name,
        userId: req.session.user.id.toString(),
        resourceType: 'legend',
        resourceId: legend.id.toString(),
        resourceName: title || 'Легенда',
      });
    }

    return res.status(201).json(withComputedUrls(fullLegend));
  } catch (err) {
    if (!t.finished) {
      try {
        await t.rollback();
      } catch (rollbackErr) {
        console.error('Rollback failed after POST /api/legend:', rollbackErr);
      }
    }
    console.error('POST /api/legend error:', err, err.original || '');
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

    const oldYear = legend.year;
    const oldTitle = legend.title;
    const oldImg = legend.img;
    const oldDescription = legend.description;
    const oldHidden = legend.hidden;
    const oldOrder = legend.order;
    const oldUserId = legend.userId;

    const newYear = year ?? legend.year;
    const newTitle = title ?? legend.title;
    const newImg = img !== undefined ? img : legend.img;
    const newDescription = description !== undefined ? description : legend.description;
    const newHidden = hidden !== undefined ? hidden : legend.hidden;
    const newOrder = order ?? legend.order;
    const newUserId = userId !== undefined ? userId : legend.userId;

    let constructorChanged = false;
    if (constructor) {
      const existingConstructor = await ConstructorLegend.findOne({
        where: { legendId: legend.id },
        transaction: t,
      });
      if (existingConstructor) {
        const oldData = JSON.stringify(existingConstructor.data);
        const oldImage = existingConstructor.image;
        const newData = JSON.stringify(constructor.data !== undefined ? constructor.data : existingConstructor.data);
        const newImage = constructor.image !== undefined ? constructor.image : existingConstructor.image;
        constructorChanged = oldData !== newData || oldImage !== newImage;
      } else if (constructor.data || constructor.image) {
        constructorChanged = true;
      }
    }

    const hasChanges =
      oldYear !== newYear ||
      oldTitle !== newTitle ||
      oldImg !== newImg ||
      oldDescription !== newDescription ||
      oldHidden !== newHidden ||
      oldOrder !== newOrder ||
      oldUserId !== newUserId ||
      constructorChanged;

    await legend.update(
      {
        year: newYear,
        title: newTitle,
        img: newImg,
        description: newDescription,
        hidden: newHidden,
        order: newOrder,
        userId: newUserId,
      },
      { transaction: t }
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
          { transaction: t }
        );
      } else {
        await constructorRow.update(
          {
            data: data !== undefined ? data : constructorRow.data,
            image: image !== undefined ? image : constructorRow.image,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();

    if (req.session?.user) {
      logResourceAction({
        action: 'UPDATE',
        userName: req.session.user.name,
        userId: req.session.user.id.toString(),
        resourceType: 'legend',
        resourceId: id,
        resourceName: newTitle || legend.title,
        hasChanges,
      });
    }

    let fullLegend = legend;
    try {
      const withIncludes = await Legend.findByPk(id, {
        include: [
          { model: ConstructorLegend },
          { model: User, as: 'author', attributes: ['id', 'userName'] },
        ],
      });
      if (withIncludes) fullLegend = withIncludes;
    } catch (fetchErr) {
      console.error('PUT /api/legend/:id: error in Legend.findByPk after commit:', fetchErr, fetchErr.original || '');
    }

    return res.json(withComputedUrls(fullLegend));
  } catch (err) {
    if (!t.finished) {
      try {
        await t.rollback();
      } catch (rollbackErr) {
        console.error('Rollback failed after PUT /api/legend/:id:', rollbackErr);
      }
    }
    console.error('PUT /api/legend/:id error:', err, err.original || '');
    next(err);
  }
});

router.patch('/:id/hidden', async (req, res, next) => {
  try {
    const { hidden } = req.body;
    const legend = await Legend.findByPk(req.params.id);
    if (!legend) return res.status(404).json({ message: 'Legend not found' });

    await legend.update({ hidden: !!hidden });

    const fullLegend = await Legend.findByPk(req.params.id, {
      include: [
        { model: ConstructorLegend },
        { model: User, as: 'author', attributes: ['id', 'userName'] },
      ],
    });

    res.json(withComputedUrls(fullLegend || legend));
  } catch (err) {
    console.error('PATCH /api/legend/:id/hidden error:', err, err.original || '');
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
      include: [
        { model: ConstructorLegend },
        { model: User, as: 'author', attributes: ['id', 'userName'] },
      ],
    });
    res.json(legends.map(withComputedUrls));
  } catch (err) {
    if (!t.finished) {
      try {
        await t.rollback();
      } catch (rollbackErr) {
        console.error('Rollback failed after PATCH /legend/order/bulk:', rollbackErr);
      }
    }
    console.error('PATCH /api/legend/order/bulk error:', err, err.original || '');
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  const t = await Legend.sequelize.transaction();
  try {
    const id = req.params.id;

    const legend = await Legend.findByPk(id, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!legend) {
      await t.rollback();
      return res.status(404).json({ message: 'Legend not found' });
    }

    const legendTitle = legend.title || 'Легенда';

    const constructorRows = await ConstructorLegend.findAll({
      where: { legendId: id },
      transaction: t,
    });

    const files = [];
    if (legend.img) files.push(legend.img);

    for (const c of constructorRows || []) {
      if (c.image) files.push(c.image);
      const inputs = flattenInputs(c.data);
      const fileInputs = inputs
        .filter((inp) => inp?.type === 'file')
        .flatMap((inp) => toArray(inp.value))
        .filter(Boolean);
      files.push(...fileInputs);
    }

    const mdLinks = collectMarkdownLinksFromConstructor(constructorRows);

    await ConstructorLegend.destroy({ where: { legendId: id }, transaction: t });
    const deleted = await Legend.destroy({ where: { id }, transaction: t });

    await t.commit();

    if (!deleted) return res.status(404).json({ message: 'Legend not found' });

    const userInfo = req.session?.user
      ? {
        userName: req.session.user.name,
        userId: req.session.user.id.toString(),
        resourceType: 'legend',
        resourceId: id,
      }
      : null;

    const uniqueFiles = [...new Set(files.map((x) => (typeof x === 'string' ? x.trim() : x)).filter(Boolean))];

    await Promise.all(uniqueFiles.map((url) => deleteImageFromS3Safe(url, userInfo, id)));
    await Promise.all(mdLinks.map((url) => deleteMarkdownFromS3Safe(url, userInfo, id)));

    if (req.session?.user) {
      logResourceAction({
        action: 'DELETE',
        userName: req.session.user.name,
        userId: req.session.user.id.toString(),
        resourceType: 'legend',
        resourceId: id,
        resourceName: legendTitle,
      });
    }

    res.json({ message: 'Deleted', id });
  } catch (err) {
    if (!t.finished) {
      try {
        await t.rollback();
      } catch (rollbackErr) {
        console.error('Rollback failed after DELETE /legend/:id:', rollbackErr);
      }
    }
    console.error('DELETE /api/legend/:id error:', err, err.original || '');
    next(err);
  }
});

router.post('/upload-markdown-file', fileMiddleware.single('markdownFile'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Файл не найден в запросе' });

    const userInfo = req.session?.user
      ? {
        userName: req.session.user.name,
        userId: req.session.user.id.toString(),
        resourceType: 'legend',
      }
      : null;

    const uploadFolder = req.file.mimetype === 'application/pdf' ? LEGEND_MD_DOCS_DIR : LEGEND_MD_IMAGES_DIR;

    const { fileName } = buildHashedKey(req.file, uploadFolder);
    const fileForUpload = { ...req.file, originalname: fileName };
    const url = await uploadFileToS3(fileForUpload, uploadFolder, userInfo);

    return res.status(200).json({ message: 'Файл успешно загружен', url });
  } catch (e) {
    console.error('Ошибка при загрузке markdown-файла (legend):', e);
    return res.status(500).json({ message: 'Ошибка загрузки файла', error: e.message });
  }
});

router.delete('/delete-markdown-file', async (req, res) => {
  try {
    const userInfo = req.session?.user
      ? {
        userName: req.session.user.name,
        userId: req.session.user.id.toString(),
        resourceType: 'legend',
      }
      : null;

    const { url } = req.body || {};
    if (!url) return res.status(400).json({ message: 'URL не предоставлен' });

    await deleteMarkdownFromS3Safe(url, userInfo, null);

    return res.status(200).json({ message: 'Файл удалён' });
  } catch (e) {
    console.error('Ошибка при удалении markdown-файла (legend):', e);
    return res.status(500).json({ message: 'Ошибка удаления файла', error: e.message });
  }
});

router.post('/mp', fileMiddleware.any(), async (req, res) => {
  const t = await Legend.sequelize.transaction();
  try {
    const userInfo = req.session?.user
      ? {
        userName: req.session.user.name,
        userId: req.session.user.id.toString(),
        resourceType: 'legend',
      }
      : null;

    const meta = req.body?.meta ? JSON.parse(req.body.meta) : {};
    const year = Number(meta.year);
    const title = String(meta.title || '').trim();
    const description = String(meta.previewText || meta.description || '').trim();
    const hidden = !!meta.hidden;

    let minOrder = await Legend.min('order', { transaction: t });
    if (typeof minOrder !== 'number' || Number.isNaN(minOrder)) {
      minOrder = 0;
    }
    const nextOrder = minOrder - 1;

    const photoAvaFile = (req.files || []).find((f) => f.fieldname === 'photoAva');
    let imgKey = meta.img || null;
    if (photoAvaFile) {
      imgKey = await uploadFileToS3(photoAvaFile, LEGEND_FILES_DIR, userInfo);
    }

    const legend = await Legend.create(
      {
        year,
        title,
        img: imgKey,
        description,
        hidden,
        order: nextOrder,
        userId: meta.userId || null,
      },
      { transaction: t }
    );

    const filesMap = {};
    const batchId = req.batchId || (req.batchId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`);

    for (const f of req.files || []) {
      const m = f.fieldname.match(/^dynamic_block_(\d+)_input_(\d+)(\[\])?$/);
      if (!m) continue;
      const b = Number(m[1]);
      const i = Number(m[2]);
      filesMap[b] ??= {};
      filesMap[b][i] ??= [];
      f.originalname = `${batchId}__${f.originalname || 'file'}`;
      const savedKey = await uploadFileToS3(f, LEGEND_FILES_DIR, userInfo);
      filesMap[b][i].push(savedKey);
    }

    const dynamicBlocks = Array.isArray(meta.dynamicBlocks) ? meta.dynamicBlocks : [];

    for (let b = 0; b < dynamicBlocks.length; b++) {
      const inputs = (dynamicBlocks[b] || []).map((inp, i) => {
        if (filesMap[b]?.[i]?.length) {
          const arr = filesMap[b][i];
          return { ...inp, value: arr.length === 1 ? arr[0] : arr };
        }
        return inp;
      });

      let image = null;
      const flat = flattenInputs(inputs);
      const firstFileIdx = flat.findIndex((x) => x.type === 'file' && (typeof x.value === 'string' || Array.isArray(x.value)));
      if (firstFileIdx >= 0) {
        const v = flat[firstFileIdx].value;
        image = Array.isArray(v) ? v[0] ?? null : v;
      }

      await ConstructorLegend.create(
        {
          legendId: legend.id,
          data: inputs,
          image,
        },
        { transaction: t }
      );
    }

    await t.commit();

    const fullLegend = await Legend.findByPk(legend.id, {
      include: [
        { model: ConstructorLegend },
        { model: User, as: 'author', attributes: ['id', 'userName'] },
      ],
    });

    if (req.session?.user) {
      logResourceAction({
        action: 'CREATE',
        userName: req.session.user.name,
        userId: req.session.user.id.toString(),
        resourceType: 'legend',
        resourceId: legend.id.toString(),
        resourceName: title || 'Легенда',
      });
    }

    res.status(201).json(withComputedUrls(fullLegend || legend));
  } catch (e) {
    if (!t.finished) await t.rollback();
    console.error('POST /api/legend/mp error:', e);
    res.status(500).json({ message: 'Ошибка создания легенды (multipart)' });
  }
});

router.put('/mp/:id', fileMiddleware.any(), async (req, res) => {
  const t = await Legend.sequelize.transaction();
  try {
    const id = req.params.id;

    const userInfo = req.session?.user
      ? {
        userName: req.session.user.name,
        userId: req.session.user.id.toString(),
        resourceType: 'legend',
        resourceId: id,
      }
      : null;

    const legend = await Legend.findByPk(id, {
      include: [{ model: ConstructorLegend }],
    });

    if (!legend) {
      await t.rollback();
      return res.status(404).json({ message: 'Legend not found' });
    }

    const meta = req.body?.meta ? JSON.parse(req.body.meta) : {};

    const oldYear = legend.year;
    const oldTitle = legend.title;
    const oldDescription = legend.description;
    const oldHidden = legend.hidden;
    const oldUserId = legend.userId;
    const oldAvatar = legend.img || null;
    const oldConstructorData = (legend.ConstructorLegends || []).map((c) => ({
      data: JSON.stringify(c.data),
      image: c.image,
    }));

    const oldMdLinks = collectMarkdownLinksFromConstructor(legend.ConstructorLegends);

    const oldDynamicFiles = (legend.ConstructorLegends || []).flatMap((c) => {
      const inputs = flattenInputs(c.data);
      const fileInputs = inputs
        .filter((inp) => inp?.type === 'file')
        .flatMap((inp) => toArray(inp.value))
        .filter(Boolean);
      return [...(c.image ? [c.image] : []), ...fileInputs];
    });

    const newPhotoAva = (req.files || []).find((f) => f.fieldname === 'photoAva');
    let newAvatarKey = meta.img !== undefined ? meta.img : oldAvatar;
    if (newPhotoAva) {
      newAvatarKey = await uploadFileToS3(newPhotoAva, LEGEND_FILES_DIR, userInfo);
    }

    const filesMap = {};
    const batchId = req.batchId || (req.batchId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`);

    for (const f of req.files || []) {
      const m = f.fieldname.match(/^dynamic_block_(\d+)_input_(\d+)(\[\])?$/);
      if (!m) continue;
      const b = Number(m[1]);
      const i = Number(m[2]);
      filesMap[b] ??= {};
      filesMap[b][i] ??= [];
      f.originalname = `${batchId}__${f.originalname || 'file'}`;
      const savedKey = await uploadFileToS3(f, LEGEND_FILES_DIR, userInfo);
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
      })
    );

    const actualDynamicFiles = mergedBlocks
      .flatMap((group) => flattenInputs(group))
      .filter((inp) => inp?.type === 'file')
      .flatMap((inp) => toArray(inp.value))
      .filter(Boolean);

    await legend.update(
      {
        year: meta.year ?? legend.year,
        title: meta.title ?? legend.title,
        description:
          meta.previewText !== undefined
            ? String(meta.previewText || '').trim()
            : meta.description !== undefined
              ? String(meta.description || '').trim()
              : legend.description,
        img: newAvatarKey,
        hidden: meta.hidden !== undefined ? !!meta.hidden : legend.hidden,
        userId: meta.userId ?? legend.userId,
      },
      { transaction: t }
    );

    await ConstructorLegend.destroy({ where: { legendId: id }, transaction: t });

    for (const group of mergedBlocks) {
      let image = null;
      const flat = flattenInputs(group);
      const firstFileIdx = flat.findIndex((x) => x.type === 'file' && (typeof x.value === 'string' || Array.isArray(x.value)));
      if (firstFileIdx >= 0) {
        const v = flat[firstFileIdx].value;
        image = Array.isArray(v) ? v[0] ?? null : v;
      }
      await ConstructorLegend.create({ legendId: id, data: group, image }, { transaction: t });
    }

    const newMdLinks = collectMarkdownLinksFromConstructor(mergedBlocks.map((g) => ({ data: g })));
    const removedMd = oldMdLinks.filter((u) => !newMdLinks.includes(u));

    await t.commit();

    const oldAll = [...new Set(oldDynamicFiles || [])].filter(Boolean);
    const newAll = [...new Set(actualDynamicFiles || [])].filter(Boolean);

    const toDelete = oldAll
      .map((v) => (typeof v === 'string' ? v.trim() : v))
      .filter(Boolean)
      .filter((v) => !newAll.includes(v));

    await Promise.all(toDelete.map((url) => deleteImageFromS3Safe(url, userInfo, id)));

    if (oldAvatar && oldAvatar !== newAvatarKey) {
      await deleteImageFromS3Safe(oldAvatar, userInfo, id);
    }

    await Promise.all(removedMd.map((url) => deleteMarkdownFromS3Safe(url, userInfo, id)));

    const newYear = meta.year ?? legend.year;
    const newTitle = meta.title ?? legend.title;
    const newDescription =
      meta.previewText !== undefined
        ? String(meta.previewText || '').trim()
        : meta.description !== undefined
          ? String(meta.description || '').trim()
          : legend.description;
    const newHidden = meta.hidden !== undefined ? !!meta.hidden : legend.hidden;
    const newUserId = meta.userId ?? legend.userId;

    const newConstructorData = mergedBlocks.map((g) => JSON.stringify(g));
    const oldConstructorDataStr = oldConstructorData.map((c) => c.data);
    const constructorChanged =
      oldConstructorData.length !== newConstructorData.length ||
      oldConstructorDataStr.some((oldData, idx) => {
        if (idx >= newConstructorData.length) return true;
        return oldData !== newConstructorData[idx];
      });

    const hasChanges =
      oldYear !== newYear ||
      oldTitle !== newTitle ||
      oldDescription !== newDescription ||
      oldHidden !== newHidden ||
      oldUserId !== newUserId ||
      oldAvatar !== newAvatarKey ||
      constructorChanged ||
      oldMdLinks.length !== newMdLinks.length ||
      oldMdLinks.some((link) => !newMdLinks.includes(link));

    const fullLegend = await Legend.findByPk(id, {
      include: [
        { model: ConstructorLegend },
        { model: User, as: 'author', attributes: ['id', 'userName'] },
      ],
    });

    if (req.session?.user) {
      logResourceAction({
        action: 'UPDATE',
        userName: req.session.user.name,
        userId: req.session.user.id.toString(),
        resourceType: 'legend',
        resourceId: id,
        resourceName: newTitle || legend.title,
        hasChanges,
      });
    }

    res.json(withComputedUrls(fullLegend || legend));
  } catch (e) {
    if (!t.finished) await t.rollback();
    console.error('PUT /api/legend/mp/:id error:', e);
    res.status(500).json({ message: 'Ошибка обновления легенды (multipart)' });
  }
});

module.exports = router;
