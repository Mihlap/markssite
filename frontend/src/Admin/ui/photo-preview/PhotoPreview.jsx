import { memo, useEffect, useMemo, useRef, useState } from 'react';
import styles from './Styles.module.css';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

const resolveStringUrl = (file, folder) => {
  if (typeof file !== 'string') return null;
  return file.startsWith('http') ? file : `${bucket_url}/images/${folder}/${file}`;
};

function PhotoPreview({ files, variant = 'single', onRemove, color = 'blue', label, customStyles, imageFolder = 'imageAdd' }) {
  const urlMapRef = useRef(new Map());
  const [blobPreviews, setBlobPreviews] = useState([]);

  const stringPreviews = useMemo(() => {
    if (!files) return [];
    return Array.from(files).map((f) => resolveStringUrl(f, imageFolder)).filter(Boolean);
  }, [files, imageFolder]);

  useEffect(() => {
    return () => {
      urlMapRef.current.forEach((url) => URL.revokeObjectURL(url));
      urlMapRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!files || files.length === 0) {
      setBlobPreviews([]);
      return;
    }

    const currentBlobs = new Set(Array.from(files).filter((f) => f instanceof Blob));
    urlMapRef.current.forEach((url, file) => {
      if (!currentBlobs.has(file)) {
        URL.revokeObjectURL(url);
        urlMapRef.current.delete(file);
      }
    });

    const urls = Array.from(files)
      .map((file) => {
        if (!file || typeof file === 'string') return null;
        if (file instanceof Blob) {
          if (!urlMapRef.current.has(file)) {
            urlMapRef.current.set(file, URL.createObjectURL(file));
          }
          return urlMapRef.current.get(file);
        }
        return null;
      })
      .filter(Boolean);

    setBlobPreviews(urls);
  }, [files]);

  const previews = useMemo(() => {
    const seen = new Set();
    return [...stringPreviews, ...blobPreviews].filter((url) => {
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    });
  }, [stringPreviews, blobPreviews]);

  if (previews.length === 0) return null;

  return (
    <div style={customStyles}>
      {label && <div className={styles.preview__label}>{label}</div>}
      <div className={styles.preview} data-variant={variant}>
        {previews.map((url, index) => (
          <div key={url} className={styles.preview__item}>
            <img src={url} alt="" className={styles.preview__img} />
            {onRemove && (
              <button
                type="button"
                className={styles.preview__remove}
                onClick={() => onRemove(index)}
                aria-label="Удалить"
                data-color={color}
              >
                &times;
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(PhotoPreview);
