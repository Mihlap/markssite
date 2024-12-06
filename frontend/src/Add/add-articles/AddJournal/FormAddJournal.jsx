import React, { useState, useCallback } from 'react';
import InputField from './InputField';
import DropdownSelect from './DropdownSelect';
import FileUploader from './FileUploader';
import DynamicBlockConstructor from './DynamicBlockConstructor';
import styles from '../../../Add/add-project/formAdd/FormAddProject.module.scss';

export default function FormAddJournal() {
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

  return (
    <div className={styles.form_container}>
      {showNotification && <div className={styles.form_container__notification}>Заполните обязательные поля</div>}
      <h1 className={styles.form_container__title}>Новая статья</h1>
      <div className={styles.form_container__block_form}>
        <form className={styles.form_container__form} onSubmit={handleSubmit}>
          <InputField label="Название статьи" name="title" value={formData.title} onChange={handleInputChange} />
          <InputField label="Дата, месяц, год" name="date" value={formData.date} onChange={handleInputChange} />
          <DropdownSelect
            label="Выберите категорию фильтрации"
            name="category"
            options={['Архитектура', 'IT', 'Проектирование', 'Механика грунтов']}
            value={formData.category}
            onChange={handleInputChange}
          />
          <DropdownSelect
            label="Выберите номер выпуска"
            name="issueNumber"
            options={Array.from({ length: 10 }, (_, i) => i + 1)}
            value={formData.issueNumber}
            onChange={handleInputChange}
          />

          <div className={styles.authors}>
            <h3>Авторы</h3>
            {formData.authors.map((author) => (
              <div key={author.id} className={styles.author}>
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
                <button type="button" className={styles.removeAuthor} onClick={() => handleRemoveAuthor(author.id)}>
                  Удалить
                </button>
              </div>
            ))}
            <button type="button" className={styles.addAuthor} onClick={handleAddAuthor}>
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
          <button type="submit" className={styles.submitButton}>
            Сохранить
          </button>
          <button type="button" className={styles.cancelButton} onClick={() => console.log('Отмена')}>
            Отмена
          </button>
        </form>
      </div>
    </div>
  );
}


