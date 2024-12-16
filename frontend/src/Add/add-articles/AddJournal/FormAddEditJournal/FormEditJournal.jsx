import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputField from '../InputField';
import DropdownSelect from '../DropdownSelect';
import AuthorsSection from '../AuthorsSection';
import { fetchJournalById, updateJournal, setFormData } from '../../../../store/Slice/journalSlice';
import styles from '../../../../Add/add-project/formAdd/FormAddProject.module.scss';

const FormEditJournal = ({ journalId, setIsModalOpen }) => {
  const dispatch = useDispatch();
  const { formData, loading, error } = useSelector((state) => state.journal);

  useEffect(() => {
    if (journalId) {
      dispatch(fetchJournalById(journalId));
    }
  }, [dispatch, journalId]);

  const handleInputChange = useCallback(
    (name, value) => {
      dispatch(setFormData({ name, value }));
    },
    [dispatch]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const { title, publication_date, category, issue_number, authors, blocks, markdown_content } = formData;

      const formDataToSend = new FormData();
      formDataToSend.append('title', title);
      formDataToSend.append('publication_date', publication_date);
      formDataToSend.append('category', JSON.stringify(category));
      formDataToSend.append('issue_number', issue_number || null);
      formDataToSend.append('authors', JSON.stringify(authors));
      formDataToSend.append('blocks', JSON.stringify(blocks));
      formDataToSend.append('markdown_content', markdown_content);

      authors.forEach((author) => {
        if (author.image && author.image instanceof File) {
          formDataToSend.append('authorImages', author.image, author.image.name);
        }
      });

      try {
        await dispatch(updateJournal({ journalId, formData: formDataToSend })).unwrap();
        setIsModalOpen(false);
      } catch (error) {
        console.error('Ошибка при обновлении записи:', error);
      }
    },
    [formData, dispatch, journalId, setIsModalOpen]
  );

  return (
    <div className={styles.formContainer}>
      {loading ? (
        <p>Загрузка...</p>
      ) : error ? (
        <p>Ошибка загрузки: {error}</p>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <InputField label="Название статьи" name="title" value={formData.title} onChange={handleInputChange} />
          <InputField
            label="Дата публикации"
            name="publication_date"
            value={formData.publication_date}
            onChange={handleInputChange}
            type="date"
          />
          <DropdownSelect
            label="Категория"
            name="category"
            isMulti
            options={[
              { value: 'Архитектура', label: 'Архитектура' },
              { value: 'IT', label: 'IT' },
            ]}
            value={formData.category.map((item) => ({ value: item, label: item }))}
            onChange={(selected) =>
              handleInputChange(
                'category',
                selected.map((option) => option.value)
              )
            }
          />
          <AuthorsSection
            authors={formData.authors}
            onAuthorsChange={(authors) => handleInputChange('authors', authors)}
          />
          <button type="submit" className={styles.submitButton}>
            Обновить
          </button>
        </form>
      )}
    </div>
  );
};

export default FormEditJournal;
