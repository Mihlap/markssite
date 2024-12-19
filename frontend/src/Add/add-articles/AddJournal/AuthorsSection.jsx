import React, { useCallback, useEffect, useState } from 'react';
import styles from './AuthorsSection.module.scss';
import ImagePreviewSection from './ImagePreviewSection';
import compressImageFile from 'browser-image-compression';

function AuthorsSection({ authors = [], onAuthorsChange, onImageChange }) {
  const [localImages, setLocalImages] = useState({}); // Для локального хранения файлов

  useEffect(() => {
    if (!Array.isArray(authors)) {
      onAuthorsChange([]);
    } else if (authors.length === 0) {
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
      const updatedAuthors = authors
        .filter((author) => author.id !== id)
        .map((author, index) => ({ ...author, number: index + 1 }));

      const { [id]: _, ...restImages } = localImages; // Удаляем локальный файл
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

        handleUpdateAuthorBlock(id, {
          image: URL.createObjectURL(compressedFile),
          isLoading: false,
        });
      } catch (error) {
        console.error('Ошибка обработки изображения:', error);
        handleUpdateAuthorBlock(id, { isLoading: false });
      }
    },
    [handleUpdateAuthorBlock, onImageChange, compressImage]
  );


  const handleRemoveImage = useCallback(
    (id) => {
        setLocalImages((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      onAuthorsChange(
        authors.map((author) => (author.id === id ? { ...author, image: null } : author))
      );
    },
    [authors, onAuthorsChange]
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
              <div className={styles.slider_container__uploadTextForm}>Загрузить изображение</div>
            </label>
            <ImagePreviewSection
              images={
                author.image
                  ? [
                      typeof author.image === 'string'
                        ? author.image
                        : localImages[author.id] && URL.createObjectURL(localImages[author.id]),
                    ].filter(Boolean)
                  : []
              }
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
                value={author.name || ''}
                maxLength={150}
                onChange={(e) =>
                  onAuthorsChange(
                    authors.map((a) => (a.id === author.id ? { ...a, name: e.target.value } : a))
                  )
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

export default React.memo(AuthorsSection);
