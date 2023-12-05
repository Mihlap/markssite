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
  // handleMouseHover,
}) => {
  const [isFocused, setIsFocused] = useState({
    name: false,
    phone: false,
    city: false,
    choose: false,
    letter: false,
    resume: false,
  });
 
  const [isValid, setIsValid] = useState(true);
  const [isMatching, setIsMatching] = useState(true);
  const [phoneClicked, setPhoneClicked] = useState(false);
  const [inputLineColor, setInputLineColor] = useState("#959DA6");
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileAttached, setFileAttached] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    choose: "",
    letter: "",
    resume: "",
  });


  const fileInputRef = useRef(null);
  const isFilled = (name) => !!formData[name];

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (
        file.type.includes("image/") ||
        file.type === "application/pdf" ||
        file.type.includes("application/")
      ) {
        // console.log("Selected file:", file);
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
 

  function handleFocus(event) {
    const name = event?.target?.name;
    setPhoneClicked(false);
    setInputLineColor("#959DA6");
    setIsFocused((prev) => ({ ...prev, [name]: true }));
  }

  function handleBlur(event) {
    const name = event?.target?.name;
    setIsFocused((prev) => ({ ...prev, [name]: false }));

    if (!event.target.value && name !== "phone") {
      event.target.placeholder = "";
    } else {
      if (name === "phone") {
        const phoneNumberRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        if (phoneNumberRegex.test(formData.phone)) {
          setIsValid(true);
          setIsMatching(true);
        } else {
          setIsValid(false);
          setIsMatching(false);
          setInputLineColor("#959DA6");
        }
      }
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };



  function handleSubmit(event) {
    event.preventDefault();
    const formDataCopy = { ...formData };

    formDataCopy.choose = selectedOptions ? selectedOptions.value : '';
  
  const formDataToSend = new FormData();
  formDataToSend.append('name', formDataCopy.name);
  formDataToSend.append('phone', formDataCopy.phone);
  formDataToSend.append('city', formDataCopy.city);
  formDataToSend.append('choose', formDataCopy.choose);
  formDataToSend.append('letter', formDataCopy.letter);
  formDataToSend.append('resume', formDataCopy.resume);
  
  if (selectedFile) {
    formDataToSend.append('resumeFile', selectedFile);
  }
  
  fetch(`${Host}/api-mail/portalSubmitForm`, {
    method: 'POST',
    body: formDataToSend,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Server response:', data);
  
      if (data && data.message === 'Письмо успешно отправлено') {
        setFormData({ 
          name: "",
          phone: "",
          city: "",
          choose: "",
          letter: "",
          resume: "",
        });
        setSelectedFile(null);
        setFileAttached(false);
        setSelectedOptions(null);
      } else {
        // Вывод ошибки только в случае неудачи
        console.error('Form submission failed:', data.message || 'Unknown error');
      }
    })
    .catch((error) => {
      // Логировать только фактические ошибки, а не успешные ответы
      if (!error.response || error.response.status !== 200) {
        console.error('Error:', error);
      }
    });
  
  }

 
  

  return (
    <form className={styles.form_form_wrapper} onSubmit={handleSubmit}>
    <div className={styles.form_vacancy_wrapper}>
      <div className={styles.form_vacancy_block}>
        <div className={styles.form_vacancy_left}>
          <div className={`${styles.group} some-unique-class`}>
              <label
                  className={`${styles.label1} ${
                    isFocused.name || isFilled("name") ? styles.focused1 : ""
                  }`}
                onMouseOver={handleMouseEnter}
                onMouseOut={handleMouseLeave}
              >
                <input
                  type="text"
                  name="name"
                  placeholder=""
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  maxLength="150"
                  size="55"
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
                  isFocused.phone || isFilled("phone") ? styles.focused1 : ""
                }`}
                onMouseOver={handleMouseEnter}
                onMouseOut={handleMouseLeave}
              >
                <InputMask
                  id="phone-input"
                  mask="+7 (999) 999-99-99"
                  maskChar=""
                  name="phone"
                  placeholder=""
                  value={formData.phone}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={`${styles.input_tel_form_contacts} ${
                    isFocused.phone ? styles.focused : ""
                  }`}
                   style={{ fontVariantNumeric: "lining-nums" }}
                />
                <div
                  className={styles.line}
                  style={{ backgroundColor: inputLineColor }}
                ></div>
                  <span className={styles.placeholder}>
                  Номер&nbsp;телефона
                </span>
                {!isValid && formData.phone.length > 0 && (
                  <span className={styles.error_line}>
                    Некорректный телефон
                  </span>
                )}
              </label>
            </div>
            <div className={styles.group}>
              <label
                  className={`${styles.label1} ${
                  isFocused.city || isFilled("city") ? styles.focused1 : ""
                }`}
                onMouseOver={handleMouseEnter}
                onMouseOut={handleMouseLeave}
              >
                <input
                  type="text"
                  name="city"
                  placeholder=""
                  value={formData.city}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  maxLength="100"
                  size="55"
                  autoComplete="off"
                  className={styles.input_city_form_contacts}
                />
                <div className={styles.line}></div>
                <span className={styles.placeholder}>Город</span>
              </label>
            </div>
         </div>
        <div className={styles.form_vacancy_right}>
             <div className={`${styles.group} some-unique-class`}>
              <label               
                className={`${styles.label1} ${
                  isFocused.choose || isFilled("choose") ? styles.focused1 : ""
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
                  isFocused.letter || isFilled("letter") ? styles.focused1 : ""
                }`}
                onMouseOver={handleMouseEnter}
                onMouseOut={handleMouseLeave}
              >
                <input
                  type="text"
                  name="letter"
                  placeholder=""
                  value={formData.letter}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  maxLength="500"
                  size="55"
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
                  isFocused.resume || isFilled("resume") ? styles.focused1 : ""
                }`}
                onMouseOver={handleMouseEnter}
                onMouseOut={handleMouseLeave}
              >
                <input
                  type="text"
                  name="resume"
                  placeholder=""
                  value={formData.resume}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  maxLength="200"
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
            !isValid || !formData
              ? styles.disabled
              : ""
          }`}
            disabled={
              !isValid || !formData
            }
            type="submit"
            id="submit-button"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            >
            <p className={styles.button_name_vacancy}>
              Откликнутся на вакансию
            </p>
          </button>
        </div>
      </div>
    </div>
    </form>
  );
};

export default VacancyFormContact;
