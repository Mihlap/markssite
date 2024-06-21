import React, { useState, useCallback } from "react";
import InputMask from "react-input-mask";
import styles from "./CompanyFormContacts.module.css";
import "react-phone-number-input/style.css";


const CompanyFormContacts = ({
  handleMouseEnter,
  handleMouseLeave,
  setIsLoading,
  setModalOpen,
  handleMouseHover,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    task: "",
  });

  const [isFocused, setIsFocused] = useState({
    name: false,
    phone: false,
    task: false,
  });

  const [isValid, setIsValid] = useState(true);
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [inputLineColor, setInputLineColor] = useState("#959DA6");

  const Host = process.env.REACT_APP_SERVER_HOST;

  const handleFocus = useCallback((event) => {
    const name = event.target.name;
    setIsFocused((prevState) => ({
      ...prevState,
      [name]: true,
    }));
    if (name === "phone") {
      setInputLineColor("#FF7F6A");
    } else {
      setInputLineColor("#959DA6");
    }
  }, []);

  const handleBlur = useCallback(
    (event) => {
      const name = event.target.name;
      if (!formData[name]) {
        setIsFocused((prevState) => ({
          ...prevState,
          [name]: false,
        }));
      }
      if (name === "phone") {
        const phoneNumberRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        setIsValid(phoneNumberRegex.test(formData.phone));
        if (!phoneNumberRegex.test(formData.phone)) {
          setInputLineColor("#959DA6");
        } else {
          setInputLineColor("#959DA6");
        }
      }
    },
    [formData]
  );

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "phone") {
      setIsValid(true);
      setInputLineColor("#FF7F6A");
    }
  }, []);

  const handlePaste = useCallback((event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text").replace(/\D/g, "");
    if (pastedData.length >= 10) {
      const formattedValue = `+7 (${pastedData.slice(
        -10,
        -7
      )}) ${pastedData.slice(-7, -4)}-${pastedData.slice(
        -4,
        -2
      )}-${pastedData.slice(-2)}`;
      setFormData((prevState) => ({
        ...prevState,
        phone: formattedValue,
      }));
      setIsValid(true);
    } else {
      setIsValid(false);
      setInputLineColor("#959DA6");
    }
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      setIsLoading(true);

      if (!isConsentGiven) return;
      fetch(`${Host}/api-mail/submitForm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, consentGiven: isConsentGiven }),
      })
        .then((response) => {
          if (response.ok) {
            setModalOpen(true);
            setFormData({ name: "", phone: "", task: "" });
            setIsConsentGiven(false);
          } else {
            console.error("Form submission failed");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [formData, isConsentGiven, Host]
  );

  return (
        <div className={styles.form_left_wrapper}>
          <div className={styles.border_line_con}>
            <div className={styles.form_left_main}>
              <div className={styles.title}>На связи</div>
              <span className={styles.span_text}>
                Наши специалисты ответят на&nbsp;все интересующие вас вопросы
              </span>
              <form
                className={styles.form_form_wrapper}
                onSubmit={handleSubmit}
              >
                <div className={`${styles.group} some-unique-class`}>
                  <label
                    className={`${styles.label1} ${
                      isFocused.name ? styles.focused1 : ""
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
                      maxLength="30"
                      size="65"
                      autoComplete="off"
                      className={styles.input_name_form_contacts}
                    />
                    <div className={styles.line}></div>
                    <span className={styles.placeholder}>Ваше&nbsp;Имя</span>
                  </label>
                </div>
                <div className={styles.group}>
                  <label
                    className={`${styles.label1} ${
                      isFocused.phone ? styles.focused1 : ""
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
                    <div
                      className={styles.line}
                      style={{ backgroundColor: inputLineColor }}
                    ></div>
                    {!isValid && formData.phone.length > 0 && (
                      <span className={styles.error_line}>
                        Некорректный телефон
                      </span>
                    )}
                    <span className={styles.placeholder}>
                      Номер&nbsp;телефона
                    </span>
                  </label>
                </div>
                <div className={styles.group}>
                  <label
                    className={`${styles.label1} ${
                      isFocused.task ? styles.focused1 : ""
                    }`}
                    onMouseOver={handleMouseEnter}
                    onMouseOut={handleMouseLeave}
                  >
                    <input
                      type="text"
                      name="task"
                      placeholder=""
                      value={formData.task}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      maxLength="300"
                      size="55"
                      autoComplete="off"
                      className={styles.input_task_form_contacts}
                    />
                    <div className={styles.line}></div>
                    <span className={styles.placeholder}>Сообщение</span>
                  </label>
                </div>
                <div className={styles.agreement}>
                  <label
                    onMouseOver={handleMouseEnter}
                    onMouseOut={handleMouseLeave}
                  >
                    <input
                      type="checkbox"
                      id="checkbox"
                      className={`${styles.checkbox} checkbox-input`}
                      checked={isConsentGiven}
                      onChange={(e) => setIsConsentGiven(e.target.checked)}
                    />
                    <p className={styles.agreement_label_text_block}>
                      Подтвердите согласие на&nbsp;обработку
                      <a href="./Information">
                        &nbsp;<u>персональных&nbsp;данных</u>
                      </a>
                    </p>
                  </label>
                </div>
                <button
                  className={`${styles.button_hover10} ${
                    !isValid ||
                    !formData.phone ||
                    !formData.name ||
                    !formData.task ||
                    !isConsentGiven
                      ? styles.disabled
                      : ""
                  }`}
                  disabled={
                    !isValid ||
                    !formData.phone ||
                    !formData.name ||
                    !formData.task ||
                    !isConsentGiven
                  }
                  type="submit"
                  id="submit-button"
                  onMouseOver={handleMouseEnter}
                  onMouseOut={handleMouseLeave}
                >
                  <p className={styles.button_name10}>Отправить</p>
                </button>
              </form>
            </div>
          </div>
        </div> 
  );
};

export default CompanyFormContacts;
