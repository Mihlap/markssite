import React, { useState } from "react";
// import PhoneInput from 'react-phone-number-input';
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
  const [inputLineColor, setInputLineColor] = useState('#959DA6');

  // const [showError, setShowError] = useState(false);
 
  




  const Host = process.env.REACT_APP_SERVER_HOST;
 

  function handleFocus(event) {
    const name = event?.target?.name;
    if (name === "name") {
      setIsFocused1(true);
      setPhoneClicked(false);
    } else if (name === "phone") {
      setIsFocused2(true);
      setValue2("");
      setPhoneClicked(true);
      setInputLineColor('#FF7F6A');
    } else if (name === "task") {
      setIsFocused3(true);
      setPhoneClicked(false);
      setInputLineColor('#959DA6'); 
    }
  }

  function handleBlur(event) {
    const name = event?.target?.name;
    if (!event.target.value && name !== "phone") {
      event.target.placeholder = "";
      // setShowError(false);
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
          // setIsFocused2(true);
          setIsValid(true);
          setIsMatching(true);
         
        } else {
          setIsValid(false);
          setIsMatching(false);
          setIsFocused2(false);
          setInputLineColor('#959DA6');
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
    } else if (name === "task") {
      setValue3(value);
      if (!value) {
        setIsFocused3(false);
      }
    }
  }

  function handleSubmit(event) {
    event.preventDefault(); 
    if (!isConsentGiven) {
      // console.log('Согласие не установлено, форма не будет отправлена.');
      return;
    }
    const formData = {
      name: value1,
      phone: value2,
      task: value3,
      consentGiven: isConsentGiven,
    };
    fetch(`${Host}/api-mail/submitForm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (response.ok) {
          
          // console.log('Form submitted successfully');
          setValue1("");
          setValue2("");
          setValue3("");
          setIsConsentGiven(false);   
          
        } else {
             console.error('Form submission failed');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
      }

  
  return (
    <div className={styles.form_left_wrapper}>
      <div className={styles.border_line_con}>
      <div className={styles.form_left_main}>
        <div className={styles.title}>На связи</div>
        <span className={styles.span_text}>
        Давайте проектировать будущее вместе!
        </span>
        <form className={styles.form_form_wrapper} onSubmit={handleSubmit}>
          <div className={`${styles.group} some-unique-class`}>
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
                className={styles.input_name_form_contacts}
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
               id="phone-input"
                mask="+7 (999) 999-99-99"
                maskChar="_"
                name="phone"
                placeholder="+7 (___) ___-__-__"
                value={value2}
                onBlur={handleBlur}
                onChange={handleChange}
                onFocus={handleFocus}
                className={`${styles.input_tel_form_contacts} ${isFocused2 ? styles.focused : ''}`}
                // className={styles.input_tel_form_contacts}
                style={{ fontVariantNumeric: "lining-nums" }}
              />
              <div className={styles.line}
           style={{ backgroundColor: inputLineColor }}
            
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
                className={styles.input_task_form_contacts}
              />
              <div className={styles.line}></div>
              <span className={styles.placeholder}>Сообщение</span>
            </label>
          </div>
          <div className={styles.agreement}>
            <label>
              <input
                type="checkbox"
                id="checkbox"
                className={`${styles.checkbox} checkbox-input`}
                checked={isConsentGiven}
                onChange={(e) => setIsConsentGiven(e.target.checked)}
              />
              Подтвердите согласие на обработку
              <a href="./Information">&nbsp;персональных данных</a>
            </label>
          </div>
          <button
          type="submit"
          id="submit-button"
           className={`${styles.button_hover10}
           ${(!isValid || !value2 || !value1 || !value3 || !isConsentGiven) ? styles.disabled : ""}`}
           disabled={!isValid || !value2 || !value1 || !value3 || !isConsentGiven}
           >
            <p className={styles.button_name1}>Отправить</p>
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default CompanyFormContacts;
