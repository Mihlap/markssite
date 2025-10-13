// const express = require('express');
// const { URL } = require('url');
// const crypto = require('crypto');
// const { sequelize, StaffNew, ConstructorStaffNew } = require('../db/models');
// const { Op } = require('sequelize');
// const fileMiddleware = require('../middleware/file');
// const { uploadFileToS3, deleteFileFromS3 } = require('../s3Utils/s3Service');

// const router = express.Router();

// const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

// const STAFF_BASE_DIR = 'images/imageStaff';
// const STAFF_FILES_DIR = 'images/imageStaff/imagesFolder';
// const STAFF_MD_IMAGES_DIR = 'images/imageStaff/imagesFolder/imageMarkdown';
// const STAFF_MD_DOCS_DIR = 'images/imageStaff/imagesFolder/documents';

// async function getNextSortIndex(t) {
//   const max = await StaffNew.max('sortIndex', { transaction: t });
//   return Number.isFinite(max) ? max + 1 : 0;
// }

// function flattenInputs(data) {
//   if (!Array.isArray(data)) return [];
//   const flat = [];
//   for (const it of data) {
//     if (Array.isArray(it)) flat.push(...it);
//     else if (it && typeof it === 'object') flat.push(it);
//   }
//   return flat;
// }

// const extractFileNameAndFolderFromUrl = (url) => {
//   if (!url) return null;
//   if (!/^https?:\/\//i.test(url)) {
//     const clean = decodeURIComponent(String(url)).replace(/^\/+/, '');
//     const parts = clean.split('/').filter(Boolean);
//     if (!parts.length) return null;
//     const fileName = parts.pop();
//     const folder = parts.join('/') || STAFF_FILES_DIR;
//     return { fileName, folder };
//   }
//   try {
//     const u = new URL(url);
//     const parts = decodeURIComponent(u.pathname).split('/').filter(Boolean);
//     if (!parts.length) return null;
//     const fileName = parts.pop();
//     const folder = parts.join('/') || STAFF_FILES_DIR;
//     return { fileName, folder };
//   } catch {
//     return null;
//   }
// };

// function extractMdFileNameAndFolder(url) {
//   try {
//     const clean = String(url).split('?')[0];
//     let path;
//     if (/^https?:\/\//i.test(clean)) {
//       const u = new URL(clean);
//       path = decodeURIComponent(u.pathname || '');
//     } else {
//       path = decodeURIComponent(clean);
//     }
//     const parts = path.split('/').filter(Boolean);
//     if (!parts.length) return null;
//     const fileName = parts.pop();
//     const isPdf = /\.pdf$/i.test(fileName);
//     const folder = isPdf ? STAFF_MD_DOCS_DIR : STAFF_MD_IMAGES_DIR;
//     return { fileName, folder };
//   } catch {
//     return null;
//   }
// }

// const deleteImageFromS3Safe = async (fileUrlOrKey) => {
//   const parsed = extractFileNameAndFolderFromUrl(fileUrlOrKey);
//   if (!parsed) return;
//   const { fileName, folder } = parsed;
//   try {
//     await deleteFileFromS3(fileName, folder);
//   } catch {}
// };


// function extractMarkdownLinks(markdownText = '') {
//   const links = [];
//   const imgRe = /!\[[^\]]*\]\((?<url>[^)]+)\)/g;
//   const linkRe = /\[[^\]]*\]\((?<url>[^)]+)\)/g;

//   for (const m of markdownText.matchAll(imgRe)) {
//     if (m.groups?.url) links.push(m.groups.url);
//   }
//   for (const m of markdownText.matchAll(linkRe)) {
//     const u = m.groups?.url || '';
//     if (u.endsWith('.pdf') || u.match(/\.(jpe?g|png|gif|bmp|webp|svg)$/i)) {
//       links.push(u);
//     }
//   }
//   return [...new Set(links)];
// }

