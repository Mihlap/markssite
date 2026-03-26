const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

/**
 * Проверяет, является ли URL полным (http/https/blob)
 * @param {string} url - URL для проверки
 * @returns {boolean}
 */
export const isFullUrl = (url = '') => /^https?:\/\//i.test(url) || /^blob:/i.test(url);

/**
 * Преобразует относительный путь в полный URL к S3 bucket
 * @param {string} val - Относительный путь или полный URL
 * @returns {string} - Полный URL
 */
export const toBucketSrc = (val) => {
    if (!val) return '';
    if (isFullUrl(val)) return val;
    const base = String(bucket_url || '').replace(/\/+$/, '');
    const key = String(val).replace(/^\/+/, '');
    return `${base}/${key}`;
};

