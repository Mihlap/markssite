import { useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Login({ setUser }) {
  const serverHost = process.env.REACT_APP_SERVER_HOST;
  const navigate = useNavigate(); // Хук для перенаправления пользователя
  const [inputGroup, setInputGroup] = useState({
    userName: "",
    password: "",
  });
  const [errorDiv, setErrorDiv] = useState(false);

  const changeHandler = (event) =>
    setInputGroup((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${serverHost}/api/auth/login`,
        inputGroup,
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log("тут");
        setUser(response.data.name);
        navigate("/");
      }
    } catch (error) {
      setErrorDiv(true);
      console.error("Ошибка при попытке войти в систему", error);
    }
  };

  useEffect(() => {
    if (errorDiv) {
      const timer = setTimeout(() => {
        setErrorDiv(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  });

  return (
    <section className={styles.login_container}>
      <div className={styles.border_line}>
        <div className={styles.login_block}>
          <div className={styles.login_block__title}>MARKS GROUP</div>
          <div className={styles.login_block__subtitle}>
            Вход в административную панель
          </div>
          <form className={styles.login_form} onSubmit={submitHandler}>
            <div className={`${styles.form__group} ${styles.field}`}>
              <input
                type="input"
                className={styles.form__field}
                value={inputGroup.userName}
                onChange={changeHandler}
                placeholder="userName"
                name="userName"
                id="userName"
                required
              />
              <label htmlFor="userName" className={styles.form__label}>
                Введите рабочий E-mail
              </label>
            </div>

            <div className={`${styles.form__group} ${styles.field}`}>
              <input
                type="password"
                className={styles.form__field}
                value={inputGroup.password}
                onChange={changeHandler}
                placeholder="password"
                name="password"
                id="password"
                required
              />
              <label htmlFor="password" className={styles.form__label}>
                Введите пароль
              </label>
            </div>

            <div className={styles.error_bnt_block}>
              <button className={styles.form_button} type="submit">
                Войти
              </button>
              {errorDiv && (
                <div className={styles.error_div}>
                  Hеверный E-mail или пароль 😔
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