// function collectMarkdownLinksFromConstructor(cons = []) {
//   const all = [];
//   for (const c of cons) {
//     const inputs = flattenInputs(c?.data);
//     for (const inp of inputs) {
//       if (inp?.type === 'markdown' && typeof inp?.value === 'string') {
//         all.push(...extractMarkdownLinks(inp.value));
//       }
//     }
//   }
//   return [...new Set(all)];
// }

// function buildHashedKey(file, folder) {
//   let ext = '';
//   if (file.originalname && file.originalname.includes('.')) {
//     ext = file.originalname.slice(file.originalname.lastIndexOf('.'));
//   } else if (file.mimetype === 'application/pdf') {
//     ext = '.pdf';
//   }
//   let name;
//   if (file.buffer && file.buffer.length) {
//     const hash = crypto.createHash('sha1').update(file.buffer).digest('hex');
//     name = `${hash}${ext}`;
//   } else {
//     const ts = Date.now();
//     name = `${ts}${ext}`;
//   }
//   return { folder, fileName: name };
// }


// router.get('/stuffs', async (req, res) => {
//   try {
//     const { category, includeHidden } = req.query;
//     const where = {};
//     const showHidden = String(includeHidden).toLowerCase() === 'true';
//     if (!showHidden) where.isVisible = true;
//     if (category) where.category = { [Op.contains]: [category] };

//     const rows = await StaffNew.findAll({
//       where,
//       order: [
//         ['sortIndex', 'ASC'],
//         ['createdAt', 'ASC'],
//       ],
//       include: [
//         {
//           model: ConstructorStaffNew,
//           as: 'ConstructorStaffNews',
//           separate: true,
//           order: [['id', 'ASC']],
//         },
//       ],
//     });

//     const out =
//       !showHidden && category
//         ? rows.filter((r) => (r.visibilityByCategory || {})[category] !== false)
//         : rows;

//     res.json(out);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: 'Ошибка получения списка сотрудников' });
//   }
// });

// router.post('/stuffs', async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const payload = { ...req.body };
//     if (payload.category && !Array.isArray(payload.category)) payload.category = [payload.category];

//     const sortIndex = await getNextSortIndex(t);
//     const row = await StaffNew.create({ ...payload, sortIndex }, { transaction: t });
//     await t.commit();

//     const full = await StaffNew.findByPk(row.id, {
//       include: [
//         {
//           model: ConstructorStaffNew,
//           as: 'ConstructorStaffNews',
//           separate: true,
//           order: [['id', 'ASC']],
//         },
//       ],
//     });
//     res.status(201).json(full);
//   } catch (e) {
//     await t.rollback();
//     console.error(e);
//     res.status(500).json({ error: 'Ошибка создания карточки' });
//   }
// });

// router.post('/upload', fileMiddleware.single('file'), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: 'Файл не передан' });
//     const key = await uploadFileToS3(req.file, STAFF_BASE_DIR);
//     res.json({ filename: key });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: 'Не удалось загрузить файл' });
//   }
// });

// router.post('/stuffs-mp', fileMiddleware.any(), async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const meta = req.body?.meta ? JSON.parse(req.body.meta) : {};
//     const category = Array.isArray(meta.category)
//       ? meta.category
//       : meta.category
//       ? [meta.category]
//       : [];

//     const sortIndex = await getNextSortIndex(t);

//     const staff = await StaffNew.create(
//       {
//         name: String(meta.name || '').trim(),
//         position: meta.position || '',
//         description: meta.description || '',
//         category,
//         isVisible: meta.isVisible ?? true,
//         sortIndex,
//         userId: meta.userId ?? null,
//         visibilityByCategory: meta.visibilityByCategory || {},
//       },
//       { transaction: t },
//     );

//     const photoAvaFile = (req.files || []).find((f) => f.fieldname === 'photoAva');
//     if (photoAvaFile) {
//       const key = await uploadFileToS3(photoAvaFile, STAFF_BASE_DIR);
//       await staff.update({ img: key }, { transaction: t });
//     }

