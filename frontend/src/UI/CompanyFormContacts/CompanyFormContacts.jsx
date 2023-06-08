import React from "react";
import styles from "./CompanyFormContacts.module.css";

const CompanyFormContacts = () => {
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
            <label>
              <input
                type="text"
                placeholder="Ваше имя"
                // value={name}
                // onChange={(e) => setName(e.target.value)}
              />
              <div className={styles.line}></div>
            </label>
          </div>
          <div className={styles.group}>
            <label>
              <input
                type="tel"
                placeholder="Номер телефона"
                // value={phone}
                // onChange={(e) => setPhone(e.target.value)}
              />
              <div className={styles.line}></div>
            </label>
          </div>
          <div className={styles.group}>
            <label>
              <input
                type="text"
                placeholder="Задача"
                // value={task}
                // onChange={(e) => setTask(e.target.value)}
              />
              <div className={styles.line}></div>
            </label>
          </div>
          <div className={styles.agreement}>
            <label>
              <input
                type="checkbox"
                id="checkbox"
                className={styles.checkbox}
                // value={consent}
                // onChange={(e) => setConsent(e.target.checked)}
              />
              Подтвердите согласие на обработку <a href="">персональных данных</a>
            </label>
          </div>
          <button className={styles.form_button}>
            <p className={styles.button_name}>Отправить</p>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanyFormContacts;
