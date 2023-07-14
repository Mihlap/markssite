import React, { useEffect } from 'react';
import axios from 'axios';
import styles from "./Login.module.scss";
import { useNavigate } from 'react-router-dom';

export default function SignUpPage({ setUser }) {
  const navigate = useNavigate(); // Хук для перенаправления пользователя

  const serverHost = process.env.REACT_APP_SERVER_HOST;

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios({
          method: "get",
          url: `${serverHost}/api/auth/user`,
          withCredentials: true, // Включает отправку кук с запросом
        });

        if (response.status === 200) {
          // Здесь вы можете обновить ваш стейт, чтобы отразить, что пользователь зарегистрирован
          console.log("cooki");
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkUser();
  }, []);

  const sumbitHandler = async (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.target));

    try {
      const response = await axios({
        method: "post",
        url: `${serverHost}/api/auth/signup`,
        data: formData,
        withCredentials: true, // Включает отправку кук с запросом
      });

      if (response.status === 200) {
        console.log("зашел сюда");
        setUser(true);
        navigate("/admin");
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