//     const filesMap = {};
//     const batchId =
//       req.batchId ||
//       (req.batchId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`);

//     for (const f of req.files || []) {
//       const m = f.fieldname.match(/^dynamic_block_(\d+)_input_(\d+)(\[\])?$/);
//       if (!m) continue;
//       const b = Number(m[1]);
//       const i = Number(m[2]);
//       filesMap[b] ??= {};
//       filesMap[b][i] ??= [];
//       f.originalname = `${batchId}__${f.originalname || 'file'}`;
//       const savedKey = await uploadFileToS3(f, STAFF_FILES_DIR);
//       filesMap[b][i].push(savedKey);
//     }

//     const dynamicBlocks = Array.isArray(meta.dynamicBlocks) ? meta.dynamicBlocks : [];
//     for (let b = 0; b < dynamicBlocks.length; b++) {
//       const inputs = dynamicBlocks[b].map((inp, i) => {
//         if (filesMap[b]?.[i]?.length) {
//           const arr = filesMap[b][i];
//           return { ...inp, value: arr.length === 1 ? arr[0] : arr };
//         }
//         return inp;
//       });

//       let image = null;
//       const firstFileIdx = inputs.findIndex(
//         (x) => x.type === 'file' && (typeof x.value === 'string' || Array.isArray(x.value)),
//       );
//       if (firstFileIdx >= 0) {
//         const v = inputs[firstFileIdx].value;
//         image = Array.isArray(v) ? v[0] ?? null : v;
//       }

//       await ConstructorStaffNew.create(
//         { staffNewId: staff.id, data: inputs, image },
//         { transaction: t },
//       );
//     }

//     await t.commit();

//     const full = await StaffNew.findByPk(staff.id, {
//       include: [
//         {
//           model: ConstructorStaffNew,
//           as: 'ConstructorStaffNews',
//           separate: true,
//           order: [['id', 'ASC']],
//         },
//       ],
//     });
//     res.status(201).json(full);
//   } catch (e) {
//     await t.rollback();
//     console.error(e);
//     res.status(500).json({ error: 'Ошибка создания карточки (multipart)' });
//   }
// });

// router.post('/upload-markdown-file', fileMiddleware.single('markdownFile'), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: 'Файл не найден в запросе' });

//     const uploadFolder =
//       req.file.mimetype === 'application/pdf' ? STAFF_MD_DOCS_DIR : STAFF_MD_IMAGES_DIR;

//     const { fileName } = buildHashedKey(req.file, uploadFolder);
//     const fileForUpload = { ...req.file, originalname: fileName };
//     const url = await uploadFileToS3(fileForUpload, uploadFolder);

//     return res.status(200).json({ message: 'Файл успешно загружен', url });
//   } catch (e) {
//     console.error('Ошибка при загрузке markdown-файла (staff):', e);
//     return res.status(500).json({ message: 'Ошибка загрузки файла', error: e.message });
//   }
// });

// router.put('/stuffs-mp/:id', fileMiddleware.any(), async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const id = req.params.id;
//     const staff = await StaffNew.findByPk(id, {
//       include: [{ model: ConstructorStaffNew, as: 'ConstructorStaffNews' }],
//     });
//     if (!staff) return res.status(404).json({ error: 'Карточка не найдена' });

//     const meta = req.body?.meta ? JSON.parse(req.body.meta) : {};
//     const category = Array.isArray(meta.category)
//       ? meta.category
//       : meta.category
//       ? [meta.category]
//       : [];
   
//     const oldMdLinks = collectMarkdownLinksFromConstructor(staff.ConstructorStaffNews);

//     const oldAvatar = staff.img || null;
 
//     const oldDynamicFiles = (staff.ConstructorStaffNews || []).flatMap((c) => {
//       const inputs = flattenInputs(c.data);
//       const fileInputs = inputs
//         .filter((inp) => inp?.type === 'file')
//         .flatMap((inp) => toArray(inp.value))
//         .filter(Boolean);
//       return [
//         ...(c.image ? [c.image] : []),
//         ...fileInputs,
//       ];
//     });

