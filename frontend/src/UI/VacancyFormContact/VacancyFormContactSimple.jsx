import React, { useRef, useState, useCallback, useEffect } from "react";
import InputMask from "react-input-mask";
import { Link } from "react-router-dom";
import styles from "./VacancyFormContact.module.css";
import "react-phone-number-input/style.css";

const Host = process.env.REACT_APP_SERVER_HOST;

const VacancyFormContactSimple = ({
  handleMouseEnter,
  handleMouseLeave,
  buttonRef,
}) => {
  const [isFocused, setIsFocused] = useState({
    name: false,
    phone: false, 
    letter: false,
    resume: false,
  });

  const [isValid, setIsValid] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileAttached, setFileAttached] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",    
    letter: "",
    resume: "",
  });

  const fileInputRef = useRef(null);
  const isFilled = useCallback((name) => !!formData[name], [formData]);

  const handleFocus = useCallback((event) => {
    const name = event?.target?.name;
    setIsFocused((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handlePaste = useCallback((event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text");
    const cleanedValue = pastedData.replace(/\D/g, "");

    if (cleanedValue.length >= 10) {
      const formattedValue = `+7 (${cleanedValue.slice(-10, -7)}) ${cleanedValue.slice(-7, -4)}-${cleanedValue.slice(-4, -2)}-${cleanedValue.slice(-2)}`;
      setFormData((prevData) => ({ ...prevData, phone: formattedValue }));
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, []);

  const handleBlur = useCallback((event) => {
    const name = event?.target?.name;
    setIsFocused((prev) => ({ ...prev, [name]: false }));

    if (name === "phone") {
      const phoneNumberRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
      setIsValid(phoneNumberRegex.test(formData.phone));
    }
  }, [formData.phone]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "phone") {
      setIsValid(true);
    }
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();

    const formDataToSend = new FormData();
    const formDataCopy = { ...formData };

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
          setFormData({
            name: "",
            phone: "",           
            letter: "",
            resume: "",
          });
          setSelectedFiles([]);
          setFileAttached(false);
        } else {
          console.error("Form submission failed:", data.message || "Unknown error");
        }
      })
      .catch((error) => {
        if (!error.response || error.response.status !== 200) {
          console.error("Error:", error);
        }
      });
  }, [formData, selectedFiles]);

  const handleFileChange = useCallback((event) => {
    const files = Array.from(event.target.files);

    if (files.length > 0) {
      if (files.every((file) =>
        file.type.includes("image/") || file.type === "application/pdf" || file.type.includes("application/")
      )) {
        setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
        setFileAttached(true);
      } else {
        console.error("Invalid file type. Please select an image, PDF, or other document.");
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
    const isFormComplete = Object.values(formData).every(field => field.trim() !== "") && isValid;
    setIsFormValid(isFormComplete);
  }, [formData, isValid]);

  return (
    <form className={styles.form_form_wrapper} onSubmit={handleSubmit}>
      <div className={styles.form_vacancy_wrapperSimple}>
        <div className={styles.form_vacancy_block_simple}>
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
                  maxLength="100"
                  autoComplete="off"
                  className={styles.input_name_form_contacts}
                />
                <div className={styles.lineSimple}></div>
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
                  autoComplete="off"
                  onPaste={handlePaste}
                  className={`${styles.input_tel_form_contacts} ${
                    isFocused.phone ? styles.focused : ""
                  }`}
                  style={{ fontVariantNumeric: "lining-nums" }}
                />
                <div className={styles.lineSimple}></div>
                <span className={styles.placeholder}>Телефон</span>
                {!isValid && formData.phone.length > 0 && (
                  <span className={styles.error_line}>
                    Некорректный телефон
                  </span>
                )}
              </label>
            </div>           
          </div>
          <div className={styles.form_vacancy_right}>          
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
                  autoComplete="off"
                  className={styles.input_letter_form_contacts}
                />
                <div className={styles.lineSimple}></div>
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
                  autoComplete="off"
                  className={styles.input_resume_form_contacts}
                />
                <div className={`${styles.lineSimple} ${styles.line_resume}`}></div>
                <span className={styles.placeholder}>
                Ссылка&nbsp;на&nbsp;резюме/портфолио
                </span>
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
                      <span className={styles.removeFile_resumeFiles_remove}>
                        &times;
                      </span>
                    </span>
                    <span className={styles.fileName_resumeFiles}>
                      {file.name}
                    </span>
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
          <div className={styles.agreement_vacancy} style={{paddingTop: '80px'}}>
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
               </div>
             <div style={{display: 'flex', justifyContent: 'center', zIndex: '1000'}}>
            <button            
              className={`${styles.button_vacancy}
              ${!isFormValid ? styles.disabled : ""}`}
              disabled={!isFormValid}
              type="submit"
              id="submit-button"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ minWidth: '432px', height: '56px'}}
              ref={buttonRef}
            >
              <p className={styles.button_name_vacancy}>
                Откликнуться на вакансию
              </p>
            </button>
          </div>
        </div>      
      </div>
    </form>
  );
};

export default React.memo(VacancyFormContactSimple);
