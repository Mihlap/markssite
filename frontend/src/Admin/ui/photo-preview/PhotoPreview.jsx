import { memo, useEffect, useState } from 'react';
import styles from './Styles.module.css';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

function PhotoPreview({ files, variant = 'single', onRemove, color = 'blue', label, customStyles }) {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (!files || files.length === 0) {
      setPreviews([]);
      return;
    }

    const objectUrls = [];
    const urls = Array.from(files).map((file) => {
      // If it's a string (existing URL from S3), use it directly
      if (typeof file === 'string') {
        // If it's already a full URL, use as-is; otherwise prepend bucket_url with images path
        return file.startsWith('http') ? file : `${bucket_url}/images/imageAdd/${file}`;
      }
      // If it's a File object, create an object URL
      const objectUrl = URL.createObjectURL(file);
      objectUrls.push(objectUrl);
      return objectUrl;
    });
    setPreviews(urls);

    return () => {
      // Only revoke object URLs (not S3 URLs)
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
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
