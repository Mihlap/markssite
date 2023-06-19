import React, { useRef, useState } from 'react';
import styles from './CompanySubscriptionForm.module.css';

const isValidRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

const CompanySubscriptionForm = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isMatching, setIsMatching] = useState(true);
  const emailInputRef = useRef(null);

  function handleFocus(event) {
    // const email = event.target.value;
    setIsFocused(true);
    event.target.placeholder = '';
  }

  function handleBlur(event) {
    setIsFocused(false);
    const email = event.target.value;
    const isValid = isValidRegex.test(email);
    setValue(email);
    setIsValid(isValid);
    // if (!email) {
    //   event.target.placeholder = 'Ваш Email';
    // } else {
    //   event.target.placeholder = null;
    // }
  }

  function handleChange(event) {
  const email = event.target.value.toLowerCase();
  const isValid = isValidRegex.test(email);
  const button = document.querySelector('#submit-button');
  setValue(email);
  setIsValid(isValid);
  setIsMatching(true);
}
function handleSubmit(event) {
  event.preventDefault();
  if (emailInputRef.current.checkValidity()) {
    const email = emailInputRef.current.value;
    if (email !== '') {
      if (emailInputRef.current.parentNode.querySelector('.placeholder')) {
        emailInputRef.current.parentNode.querySelector('.placeholder').style.transform = 'translateY(-100%) scale(0)';
      }
    }
    console.log(`Sending email to ${email}`);
  } else {
    console.log('Некорректный Email');
  }
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
        <form className={styles.form_form_wrapper1} onSubmit={handleSubmit}>
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
                onInput={checkMatching}
                maxLength="55"
                size="55"
                style={{
                  borderColor: (isValid && isMatching) ? '' : '#E00747',
                  color: (isValid && isMatching) ? '' : '#E00747',
                }}
                required
                ref={emailInputRef}
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
          onClick={handleSubmit}
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