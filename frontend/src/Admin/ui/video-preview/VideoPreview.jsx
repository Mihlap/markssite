import { memo, useEffect, useState } from 'react';
import s from './Styles.module.css';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

function VideoPreview({ file, onRemove, label }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (!file) return;
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setSrc(url);
      return () => URL.revokeObjectURL(url);
    }
    if (typeof file === 'string') {
      setSrc(file.startsWith('http') ? file : `${bucket_url}/images/imageAdd/${file}`);
    }
  }, [file]);

  if (!src) return null;

  return (
    <div>
      {label && <div className={s.label}>{label}</div>}
      <div className={s.item}>
        <video
          className={s.video}
          src={src}
          preload="metadata"
          muted
          loop
          autoPlay
          playsInline
        />
        <button type="button" className={s.remove} onClick={onRemove} aria-label="Удалить" />
      </div>
    </div>
  );
}

export default memo(VideoPreview);
