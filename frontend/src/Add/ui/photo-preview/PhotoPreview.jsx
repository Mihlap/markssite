import { memo, useEffect, useState } from 'react';
import styles from './Styles.module.css';

function PhotoPreview({ files, variant = 'single', onRemove, color = 'blue', label }) {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (!files || files.length === 0) {
      setPreviews([]);
      return;
    }

    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  if (previews.length === 0) return null;

  return (
    <div>
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