//     const newPhotoAva = (req.files || []).find((f) => f.fieldname === 'photoAva');
//     let newAvatarKey = oldAvatar;
//     if (newPhotoAva) newAvatarKey = await uploadFileToS3(newPhotoAva, STAFF_BASE_DIR);

//     const filesMap = {};
//     const batchId =
//       req.batchId ||
//       (req.batchId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`);

//     for (const f of req.files || []) {
//       const m = f.fieldname.match(/^dynamic_block_(\d+)_input_(\d+)(\[\])?$/);
//       if (!m) continue;
//       const b = Number(m[1]);
//       const i = Number(m[2]);
//       filesMap[b] ??= {};
//       filesMap[b][i] ??= [];
//       f.originalname = `${batchId}__${f.originalname || 'file'}`;
//       const savedKey = await uploadFileToS3(f, STAFF_FILES_DIR);
//       filesMap[b][i].push(savedKey);
//     }

//     const incomingBlocks = Array.isArray(meta.dynamicBlocks) ? meta.dynamicBlocks : [];
//     const mergedBlocks = incomingBlocks.map((group, b) =>
//       (Array.isArray(group) ? group : []).map((inp, i) => {
//         if (filesMap[b]?.[i]?.length) {
//           const arr = filesMap[b][i];
//           return { ...inp, value: arr.length === 1 ? arr[0] : arr };
//         }
//         return inp;
//       }),
//     );
  
//     const actualDynamicFiles = mergedBlocks
//       .flatMap((group) => flattenInputs(group))
//       .filter((inp) => inp?.type === 'file')
//       .flatMap((inp) => toArray(inp.value))
//       .filter(Boolean);

//     await staff.update(
//       {
//         name: String(meta.name || '').trim(),
//         position: meta.position || '',
//         description: meta.description || '',
//         category,
//         isVisible: meta.isVisible ?? true,
//         sortIndex: staff.sortIndex,
//         userId: meta.userId ?? null,
//         visibilityByCategory: meta.visibilityByCategory || {},
//         img: newAvatarKey,
//       },
//       { transaction: t },
//     );

//     await ConstructorStaffNew.destroy({ where: { staffNewId: id }, transaction: t });
//     for (const group of mergedBlocks) {
//       let image = null;
//       const flat = flattenInputs(group);
//       const firstFileIdx = flat.findIndex(
//         (x) => x.type === 'file' && (typeof x.value === 'string' || Array.isArray(x.value)),
//       );
//       if (firstFileIdx >= 0) {
//         const v = flat[firstFileIdx].value;
//         image = Array.isArray(v) ? v[0] ?? null : v;
//       }
//       await ConstructorStaffNew.create({ staffNewId: id, data: group, image }, { transaction: t });
//     }

//     const newMdLinks = collectMarkdownLinksFromConstructor(mergedBlocks.map((g) => ({ data: g })));
//     const removedMd = oldMdLinks.filter((u) => !newMdLinks.includes(u));

//     await t.commit();
 
//     const oldAll = [
//       ...new Set([...(oldDynamicFiles || []), ...(oldAvatar ? [oldAvatar] : [])]),
//     ].filter(Boolean);
//     const newAll = [
//       ...new Set([...(actualDynamicFiles || []), ...(newAvatarKey ? [newAvatarKey] : [])]),
//     ].filter(Boolean);
//     const toDelete = oldAll
//       .map((v) => (typeof v === 'string' ? v.trim() : v))
//       .filter(Boolean)
//       .filter((v) => !newAll.includes(v));

//     await Promise.all(toDelete.map(deleteImageFromS3Safe));

