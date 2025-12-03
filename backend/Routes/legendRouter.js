const express = require('express');
const { URL } = require('url');
const crypto = require('crypto');

const router = express.Router();

const { Legend, ConstructorLegend, User } = require('../db/models');
const fileMiddleware = require('../middleware/file');
const { uploadFileToS3, deleteFileFromS3 } = require('../s3Utils/s3Service');

const LEGEND_BASE_DIR = 'images/imageHistory';
const LEGEND_FILES_DIR = 'images/imageHistory/imagesFolder';
const LEGEND_MD_IMAGES_DIR = 'images/imageHistory/imagesFolder/imageMarkdown';
const LEGEND_MD_DOCS_DIR = 'images/imageHistory/imagesFolder/documents';

const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

function flattenInputs(data) {
  if (!Array.isArray(data)) return [];
  const flat = [];
  for (const it of data) {
    if (Array.isArray(it)) flat.push(...it);
    else if (it && typeof it === 'object') flat.push(it);
  }
  return flat;
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

const deleteImageFromS3Safe = async (fileUrlOrKey) => {
  const parsed = extractFileNameAndFolderFromUrl(fileUrlOrKey);
  if (!parsed) return;
  const { fileName, folder } = parsed;
  try {
    await deleteFileFromS3(fileName, folder);
  } catch {

  }
};

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
        { model: User, as: 'author', attributes: ['id', 'userName'] },
      ],
    });

    if (!legend) return res.status(404).json({ message: 'Legend not found' });

    res.json(legend);
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
      console.error(
        'POST /api/legend: error in Legend.findByPk after commit:',
        fetchErr,
        fetchErr.original || ''
      );
    }

    return res.status(201).json(fullLegend);
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
      console.error(
        'PUT /api/legend/:id: error in Legend.findByPk after commit:',
        fetchErr,
        fetchErr.original || ''
      );
    }

    return res.json(fullLegend);
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
    res.json(legend);
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
      include: [{ model: ConstructorLegend }],
    });
    res.json(legends);
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
      include: [{ model: ConstructorLegend }],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!legend) {
      await t.rollback();
      return res.status(404).json({ message: 'Legend not found' });
    }
 
    const files = [];
    for (const c of legend.ConstructorLegends || []) {
      if (c.image) files.push(c.image);
      const inputs = flattenInputs(c.data);
      const fileInputs = inputs
        .filter((inp) => inp?.type === 'file')
        .flatMap((inp) => toArray(inp.value))
        .filter(Boolean);
      files.push(...fileInputs);
    }

    const mdLinks = collectMarkdownLinksFromConstructor(legend.ConstructorLegends);

    await ConstructorLegend.destroy({ where: { legendId: id }, transaction: t });
    const deleted = await Legend.destroy({ where: { id }, transaction: t });

    await t.commit();

    if (!deleted) return res.status(404).json({ message: 'Legend not found' });

    const uniqueFiles = [
      ...new Set(files.map((x) => (typeof x === 'string' ? x.trim() : x)).filter(Boolean)),
    ];

    await Promise.all(uniqueFiles.map(deleteImageFromS3Safe));

    await Promise.all(
      mdLinks.map(async (url) => {
        const parsed = extractMdFileNameAndFolder(url);
        if (!parsed) return;
        try {
          await deleteFileFromS3(parsed.fileName, parsed.folder);
        } catch {
    
        }
      })
    );

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

    const uploadFolder =
      req.file.mimetype === 'application/pdf' ? LEGEND_MD_DOCS_DIR : LEGEND_MD_IMAGES_DIR;

    const { fileName } = buildHashedKey(req.file, uploadFolder);
    const fileForUpload = { ...req.file, originalname: fileName };
    const url = await uploadFileToS3(fileForUpload, uploadFolder);

    return res.status(200).json({ message: 'Файл успешно загружен', url });
  } catch (e) {
    console.error('Ошибка при загрузке markdown-файла (legend):', e);
    return res.status(500).json({ message: 'Ошибка загрузки файла', error: e.message });
  }
});

router.delete('/delete-markdown-file', async (req, res) => {
  try {
    const { url } = req.body || {};
    if (!url) return res.status(400).json({ message: 'URL не предоставлен' });

    const parsed = extractMdFileNameAndFolder(url);
    if (!parsed) return res.status(400).json({ message: 'Невозможно определить имя файла/папку' });

    await deleteFileFromS3(parsed.fileName, parsed.folder);
    return res.status(200).json({ message: 'Файл удалён' });
  } catch (e) {
    console.error('Ошибка при удалении markdown-файла (legend):', e);
    return res.status(500).json({ message: 'Ошибка удаления файла', error: e.message });
  }
});

