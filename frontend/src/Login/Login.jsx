import { useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";
import { useEffect, useState, useRef } from "react";
import axios from "axios";


export default function Login({ setUser }) {
  const serverHost = process.env.REACT_APP_SERVER_HOST;
  const navigate = useNavigate(); // Хук для перенаправления пользователя
  const [inputGroup, setInputGroup] = useState({
    userName: "",
    password: "",
  });

  const inputRef = useRef(null);

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
      console.error("Ошибка при попытке войти в систему", error);
    }
  };

  useEffect(() => {
    const inputs = document.querySelectorAll(".form__field");

    inputs.forEach((input) => {
      input.addEventListener("click", () => {
        input.focus();
      });
    });
  }, []);

  return (
    <section className={styles.login_container}>
      <div className={styles.login_block}>
        <form className={styles.login_form} onSubmit={submitHandler}>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="input"
              className={styles.form__field}
              value={inputGroup.userName}
              onChange={changeHandler}
              placeholder="Name"
              name="userName"
              required
            />
            <label htmlFor="name" className={styles.form__label} onClick={() => inputRef.current.focus()}>
              Name
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
              required
            />
            <label htmlFor="name" className={styles.form__label}>
              password
            </label>
          </div>
          <button className={styles.form_button} type="submit">
            войти
          </button>
        </form>
      </div>
    </section>
  );
}
