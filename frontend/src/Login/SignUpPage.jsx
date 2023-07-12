import React from 'react';
import axios from 'axios';
import styles from "./Login.module.scss";
import { useNavigate } from 'react-router-dom';

export default function SignUpPage() {
  const navigate = useNavigate(); // Хук для перенаправления пользователя

  const serverHost = process.env.REACT_APP_SERVER_HOST;

  const sumbitHandler = async (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.target));

    try {
      const response = await axios.post(
        `${serverHost}/api/auth/signup`,
        formData
      );
      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className={styles.login_container}>
      <div className={styles.login_block}>
        <form className={styles.login_form} onSubmit={sumbitHandler}>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="input"
              className={styles.form__field}
              placeholder="Name"
              name="userName"
              // value={identifier}
              // onChange={(e) => dispatch(setIdentifier(e.target.value))}
              required
            />
            <label htmlFor="name" className={styles.form__label}>
              Name
            </label>
          </div>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="password"
              className={styles.form__field}
              placeholder="password"
              name="password"
              // value={password}
              // onChange={(e) => dispatch(setPassword(e.target.value))}
              required
            />
            <label htmlFor="name" className={styles.form__label}>
              password
            </label>
          </div>
          <button
            className={styles.form_button}
            type="submit"
            // disabled={isLoading}
          >
            зарегистрироваться
          </button>
        </form>
      </div>
    </section>
  );
}
