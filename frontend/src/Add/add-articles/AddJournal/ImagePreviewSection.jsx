import React from 'react';
import styles from './ImagePreviewSection.module.scss';

export default function ImagePreviewSection({ images, onRemove, isLoading }) {
  return (
    <div className={styles.preview_section}>
      {isLoading && <div className={styles.loading}>Загрузка . . .</div>}
      <div className={styles.preview_photos_container}>
        {images.map((preview, index) => (
          <div key={index} className={styles.preview_photos_container__block}>
            <img
              className={styles.preview_photos_container__img}
              src={typeof preview === 'string' ? preview : URL.createObjectURL(preview)}
              alt={`Preview ${index}`}
            />
            <div className={styles.preview_photos_container__remove_icon} onClick={() => onRemove(index)}>
              <span></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
