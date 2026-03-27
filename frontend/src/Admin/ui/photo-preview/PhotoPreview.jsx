import { memo, useEffect, useRef, useState } from 'react';
import styles from './Styles.module.css';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

function PhotoPreview({ files, variant = 'single', onRemove, color = 'blue', label, customStyles }) {
  const [previews, setPreviews] = useState([]);
  const urlMapRef = useRef(new Map());

  useEffect(() => {
    return () => {
      urlMapRef.current.forEach((url) => URL.revokeObjectURL(url));
      urlMapRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!files || files.length === 0) {
      setPreviews([]);
      return;
    }

    const currentBlobs = new Set(Array.from(files).filter((f) => f instanceof Blob));

    // Revoke URLs for files no longer in the list
    urlMapRef.current.forEach((url, file) => {
      if (!currentBlobs.has(file)) {
        URL.revokeObjectURL(url);
        urlMapRef.current.delete(file);
      }
    });

    const urls = Array.from(files)
      .map((file) => {
        if (!file) return null;
        if (typeof file === 'string') {
          return file.startsWith('http') ? file : `${bucket_url}/images/imageAdd/${file}`;
        }
        if (file instanceof Blob) {
          if (!urlMapRef.current.has(file)) {
            urlMapRef.current.set(file, URL.createObjectURL(file));
          }
          return urlMapRef.current.get(file);
        }
        return null;
      })
      .filter(Boolean);

    setPreviews(urls);
  }, [files]);

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
