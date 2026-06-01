import { isHttp, encodePathnameOnly } from './media';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

export const normalizeConstructorGroups = (groups) => {
  if (!Array.isArray(groups)) return [];
  const looksImageInput = (inp) => {
    const t = String(inp?.type || '').toLowerCase();
    const lbl = String(inp?.label || '').toLowerCase();
    return t === 'file' || t === 'image' || /изображ|image|img/.test(lbl);
  };
  
  const normalizeUrlForHistory = (v) => {
    if (!v) return '';
    if (isHttp(String(v))) return encodePathnameOnly(String(v));
    const trimmed = String(v).replace(/^\/+/, ''); 
    const path = trimmed.includes('/') ? trimmed : `images/${trimmed}`;
    return `${bucket_url}/${path}`;
  };
  
  return groups.map((group) =>
    (Array.isArray(group) ? group : []).map((inp) => {
      if (!inp) return inp;
      if (!looksImageInput(inp)) return inp;
      const v = inp.value;
      if (typeof v === 'string') return { ...inp, value: normalizeUrlForHistory(v) };
      if (Array.isArray(v)) {
        return {
          ...inp,
          value: v.map((vv) =>
            typeof vv === 'string' ? normalizeUrlForHistory(vv) : vv && vv.src ? { ...vv, src: normalizeUrlForHistory(vv.src) } : vv
          ),
        };
      }
      if (v && typeof v === 'object' && typeof v.src === 'string') {
        return { ...inp, value: { ...v, src: normalizeUrlForHistory(v.src) } };
      }
      return inp;
    })
  );
};
