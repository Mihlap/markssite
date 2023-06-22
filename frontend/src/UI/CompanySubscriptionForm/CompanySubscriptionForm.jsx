import React, { useRef, useState } from 'react';
import styles from './CompanySubscriptionForm.module.css';

const isValidRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

const CompanySubscriptionForm = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isMatching, setIsMatching] = useState(true);
  const emailInputRef = useRef(null);

  function handleFocus() {
    setIsFocused(true);
  }

  function handleBlur(event) {
    setIsFocused(true);
    const email = event.target.value;
    const isValid = isValidRegex.test(email);
    if (!email) {
      setIsFocused(false);
    }
    setValue(email);
    setIsValid(isValid);
    }

  function handleChange(event) {
  const email = event.target.value.toLowerCase();
  const isValid = isValidRegex.test(email);
  const button = document.querySelector('#submit-button');
  setValue(email);
  setIsValid(isValid);
  setIsMatching(true);
}

function checkMatching(event) {
  const email = event.target.value.toLowerCase();
  const isValid = isValidRegex.test(email);
  const isMatching = event.target.checkValidity(); 
  setIsValid(isValid);
  setIsMatching(isMatching);
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
              className={`${styles.label} ${isFocused ? styles.focused : " "}`}
            >
              <input
                id="email-input"
                type="email"
                placeholder=""
                value={value}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur} 
                onInput={checkMatching}
                maxLength="70"
                size="70"
                style={{
                  borderColor: (isValid && isMatching) ? '' : '#E00747',
                  color: (isValid && isMatching) ? '' : '#E00747',
                }}
                required
                ref={emailInputRef}
                autoComplete="off"
              />
              <div
              className={styles.line1}
              style={{backgroundColor: (!value && !isFocused) ? '' : (!value && isFocused) ? '#FF7F6A' : (isValid && isMatching) ? '' : '#E00747'}}
              >
              </div>
              {!isValid && value.length > 0 && ( <span className={styles.error_line1}>Некорректный Email</span>)}
              <span className={styles.placeholder}>Ваш Email</span>
            </label>
          </div>
          <button
          className={`${styles.button_hover1} ${(!isValid || !isMatching || !value) ? styles.disabled : ''}`}
          id="submit-button"
          disabled={!isValid || !isMatching || !value}
          type="submit"
          >
            <p className={styles.button_name}>Подписаться</p>
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompanySubscriptionForm;