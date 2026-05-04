import { memo, useEffect, useState } from 'react';
import s from './Styles.module.css';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

function VideoPreview({ file, embedUrl, onRemove, label, color = 'salmon' }) {
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

  if (!src && !embedUrl) return null;

  return (
    <div>
      {label && <div className={s.label}>{label}</div>}
      <div className={s.item}>
        {embedUrl ? (
          <iframe
            className={s.iframe}
            src={embedUrl}
            title="Video Preview"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            className={s.video}
            src={src}
            preload="metadata"
            muted
            loop
            autoPlay
            playsInline
          />
        )}
        {onRemove && (
          <button type="button" className={`${s.remove}${color === 'blue' ? ` ${s.removeBlue}` : ''}`} onClick={onRemove} aria-label="Удалить" />
        )}
      </div>
    </div>
  );
}

export default memo(VideoPreview);
