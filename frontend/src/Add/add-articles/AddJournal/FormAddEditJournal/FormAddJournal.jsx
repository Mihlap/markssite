import React, { useState, useCallback } from 'react';
import InputField from '../InputField';
import DropdownSelect from '../DropdownSelect';
import AuthorsSection from '../AuthorsSection';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../../../Add/add-project/formAdd/FormAddProject.module.scss';
import { PublicationContainer, PublicationIndicator } from '../../../add-project/formAdd/utils/CustomSelectComponents';
import { createJournal, updateAuthors } from '../../../../store/Slice/journalSlice';


export default function FormAddJournal({ setIsModalOpen }) {  
  const dispatch = useDispatch();
  const authors = useSelector((state) => state.journal?.formData?.authors || []);
  const [showNotification, setShowNotification] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    category: '',
    issueNumber: '',
    authors: [],
    university: '',
    location: '',
    text: '',
    blocks: [
      { id: Date.now() + 1, type: 'university', value: '' },
      { id: Date.now() + 2, type: 'location', value: '' },
    ],
  });

  const handleInputChange = useCallback((name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleAddInputBlock = useCallback((blockType) => {
    setFormData((prev) => ({
      ...prev,
      blocks: [
        ...prev.blocks,
        {
          id: Date.now(),
          type: blockType,
          value: '',
        },
      ],
    }));
  }, []);

  const handleRemoveInputBlock = useCallback((id) => {
    setFormData((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((block) => block.id !== id),
    }));
  }, []);

  const handleBlockValueChange = useCallback((id, value) => {
    setFormData((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) => (block.id === id ? { ...block, value } : block)),
    }));
  }, []);


  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const { title, date, category } = formData;
      if (!title || !date || !category || authors.length === 0) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        return;
      }

      // Готовим данные к отправке
      // Здесь мы создаем FormData, чтобы отправить данные как multipart/form-data
      const fd = new FormData();

      fd.append('title', formData.title);
      fd.append('publication_date', formData.date);
      // category – массив, его нужно превратить в JSON-строку
      fd.append('category', JSON.stringify(Array.isArray(formData.category) ? formData.category : []));
      fd.append('issue_number', formData.issueNumber || '');
      fd.append('authors', JSON.stringify(authors));

      // Если у вас есть поля organizations, locations, markdown_content, editor_id, их тоже можно добавить:
      fd.append('organizations', JSON.stringify([]));
      fd.append('locations', JSON.stringify([]));
      fd.append('markdown_content', formData.text || '');
      fd.append('editor_id', '');

      // Если у вас когда-то появятся файлы (authorImages), добавьте их так:
      // formData.authorImages.forEach((file) => fd.append('authorImages', file));

      console.log('Данные формы перед отправкой:', { ...formData, authors });

      // Отправляем данные на сервер для создания нового журнала
      dispatch(createJournal(fd));
      setIsModalOpen(false);
    },
    [formData, authors, dispatch, setIsModalOpen]
  );


  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);


  const universityBlocks = formData.blocks.filter((block) => block.type === 'university');
  const locationBlocks = formData.blocks.filter((block) => block.type === 'location');

  return (
    <div className={styles.form_container}>
      {showNotification && <div className={styles.form_container__notification}>Заполните обязательные поля</div>}
      <h1 className={styles.form_container__title}>Новая статья</h1>
      <div className={styles.form_container__block_form}>
        <form className={styles.form_container__form} onSubmit={handleSubmit}>
          <div className={styles.form_container__block_gray_one}>
            <InputField
              label="Название статьи"
              name="title"
              placeholder="Название статьи"
              value={formData.title}
              onChange={handleInputChange}
            />
            <InputField
              label="Дата, месяц, год"
              placeholder="Дата, месяц, год"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
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
            authors={authors}
            onAuthorsChange={(updatedAuthors) => dispatch(updateAuthors(updatedAuthors))}
          />

          {universityBlocks.map((block) => (
            <div key={block.id} className={styles.form_container__block_gray_one}>
              <div className={styles.form_container__checkbox_block}>
                <div>Университет или организация</div>
              </div>
              <button className={styles.form_container__close_button} onClick={() => handleRemoveInputBlock(block.id)}>
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
              <button className={styles.form_container__close_button} onClick={() => handleRemoveInputBlock(block.id)}>
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
                buttonLabel="Добавить город"
                onButtonClick={() => console.log('Добавить город')}
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
