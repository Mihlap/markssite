import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Select from 'react-select';
import { useDispatch } from 'react-redux';

import { addVacancy } from '../../../store/Slice/vacanciesSlice.js';
import { selectBlocks } from '../utils.js';
import useInterceptExternalClose from '../../hooks/useInterceptExternalClose.js';

import customStyle from './customStyle.js';
import styles from './FormAddVacancy.module.scss';
import adminStyles from '../../style/style-card.module.scss';

import SubmitButtons from '../../../UI/SubmitButtons/SubmitButtons.jsx';
import ExitConfirmModal from '../../../UI/ExitConfirmModal/ExitConfirmModal.jsx';

export default function FormAddVacancy({ setIsModalOpen, selectedFilter }) {
  const [showNotification] = useState(false);
  const [, setLoading] = useState(false);
  const [, setError] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const dispatch = useDispatch();
  const type = selectedFilter === 'Вакансии' ? 'вакансия' : 'стажировка';

  const [formData, setFormData] = useState({
    title: '',
    textBlock1: '',
    textBlock2: '',
    textBlock3: '',
    department: '',
    experience: '',
    location: '',
    busyness: '',
    workMode: '',
    skills: '',
    benefits: '',
    type: type,
  });

  const [isFocused, setIsFocused] = useState({
    title: false,
    textBlock1: false,
    textBlock2: false,
    textBlock3: false,
    department: false,
    experience: false,
    location: false,
    busyness: false,
    workMode: false,
    skills: false,
    benefits: false,
  });

  const quillRef1 = useRef(null);
  const quillRef2 = useRef(null);
  const quillRef3 = useRef(null);

  const quillRefs = useMemo(() => [quillRef1, quillRef2, quillRef3], []);
  const applyStylesToQuillEditor = useCallback((quillRef) => {
    if (quillRef && quillRef.current) {
      const editor = quillRef.current.getEditor();
      const editorElement = editor.root;

      editorElement.style.fontSize = '16px';
      editorElement.style.fontFamily = 'Raleway, sans-serif';
      editorElement.style.color = 'var(--black-1D2E43)';
      editorElement.style.border = 'none';
      editorElement.style.lineHeight = '1';
    }
  }, []);

  const openExitConfirm = useCallback(() => setShowExitConfirm(true), []);

  useInterceptExternalClose(`.${adminStyles.card_components_admin__close_button}`, openExitConfirm);

  useEffect(() => {
    quillRefs.forEach((quillRef) => applyStylesToQuillEditor(quillRef));
  }, [applyStylesToQuillEditor, quillRefs]);

  useEffect(() => {
    const quill = quillRef1.current.getEditor();

    quill.on('text-change', () => {
      const plainText = quill.getText();

      if (plainText.length > 300) {
        const excessLength = plainText.length - 301;
        quill.deleteText(quill.getLength() - 1 - excessLength, quill.getLength() - 1, 'silent');
      }
      setFormData((prevFormData) => ({
        ...prevFormData,
        textBlock1: quill.root.innerHTML,
      }));
    });
  }, [setFormData]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setLoading(true);
      try {
        await dispatch(addVacancy(formData));
        setFormData({
          title: '',
          textBlock1: '',
          textBlock2: '',
          textBlock3: '',
          department: '',
          experience: '',
          location: '',
          busyness: '',
          workMode: '',
          skills: [],
          benefits: [],
        });
        setIsModalOpen(false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, formData, setIsModalOpen]
  );

  const handleBlur = useCallback((event) => {
    const name = event?.target?.name;
    setIsFocused((prev) => ({ ...prev, [name]: false }));
  }, []);

  const handleFocus = useCallback((event) => {
    const name = event?.target?.name;
    setIsFocused((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleChangeSelect = useCallback((value, name) => {
    let selectedValue;
    if (Array.isArray(value)) {
      const selectedValues = value.map((option) => option.value);
      selectedValue = selectedValues.join(', ');
    } else {
      selectedValue = value;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: selectedValue,
    }));
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  return (
    <div className={styles.form_container}>
      {showNotification && (
        <div className={styles.form_container__notification}>
          Заполните предыдущий блок или дождитесь загрузки изображений❗
        </div>
      )}
      <div className={styles.form_container__title}>
        Новая {selectedFilter === 'Вакансии' ? 'вакансия' : 'стажировка'}
      </div>
      <div className={styles.form_container__block_form}>
        <form className={styles.form_container__form} onSubmit={handleSubmit}>
          <div className={styles.form_container__block_gray_one}>
            <div className={`${styles.form__group} ${styles.field}`}>
              <input
                type="input"
                className={styles.form__field}
                placeholder="title"
                name="title"
                id="title"
                value={formData.title}
                onChange={(event) => {
                  const { name, value } = event.target;
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    [name]: value,
                  }));
                }}
                required
              />
              <label htmlFor="title" className={styles.form__label}>
                Название вакансии
              </label>
            </div>
            {selectBlocks.map((block, index) => (
              <div key={`${block.name}_${index}`} className={`${styles.group} some-unique-class`}>
                <label
                  className={`${styles.label1} ${isFocused[block.name] || formData[block.name] ? styles.focused1 : ''
                    }`}>
                  <Select
                    className={`${styles.form__group} ${styles.field}`}
                    id={`${block.name}-input`}
                    name={block.name}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    isMulti={block.name === 'benefits' || block.name === 'skills'}
                    options={block.options}
                    required
                    value={block.options.find((option) => option.value === formData[block.name])}
                    placeholder={block.label}
                    onChange={(value) => handleChangeSelect(value, block.name)}
                    isSearchable={false}
                    isClearable={false}
                    menuShouldScrollIntoView={false}
                    styles={customStyle}
                  />
                </label>
              </div>
            ))}
          </div>
          <div className={styles.form_container__block_gray_one}>
            <div className={styles.heading_textarea}>
              <div className={styles.form_container__description_text}>
                <div className={styles.form_container__textarea_length}>
                  {`${quillRef1.current ? quillRef1.current.getEditor().getText().length - 1 : 0}/300`}
                </div>
                <ReactQuill
                  ref={quillRef1}
                  modules={{
                    toolbar: [['bold', 'underline', { list: 'bullet' }]],
                    clipboard: {
                      matchVisual: false,
                    },
                  }}
                  formats={['bold', 'underline', 'list']}
                  className={styles.form_container__textarea}
                  style={{
                    padding: '0rem',
                    border: '1px solid var(--blue-75BBFD)',
                    fontFamily: 'var(--font-raleway)',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 'var(--fw-400)',
                    color: 'var(---black-1D2E43)',
                    boxSizing: 'border-box',
                    paddingBottom: '2.5rem',
                  }}
                  required
                  name="textBlock1"
                  id="textBlock1"
                  value={formData.textBlock1}
                  onChange={(value) => {
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      textBlock1: value,
                    }));
                  }}
                  placeholder="Не более 300 символов"
                />
                <label htmlFor="textBlock1" className={styles.form_container__textarea_label_constructor}>
                  Мы ищем
                </label>
              </div>
            </div>
          </div>
          <div className={styles.form_container__block_gray_one}>
            <div className={styles.heading_textarea}>
              <div className={styles.form_container__description_text}>
                <ReactQuill
                  ref={quillRef2}
                  modules={{
                    toolbar: [['bold', 'underline', { list: 'bullet' }]],
                    clipboard: {
                      matchVisual: false,
                    },
                  }}
                  formats={['bold', 'underline', 'list']}
                  className={styles.form_container__textarea}
                  style={{
                    padding: '0rem',
                    border: '1px solid var(--blue-75BBFD)',
                    fontFamily: 'var(--font-raleway)',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 'var(--fw-400)',
                    lineHeight: '16px',
                    color: 'var(---black-1D2E43)',
                    boxSizing: 'border-box',
                    paddingBottom: '2.5rem',
                  }}
                  required
                  name="textBlock2"
                  id="textBlock2"
                  value={formData.textBlock2}
                  onChange={(value) => {
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      textBlock2: value,
                    }));
                  }}
                  placeholder="нет ограничений по символам"
                />
                <label htmlFor="textBlock2" className={styles.form_container__textarea_label_constructor}>
                  Вам предстоит
                </label>
              </div>
            </div>
          </div>
          <div className={styles.form_container__block_gray_one}>
            <div className={styles.heading_textarea}>
              <div className={styles.form_container__description_text}>
                <ReactQuill
                  ref={quillRef3}
                  modules={{
                    toolbar: [['bold', 'underline', { list: 'bullet' }]],
                    clipboard: {
                      matchVisual: false,
                    },
                  }}
                  formats={['bold', 'underline', 'list']}
                  className={styles.form_container__textarea}
                  style={{
                    padding: '0rem',
                    border: '1px solid var(--blue-75BBFD)',
                    fontFamily: 'var(--font-raleway)',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 'var(--fw-400)',
                    lineHeight: '16px',
                    color: 'var(---black-1D2E43)',
                    boxSizing: 'border-box',
                    paddingBottom: '2.5rem',
                  }}
                  required
                  name="textBlock3"
                  id="textBlock3"
                  value={formData.textBlock3}
                  onChange={(value) => {
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      textBlock3: value,
                    }));
                  }}
                  placeholder="нет ограничений по символам"
                />
                <label htmlFor="textBlock3" className={styles.form_container__textarea_label_constructor}>
                  Требования
                </label>
              </div>
            </div>
          </div>
          <SubmitButtons
            classNames={{
              wrapper: styles.form_container__button_block,
              save: styles.form_container__button_save,
              cancel: styles.form_container__button_cancel,
            }}
            onCancel={(e) => {
              e?.preventDefault?.();
              e?.stopPropagation?.();
              setShowExitConfirm(true);
              setShowExitConfirm(true);
            }}
          />
        </form>

        <ExitConfirmModal
          open={showExitConfirm}
          onCancel={() => setShowExitConfirm(false)}
          onLeave={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}
