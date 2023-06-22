import React, { useRef, useState } from "react";
import PhoneInput from 'react-phone-number-input';
import InputMask from 'react-input-mask';
import styles from "./CompanyFormContacts.module.css";
import 'react-phone-number-input/style.css';

const CompanyFormContacts = () => {
  const [isFocused1, setIsFocused1] = useState(false);
  const [value1, setValue1] = useState("");
  const [isFocused2, setIsFocused2] = useState(false);
  const [value2, setValue2] = useState("");
  const [isFocused3, setIsFocused3] = useState(false);
  const [value3, setValue3] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isMatching, setIsMatching] = useState(true);
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [phoneClicked, setPhoneClicked] = useState(false);

 

  function handleFocus(event) {
    const name = event?.target?.name;
    if (name === "name") {
      setIsFocused1(true);
      setPhoneClicked(false);
    } else if (name === "phone") {
      setIsFocused2(true);
      setValue2("");
      setPhoneClicked(true);
    } else if (name === "task") {
      setIsFocused3(true);
      setPhoneClicked(false);
    }
  }

  function handleBlur(event) {
    const name = event?.target?.name;
    if (!event.target.value && name !== "phone") {
      event.target.placeholder = "";
      if (name === "name") {
        setIsFocused1(false);
      } else if (name === "task") {
        setIsFocused3(false);
      }
    } else {
      if (name === "name") {
        setIsFocused1(true);
      } else if (name === "task") {
        setIsFocused3(true);
      }
  
      if (name === "phone") {
        const phoneNumberRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        if (phoneNumberRegex.test(value2)) {
          setIsValid(true);
          setIsMatching(true);
        } else {
          setIsValid(false);
          setIsMatching(false);
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
      }
    } else if (name === "task") {
      setValue3(value);
      if (!value) {
        setIsFocused3(false);
      }
    }
  }

  
  return (
    <div className={styles.form_left_wrapper}>
      <div className={styles.form_left_main}>
        <div className={styles.title}>Свяжитесь с нами</div>
        <span className={styles.span_text}>
          Мы будем рады ответить на все интересующие вас
          вопросы..........................
        </span>
        <form className={styles.form_form_wrapper}>
          <div className={styles.group}>
            <label
              className={`${styles.label1} ${
                isFocused1 ? styles.focused1 : " "
              }`}
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
              />
              <div className={styles.line}></div>
              <span className={styles.placeholder}>Ваше Имя</span>
            </label>
          </div>
          <div className={styles.group}>
            <label
             className={`${styles.label1} ${isFocused2 ? styles.focused1 : " "}`}
             >
              <InputMask
                mask="+7 (999) 999-99-99"
                maskChar="_"
                name="phone"
                placeholder="+7 (___) ___-__-__"
                value={value2}
                onBlur={handleBlur}
                onChange={handleChange}
                onFocus={handleFocus}
                className={`${styles.input} ${isFocused2 ? styles.focused : ''}`}
              />
              <div className={styles.line}
              style={{backgroundColor: (!value2 && !isFocused2) ? '' : (!value2 && isFocused2) ? '#FF7F6A' : (isValid && isMatching) ? '' : '#E00747'}}
              ></div>
              {!isValid && value2.length > 0 && ( <span className={styles.error_line}>Некорректный телефон</span>)}
              {/* <span className={styles.placeholder}>Номер телефона</span> */}
            </label>
          </div>
          <div className={styles.group}>
            <label
              className={`${styles.label1} ${
                isFocused3 ? styles.focused1 : " "
              }`}
            >
              <input
                type="text"
                name="task"
                placeholder=""
                value={value3}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                maxLength="300"
                size="55"
                autoComplete="off"
              />
              <div className={styles.line}></div>
              <span className={styles.placeholder}>Задача</span>
            </label>
          </div>
          <div className={styles.agreement}>
            <label>
              <input
                type="checkbox"
                id="checkbox"
                className={styles.checkbox}
                checked={isConsentGiven}
                onChange={(e) => setIsConsentGiven(e.target.checked)}
              />
              Подтвердите согласие на обработку
              <a href="./Information">&nbsp;персональных данных</a>
            </label>
          </div>
          <button className={styles.button_hover} disabled={!isConsentGiven || !value2 || !isValid || !isMatching}>
            <p className={styles.button_name}>Отправить</p>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanyFormContacts;
