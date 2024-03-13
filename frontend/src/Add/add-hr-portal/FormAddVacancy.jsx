import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { addVacancy } from "../../store/Slice/vacanciesSlice.js";
import { selectBlocks } from "./utils.js";

import styles from "./FormAddVacancy.module.scss";
// import customStyles from "../add-project/formAdd/utils/customStyles.js";

import { changeHandler } from "../add-project/formAdd/utils/formHelpers";

export default function FormAddVacancy({ setIsModalOpen }) {
  const [showNotification, setShowNotification] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    textBlock1: "",
    textBlock2: "",
    textBlock3: "",
    department: "",
    experience: "",
    location: "",
    busyness: "",
    workMode: "",
    skills: "",
    benefits: [],
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

  // Стили для eact-quill
  const quillRefs = [quillRef1, quillRef2, quillRef3];
  const applyStylesToQuillEditor = (quillRef) => {
    if (quillRef && quillRef.current) {
      const editor = quillRef.current.getEditor();
      const editorElement = editor.root;

      // Применение стилей к нужному элементу
      editorElement.style.fontSize = "16px";
      editorElement.style.fontFamily = "Raleway, sans-serif";
      editorElement.style.color = "var(--black-1D2E43)";
      editorElement.style.border = "none";
    }
  };

  useEffect(() => {
    // Применение стилей для каждого quillRef
    quillRefs.forEach((quillRef) => applyStylesToQuillEditor(quillRef));
  }, [quillRefs]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
    //       // Преобразуем массив benefits в строку, разделенную запятыми
    // const benefitsValue = formData.benefits.join(", ");
    // // Обновляем объект формы данных перед отправкой на сервер
    // const updatedFormData = { ...formData, benefits: benefitsValue };
    // await dispatch(addVacancy(updatedFormData));
      await dispatch(addVacancy(formData));
      // Очищаем форму после успешной отправки
      setFormData({
        title: "",
        textBlock1: "",
        textBlock2: "",
        textBlock3: "",
        department: "",
        experience: "",
        location: "",
        busyness: "",
        workMode: "",
        skills: "",
        benefits: [],
      });
      setIsModalOpen(false); // Закрываем модальное окно
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  function handleBlur(event) {
    const name = event?.target?.name;
    setIsFocused((prev) => ({ ...prev, [name]: false }));
  }

  function handleFocus(event) {
    const name = event?.target?.name;
    setIsFocused((prev) => ({ ...prev, [name]: true }));
  }

  const handleChangeSelect = (value, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value.value, // Обновляем значение соответствующего поля в состоянии formData
    }));
  };

  // закрывает модалкку формы
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.form_container}>
      {showNotification && (
        <div className={styles.form_container__notification}>
          Заполните предыдущий блок или дождитесь загркузки изображений❗
        </div>
      )}
      <div className={styles.form_container__title}>Новая вакансия</div>

      <div className={styles.form_container__block_form}>
        <form
          className={styles.form_container__form}
           onSubmit={handleSubmit}
        >
          {/* первый серый блок с инфой  */}
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
                oComplete="off"
                required
              />
              <label htmlFor="title" className={styles.form__label}>
                Название вакансии
              </label>
            </div>
            {selectBlocks.map((block, index) => (
              <div key={index} className={`${styles.group} some-unique-class`}>
                <label
                  className={`${styles.label1} ${
                    isFocused[block.name] || formData[block.name]
                      ? styles.focused1
                      : ""
                  }`}
                >
                  {block.name === "benefits" ? (
                    <Select
                      className={`${styles.form__group} ${styles.field}`}
                      id={`${block.name}-input`}
                      name={block.name}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      isMulti={true}
                      options={block.options}
                      required
                      value={block.options.find(
                        (option) => option.value === formData[block.name]
                      )}
                      placeholder={block.label}
                      onChange={(selectedOptions) => {
                        const selectedValues = selectedOptions.map(
                          (option) => option.value
                        );
                        handleChangeSelect(selectedValues, block.name);
                      }}
                      isSearchable={false}
                      isClearable={false}
                      menuShouldScrollIntoView={false}
                      styles={{
                        container: (provided) => ({
                          ...provided,
                          border: "none",
                          width: "100%",
                          // maxWidth: '28rem',
                        }),
                        control: (provided, state) => ({
                          ...provided,
                          border: "none",
                          backgroundColor: "transparent",
                          boxShadow: state.isFocused
                            ? "none"
                            : provided.boxShadow,
                          borderBottom: `1px solid ${
                            state.isFocused ? "#75BBFD" : "#959DA6"
                          }`,
                          borderColor: "transparent",
                          "&:hover": {
                            borderBottomColor: "1px solid",
                          },
                        }),
                        indicatorSeparator: (provided) => ({
                          ...provided,
                          display: "none",
                        }),
                        multiValue: (provided) => ({
                          ...provided,
                          backgroundColor: "transparent",
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: "#959DA6",
                          marginLeft: -5,
                        }),
                        placeholder: (provided) => ({
                          ...provided,
                          marginLeft: -5,
                          color: "#959DA6",
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isFocused
                            ? "#75BBFD"
                            : "transparent",
                          color: state.isFocused ? "white" : "inherit",
                        }),
                        dropdownIndicator: (provided, state) => ({
                          ...provided,
                          transform: state.selectProps.menuIsOpen
                            ? "rotate(180deg)"
                            : null,
                          transition: "transform 0.3s ease-in-out",
                          color: state.isFocused ? "#75BBFD" : "#C0C5CB",
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          "&::-webkit-scrollbar": {
                            width: "4px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#C0C5CB",
                            borderRadius: "4px",
                          },
                          "&::-webkit-scrollbar-track": {
                            backgroundColor: "transparent",
                          },
                          // Для Microsoft Edge
                          "&::-ms-scrollbar": {
                            width: "4px",
                          },
                          "&::-ms-scrollbar-thumb": {
                            backgroundColor: "#C0C5CB",
                            borderRadius: "4px",
                          },
                          "&::-ms-scrollbar-track": {
                            backgroundColor: "transparent",
                          },
                          margin: "6px",
                        }),
                        menu: (provided) => ({
                          ...provided,
                          boxShadow: "none",
                          backgroundColor: "#EBECEE",
                        }),
                      }}
                    />
                  ) : (
                    <Select
                      className={`${styles.form__group} ${styles.field}`}
                      id={`${block.name}-input`}
                      name={block.name}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      isMulti={false}
                      options={block.options}
                      required
                      value={block.options.find(
                        (option) => option.value === formData[block.name]
                      )}
                      placeholder={block.label}
                      onChange={(value) =>
                        handleChangeSelect(value, block.name)
                      }
                      isSearchable={false}
                      isClearable={false}
                      menuShouldScrollIntoView={false}
                      styles={{
                        container: (provided) => ({
                          ...provided,
                          border: "none",
                          width: "100%",
                          // maxWidth: '28rem',
                        }),
                        control: (provided, state) => ({
                          ...provided,
                          border: "none",
                          backgroundColor: "transparent",
                          boxShadow: state.isFocused
                            ? "none"
                            : provided.boxShadow,
                          borderBottom: `1px solid ${
                            state.isFocused ? "#75BBFD" : "#959DA6"
                          }`,
                          borderColor: "transparent",
                          "&:hover": {
                            borderBottomColor: "1px solid",
                          },
                        }),
                        indicatorSeparator: (provided) => ({
                          ...provided,
                          display: "none",
                        }),
                        multiValue: (provided) => ({
                          ...provided,
                          backgroundColor: "transparent",
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: "#959DA6",
                          marginLeft: -5,
                        }),
                        placeholder: (provided) => ({
                          ...provided,
                          marginLeft: -5,
                          color: "#959DA6",
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isFocused
                            ? "#75BBFD"
                            : "transparent",
                          color: state.isFocused ? "white" : "inherit",
                        }),
                        dropdownIndicator: (provided, state) => ({
                          ...provided,
                          transform: state.selectProps.menuIsOpen
                            ? "rotate(180deg)"
                            : null,
                          transition: "transform 0.3s ease-in-out",
                          color: state.isFocused ? "#75BBFD" : "#C0C5CB",
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          "&::-webkit-scrollbar": {
                            width: "4px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#C0C5CB",
                            borderRadius: "4px",
                          },
                          "&::-webkit-scrollbar-track": {
                            backgroundColor: "transparent",
                          },
                          // Для Microsoft Edge
                          "&::-ms-scrollbar": {
                            width: "4px",
                          },
                          "&::-ms-scrollbar-thumb": {
                            backgroundColor: "#C0C5CB",
                            borderRadius: "4px",
                          },
                          "&::-ms-scrollbar-track": {
                            backgroundColor: "transparent",
                          },
                          margin: "6px",
                        }),
                        menu: (provided) => ({
                          ...provided,
                          boxShadow: "none",
                          backgroundColor: "#EBECEE",
                        }),
                      }}
                    />
                  )}
                </label>
              </div>
            ))}
          </div>
          <div className={styles.form_container__block_gray_one}>
            <div className={styles.heading_textarea}>
              <div className={styles.form_container__description_text}>
                <ReactQuill
                  ref={quillRef1}
                  modules={{
                    toolbar: [
                      ["bold", "underline", { list: "bullet" }]
                    ],
                    clipboard: {
                      matchVisual: false,
                    },
                  }}
                  formats={["bold", "underline", "list"]}
                  className={styles.form_container__textarea}
                  style={{
                    // resize: "none",
                    padding: "0rem",
                    border: "1px solid var(--blue-75BBFD)",
                    fontFamily: "var(--font-raleway)",
                    borderRadius: "6px",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: "var(--fw-400)",
                    lineHeight: "16px",
                    color: "var(---black-1D2E43)",
                    boxSizing: "border-box",
                    paddingBottom: "2.5rem",
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
                  placeholder="нет ограничений по символам"
                />
                <label
                  htmlFor="textBlock"
                  className={styles.form_container__textarea_label_constructor}
                >
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
                    toolbar: [
                      ["bold", "underline", { list: "bullet" }]
                    ],
                    clipboard: {
                      matchVisual: false,
                    },
                  }}
                  formats={["bold", "italic", "list"]}
                  className={styles.form_container__textarea}
                  style={{
                    // resize: "none",
                    padding: "0rem",
                    border: "1px solid var(--blue-75BBFD)",
                    fontFamily: "var(--font-raleway)",
                    borderRadius: "6px",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: "var(--fw-400)",
                    lineHeight: "16px",
                    color: "var(---black-1D2E43)",
                    boxSizing: "border-box",
                    paddingBottom: "2.5rem",
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
                <label
                  htmlFor="textBlock"
                  className={styles.form_container__textarea_label_constructor}
                >
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
                    toolbar: [
                      ["bold", "underline", { list: "bullet" }]
                    ],
                    clipboard: {
                      matchVisual: false,
                    },
                  }}
                  formats={["bold", "italic", "list"]}
                  className={styles.form_container__textarea}
                  style={{
                    // resize: "none",
                    padding: "0rem",
                    border: "1px solid var(--blue-75BBFD)",
                    fontFamily: "var(--font-raleway)",
                    borderRadius: "6px",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: "var(--fw-400)",
                    lineHeight: "16px",
                    color: "var(---black-1D2E43)",
                    boxSizing: "border-box",
                    paddingBottom: "2.5rem",
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
                <label
                  htmlFor="textBlock"
                  className={styles.form_container__textarea_label_constructor}
                >
                  Требования
                </label>
              </div>
            </div>
            </div>
          <div className={styles.form_container__button_block}>
            <button
              className={styles.form_container__button_save}
              type="submit"
            ></button>
            <button
              className={styles.form_container__button_cancel}
              type="button"
              onClick={closeModal}
            ></button>
          </div>
        </form>
      </div>
    </div>
  );
}
