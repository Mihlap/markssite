import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputField from '../InputField';
import DropdownSelect from '../DropdownSelect';
import AuthorsSection from '../AuthorsSection';

import {
  fetchJournalById,
  updateJournal,
  setFormData,
  clearFormData,
  updateAuthors,
  fetchJournals,
} from '../../../../store/Slice/journalSlice';

import { PublicationContainer, PublicationIndicator } from '../../../add-project/formAdd/utils/CustomSelectComponents';
import styles from '../../../../Add/add-project/formAdd/FormAddProject.module.scss';

export default function FormEditJournal({ editJournalData, setIsModalOpen }) {
  const dispatch = useDispatch();
  const { formData, loading, error } = useSelector((state) => state.journal);
  const [localImages, setLocalImages] = useState({});

  const [showNotification, setShowNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [universityBlocks, setUniversityBlocks] = useState([]);
  const [locationBlocks, setLocationBlocks] = useState([]);

  useEffect(() => {
    setUniversityBlocks(formData.blocks.filter((b) => b.type === 'university'));
    setLocationBlocks(formData.blocks.filter((b) => b.type === 'location'));
  }, [formData.blocks]);

  useEffect(() => {
    if (editJournalData) {
      dispatch(fetchJournalById(editJournalData)).then((data) => {
        const updatedAuthors = data.payload.authors.map((author) => ({
          ...author,
          image: author.image && !author.image.startsWith('blob:') ? author.image : null,
        }));

        dispatch(setFormData({ name: 'authors', value: updatedAuthors }));
      });
    }
  }, [dispatch, editJournalData]);

  const handleInputChange = useCallback(
    (name, value) => {
      dispatch(setFormData({ name, value }));
    },
    [dispatch]
  );

  const handleAddInputBlock = useCallback(
    (blockType) => {
      const newBlock = { id: Date.now(), type: blockType, value: '' };
      const updated = [...formData.blocks, newBlock];
      dispatch(setFormData({ name: 'blocks', value: updated }));
    },
    [dispatch, formData.blocks]
  );

  const handleRemoveInputBlock = useCallback(
    (id) => {
      const updatedBlocks = formData.blocks.filter((b) => b.id !== id);
      dispatch(setFormData({ name: 'blocks', value: updatedBlocks }));
    },
    [dispatch, formData.blocks]
  );

  const handleBlockValueChange = useCallback(
    (id, newValue) => {
      const updatedBlocks = formData.blocks.map((block) => (block.id === id ? { ...block, value: newValue } : block));
      dispatch(setFormData({ name: 'blocks', value: updatedBlocks }));
    },
    [dispatch, formData.blocks]
  );

  const handleAuthorsChange = useCallback(
    (updatedAuthors) => {
      dispatch(updateAuthors(updatedAuthors));

      setLocalImages((prev) => {
        const newImages = { ...prev };
        updatedAuthors.forEach((author) => {
          if (!(author.id in newImages)) {
            newImages[author.id] = null;
          }
        });

        const updatedIds = updatedAuthors.map((a) => a.id);
        Object.keys(newImages).forEach((id) => {
          if (!updatedIds.includes(id)) {
            delete newImages[id];
          }
        });

        return newImages;
      });
    },
    [dispatch]
  );

  const handleImageChange = useCallback(
    (authorId, file) => {
      setLocalImages((prev) => ({ ...prev, [authorId]: file || null }));

      const updatedAttachments = { ...formData.attachments };
      if (file) {
        updatedAttachments[authorId] = URL.createObjectURL(file);
      } else {
        delete updatedAttachments[authorId];
      }
      dispatch(setFormData({ name: 'attachments', value: updatedAttachments }));
    },
    [dispatch, formData.attachments]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      if (!formData.title || !formData.publication_date || !formData.category.length > 0) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        return;
      }

      setIsSubmitting(true);

      try {
        const formDataToSend = new FormData();

        formDataToSend.append('title', formData.title);
        formDataToSend.append('publication_date', formData.publication_date);
        formDataToSend.append('category', JSON.stringify(formData.category));
        formDataToSend.append('issue_number', formData.issue_number || null);
        formDataToSend.append('organizations', JSON.stringify(formData.blocks.filter((b) => b.type === 'university')));
        formDataToSend.append('locations', JSON.stringify(formData.blocks.filter((b) => b.type === 'location')));
        formDataToSend.append('markdown_content', formData.markdown_content || null);
        formDataToSend.append('imageKey', formData.imageKey || 'one');

        const sanitizedAuthors = formData.authors.map((author) => ({
          ...author,
          image: author.image && !author.image.startsWith('blob:') ? author.image : null,     
        }));
        formDataToSend.append('authors', JSON.stringify(sanitizedAuthors));

        Object.entries(localImages).forEach(([id, file]) => {
          if (file) {      
            formDataToSend.append('authorImages', file, id);
          }
        });
  
        const response = await dispatch(
          updateJournal({ journalId: editJournalData, formData: formDataToSend })
        ).unwrap();

        const updatedAuthors = formData.authors.map((author) => {
          const updatedAuthor = response.journal.authors.find((respAuthor) => respAuthor.id === author.id);
          return updatedAuthor ? { ...author, image: updatedAuthor.image } : author;
        });
        dispatch(setFormData({ name: 'authors', value: updatedAuthors }));

        setIsModalOpen(false);
        dispatch(clearFormData());
      } catch (err) {
        console.error('Ошибка при обновлении записи:', err);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } finally {
        setIsSubmitting(false);
      }
    },
    [dispatch, formData, editJournalData, localImages, isSubmitting, setIsModalOpen]
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    dispatch(fetchJournals());
  }, [dispatch, setIsModalOpen]);

  useEffect(() => {
    return () => {
      Object.values(localImages).forEach((file) => {
        if (file instanceof Blob && file.type.startsWith('image/')) {
          URL.revokeObjectURL(file);
        }
      });
    };
  }, [localImages]);

  return (
    <div className={styles.form_container}>
      {loading ? (
        <div className={styles.form_container__loading}>Загрузка...</div>
      ) : error ? (
        <div className={styles.form_container__error}>Ошибка: {error}</div>
      ) : (
        <>
          {showNotification && <div className={styles.form_container__notification}>Заполните обязательные поля</div>}
          <h1 className={styles.form_container__title}>Редактирование статьи</h1>

          <div className={styles.form_container__block_form}>
            <form className={styles.form_container__form} onSubmit={handleSubmit}>
              <div className={styles.form_container__block_gray_one}>
                <InputField
                  label="Название статьи"
                  name="title"
                  placeholder="Название статьи"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  type="text"
                />

                <InputField
                  label="Дата, месяц, год"
                  placeholder="Дата, месяц, год"
                  name="publication_date"
                  value={formData.publication_date || ''}
                  onChange={handleInputChange}
                  type="text"
                />

                <DropdownSelect
                  label=""
                  name="category"
                  placeholder="Выберите категорию фильтрации"
                  isMulti
                  options={[
                    { value: 'Архитектура', label: 'Архитектура' },
                    { value: 'IT', label: 'IT' },
                    { value: 'Проектирование', label: 'Проектирование' },
                    { value: 'Механика грунтов', label: 'Механика грунтов' },
                  ]}
                  value={
                    Array.isArray(formData.category) ? formData.category.map((cat) => ({ value: cat, label: cat })) : []
                  }
                  onChange={(selectedOptions) => {
                    const newCats = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
                    handleInputChange('category', newCats);
                  }}
                  components={{
                    DropdownIndicator: PublicationIndicator,
                    ValueContainer: PublicationContainer,
                  }}
                />

                <DropdownSelect
                  label=""
                  placeholder="Выберите номер выпуска"
                  name="issue_number"
                  options={Array.from({ length: 10 }, (_, i) => ({
                    value: `${i + 1}`,
                    label: `Выпуск ${i + 1}`,
                  }))}
                  value={
                    formData.issue_number
                      ? {
                          value: formData.issue_number,
                          label: `Выпуск ${formData.issue_number}`,
                        }
                      : null
                  }
                  onChange={(selOpt) => handleInputChange('issue_number', selOpt?.value || '')}
                  components={{
                    DropdownIndicator: PublicationIndicator,
                    ValueContainer: PublicationContainer,
                  }}
                />
              </div>

              <AuthorsSection
                authors={formData.authors}
                onAuthorsChange={handleAuthorsChange}
                onImageChange={handleImageChange}
                isEditing={true}
              />

              {universityBlocks.map((block) => (
                <div key={block.id} className={styles.form_container__block_gray_one}>
                  <div className={styles.form_container__checkbox_block}>
                    <div>Университет или организация</div>
                  </div>
                  <button
                    type="button"
                    className={styles.form_container__close_button}
                    onClick={() => handleRemoveInputBlock(block.id)}>
                    <svg width="12" height="12" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.99999 6.53013L0.530313 12L0 11.4697L5.46969 5.99982L0.000346988 0.530327L0.53066 2.82526e-05L5.99999 5.46951L11.4694 0L11.9997 0.530299L6.53029 5.99982L12 11.4697L11.4697 12L5.99999 6.53013Z"
                        fill="#566272"
                      />
                    </svg>
                  </button>
                  <InputField
                    label=""
                    name="university"
                    value={block.value}
                    onChange={(name, val) => handleBlockValueChange(block.id, val)}
                    placeholder="Нет ограничений по символам"
                    useHeadingBlock
                  />
                </div>
              ))}

              <button
                type="button"
                className={styles.add_input_button}
                onClick={() => handleAddInputBlock('university')}>
                <svg width="25" height="24" fill="none">
                  <circle cx="12.5" cy="12" r="12" fill="currentColor" />
                  <path
                    d="M6.5 12H12.5M18.5 12H12.5M12.5 12V6M12.5 12V18"
                    stroke="#F6F6F6"
                    strokeWidth="1.2"
                    strokeLinecap="square"
                  />
                </svg>
                <span className={styles.add_input_text}>Добавить университет или организация</span>
              </button>

              {locationBlocks.map((block) => (
                <div key={block.id} className={styles.form_container__block_gray_one}>
                  <div className={styles.form_container__checkbox_block}>
                    <div>Город, Страна</div>
                  </div>
                  <button
                    type="button"
                    className={styles.form_container__close_button}
                    onClick={() => handleRemoveInputBlock(block.id)}>
                    <svg width="12" height="12" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.99999 6.53013L0.530313 12L0 11.4697L5.46969 5.99982L0.000346988 0.530327L0.53066 2.82526e-05L5.99999 5.46951L11.4694 0L11.9997 0.530299L6.53029 5.99982L12 11.4697L11.4697 12L5.99999 6.53013Z"
                        fill="#566272"
                      />
                    </svg>
                  </button>
                  <InputField
                    label=""
                    name="location"
                    value={block.value}
                    onChange={(name, val) => handleBlockValueChange(block.id, val)}
                    placeholder="Нет ограничений по символам"
                    useHeadingBlock
                  />
                </div>
              ))}

              <button type="button" className={styles.add_input_button} onClick={() => handleAddInputBlock('location')}>
                <svg width="25" height="24" fill="none">
                  <circle cx="12.5" cy="12" r="12" fill="currentColor" />
                  <path
                    d="M6.5 12H12.5M18.5 12H12.5M12.5 12V6M12.5 12V18"
                    stroke="#F6F6F6"
                    strokeWidth="1.2"
                    strokeLinecap="square"
                  />
                </svg>
                <span className={styles.add_input_text}>Добавить город, страну</span>
              </button>

              <div className={styles.form_container__button_block}>
                <button type="submit" className={styles.form_container__button_save} />
                <button type="button" className={styles.form_container__button_cancel} onClick={closeModal} />
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
