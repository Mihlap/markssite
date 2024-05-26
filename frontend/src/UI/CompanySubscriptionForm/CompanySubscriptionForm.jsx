import React, { useState, useCallback, useMemo } from "react";
import styles from "./CompanySubscriptionForm.module.css";

const isValidRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
const Host = process.env.REACT_APP_SERVER_HOST;

const CompanySubscriptionForm = ({
  handleMouseEnter,
  handleMouseLeave,
  handleMouseHover,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState("");

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback((event) => {
    setIsFocused(true);
    const email = event?.target?.value;
    const isValid = isValidRegex.test(email);
    if (!email) {
      setIsFocused(false);
    }
    setValue(email);
    setIsValid(isValid);
  }, []);

  const handleChange = useCallback((event) => {
    const email = event.target.value.toLowerCase();
    const isValid = isValidRegex.test(email);
    setValue(email);
    setIsValid(isValid);
    setShowError(false);
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    const email = event.target.querySelector("#email-input").value;
    const isValid = isValidRegex.test(email);
    setIsValid(isValid);
    setShowError(!isValid);
    if (!isValid) {
      setShowError(true);
      return;
    }
    try {
      const response = await fetch(`${Host}/api-mail/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.status === 200) {
        setMessage("Вы успешно подписались на новости.");
        setValue("");
      } else {
        setMessage("Произошла ошибка при подписке.");
      }
    } catch (error) {
      setMessage("Произошла ошибка при подписке.");
    }
  }, []);

  const emailInputStyle = useMemo(() => ({
    borderColor: isValid ? "" : "#E00747"
  }), [isValid]);

  const submitButtonClass = useMemo(() => (
    `${styles.button_hover11} ${!isValid || !value ? styles.disabled : ""}`
  ), [isValid, value]);

  return (
    <div className={styles.form_right_wrapper}>
      <div className={styles.border_line_sub}>
        <div className={styles.form_right_main}>
          <div className={styles.title1}>
            Что бы всегда быть в&nbsp;курсе новых направлений и&nbsp;наших проектов, подпишитесь на&nbsp;рассылку/альманах
          </div>
          <form className={styles.form_form_wrapper1} onSubmit={handleSubmit}>
            <div className={styles.group}>
              <label
                className={`${styles.label} ${isFocused ? styles.focused : ""}`}
                onMouseOver={handleMouseEnter}
                onMouseOut={handleMouseLeave}
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
                  style={emailInputStyle}
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
              className={submitButtonClass}
              id="submit-button"
              disabled={!value}
              type="submit"
              onMouseOver={handleMouseEnter}
              onMouseOut={handleMouseLeave}
            >
              <p className={styles.button_name}>Подписаться</p>
            </button>
          </form>
          {message && <div className={styles.message}>{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default CompanySubscriptionForm;
