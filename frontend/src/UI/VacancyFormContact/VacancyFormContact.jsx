import React, { useRef, useState } from "react";
import InputMask from "react-input-mask";
import Select from "react-select";
import { Link } from "react-router-dom";
import styles from "./VacancyFormContact.module.css";
import "react-phone-number-input/style.css";

const options = [
  { value: " ", label: " " },
  { value: "Архитектура", label: "Архитектура" },
  { value: "Конструкции", label: "Конструкции" },
  { value: "Инженерия", label: "Инженерия" },
  { value: "Аналитика", label: "Аналитика" },
  { value: "Технологии", label: "Технологии" },
  { value: "Проектирование", label: "Проектирование" },
  { value: "BIM", label: "BIM" },
  { value: "Генеральный план", label: "Генеральный план" },
  { value: "it", label: "it" },
  { value: "Дизайн", label: "Дизайн" },
];

const Host = process.env.REACT_APP_SERVER_HOST;

const VacancyFormContact = ({
  handleMouseEnter,
  handleMouseLeave,
  handleMouseHover,
}) => {
  const [isFocused1, setIsFocused1] = useState(false);
  const [value1, setValue1] = useState("");
  const [isFocused2, setIsFocused2] = useState(false);
  const [value2, setValue2] = useState("");
  const [isFocused3, setIsFocused3] = useState(false);
  const [value3, setValue3] = useState("");
  const [isFocused4, setIsFocused4] = useState(false);
  const [value4, setValue4] = useState("");
  const [isFocused5, setIsFocused5] = useState(false);
  const [value5, setValue5] = useState("");
  const [isFocused6, setIsFocused6] = useState(false);
  const [value6, setValue6] = useState("");

  const [isValid, setIsValid] = useState(true);
  const [isMatching, setIsMatching] = useState(true);
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [phoneClicked, setPhoneClicked] = useState(false);
  const [inputLineColor, setInputLineColor] = useState("#959DA6");
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileAttached, setFileAttached] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (
        file.type.includes("image/") ||
        file.type === "application/pdf" ||
        file.type.includes("application/")
      ) {
        console.log("Selected file:", file);
        setSelectedFile(file);
        setFileAttached(true);
      } else {
        console.error(
          "Invalid file type. Please select an image, PDF, or other document."
        );
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileAttached(false);
  };

  const handleChangeVacancy = (selectedValues) => {
    setSelectedOptions(selectedValues);
  };
  // const [showError, setShowError] = useState(false);

  function handleFocus(event) {
    const name = event?.target?.name;
    if (name === "name") {
      setIsFocused1(true);
      setPhoneClicked(false);
    } else if (name === "phone") {
      setIsFocused2(true);
      setValue2("");
      setPhoneClicked(true);
      setInputLineColor("#FF7F6A");
    } else if (name === "city") {
      setIsFocused3(true);
      setPhoneClicked(false);
      setInputLineColor("#959DA6");
    } else if (name === "choose") {
      setIsFocused4(true);
      setPhoneClicked(false);
      setInputLineColor("#959DA6");
    } else if (name === "letter") {
      setIsFocused5(true);
      setPhoneClicked(false);
      setInputLineColor("#959DA6");
    } else if (name === "resume") {
      setIsFocused6(true);
      setPhoneClicked(false);
      setInputLineColor("#959DA6");
    }
  }

  function handleBlur(event) {
    const name = event?.target?.name;
    if (!event.target.value && name !== "phone") {
      event.target.placeholder = "";
      // setShowError(false);
      if (name === "name") {
        setIsFocused1(false);
      } else if (
        name === "city" ||
        name === "choose" ||
        name === "letter" ||
        name === "resume"
      ) {
        setIsFocused3(false);
        setIsFocused4(false);
        setIsFocused5(false);
        setIsFocused6(false);
      }
    } else {
      if (name === "name") {
        setIsFocused1(true);
      } else if (
        name === "city" ||
        name === "choose" ||
        name === "letter" ||
        name === "resume"
      ) {
        setIsFocused3(true);
        setIsFocused4(false);
        setIsFocused5(true);
        setIsFocused6(true);
      }

      if (name === "phone") {
        const phoneNumberRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        if (phoneNumberRegex.test(value2)) {
          // setIsFocused2(true);
          setIsValid(true);
          setIsMatching(true);
        } else {
          setIsValid(false);
          setIsMatching(false);
          setIsFocused2(false);
          setInputLineColor("#959DA6");
        }
      }
    }
  }

  function handleChange(event) {
    const name = event?.target?.name;
    const value = event?.target?.value;
    // console.log(name, value);
    if (name === "name") {
      setValue1(value);
      if (!value) {
        setIsFocused1(false);
      }
    } else if (name === "phone") {
      setValue2(value);
      if (!value) {
        setIsFocused2(false);
        // setInputLineColor('#959DA6');
      }
      // setShowError(false);
      if (!value) {
        setIsFocused2(false);
      }
    } else if (name === "city") {
      setValue3(value);
      if (!value) {
        setIsFocused3(false);
      }
    } else if (name === "letter") {
      setValue4(value);
      if (!value) {
        setIsFocused4(false);
      }
    } else if (name === "letter") {
      setValue5(value);
      if (!value) {
        setIsFocused5(false);
      }
    } else if (name === "resume") {
      setValue6(value);
      if (!value) {
        setIsFocused6(false);
      }
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
      const formData = {
      name: value1,
      phone: value2,
      city: value3,
      choose: value4,
      letter: value5,
      resume: value6,
    };

    fetch(`${Host}/api-mail/portalSubmitForm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
    
          setValue1("");
          setValue2("");
          setValue3("");
          setValue4("");
          setValue5("");
          setValue6("");
          setIsConsentGiven(false);
        } else {
          console.error("Form submission failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <div className={styles.form_vacancy_wrapper}>
      <div className={styles.form_vacancy_block}>
        <div className={styles.form_vacancy_left}>
          <form className={styles.form_form_wrapper} onSubmit={handleSubmit}>
            <div className={`${styles.group} some-unique-class`}>
              <label
                className={`${styles.label1} ${
                  isFocused1 ? styles.focused1 : " "
                }`}
                onMouseOver={handleMouseEnter}
                onMouseOut={handleMouseLeave}
              >
                <input
                  type="text"
                  name="name"
                  placeholder=""
                  value={value1}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  maxLength="30"
                  size="65"
                  autoComplete="off"
                  className={styles.input_name_form_contacts}
                />
                <div className={styles.line}></div>
                <span className={styles.placeholder}>
                  Ваше&nbsp;имя&nbsp;и&nbsp;фамилия
                </span>
              </label>
            </div>
            <div className={styles.group}>
              <label
                className={`${styles.label1} ${
                  isFocused2 ? styles.focused1 : " "
                }`}
                onMouseOver={handleMouseEnter}
                onMouseOut={handleMouseLeave}
              >
                <InputMask
                  id="phone-input"
                  mask="+7 (999) 999-99-99"
                  maskChar="_"
                  name="phone"
                  placeholder="+7 (___) ___-__-__"
                  value={value2}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={`${styles.input_tel_form_contacts} ${
                    isFocused2 ? styles.focused : ""
                  }`}
                  // className={styles.input_tel_form_contacts}
                  style={{ fontVariantNumeric: "lining-nums" }}
                />
                <div
                  className={styles.line}
                  style={{ backgroundColor: inputLineColor }}
                ></div>
                {!isValid && value2.length > 0 && (
                  <span className={styles.error_line}>
                    Некорректный телефон
                  </span>
                )}
                {/* <span className={styles.placeholder}>Номер телефона</span> */}
              </label>
            </div>
            <div className={styles.group}>
              <label
                className={`${styles.label1} ${
                  isFocused3 ? styles.focused1 : " "
                }`}
                onMouseOver={handleMouseEnter}
                onMouseOut={handleMouseLeave}
              >
                <input
                  type="text"
                  name="city"
                  placeholder=""
                  value={value3}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  maxLength="300"
                  size="55"
                  autoComplete="off"
                  className={styles.input_city_form_contacts}
                />
                <div className={styles.line}></div>
                <span className={styles.placeholder}>Город</span>
              </label>
            </div>
          </form>
        </div>
        <div className={styles.form_vacancy_right}>
          <form className={styles.form_form_wrapper} onSubmit={handleSubmit}>
            <div className={`${styles.group} some-unique-class`}>
              <label
                className={`${styles.label1} ${
                  isFocused4 ? styles.focused1 : " "
                }`}
                onMouseOver={handleMouseEnter}
                onMouseOut={handleMouseLeave}
              >
                <Select
                  className={styles.input_choose_form_contacts}
                  id="choose-input"
                  name="choose"
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  isMulti={false}
                  options={options}
                  value={selectedOptions}
                  placeholder={"Выбрать вакансию"}
                  onChange={handleChangeVacancy}
                  isSearchable={false}
                  isClearable={false}
                  styles={{
                    container: (provided) => ({
                      ...provided,
                      border: "none",
                    }),
                    control: (provided, state) => ({
                      ...provided,
                      border: "none",
                      backgroundColor: "transparent",
                      boxShadow: state.isFocused ? "none" : provided.boxShadow,
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
                  }}
                />
                <div className={`${styles.line} ${styles.line_select}`}></div>
                {/* <span className={styles.placeholder}>Выбрать вакансию</span> */}
              </label>
            </div>
            <div className={`${styles.group} some-unique-class`}>
              <label
                className={`${styles.label1} ${
                  isFocused5 ? styles.focused1 : " "
                }`}
                onMouseOver={handleMouseEnter}
                onMouseOut={handleMouseLeave}
              >
                <input
                  type="text"
                  name="letter"
                  placeholder=""
                  value={value5}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  maxLength="30"
                  size="65"
                  autoComplete="off"
                  className={styles.input_letter_form_contacts}
                />
                <div className={styles.line}></div>
                <span className={styles.placeholder}>
                  Сопроводительное письмо
                </span>
              </label>
            </div>
            <div className={styles.group}>
              <label
                className={`${styles.label1} ${
                  isFocused6 ? styles.focused1 : " "
                }`}
                onMouseOver={handleMouseEnter}
                onMouseOut={handleMouseLeave}
              >
                <input
                  type="text"
                  name="resume"
                  placeholder=""
                  value={value6}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  maxLength="300"
                  size="55"
                  autoComplete="off"
                  className={styles.input_resume_form_contacts}
                />
                <div className={styles.line}></div>
                <span className={styles.placeholder}>
                  Ссылка на резюме/портфолио
                </span>
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
                ref={fileInputRef}
              />
              <div
                className={styles.button_resume_file}
                onMouseOver={handleMouseEnter}
                onMouseOut={handleMouseLeave}
                onMouseHover={handleMouseHover}
                onClick={() => fileInputRef.current.click()}
              >
                {fileAttached ? (
                  <div className={styles.fileAttached}>
                    <span>Файл прикреплен</span>
                    <span
                      className={styles.removeFile}
                      onClick={handleRemoveFile}
                    >
                      &times;
                    </span>
                  </div>
                ) : (
                  "Прикрепить файл"
                )}
              </div>
            </div>
          </form>
        </div>
        <div className={styles.agreement_vacancy}>
          Нажав на кнопку, соглашаюсь на обработку{" "}
          <Link
            to="../Information"
            target="blank"
            className={styles.agreement_vacancy_link}
            onMouseOver={handleMouseEnter}
            onMouseOut={handleMouseLeave}
          >
            персональных данных
          </Link>
          <button
            className={`${styles.button_vacancy}
          ${
            !isValid || !value2 || !value1 || !value3 || !value5 || !value6
              ? styles.disabled
              : ""
          }`}
            disabled={
              !isValid || !value2 || !value1 || !value3 || !value5 || !value6
            }
            type="submit"
            id="submit-button"
            onMouseOver={handleMouseEnter}
            onMouseOut={handleMouseLeave}
            onMouseHover={handleMouseHover}
          >
            <p className={styles.button_name_vacancy}>
              Откликнутся на вакансию
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VacancyFormContact;