router.post('/mp', fileMiddleware.any(), async (req, res) => {
  const t = await Legend.sequelize.transaction();
  try {
    const meta = req.body?.meta ? JSON.parse(req.body.meta) : {};
    const year = Number(meta.year);
    const title = String(meta.title || '').trim();
    const description = String(meta.description || '').trim();
    const img = meta.img || null;
    const hidden = !!meta.hidden;

    let minOrder = await Legend.min('order', { transaction: t });
    if (typeof minOrder !== 'number' || Number.isNaN(minOrder)) {
      minOrder = 0;
    }
    const nextOrder = minOrder - 1;

    const legend = await Legend.create(
      {
        year,
        title,
        img,
        description,
        hidden,
        order: nextOrder,
        userId: meta.userId || null,
      },
      { transaction: t }
    );
  
    const filesMap = {};
    const batchId =
      req.batchId ||
      (req.batchId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`);

    for (const f of req.files || []) {
      const m = f.fieldname.match(/^dynamic_block_(\d+)_input_(\d+)(\[\])?$/);
      if (!m) continue;
      const b = Number(m[1]);
      const i = Number(m[2]);
      filesMap[b] ??= {};
      filesMap[b][i] ??= [];
      f.originalname = `${batchId}__${f.originalname || 'file'}`;
      const savedKey = await uploadFileToS3(f, LEGEND_FILES_DIR);
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
      const firstFileIdx = flat.findIndex(
        (x) => x.type === 'file' && (typeof x.value === 'string' || Array.isArray(x.value))
      );
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

    res.status(201).json(fullLegend || legend);
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
    const legend = await Legend.findByPk(id, {
      include: [{ model: ConstructorLegend }],
    });

    if (!legend) {
      await t.rollback();
      return res.status(404).json({ message: 'Legend not found' });
    }

    const meta = req.body?.meta ? JSON.parse(req.body.meta) : {};

    const oldMdLinks = collectMarkdownLinksFromConstructor(legend.ConstructorLegends);
    const oldDynamicFiles = (legend.ConstructorLegends || []).flatMap((c) => {
      const inputs = flattenInputs(c.data);
      const fileInputs = inputs
        .filter((inp) => inp?.type === 'file')
        .flatMap((inp) => toArray(inp.value))
        .filter(Boolean);
      return [
        ...(c.image ? [c.image] : []),
        ...fileInputs,
      ];
    });

    const filesMap = {};
    const batchId =
      req.batchId ||
      (req.batchId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`);

    for (const f of req.files || []) {
      const m = f.fieldname.match(/^dynamic_block_(\d+)_input_(\d+)(\[\])?$/);
      if (!m) continue;
      const b = Number(m[1]);
      const i = Number(m[2]);
      filesMap[b] ??= {};
      filesMap[b][i] ??= [];
      f.originalname = `${batchId}__${f.originalname || 'file'}`;
      const savedKey = await uploadFileToS3(f, LEGEND_FILES_DIR);
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
        description: meta.description ?? legend.description,
        img: meta.img !== undefined ? meta.img : legend.img,
        hidden: meta.hidden !== undefined ? !!meta.hidden : legend.hidden,
        userId: meta.userId ?? legend.userId,
      },
      { transaction: t }
    );

    await ConstructorLegend.destroy({ where: { legendId: id }, transaction: t });

    for (const group of mergedBlocks) {
      let image = null;
      const flat = flattenInputs(group);
      const firstFileIdx = flat.findIndex(
        (x) => x.type === 'file' && (typeof x.value === 'string' || Array.isArray(x.value))
      );
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

    await Promise.all(toDelete.map(deleteImageFromS3Safe)); 
    await Promise.all(
      removedMd.map(async (url) => {
        const parsed = extractMdFileNameAndFolder(url);
        if (!parsed) return;
        try {
          await deleteFileFromS3(parsed.fileName, parsed.folder);
        } catch (e) {
          console.error('Не удалось удалить markdown-файл legend:', url, e);
        }
      })
    );

    const fullLegend = await Legend.findByPk(id, {
      include: [
        { model: ConstructorLegend },
        { model: User, as: 'author', attributes: ['id', 'userName'] },
      ],
    });

    res.json(fullLegend || legend);
  } catch (e) {
    if (!t.finished) await t.rollback();
    console.error('PUT /api/legend/mp/:id error:', e);
    res.status(500).json({ message: 'Ошибка обновления легенды (multipart)' });
  }
});

module.exports = router;
