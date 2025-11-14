export const isHttp = (s) => typeof s === 'string' && /^https?:\/\//i.test(s);

export const encodePathnameOnly = (u) => {
  if (!isHttp(u)) return u;
  try {
    const url = new URL(u);
    url.pathname = url.pathname
      .split('/')
      .map((seg) => (seg ? encodeURIComponent(decodeURIComponent(seg)) : seg))
      .join('/');
    return url.toString();
  } catch {
    return encodeURI(u);
  }
};

export const absolutizeToBucket = (raw, bucketUrl) => {
  if (!raw) return '';
  if (isHttp(raw)) return encodePathnameOnly(raw);
  const trimmed = String(raw).replace(/^\/+/, '');
  const path = trimmed.includes('/') ? trimmed : `images/imageAdd/${trimmed}`;
  return `${bucketUrl}/${path}`;
};

export const toBestImageSrc = (val, bucketUrl) => {
  if (!val) return '';
  if (typeof val === 'string') return absolutizeToBucket(val, bucketUrl);
  if (Array.isArray(val) && val.length) {
    const first = val[0];
    if (typeof first === 'string') return absolutizeToBucket(first, bucketUrl);
    if (first && typeof first === 'object') {
      if (typeof first.src === 'string') return absolutizeToBucket(first.src, bucketUrl);
      if (typeof first.url === 'string') return absolutizeToBucket(first.url, bucketUrl);
      if (typeof first.path === 'string') return absolutizeToBucket(first.path, bucketUrl);
      if (typeof first.Location === 'string') return absolutizeToBucket(first.Location, bucketUrl);
    }
  }
  if (val && typeof val === 'object') {
    if (typeof val.src === 'string') return absolutizeToBucket(val.src, bucketUrl);
    if (typeof val.url === 'string') return absolutizeToBucket(val.url, bucketUrl);
    if (typeof val.path === 'string') return absolutizeToBucket(val.path, bucketUrl);
    if (typeof val.Location === 'string') return absolutizeToBucket(val.Location, bucketUrl);
  }
  return '';
};

export const rewriteMdLinksToBucket = (md = '', bucketUrl = '') =>
  String(md).replace(/(!?\[[^\]]*\]\()([^)]+)(\))/g, (_m, p1, url, p3) => {
    const clean = String(url).trim();
    const final = isHttp(clean) ? encodePathnameOnly(clean) : absolutizeToBucket(clean, bucketUrl);
    return `${p1}${final}${p3}`;
  });
