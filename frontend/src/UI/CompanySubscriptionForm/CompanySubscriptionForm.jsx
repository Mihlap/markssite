import React, { useState } from 'react';
import styles from './CompanySubscriptionForm.module.css';

const isValidRegex = /\S+@\S+\.\S+/;

const CompanySubscriptionForm = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');
  const [isValid, setIsValid] = useState(false);

  function handleFocus(event) {
    setIsFocused(true);
    event.target.placeholder = '';
    setIsValid(isValidRegex.test(value));
    // event.placeholder.style.transform = 'translateY(-100%) scale(0.8)';
  }

  function handleBlur(event) {
    setIsFocused(false);
    if (!event.target.value) {
      event.target.placeholder = 'Ваш Email';
      setIsValid(true);
     }
  }

  function handleChange(event) {
  const email = event.target.value;
  const isValid = isValidRegex.test(email);
  const button = document.querySelector('#submit-button');

  setValue(email);
  setIsValid(isValid);

  if (isValid) {
    setIsFocused(false);
    button.setAttribute('disabled', true);
  } else {
    setIsFocused(true);
    button.removeAttribute('disabled');
  }
}

 return (
    <div className={styles.form_right_wrapper}>
      <div className={styles.form_right_main}>
        <div className={styles.title1}>
          {" "}
          Что бы всегда быть в курсе новых направлений и наших проектов
          подпишитесь на рассылку/альманах
        </div>
        <form className={styles.form_form_wrapper1}>
          <div className={styles.group}>
            <label
              className={`${styles.label} ${isFocused ? styles.focused : ""}`}
            >
              <input
                id="email-input"
                type="email"
                placeholder="Ваш Email"
                value={value}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                maxLength="55"
                size="55"
              />
              <div className={styles.line1}></div>
              <span className={styles.placeholder}>Ваш Email</span>
            </label>
          </div>
          <button className={`${styles.button_hover1} ${isValid ? '' : styles.disabled}`} id="submit-button" disabled={!isValid}>
            <p className={styles.button_name}>Подписаться</p>
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompanySubscriptionForm;