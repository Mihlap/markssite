import React, { useState, useCallback } from 'react';
import InputField from './InputField';
import DropdownSelect from './DropdownSelect';
import FileUploader from './FileUploader';
import DynamicBlockConstructor from './DynamicBlockConstructor';
import styles from '../../../Add/add-project/formAdd/FormAddProject.module.scss';

import {
  PublicationContainer,
  PublicationIndicator,
} from '../../../Add/add-project/formAdd/utils/CustomSelectComponents';


export default function FormAddJournal({ setIsModalOpen }) {
  const [, setIsFocused] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    category: '',
    issueNumber: '',
    authors: [],
    university: '',
    location: '',
    text: '',
    blocks: [],
  });

  const [blocks, setBlocks] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  const handleInputChange = useCallback((name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleAddAuthor = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      authors: [...prev.authors, { id: Date.now(), name: '' }],
    }));
  }, []);

  const handleRemoveAuthor = useCallback((id) => {
    setFormData((prev) => ({
      ...prev,
      authors: prev.authors.filter((author) => author.id !== id),
    }));
  }, []);

  const handleAddBlock = useCallback((block) => {
    setBlocks((prevBlocks) => [...prevBlocks, block]);
  }, []);

  const handleRemoveBlock = useCallback((index) => {
    setBlocks((prevBlocks) => prevBlocks.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!formData.title || !formData.date || !formData.category) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        return;
      }
      console.log('Submitting form data:', { ...formData, blocks });
    },
    [formData, blocks]
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

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
          <div className={styles.authors}>
            <h3 className={styles.authors__title}>Авторы</h3>
            {formData.authors.map((author) => (
              <div key={author.id} className={styles.authors__block}>
                <InputField
                  label="ФИО"
                  name={`author_${author.id}`}
                  value={author.name}
                  onChange={(name, value) =>
                    handleInputChange(
                      'authors',
                      formData.authors.map((a) => (a.id === author.id ? { ...a, name: value } : a))
                    )
                  }
                />
                <button
                  type="button"
                  className={styles.authors__remove_button}
                  onClick={() => handleRemoveAuthor(author.id)}>
                  Удалить
                </button>
              </div>
            ))}
            <button type="button" className={styles.authors__add_button} onClick={handleAddAuthor}>
              Добавить автора
            </button>
          </div>

          <InputField
            label="Университет или организация"
            name="university"
            value={formData.university}
            onChange={handleInputChange}
          />
          <InputField label="Город, страна" name="location" value={formData.location} onChange={handleInputChange} />
          <FileUploader label="Загрузить изображение" name="image" />
          <DynamicBlockConstructor blocks={blocks} onAddBlock={handleAddBlock} onRemoveBlock={handleRemoveBlock} />
          <div className={styles.form_container__button_block}>
            <button type="submit" className={styles.form_container__button_save}></button>
            <button type="button" className={styles.form_container__button_cancel} onClick={closeModal}></button>
          </div>
        </form>
      </div>
    </div>
  );
}


