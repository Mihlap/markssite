import { useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/Slice/authSlice";
import LoadingCircle from "../Loading/LoadingCircle";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [inputGroup, setInputGroup] = useState({
    userName: "",
    password: "",
  });
  const [showLoader, setShowLoader] = useState(false);
  const [errorDiv, setErrorDiv] = useState(false);
const status = useSelector((state) => state.auth.status);
  const changeHandler = (event) =>
    setInputGroup((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));

const submitHandler = (event) => {
  event.preventDefault();

  // Показать лоудер
  setShowLoader(true);

  // Задержка перед входом
  setTimeout(async () => {
    try {
      await dispatch(loginUser(inputGroup)).unwrap();
      navigate("/");
      // window.location.reload();
    } catch (error) {
      setErrorDiv(true);
      setShowLoader(false); // Скрыть лоудер, если произошла ошибка
    }
  }, 2500); // Задержка в 2 секунды
};

  useEffect(() => {
    if (errorDiv) {
      const timer = setTimeout(() => {
        setErrorDiv(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  });

  if (showLoader) {
    return <LoadingCircle />;
  }

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
