const REQUIRED_TEXT_MSG = 'Обязательно для заполнения';
const REQUIRED_FILE_MSG = 'Обязательно для загрузки';

const isEmptyVal = (v) => {
  if (v == null) return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'string') return v.trim() === '';
  return false;
};

// !!!!! на всякий случай несколько комментариев, которые лучше не удалять !!!!! 

// Этим удаляет HTML-обёртки от редакторов (напр. <p><br></p>), &nbsp; и zero-width символы
const stripHtml = (s = '') =>
  String(s)
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();

const isEmptyText = (v) => stripHtml(v) === '';

export function validateDynamicBlocks(dynamicData = [], dynamicPreviews = [], options = {}) {
  const { requiredBlockIds = [], checkMissingBlocks = true } = options;

  const errors = {};
  const presentBlockIds = new Set();

  const get = (bi, ii) => dynamicData?.[bi]?.[ii] || {};
  const getVal = (bi, ii) => get(bi, ii).value;
  const getType = (bi, ii) => get(bi, ii).type;
  const getReq = (bi, ii) => !!get(bi, ii).required;
  const getBlockReq = (bi, ii) => !!get(bi, ii).blockRequired; 

  const filePresent = (bi, ii) => {
    const v = getVal(bi, ii);
    const previews = dynamicPreviews?.[bi]?.[ii] ?? [];
    if (Array.isArray(v)) return v.length > 0 || previews.length > 0;
    return !!v || previews.length > 0;
  };

  // Вот тут собирает присутствующие blockId (по одному на блок)
  dynamicData.forEach((block) => {
    let id = null;
    (block || []).forEach((inp) => {
      if (inp?.blockId && !id) id = inp.blockId;
    });
    if (id) presentBlockIds.add(id);
  });

  // 1) Полевая валидация (только если blockRequired И само поле required)
  dynamicData.forEach((block, bi) => {
    (block || []).forEach((_, ii) => {
      const t = getType(bi, ii);
      const key = `${bi}-${ii}`;
      const blockRequired = getBlockReq(bi, ii);
      const fieldRequired = getReq(bi, ii);
      const v = getVal(bi, ii);      

      if (!blockRequired) return;

      if (t === 'file') {
        const present = filePresent(bi, ii);
        if (fieldRequired && !present) {
          errors[key] = REQUIRED_FILE_MSG;
        }
        return;
      }

      if (t === 'text' || t === 'textarea' || t === 'markdown') {
        const empty = isEmptyText(v);
        if (fieldRequired && empty) {
          errors[key] = REQUIRED_TEXT_MSG;
        }
        return;
      }

      const empty = isEmptyVal(v);
      if (fieldRequired && empty) {
        errors[key] = REQUIRED_TEXT_MSG;
      }
    });
  });

  // 2) Парные поля (pairKey)
  dynamicData.forEach((block, bi) => {
    const groups = {};
    (block || []).forEach((inp, ii) => {
      const pk = inp?.pairKey;
      if (!pk) return;
      if (!groups[pk]) groups[pk] = [];
      groups[pk].push({ ii, inp });
    });

    Object.entries(groups).forEach(([pk, list]) => {
      if (list.length < 2) return;

      const anyValuePresent = list.some(({ inp }) => {
        const v = inp?.value;
        if (inp.type === 'file') return !isEmptyVal(v);
        if (['text', 'textarea', 'markdown'].includes(inp.type)) return !isEmptyText(v);
        return !isEmptyVal(v);
      });

      if (!anyValuePresent) return;

      const filled = list.map(({ inp }) => {
        const v = inp?.value;
        if (inp.type === 'file') return !isEmptyVal(v);
        if (['text', 'textarea', 'markdown'].includes(inp.type)) return !isEmptyText(v);
        return !isEmptyVal(v);
      });

      const allEmpty = filled.every((f) => !f);
      const allFilled = filled.every((f) => f);

      if (!allEmpty && !allFilled) {
        list.forEach(({ ii, inp }) => {
          const k = `${bi}-${ii}`;
          errors[k] = inp.type === 'file' ? REQUIRED_FILE_MSG : REQUIRED_TEXT_MSG;
        });
      }
    });
  });

  // 3) Отсутствующие обязательные блоки
  const missingBlocks = [];
  if (checkMissingBlocks && Array.isArray(requiredBlockIds) && requiredBlockIds.length) {
    requiredBlockIds.forEach((reqId) => {
      if (!presentBlockIds.has(reqId)) missingBlocks.push(reqId);
    });
  }

  const ok = Object.keys(errors).length === 0 && missingBlocks.length === 0;

  return { ok, errors, missingBlocks };
}
