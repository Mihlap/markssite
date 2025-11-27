import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import styles from '../../../Add/add-project/FormAddEditProject/FormAddProject.module.scss';
import adminStyles from '../../../Add/style/style-card.module.scss';

import SubmitButtons from '../../../UI/SubmitButtons/SubmitButtons';
import ExitConfirmModal from '../../../UI/ExitConfirmModal/ExitConfirmModal';

import { updateHistoryItem, fetchCompanyHistory } from '../../../store/Slice/companyHistorySlice';

export default function FormEditHistory({ initial, onClose }) {
  const dispatch = useDispatch();

  const [inputData, setInputData] = useState({
    year: '',
    title: '',
    description: '',
    img: '',
  });

  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!initial) return;
    setInputData({
      year: initial.year ?? '',
      title: initial.title ?? '',
      description: initial.description ?? '',
      img: initial.img ?? '',
    });
  }, [initial]);

  const changeBasic = useCallback((e) => {
    const { name, value } = e.target || {};
    setInputData((p) => ({ ...p, [name]: value }));
  }, []);

  const validate = useCallback(() => {
    const errors = {};
    const yearNum = Number(inputData.year);

    if (!inputData.year || Number.isNaN(yearNum)) {
      errors.year = 'Укажите год (число)';
    }
    if (!inputData.title || !String(inputData.title).trim()) {
      errors.title = 'Заполните заголовок';
    }
    if (!inputData.description || !String(inputData.description).trim()) {
      errors.description = 'Заполните описание';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [inputData]);

  const submitHandler = useCallback(
    async (e) => {
      e?.preventDefault?.();
      if (!initial?.id) return;

      const ok = validate();
      if (!ok) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3500);
        return;
      }

      const payload = {
        year: Number(inputData.year),
        title: String(inputData.title).trim(),
        description: String(inputData.description).trim(),
        img: inputData.img ? String(inputData.img).trim() : null,
      };

      try {
        await dispatch(updateHistoryItem({ id: initial.id, data: payload })).unwrap();
        await dispatch(fetchCompanyHistory()).unwrap();
        onClose?.();
      } catch (err) {
        console.error('Ошибка при обновлении записи истории:', err);
      }
    },
    [dispatch, initial, inputData, validate, onClose]
  );

  return (
    <div className={styles.form_container}>
      {showNotification && (
        <div className={styles.form_container__notification}>Пожалуйста, заполните обязательные поля формы.</div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className={styles.form_container__title}>Редактировать запись истории</div>

        <button
          type="button"
          className={adminStyles.card_components_admin__close_button}
          onClick={() => setShowExitConfirm(true)}
          aria-label="Закрыть"
        />
      </div>

      <div className={styles.form_container__block_form}>
        <form className={styles.form_container__form} onSubmit={submitHandler} noValidate>
          <div className={styles.form_container__field}>
            <label className={styles.form_container__label}>
              Год
              <input
                type="number"
                name="year"
                value={inputData.year}
                onChange={changeBasic}
                className={`${styles.form_container__input} ${
                  fieldErrors.year ? styles.form_container__input_error : ''
                }`}
              />
            </label>
            {fieldErrors.year && <div className={styles.form_container__error}>{fieldErrors.year}</div>}
          </div>

          <div className={styles.form_container__field}>
            <label className={styles.form_container__label}>
              Заголовок
              <input
                type="text"
                name="title"
                value={inputData.title}
                onChange={changeBasic}
                className={`${styles.form_container__input} ${
                  fieldErrors.title ? styles.form_container__input_error : ''
                }`}
              />
            </label>
            {fieldErrors.title && <div className={styles.form_container__error}>{fieldErrors.title}</div>}
          </div>

          <div className={styles.form_container__field}>
            <label className={styles.form_container__label}>
              Описание
              <textarea
                name="description"
                value={inputData.description}
                onChange={changeBasic}
                className={`${styles.form_container__textarea} ${
                  fieldErrors.description ? styles.form_container__textarea_error : ''
                }`}
                rows={4}
              />
            </label>
            {fieldErrors.description && <div className={styles.form_container__error}>{fieldErrors.description}</div>}
          </div>

          <div className={styles.form_container__field}>
            <label className={styles.form_container__label}>
              Ссылка на изображение (необязательно)
              <input
                type="text"
                name="img"
                value={inputData.img}
                onChange={changeBasic}
                className={styles.form_container__input}
                placeholder="https://bucket/.../image.jpg"
              />
            </label>
          </div>

          <SubmitButtons
            classNames={{
              wrapper: styles.form_container__button_block,
              save: styles.form_container__button_save,
              cancel: styles.form_container__button_cancel,
            }}
            onCancel={() => setShowExitConfirm(true)}
          />
        </form>

        <ExitConfirmModal
          open={showExitConfirm}
          onCancel={() => setShowExitConfirm(false)}
          onLeave={() => onClose && onClose()}
        />
      </div>
    </div>
  );
}
