const bucket_url = (process.env.REACT_APP_S3_BUCKET_URL || '').replace(/\/+$/, '');

const isHttp = (s) => typeof s === 'string' && /^https?:\/\//i.test(s);

export function toHistoryImageSrc(raw) {
    if (!raw) return '';
    if (isHttp(raw)) return raw;
    if (!bucket_url) return String(raw);
    return `${bucket_url}/${String(raw).replace(/^\/+/, '')}`;
}

export function getHistoryPreviewSrc(item) {
    if (!item) return '';
    if (item.previewImageUrl) return toHistoryImageSrc(item.previewImageUrl);
    return toHistoryImageSrc(item.img);
}

export function preloadHistoryPreviews(items, limit = 10) {
    if (!Array.isArray(items) || !items.length) return;

    const seen = new Set();
    let count = 0;

    for (const item of items) {
        if (count >= limit) break;
        const src = getHistoryPreviewSrc(item);
        if (!src || seen.has(src)) continue;
        seen.add(src);
        count += 1;

        const img = new Image();
        img.decoding = 'async';
        img.src = src;
    }
}
