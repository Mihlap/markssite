import React, { useState } from "react";
import styles from "./CompanySubscriptionForm.module.css";

const isValidRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

const CompanySubscriptionForm = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [showError, setShowError] = useState(false);

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
    setValue(email);
    setIsValid(isValid);
    setShowError(false);
  }

  function handleSubmit(event) {
    // event.preventDefault();
    const email = event.target.querySelector("#email-input").value;
    const isValid = isValidRegex.test(email);
    setIsValid(isValid);
    setShowError(!isValid);
  }

//   const email = "dddd1@list.com";

// if (isValidRegex.test(email)) {
//   console.log("Email корректный");
// } else {
//   console.log("Email некорректный");
// }

  return (
    <div className={styles.form_right_wrapper}>
      <div className={styles.border_line_sub}>
        <div className={styles.form_right_main}>
          <div className={styles.title1}>
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
                  className={styles.email_input_form}
                  type="text"
                  placeholder=""
                  value={value}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  maxLength="70"
                  size="70"
                  style={{ borderColor: isValid ? "" : "#E00747" }}
                  autoComplete="off"
                />
                <div className={styles.line1}></div>
                <span className={styles.placeholder}>Ваш Email</span>
                {!isValid && showError && (
                <span
                  className={`${styles.error_line1} ${
                    showError ? "" : styles.hidden
                  }`}
                >
                  Некорректный Email
                </span>
                )} 
              </label>
            </div>
            <button
              className={`${styles.button_hover11} ${
                !isValid || !value ? styles.disabled : ""
              }`}
              id="submit-button"
              disabled={!value}
              type="submit"
            >
              <p className={styles.button_name}>Подписаться</p>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanySubscriptionForm;