//     await Promise.all(
//       removedMd.map(async (url) => {
//         const parsed = extractMdFileNameAndFolder(url);
//         if (!parsed) return;
//         try {
//           await deleteFileFromS3(parsed.fileName, parsed.folder);
//         } catch (e) {
//           console.error('Не удалось удалить markdown-файл:', url, e);
//         }
//       }),
//     );

//     const full = await StaffNew.findByPk(id, {
//       include: [
//         {
//           model: ConstructorStaffNew,
//           as: 'ConstructorStaffNews',
//           separate: true,
//           order: [['id', 'ASC']],
//         },
//       ],
//     });
//     res.json(full);
//   } catch (e) {
//     await t.rollback();
//     console.error(e);
//     res.status(500).json({ error: 'Ошибка обновления карточки (multipart)' });
//   }
// });

// router.patch('/stuffs/:id/visibility', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { isVisible, category } = req.body;

//     const row = await StaffNew.findByPk(id);
//     if (!row) return res.status(404).json({ error: 'Карточка не найдена' });

//     if (category) {
//       const vbc = { ...(row.visibilityByCategory || {}) };
//       vbc[category] = !!isVisible;
//       await row.update({ visibilityByCategory: vbc });
//       return res.json({ id, category, isVisible: !!isVisible });
//     }

//     await row.update({ isVisible: !!isVisible });
//     return res.json({ id, isVisible: !!isVisible });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: 'Ошибка смены видимости' });
//   }
// });

// router.put('/stuffs/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const payload = { ...req.body };
//     if (payload.category && !Array.isArray(payload.category)) payload.category = [payload.category];

//     const [cnt] = await StaffNew.update(payload, { where: { id } });
//     if (!cnt) return res.status(404).json({ error: 'Карточка не найдена' });

//     const row = await StaffNew.findByPk(id, {
//       include: [
//         {
//           model: ConstructorStaffNew,
//           as: 'ConstructorStaffNews',
//           separate: true,
//           order: [['id', 'ASC']],
//         },
//       ],
//     });
//     res.json(row);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: 'Ошибка обновления карточки' });
//   }
// });

// router.get('/stuffs/:id/dynamic', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const cons = await ConstructorStaffNew.findAll({
//       where: { staffNewId: id },
//       order: [['id', 'ASC']],
//     });
//     res.json({
//       dynamicData: cons.map((c) => c.data),
//       dynamicImages: cons.map((c) => c.image).filter(Boolean),
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: 'Ошибка получения динамических данных' });
//   }
// });

// router.patch('/stuffs/reorder', async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const { items } = req.body;
//     for (const it of items) {
//       await StaffNew.update({ sortIndex: it.sortIndex }, { where: { id: it.id }, transaction: t });
//     }
//     await t.commit();
//     res.json({ ok: true });
//   } catch (e) {
//     await t.rollback();
//     console.error(e);
//     res.status(500).json({ error: 'Ошибка смены порядка' });
//   }
// });

// router.post('/stuffs/:id/copy', async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const src = await StaffNew.findByPk(req.params.id, {
//       include: [{ model: ConstructorStaffNew, as: 'ConstructorStaffNews' }],
//     });
//     if (!src) {
//       await t.rollback();
//       return res.status(404).json({ error: 'Карточка не найдена' });
//     }

//     const nextSort = await getNextSortIndex(t);

//     const data = src.toJSON();
//     delete data.id;
//     data.sortIndex = nextSort;
//     const copy = await StaffNew.create(data, { transaction: t });

//     for (const c of src.ConstructorStaffNews || []) {
//       await ConstructorStaffNew.create(
//         { staffNewId: copy.id, data: c.data, image: c.image },
//         { transaction: t },
//       );
//     }

//     await t.commit();
//     res.status(201).json({ copiedId: copy.id });
//   } catch (e) {
//     await t.rollback();
//     console.error(e);
//     res.status(500).json({ error: 'Ошибка копирования' });
//   }
// });

// router.delete('/stuffs/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { category } = req.query;

