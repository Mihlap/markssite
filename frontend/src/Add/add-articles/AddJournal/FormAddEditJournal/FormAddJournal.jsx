import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputField from '../InputField';
import DropdownSelect from '../DropdownSelect';
import AuthorsSection from '../AuthorsSection';
import { setFormData, updateAuthors, clearFormData, fetchJournals } from '../../../../store/Slice/journalSlice';
import { createJournal } from '../../../../store/Slice/journalSlice';
import styles from '../../../../Add/add-project/formAdd/FormAddProject.module.scss';
import { PublicationContainer, PublicationIndicator } from '../../../add-project/formAdd/utils/CustomSelectComponents';

export default function FormAddJournal({ setIsModalOpen }) {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.journal.formData);

  const [showNotification, setShowNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localImages, setLocalImages] = useState({});

  const handleInputChange = useCallback(
    (name, value) => {
      dispatch(setFormData({ name, value }));
    },
    [dispatch]
  );

  const handleAddInputBlock = useCallback(
    (blockType) => {
      const newBlock = { id: Date.now(), type: blockType, value: '' };
      dispatch(
        setFormData({
          name: 'blocks',
          value: [...formData.blocks, newBlock],
        })
      );
    },
    [dispatch, formData.blocks]
  );

  const handleRemoveInputBlock = useCallback(
    (id) => {
      dispatch(
        setFormData({
          name: 'blocks',
          value: formData.blocks.filter((block) => block.id !== id),
        })
      );
    },
    [dispatch, formData.blocks]
  );

  const handleBlockValueChange = useCallback(
    (id, value) => {
      const updatedBlocks = formData.blocks.map((block) => (block.id === id ? { ...block, value } : block));
      dispatch(setFormData({ name: 'blocks', value: updatedBlocks }));
    },
    [dispatch, formData.blocks]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      setIsSubmitting(true);
      try {
        const { title, date, category, issueNumber, blocks, text, authors, imageKey } = formData;

        if (!title || !date || category.length === 0 || Object.keys(authors).length === 0) {
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
          return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('title', title);
        formDataToSend.append('publication_date', date);
        formDataToSend.append('category', JSON.stringify(category));
        formDataToSend.append('issue_number', issueNumber || null);
        formDataToSend.append('authors', JSON.stringify(authors));
        formDataToSend.append('organizations', JSON.stringify(blocks.filter((block) => block.type === 'university')));
        formDataToSend.append('locations', JSON.stringify(blocks.filter((block) => block.type === 'location')));
        formDataToSend.append('markdown_content', text || null);
        formDataToSend.append('imageKey', imageKey || null);

            Object.entries(authors).forEach(([authorId, author]) => {
            if (author.image) {         
              const file = localImages[authorId];
              if (file) {
                const uniqueName = `${Date.now()}_${file.name}`;
                formDataToSend.append('authorImages', file, uniqueName);
              }
            }
          });
        await dispatch(createJournal(formDataToSend)).unwrap();
        await dispatch(fetchJournals());
        setIsModalOpen(false);
        dispatch(clearFormData());
      } catch (error) {
        console.error('Ошибка при создании записи:', error);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, formData, dispatch, setIsModalOpen, localImages]
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    dispatch(clearFormData());
  }, [setIsModalOpen, dispatch]);

    useEffect(() => {
      return () => {   
        Object.values(localImages).forEach((file) => {
          if (file instanceof Blob && file.type.startsWith('image/')) {
            URL.revokeObjectURL(file);
          }
        });
      };
    }, [localImages]);
  

  const universityBlocks = formData.blocks.filter((block) => block.type === 'university');
  const locationBlocks = formData.blocks.filter((block) => block.type === 'location');

  return (
    <div className={styles.form_container}>
      {showNotification && <div className={styles.form_container__notification}>Заполните обязательные поля</div>}
      <h1 className={styles.form_container__title}>Новая статья</h1>
      <div className={styles.form_container__block_form}>
        <form className={styles.form_container__form} onSubmit={handleSubmit} noValidate>
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
              name="date"
              value={formData.date || ''}
              onChange={handleInputChange}
              type="text"
            />

            <DropdownSelect
              label=""
              name="category"
              placeholder="Выберете категорию фильтрации"
              isMulti
              options={[
                { value: 'Архитектура', label: 'Архитектура' },
                { value: 'IT', label: 'IT' },
                { value: 'Проектирование', label: 'Проектирование' },
                { value: 'Механика грунтов', label: 'Механика грунтов' },
              ]}
              value={
                Array.isArray(formData.category)
                  ? formData.category.map((category) => ({
                      value: category,
                      label: category,
                    }))
                  : []
              }
              onChange={(selectedOptions) =>
                handleInputChange('category', selectedOptions ? selectedOptions.map((option) => option.value) : [])
              }
              components={{
                DropdownIndicator: PublicationIndicator,
                ValueContainer: PublicationContainer,
              }}
            />
            
            <DropdownSelect
              label=""
              placeholder="Выберите номер выпуска"
              name="issueNumber"
              options={Array.from({ length: 10 }, (_, i) => ({
                value: (i + 1).toString(),
                label: `Выпуск ${i + 1}`,
              }))}
              value={
                formData.issueNumber ? { value: formData.issueNumber, label: `Выпуск ${formData.issueNumber}` } : null
              }
              onChange={(selectedOption) => handleInputChange('issueNumber', selectedOption?.value || '')}
              components={{
                DropdownIndicator: PublicationIndicator,
                ValueContainer: PublicationContainer,
              }}
            />
          </div>

          <AuthorsSection
            authors={Object.entries(formData.authors).map(([id, author]) => ({
              ...author,
              id,
            }))}
            onAuthorsChange={(updatedAuthors) => {
              const authorsObject = updatedAuthors.reduce((acc, author) => {
                acc[author.id] = author;
                return acc;
              }, {});
              dispatch(updateAuthors(authorsObject));
            }}
            onImageChange={(authorId, file) => {
              setLocalImages((prev) => ({ ...prev, [authorId]: file }));
            }}
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
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                onChange={(name, value) => handleBlockValueChange(block.id, value)}
                placeholder="Нет ограничений по символам"
                useHeadingBlock={true}
              />
            </div>
          ))}

          <button type="button" className={styles.add_input_button} onClick={() => handleAddInputBlock('university')}>
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                onChange={(name, value) => handleBlockValueChange(block.id, value)}
                placeholder="Нет ограничений по символам"
                useHeadingBlock={true}
              />
            </div>
          ))}

          <button type="button" className={styles.add_input_button} onClick={() => handleAddInputBlock('location')}>
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <button type="submit" className={styles.form_container__button_save}></button>
            <button type="button" className={styles.form_container__button_cancel} onClick={closeModal}></button>
          </div>
        </form>
      </div>
    </div>
  );
}
