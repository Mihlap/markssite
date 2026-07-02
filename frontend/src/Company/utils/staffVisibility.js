const norm = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[-–—]/g, '-')
    .trim();

const LEADERSHIP_ALIASES = ['руководство', 'leadership', 'management'];
const SCIENCE_ALIASES = [
  'научное сопровождение',
  'научно-техническое сопровождение',
  'scientific support',
  'science',
  'руководители отделов',
  'department managers',
];

const CANONICAL_CATEGORY = {
  руководство: 'Руководство',
  leadership: 'Руководство',
  management: 'Руководство',
  'научное сопровождение': 'Научно-техническое сопровождение',
  'научно-техническое сопровождение': 'Научно-техническое сопровождение',
  'scientific support': 'Научно-техническое сопровождение',
  science: 'Научно-техническое сопровождение',
  'руководители отделов': 'Руководители отделов',
  'department managers': 'Руководители отделов',
  hr: 'HR',
};

export const toCategoryArray = (val) => {
  if (Array.isArray(val)) return val;
  if (!val) return [];
  const str = String(val).trim();
  if (str.startsWith('[')) {
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      // ignore invalid JSON
    }
  }
  return str
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

export const normalizeStaffCategories = (val) => {
  const unique = new Set();
  for (const c of toCategoryArray(val)) {
    const key = norm(c);
    unique.add(CANONICAL_CATEGORY[key] || c);
  }
  return [...unique];
};

const aliasGroupFor = (displayName) => {
  const n = norm(displayName);
  if (LEADERSHIP_ALIASES.includes(n)) return LEADERSHIP_ALIASES;
  if (SCIENCE_ALIASES.includes(n)) return SCIENCE_ALIASES;
  if (n === 'hr') return ['hr'];
  return [n];
};

export const aliasSetFor = (displayName) => new Set(aliasGroupFor(displayName));

export const staffBelongsToCategory = (staff, displayCategory) => {
  const aliases = aliasSetFor(displayCategory);
  const hasAlias = (v) => aliases.has(norm(v));
  const cats = normalizeStaffCategories(staff?.category);
  return cats.some(hasAlias);
};

export const isStaffVisibleInCategory = (staff, displayCategory) => {
  if (!staffBelongsToCategory(staff, displayCategory)) return false;

  const aliases = aliasSetFor(displayCategory);
  const hasAlias = (v) => aliases.has(norm(v));
  const vbc =
    staff?.visibilityByCategory && typeof staff.visibilityByCategory === 'object'
      ? staff.visibilityByCategory
      : {};

  for (const [key, value] of Object.entries(vbc)) {
    if (hasAlias(key)) {
      if (value === false) return false;
      if (value === true) return true;
    }
  }

  return staff?.isVisible !== false;
};
