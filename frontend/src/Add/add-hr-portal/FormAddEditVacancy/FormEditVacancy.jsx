import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { editVacancy } from '../../../store/Slice/vacanciesSlice.js';
import { selectBlocks } from '../utils.js';

import styles from './FormAddVacancy.module.scss';

export default function FormEditVacancy({ setIsModalOpen, selectedFilter, editVacancyData }) {
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (editVacancyData) {
      const skillsArray = editVacancyData.skills ? editVacancyData.skills.split(',') : [];
      const advantagesArray = editVacancyData.advantages ? editVacancyData.advantages.split(',') : [];
      const directionArray = editVacancyData.direction ? editVacancyData.direction.split(',') : [];
      const experienceArray = editVacancyData.experience ? editVacancyData.experience.split(',') : [];
      const locationArray = editVacancyData.locationStaff ? editVacancyData.locationStaff.split(',') : [];
      const busynessArray = editVacancyData.busyness ? editVacancyData.busyness.split(',') : [];
      const workModeArray = editVacancyData.modeOperating ? editVacancyData.modeOperating.split(',') : [];
      setFormData((prev) => ({
        ...prev,
        title: editVacancyData.title || '',
        textBlock1: editVacancyData.searchStaff || '',
        textBlock2: editVacancyData.haveToWork || '',
        textBlock3: editVacancyData.requirements || '',
        direction: directionArray,
        experience: experienceArray,
        location: locationArray,
        busyness: busynessArray,
        workMode: workModeArray,
        skills: skillsArray,
        benefits: advantagesArray,
      }));
    }
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
    [dispatch, editVacancyData.id, formData, setIsModalOpen, type]
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
              <div key={`${block.id}_${block.name}_${index}`} className={`${styles.group} some-unique-class`}>
                <label
                  className={`${styles.label1} ${isFocused[block.name] || formData[block.name] ? styles.focused1 : ''}`}
                >
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
                        ? formData[block.name].map((value) => ({
                            label: value,
                            value: value,
                          }))
                        : []
                    }
                    placeholder={block.label}
                    onChange={(value) => handleChangeSelect(value, block.name)}
                    isSearchable={false}
                    isClearable={false}
                    menuShouldScrollIntoView={false}
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        border: 'none',
                        width: '100%',
                      }),
                      control: (provided, state) => ({
                        ...provided,
                        border: 'none',
                        backgroundColor: 'transparent',
                        boxShadow: state.isFocused ? 'none' : provided.boxShadow,
                        borderBottom: `1px solid ${state.isFocused ? '#75BBFD' : '#959DA6'}`,
                        borderColor: 'transparent',
                        '&:hover': {
                          borderBottomColor: '1px solid',
                        },
                      }),
                      indicatorSeparator: (provided) => ({
                        ...provided,
                        display: 'none',
                      }),
                      multiValue: (provided) => ({
                        ...provided,
                        backgroundColor: 'transparent',
                      }),
                      singleValue: (provided) => ({
                        ...provided,
                        color: '#959DA6',
                        marginLeft: -5,
                      }),
                      placeholder: (provided) => ({
                        ...provided,
                        marginLeft: -5,
                        color: '#959DA6',
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isFocused ? '#75BBFD' : 'transparent',
                        color: state.isFocused ? 'white' : 'inherit',
                      }),
                      dropdownIndicator: (provided, state) => ({
                        ...provided,
                        transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null,
                        transition: 'transform 0.3s ease-in-out',
                        color: state.isFocused ? '#75BBFD' : '#C0C5CB',
                      }),
                      menuList: (provided) => ({
                        ...provided,
                        '&::-webkit-scrollbar': {
                          width: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: '#C0C5CB',
                          borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                          backgroundColor: 'transparent',
                        },
                        '&::-ms-scrollbar': {
                          width: '4px',
                        },
                        '&::-ms-scrollbar-thumb': {
                          backgroundColor: '#C0C5CB',
                          borderRadius: '4px',
                        },
                        '&::-ms-scrollbar-track': {
                          backgroundColor: 'transparent',
                        },
                        margin: '6px',
                      }),
                      menu: (provided) => ({
                        ...provided,
                        boxShadow: 'none',
                        backgroundColor: '#EBECEE',
                      }),
                    }}
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
                  strict={false}
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
                  strict={false}
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
          <div className={styles.form_container__button_block}>
            <button className={styles.form_container__button_save} type="submit"></button>
            <button className={styles.form_container__button_cancel} type="button" onClick={closeModal}></button>
          </div>
        </form>
      </div>
    </div>
  );
}