//     const staff = await StaffNew.findByPk(id, {
//       include: [{ model: ConstructorStaffNew, as: 'ConstructorStaffNews' }],
//     });
//     if (!staff) return res.status(404).json({ error: 'Карточка не найдена' });

//     if (category) {
//       const cur = Array.isArray(staff.category) ? staff.category : [];
//       if (!cur.includes(category)) {
//         return res.json({ id, removed: false, reason: 'not-in-category' });
//       }
//       const next = cur.filter((c) => c !== category);
//       const vbc = { ...(staff.visibilityByCategory || {}) };
//       delete vbc[category];

//       await staff.update({ category: next, visibilityByCategory: vbc });

//       if (next.length === 0) {
//         const files = [];

//         if (staff.img) files.push(staff.img);

//         for (const c of staff.ConstructorStaffNews || []) {
//           if (c.image) files.push(c.image);
//           const inputs = flattenInputs(c.data);
//           const fileInputs = inputs
//             .filter((inp) => inp?.type === 'file')
//             .flatMap((inp) => toArray(inp.value))
//             .filter(Boolean);
//           files.push(...fileInputs);
//         }

//         const mdLinks = collectMarkdownLinksFromConstructor(staff.ConstructorStaffNews);

//         const unique = [
//           ...new Set(files.map((x) => (typeof x === 'string' ? x.trim() : x)).filter(Boolean)),
//         ];
//         await Promise.all(unique.map(deleteImageFromS3Safe));

//         await Promise.all(
//           mdLinks.map(async (url) => {
//             const parsed = extractMdFileNameAndFolder(url);
//             if (!parsed) return;
//             try {
//               await deleteFileFromS3(parsed.fileName, parsed.folder);
//             } catch {}
//           }),
//         );

//         await ConstructorStaffNew.destroy({ where: { staffNewId: id } });
//         await StaffNew.destroy({ where: { id } });
//         return res.json({ id, deleted: true, categoryRemoved: category });
//       }

//       return res.json({ id, categoryRemoved: category, remainingCategories: next });
//     }

//     const files = [];

//     if (staff.img) files.push(staff.img);

//     for (const c of staff.ConstructorStaffNews || []) {
//       if (c.image) files.push(c.image);
//       const inputs = flattenInputs(c.data);
//       const fileInputs = inputs
//         .filter((inp) => inp?.type === 'file')
//         .flatMap((inp) => toArray(inp.value))
//         .filter(Boolean);
//       files.push(...fileInputs);
//     }

//     const mdLinks = collectMarkdownLinksFromConstructor(staff.ConstructorStaffNews);

//     const unique = [
//       ...new Set(files.map((x) => (typeof x === 'string' ? x.trim() : x)).filter(Boolean)),
//     ];
//     await Promise.all(unique.map(deleteImageFromS3Safe));

//     await Promise.all(
//       mdLinks.map(async (url) => {
//         const parsed = extractMdFileNameAndFolder(url);
//         if (!parsed) return;
//         try {
//           await deleteFileFromS3(parsed.fileName, parsed.folder);
//         } catch {}
//       }),
//     );

//     await ConstructorStaffNew.destroy({ where: { staffNewId: id } });
//     await StaffNew.destroy({ where: { id } });

//     res.json({ id, deleted: true });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: 'Ошибка удаления' });
//   }
// });

// router.delete('/delete-markdown-file', async (req, res) => {
//   try {
//     const { url } = req.body || {};
//     if (!url) return res.status(400).json({ message: 'URL не предоставлен' });

//     const parsed = extractMdFileNameAndFolder(url);
//     if (!parsed) return res.status(400).json({ message: 'Невозможно определить имя файла/папку' });

//     await deleteFileFromS3(parsed.fileName, parsed.folder);
//     return res.status(200).json({ message: 'Файл удалён' });
//   } catch (e) {
//     console.error('Ошибка при удалении markdown-файла (staff):', e);
//     return res.status(500).json({ message: 'Ошибка удаления файла', error: e.message });
//   }
// });

// module.exports = router;
