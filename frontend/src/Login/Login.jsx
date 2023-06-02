import { useDispatch, useSelector } from "react-redux";
import { setIdentifier, setPassword, login } from "../store/Slice/loginSlice";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";
import { useEffect } from "react";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Хук для перенаправления пользователя
  const { identifier, password, user, error, isLoading } = useSelector(
    (state) => state.login
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login());
  };

  // Проверка авторизации пользователя при загрузке компонента
  useEffect(() => {
    if (user) {
      navigate("/add"); // Перенаправляем пользователя на страницу Add, если он авторизован
    }
  }, [user, navigate]);

  return (
    <section className={styles.login_container}>
        <div className={styles.login_block}>
          <form className={styles.login_form} onSubmit={handleSubmit}>
            <div className={`${styles.form__group} ${styles.field}`}>
              <input
                type="input"
                className={styles.form__field}
                placeholder="Name"
                name="identifier"
                value={identifier}
                onChange={(e) => dispatch(setIdentifier(e.target.value))}
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
                value={password}
                onChange={(e) => dispatch(setPassword(e.target.value))}
                required
              />
              <label htmlFor="name" className={styles.form__label}>
                password
              </label>
            </div>
            <button
              className={styles.form_button}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </form>
          <div className={styles.welcome_block}>
            {error && <p>неверный логин или пароль</p>}
            {user && <p>Добрый день, {user.username}!</p>}
          </div>
        </div>
    </section>
  );
}
