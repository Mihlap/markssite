import { useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";


export default function Login() {
  const navigate = useNavigate(); // Хук для перенаправления пользователя


  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   dispatch(login());
  // };

  // Проверка авторизации пользователя при загрузке компонента
  // useEffect(() => {
  //   if (user) {
  //     navigate("/admin"); // Перенаправляем пользователя на страницу Add, если он авторизован
  //   }
  // }, [user, navigate]);

  return (
    <section className={styles.login_container}>
        <div className={styles.login_block}>
        <form className={styles.login_form}
          // onSubmit={handleSubmit}
        >
            <div className={`${styles.form__group} ${styles.field}`}>
              <input
                type="input"
                className={styles.form__field}
                placeholder="Name"
                name="identifier"
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
          войти
            </button>
          </form>
       
        </div>
    </section>
  );
}
