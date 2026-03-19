import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Select from 'react-select';
import { useDispatch } from 'react-redux';

import { editVacancy } from '../../../store/Slice/vacanciesSlice.js';
import { selectBlocks } from '../const/utils.js';

import customStyle from './customStyle.js';
import styles from './FormAddVacancy.module.scss';
import adminStyles from '../../style/style-card.module.scss';
import SubmitButtons from '../../../UI/SubmitButtons/SubmitButtons.jsx';
import ExitConfirmModal from '../../../UI/ExitConfirmModal/ExitConfirmModal.jsx';
import useInterceptExternalClose from '../../hooks/useInterceptExternalClose.js';

export default function FormEditVacancy({ setIsModalOpen, selectedFilter, editVacancyData }) {
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
    department: [],
    direction: [],
    experience: [],
    location: [],
    busyness: [],
    workMode: [],
    skills: [],
    benefits: [],
    type: type,
  });

  const [isFocused, setIsFocused] = useState({
    title: false,
    textBlock1: false,
    textBlock2: false,
    textBlock3: false,
    department: false,
    direction: false,
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

  const attachSpaceBinding = useCallback((quillRef) => {
    const quill = quillRef.current?.getEditor?.();
    if (!quill) return;

    if (quill.__spaceFixApplied) return;
    quill.__spaceFixApplied = true;

    quill.keyboard.addBinding({ key: 32 }, (range) => {
      if (!range) return true;

      if (range.length) quill.deleteText(range.index, range.length, 'user');
      quill.insertText(range.index, ' ', 'user');
      quill.setSelection(range.index + 1, 0, 'silent');

      return false;
    });
  }, []);

  useEffect(() => {
    attachSpaceBinding(quillRef1);
    attachSpaceBinding(quillRef2);
    attachSpaceBinding(quillRef3);
  }, [attachSpaceBinding]);

  useEffect(() => {
    if (!editVacancyData) return;

    const combineSplitValues = (str, validOptions) => {
      if (!str) return [];
      const parts = str.split(',').map((s) => s.trim());
      let result = [];
      for (let i = 0; i < parts.length; i++) {
        if (validOptions.includes(parts[i])) {
          result.push(parts[i]);
        } else if (i < parts.length - 1) {
          const combined = parts[i] + ', ' + parts[i + 1];
          if (validOptions.includes(combined)) {
            result.push(combined);
            i++;
          } else {
            result.push(parts[i]);
          }
        } else {
          result.push(parts[i]);
        }
      }
      return result;
    };

    const getOpts = (name) => selectBlocks.find((b) => b.name === name)?.options.map((o) => o.value) || [];

    const benefitsOptions = getOpts('benefits');
    const skillsOptions = getOpts('skills');
    const directionOptions = getOpts('direction') || getOpts('department');
    const experienceOptions = getOpts('experience');
    const locationOptions = getOpts('location');
    const busynessOptions = getOpts('busyness');
    const workModeOptions = getOpts('workMode');

    setFormData((prev) => ({
      ...prev,
      title: editVacancyData.title || '',
      textBlock1: editVacancyData.searchStaff || '',
      textBlock2: editVacancyData.haveToWork || '',
      textBlock3: editVacancyData.requirements || '',
      direction: editVacancyData.direction ? combineSplitValues(editVacancyData.direction, directionOptions) : [],
      department: editVacancyData.direction ? combineSplitValues(editVacancyData.direction, directionOptions) : [],
      experience: editVacancyData.experience ? combineSplitValues(editVacancyData.experience, experienceOptions) : [],
      location: editVacancyData.locationStaff ? combineSplitValues(editVacancyData.locationStaff, locationOptions) : [],
      busyness: editVacancyData.busyness ? combineSplitValues(editVacancyData.busyness, busynessOptions) : [],
      workMode: editVacancyData.modeOperating ? combineSplitValues(editVacancyData.modeOperating, workModeOptions) : [],
      skills: editVacancyData.skills ? combineSplitValues(editVacancyData.skills, skillsOptions) : [],
      benefits: editVacancyData.advantages ? combineSplitValues(editVacancyData.advantages, benefitsOptions) : [],
    }));
  }, [editVacancyData]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setLoading(true);
      try {
        await dispatch(editVacancy({ id: editVacancyData.id, formData }));
        setFormData({
          title: '',
          textBlock1: '',
          textBlock2: '',
          textBlock3: '',
          department: [],
          direction: [],
          experience: [],
          location: [],
          busyness: [],
          workMode: [],
          skills: [],
          benefits: [],
          type: type,
        });
        setIsModalOpen(false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, editVacancyData?.id, formData, setIsModalOpen, type]
  );

  const handleBlur = useCallback((event) => {
    const name = event?.target?.name;
    setIsFocused((prev) => ({ ...prev, [name]: false }));
  }, []);

  const handleFocus = useCallback((event) => {
    const name = event?.target?.name;
    setIsFocused((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleChangeSelect = useCallback((selectedOptions, name) => {
    let selectedValues;
    if (Array.isArray(selectedOptions)) {
      selectedValues = selectedOptions.map((option) => option.value);
    } else if (selectedOptions) {
      selectedValues = [selectedOptions.value];
    } else {
      selectedValues = [];
    }
    setFormData((prev) => ({
      ...prev,
      [name]: selectedValues,
    }));
  }, []);

  const onChangeTextBlock1 = useCallback((content, delta, source, editor) => {
    if (source !== 'user') return;

    const plain = editor.getText();
    if (plain.length > 301) {
      const quill = quillRef1.current?.getEditor?.();
      if (!quill) return;

      const excess = plain.length - 301;
      quill.deleteText(quill.getLength() - 1 - excess, excess, 'user');
      return;
    }

    setFormData((prev) => (prev.textBlock1 === content ? prev : { ...prev, textBlock1: content }));
  }, []);

  const onChangeTextBlock2 = useCallback((content, delta, source) => {
    if (source !== 'user') return;
    setFormData((prev) => (prev.textBlock2 === content ? prev : { ...prev, textBlock2: content }));
  }, []);

  const onChangeTextBlock3 = useCallback((content, delta, source) => {
    if (source !== 'user') return;
    setFormData((prev) => (prev.textBlock3 === content ? prev : { ...prev, textBlock3: content }));
  }, []);

  return (
    <div className={styles.form_container}>
      {showNotification && (
        <div className={styles.form_container__notification}>
          Заполните предыдущий блок или дождитесь загрузки изображений❗
        </div>
      )}

      <div className={styles.form_container__title}>
        Редактирование {selectedFilter === 'Вакансии' ? 'вакансии' : 'стажировки'}
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
                  setFormData((prev) => ({ ...prev, [name]: value }));
                }}
                required
              />
              <label htmlFor="title" className={styles.form__label}>
                Название вакансии
              </label>
            </div>

            {selectBlocks.map((block, index) => (
              <div key={`${block.id}_${block.name}_${index}`} className={`${styles.group} some-unique-class`}>
                <label
                  className={`${styles.label1} ${
                    isFocused[block.name] ||
                    (Array.isArray(formData[block.name]) ? formData[block.name].length : !!formData[block.name])
                      ? styles.focused1
                      : ''
                  }`}>
                  <Select
                    className={`${styles.form__group} ${styles.field}`}
                    id={`${block.name}-input`}
                    name={block.name}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    isMulti={block.name === 'benefits' || block.name === 'skills'}
                    required
                    options={block.options}
                    value={
                      Array.isArray(formData[block.name])
                        ? formData[block.name].map((value) => ({ label: value, value }))
                        : []
                    }
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
                    clipboard: { matchVisual: false },
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
                  strict={false}
                  required
                  name="textBlock1"
                  id="textBlock1"
                  value={formData.textBlock1}
                  onChange={onChangeTextBlock1}
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
                    clipboard: { matchVisual: false },
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
                  strict={false}
                  required
                  name="textBlock2"
                  id="textBlock2"
                  value={formData.textBlock2}
                  onChange={onChangeTextBlock2}
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
                    clipboard: { matchVisual: false },
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
                  strict={false}
                  required
                  name="textBlock3"
                  id="textBlock3"
                  value={formData.textBlock3}
                  onChange={onChangeTextBlock3}
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
