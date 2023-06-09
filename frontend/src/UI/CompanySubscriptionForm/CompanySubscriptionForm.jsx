import React, { useState } from 'react';
import styles from './CompanySubscriptionForm.module.css';

const CompanySubscriptionForm = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');

  function handleFocus(event) {
    setIsFocused(true);
    event.target.placeholder = '';
    // event.placeholder.style.transform = 'translateY(-100%) scale(0.8)';
  }

  function handleBlur(event) {
    setIsFocused(false);
    if (!event.target.value) {
      event.target.placeholder = 'Ваш Email';
     }
  }

  function handleChange(event) {
    setValue(event.target.value);
    if (!event.target.value) {
      setIsFocused(false);
    }
  }

  function handleChange(event) {
    setValue(event.target.value);
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
          <label className={`${styles.label} ${isFocused ? styles.focused : ''}`}>
      <input
        type="email"
        placeholder="Ваш Email"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <div className={styles.line1}></div>
      <span className={styles.placeholder}>Ваш Email</span>
    </label>
          </div>
          <button className={styles.button_hover1}>
            <p className={styles.button_name}>Подписаться</p>
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompanySubscriptionForm;