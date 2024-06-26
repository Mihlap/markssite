import React, { useRef, useState, useMemo, useCallback, useEffect } from "react";
import InputMask from "react-input-mask";
import Select from "react-select";
import { Link } from "react-router-dom";
import styles from "./VacancyFormContact.module.css";
import "react-phone-number-input/style.css";
import icon_tg from "../../Portal/Vacancies/icons/icon_tg.png";
import ModalVacancyFormSend from "./ModalVacancyFormSend";
import LoadingVacancy from "../../Loading/LoadingVacancy";

const Host = process.env.REACT_APP_SERVER_HOST;

const VacancyFormContact = ({ initialDirection, handleMouseEnter, handleMouseLeave, vacancyTitle }) => {

  const options = useMemo(() => [
    { value: "Другое направление", label: "Другое направление" },
    { value: "Архитектура", label: "Архитектура" },
    { value: "Конструктив", label: "Конструктив" },
    { value: "Инженерия", label: "Инженерия" },
    { value: "Аналитика", label: "Аналитика" },
    { value: "Технологии", label: "Технологии" },
    { value: "Проектирование", label: "Проектирование" },
    { value: "BIM", label: "BIM" },
    { value: "Генеральный план", label: "Генеральный план" },
    { value: "it", label: "it" },
    { value: "Дизайн", label: "Дизайн" },
  ], []);

  const [selectedOptions, setSelectedOptions] = useState(
    options.find(option => option.value === initialDirection)
  );

  useEffect(() => {
    const foundOption = options.find(option => option.value === initialDirection);
    setSelectedOptions(foundOption);
    if (initialDirection) {
      setFormData((prevData) => ({ ...prevData, choose: initialDirection }));
    }
  }, [initialDirection, options]);

  const [isFocused, setIsFocused] = useState({
    name: false,
    phone: false,
    city: false,
    choose: false,
    letter: false,
    resume: false,
  });

  const [isValid, setIsValid] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileAttached, setFileAttached] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    choose: "",
    letter: "",
    resume: "",
    title: vacancyTitle,
  });

  const fileInputRef = useRef(null);
  const isFilled = useCallback((name) => !!formData[name], [formData]);

  const handleChangeVacancy = useCallback((selectedValues) => {
    setSelectedOptions(selectedValues);
    setFormData((prevData) => ({ ...prevData, choose: selectedValues?.value || "" }));
  }, []);

  const handleFocus = useCallback((event) => {
    const name = event?.target?.name;
    setIsFocused((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handlePaste = useCallback((event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text");
    const cleanedValue = pastedData.replace(/\D/g, "");

    if (cleanedValue.length >= 10) {
      const formattedValue = `+7 (${cleanedValue.slice(
        -10,
        -7
      )}) ${cleanedValue.slice(-7, -4)}-${cleanedValue.slice(
        -4,
        -2
      )}-${cleanedValue.slice(-2)}`;
      setFormData((prevData) => ({ ...prevData, phone: formattedValue }));
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, []);

  const handleBlur = useCallback(
    (event) => {
      const name = event?.target?.name;
      setIsFocused((prev) => ({ ...prev, [name]: false }));

      if (name === "phone") {
        const phoneNumberRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        setIsValid(phoneNumberRegex.test(formData.phone));
      }
    },
    [formData.phone]
  );

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "phone") {
      setIsValid(true);
    }
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      setIsLoading(true);

      const formDataToSend = new FormData();
      const formDataCopy = {
        ...formData,
        title: vacancyTitle,
        choose: selectedOptions ? selectedOptions.value : "",
      };

      Object.keys(formDataCopy).forEach((key) => {
        formDataToSend.append(key, formDataCopy[key]);
      });

      selectedFiles.forEach((file) => {
        formDataToSend.append("resumeFiles", file);
      });

      fetch(`${Host}/api-mail/portalSubmitForm`, {
        method: "POST",
        body: formDataToSend,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.message === "Письмо успешно отправлено") {
            setIsModalOpen(true);
            setFormData({
              name: "",
              phone: "",
              city: "",
              choose: "",
              letter: "",
              resume: "",
              title: vacancyTitle,
            });
            setSelectedFiles([]);
            setFileAttached(false);
            setSelectedOptions(null);
          } else {
            console.error(
              "Form submission failed:",
              data.message || "Unknown error"
            );
          }
        })
        .catch((error) => {
          if (!error.response || error.response.status !== 200) {
            console.error("Error:", error);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [formData, selectedOptions, selectedFiles]
  );

  const handleFileChange = useCallback((event) => {
    const files = Array.from(event.target.files);

    if (files.length > 0) {
      if (
        files.every(
          (file) =>
            file.type.includes("image/") ||
            file.type === "application/pdf" ||
            file.type.includes("application/")
        )
      ) {
        setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
        setFileAttached(true);
      } else {
        console.error(
          "Invalid file type. Please select an image, PDF, or other document."
        );
      }
    }
  }, []);

  const handleRemoveFile = useCallback((index) => {
    setSelectedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  }, []);
  
  useEffect(() => {
    const isFormComplete = Object.values(formData).every(field => field?.trim() !== "") && isValid && formData.choose;
    setIsFormValid(isFormComplete);
  }, [formData, isValid]);

  const customStyles = useMemo(
    () => ({
      container: (provided) => ({
        ...provided,
        border: "none",
        width: "100%",
      }),
      control: (provided, state) => ({
        ...provided,
        border: "none",
        backgroundColor: "transparent",
        boxShadow: state.isFocused ? "none" : provided.boxShadow,
        borderBottom: `1px solid ${state.isFocused ? "#75BBFD" : "#959DA6"}`,
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
        backgroundColor: state.isFocused ? "#75BBFD" : "transparent",
        color: state.isFocused ? "white" : "inherit",
      }),
      dropdownIndicator: (provided, state) => ({
        ...provided,
        transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : null,
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
      }),
      menu: (provided) => ({
        ...provided,
        boxShadow: "none",
        backgroundColor: "#EBECEE",
      }),
    }),
    []
  );

  return (
    <>
      {isLoading ? (
        <LoadingVacancy />
      ) : (
        <form className={styles.form_form_wrapper} onSubmit={handleSubmit}>
          <div className={styles.form_vacancy_wrapper}>
            <div className={styles.form_vacancy_block}>
              <div className={styles.form_vacancy_left}>
                <div className={`${styles.group} some-unique-class`}>
                  <label
                    className={`${styles.label1} ${isFocused.name || isFilled("name") ? styles.focused1 : ""}`}
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
                      maxLength="100"
                      autoComplete="off"
                      className={styles.input_name_form_contacts}
                    />
                    <div className={styles.line}></div>
                    <span className={styles.placeholder}>Ваше&nbsp;имя&nbsp;и&nbsp;фамилия</span>
                  </label>
                </div>
                <div className={styles.group}>
                  <label
                    className={`${styles.label1} ${isFocused.phone || isFilled("phone") ? styles.focused1 : ""}`}
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
                      autoComplete="off"
                      onPaste={handlePaste}
                      className={`${styles.input_tel_form_contacts} ${isFocused.phone ? styles.focused : ""}`}
                      style={{ fontVariantNumeric: "lining-nums" }}
                    />
                    <div className={styles.line}></div>
                    <span className={styles.placeholder}>Телефон</span>
                    {!isValid && formData.phone.length > 0 && (
                      <span className={styles.error_line}>Некорректный телефон</span>
                    )}
                  </label>
                </div>
                <div className={styles.group}>
                  <label
                    className={`${styles.label1} ${isFocused.city || isFilled("city") ? styles.focused1 : ""}`}
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
                    className={`${styles.label1} ${isFocused.choose || isFilled("choose") ? styles.focused1 : ""}`}
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
                      placeholder={"Выбрать направление"}
                      onChange={handleChangeVacancy}
                      isSearchable={false}
                      isClearable={true}
                      menuShouldScrollIntoView={false}
                      styles={customStyles}
                    />
                  </label>
                </div>
                <div className={`${styles.group} some-unique-class`}>
                  <label
                    className={`${styles.label1} ${isFocused.letter || isFilled("letter") ? styles.focused1 : ""}`}
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
                      autoComplete="off"
                      className={styles.input_letter_form_contacts}
                    />
                    <div className={styles.line}></div>
                    <span className={styles.placeholder}>Сопроводительное письмо</span>
                  </label>
                </div>
                <div className={styles.group}>
                  <label
                    className={`${styles.label1} ${isFocused.resume || isFilled("resume") ? styles.focused1 : ""}`}
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
                      autoComplete="off"
                      className={styles.input_resume_form_contacts}
                    />
                    <div className={`${styles.line} ${styles.line_resume}`}></div>
                    <span className={styles.placeholder}>Ссылка&nbsp;на&nbsp;резюме/портфолио</span>
                  </label>
                  <div className={styles.resumeFiles}>
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className={styles.fileContainer_resumeFiles}
                        onMouseOver={handleMouseEnter}
                        onMouseOut={handleMouseLeave}
                        onClick={() => handleRemoveFile(index)}
                      >
                        <span className={styles.removeFile_resumeFiles}>
                          <span className={styles.removeFile_resumeFiles_remove}>&times;</span>
                        </span>
                        <span className={styles.fileName_resumeFiles}>{file.name}</span>
                      </div>
                    ))}
                  </div>
                  {selectedFiles.length < 2 && (
                    <div>
                      <input
                        type="file"
                        name="resumeFile"
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
                        {fileAttached ? "Прикрепить файл" : "Прикрепить файл"}
                      </div>
                    </div>
                  )}
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
                  className={`${styles.button_vacancy} ${!isFormValid ? styles.disabled : ""}`}
                  disabled={!isFormValid}
                  type="submit"
                  id="submit-button"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <p className={styles.button_name_vacancy}>Откликнуться на вакансию</p>
                </button>
              </div>
            </div>
            <div className={styles.for_applicants_wrapper}>
              <div className={styles.for_applicants}>Для соискателей</div>
              <Link
                to="mailto:hr@marksgroup.ru"
                className={styles.for_applicants_mail}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                hr@marksgroup.ru
              </Link>
              <Link
                to="https://t.me/marks_career"
                target="_blank"
                className={styles.for_applicants_tg}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <img src={icon_tg} alt="Telegram" />
              </Link>
              <Link
                to={"tel:+74951201226"}
                className={styles.for_applicants_tel}
                style={{ fontVariantNumeric: "lining-nums" }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                +7&nbsp;(495)&nbsp;120-12-26
              </Link>
            </div>
          </div>
          <ModalVacancyFormSend
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            title="Заявка отправлена!"
            message="Мы свяжемся с вами в ближайшее время!"
          />
        </form>
      )}
    </>
  );
};

export default React.memo(VacancyFormContact);
