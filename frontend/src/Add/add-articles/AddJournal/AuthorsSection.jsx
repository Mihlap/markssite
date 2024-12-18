import React, { useCallback, useEffect, useState } from 'react';
import styles from './AuthorsSection.module.scss';
import ImagePreviewSection from './ImagePreviewSection';
import compressImageFile from 'browser-image-compression';

export default function AuthorsSection({ authors = [], onAuthorsChange, onImageChange }) {
  const [localImages, setLocalImages] = useState({});

  useEffect(() => {
    if (!Array.isArray(authors) || authors.length === 0) {
      onAuthorsChange([{ id: Date.now(), number: 1, name: '', image: null, isLoading: false }]);
    }
  }, [authors, onAuthorsChange]);

  const compressImage = useCallback(async (file) => {
    const options = {
      maxSizeMB: 4,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      return await compressImageFile(file, options);
    } catch (error) {
      console.error('Ошибка при сжатии изображения:', error);
      return file;
    }
  }, []);

  const handleAddAuthorBlock = useCallback(() => {
    const newAuthor = { id: Date.now(), number: authors.length + 1, name: '', image: null, isLoading: false };
    const updatedAuthors = [...authors, newAuthor];
    onAuthorsChange(updatedAuthors);
  }, [authors, onAuthorsChange]);

  const handleUpdateAuthorBlock = useCallback(
    (id, updatedData) => {
      const updatedAuthors = authors.map((author) => (author.id === id ? { ...author, ...updatedData } : author));
      onAuthorsChange(updatedAuthors);
    },
    [authors, onAuthorsChange]
  );

  const handleRemoveAuthorBlock = useCallback(
    (id) => {
      const updatedAuthors = authors.filter((author) => author.id !== id);
      const { [id]: _, ...restImages } = localImages;
      setLocalImages(restImages);
      onAuthorsChange(updatedAuthors);
    },
    [authors, onAuthorsChange, localImages]
  );

const handleFileChange = useCallback(
  async (id, file) => {
    if (!file) return;

    handleUpdateAuthorBlock(id, { isLoading: true });

    try {
      const compressedFile = await compressImage(file);

      setLocalImages((prev) => ({ ...prev, [id]: compressedFile }));

      onImageChange(id, compressedFile);

      handleUpdateAuthorBlock(id, { image: compressedFile.name, isLoading: false });
    } catch (error) {
      console.error('Ошибка обработки изображения:', error);
      handleUpdateAuthorBlock(id, { isLoading: false });
    }
  },
  [handleUpdateAuthorBlock, onImageChange, compressImage]
);


const handleRemoveImage = useCallback(
    (id) => {
      setLocalImages((prev) => ({ ...prev, [id]: null }));
      onAuthorsChange(authors.map((author) => (author.id === id ? { ...author, image: null } : author)));
    },
    [onAuthorsChange, authors]
  );

  return (
    <div className={styles.form_container}>
      {authors?.map((author) => (
        <div key={author.id} className={styles.form_container__block_gray_one}>
          <button className={styles.form_container__close_button} onClick={() => handleRemoveAuthorBlock(author.id)}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.99999 6.53013L0.530313 12L0 11.4697L5.46969 5.99982L0.000346988 0.530327L0.53066 2.82526e-05L5.99999 5.46951L11.4694 0L11.9997 0.530299L6.53029 5.99982L12 11.4697L11.4697 12L5.99999 6.53013Z"
                fill="#566272"
              />
            </svg>
          </button>
          <div className={styles.form_container__checkbox_block}>
            <div>{`Автор статьи ${author.number}`}</div>
            <label htmlFor={`author-image-${author.id}`} className={styles.slider_container__customFileUpload}>
              <input
                type="file"
                id={`author-image-${author.id}`}
                onChange={(e) => handleFileChange(author.id, e.target.files[0])}
                accept="image/*"
              />
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="Frame 4684">
                  <path
                    id="Vector"
                    d="M11.8349 7.54949L5.64223 7.54949C5.46569 7.54642 5.2903 7.57854 5.1263 7.64398C4.96231 7.70942 4.81299 7.80686 4.68705 7.93062C4.56112 8.05439 4.4611 8.20199 4.39282 8.36483C4.32454 8.52766 4.28938 8.70246 4.28938 8.87903C4.28937 9.0556 4.32454 9.2304 4.39282 9.39323C4.4611 9.55607 4.56112 9.70367 4.68705 9.82744C4.81299 9.9512 4.96231 10.0486 5.1263 10.1141C5.2903 10.1795 5.46569 10.2116 5.64223 10.2086L11.754 10.1277C12.4512 10.1156 13.1158 9.83011 13.6046 9.33275C14.0934 8.8354 14.3673 8.16596 14.3673 7.46862C14.3673 6.77129 14.0934 6.10185 13.6046 5.60449C13.1158 5.10713 12.4512 4.82165 11.754 4.80953L5.64223 4.88946C4.58413 4.88946 3.56936 5.30979 2.82117 6.05798C2.07298 6.80617 1.65265 7.82093 1.65265 8.87903C1.65265 9.93713 2.07298 10.9519 2.82117 11.7001C3.56936 12.4483 4.58413 12.8686 5.64223 12.8686L11.5189 12.8752"
                    stroke="currentColor"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
              <div className={styles.slider_container__uploadTextForm}>Загрузить изображения</div>
            </label>
            <ImagePreviewSection
              images={localImages[author.id] ? [URL.createObjectURL(localImages[author.id])] : []}
              onRemove={() => handleRemoveImage(author.id)}
              isLoading={author.isLoading}
            />
            <div className={styles.form_container__heading_block}>
              <label htmlFor={`author-name-${author.id}`} className={styles.input_field__label}></label>
              <input
                id={`author-name-${author.id}`}
                type="text"
                className={styles.form_container__heading_block_input}
                placeholder="ФИО"
                value={author.name}
                maxLength={150}
                onChange={(e) =>
                  onAuthorsChange(authors.map((a) => (a.id === author.id ? { ...a, name: e.target.value } : a)))
                }
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        className={styles.add_author_button}
        onClick={handleAddAuthorBlock}
        aria-label="Добавить автора">
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12.5" cy="12" r="12" fill="currentColor" />
          <path
            d="M6.5 12H12.5M18.5 12H12.5M12.5 12V6M12.5 12V18"
            stroke="#F6F6F6"
            strokeWidth="1.2"
            strokeLinecap="square"
          />
        </svg>
        <span className={styles.add_author_text}>Добавить автора</span>
      </button>
    </div>
  );
}
