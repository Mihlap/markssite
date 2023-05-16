import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./NotFound.module.scss";
import { Link } from "react-router-dom";

const NotFound = () => {
  const errorNumberRef = useRef(null);

  useEffect(() => {
    const errorNumber = errorNumberRef.current;
    const letters = errorNumber.textContent.split("");

    errorNumber.textContent = "";

    letters.forEach((letter) => {
      const span = document.createElement("span");
      span.textContent = letter;
      errorNumber.appendChild(span);
    });

    gsap.from(errorNumber.children, {
      duration: 1,
      autoAlpha: 0,
      y: 50,
      stagger: 0.1,
    });
  }, []);
  return (
    <section className={styles.error_section}>
      <div className={styles.error_block}>
        <div ref={errorNumberRef} className={styles.error_number}>
          404
        </div>

        <div className={styles.error_text_block}>
          <div className={styles.error_title}>
            К сожалению страница не найдена
          </div>
          <div className={styles.error_text}>
            Возможно вы неправильно набрали URL-адрес или страница была удалена
          </div>
        </div>
        <Link className={styles.error_link} to="/">
          Вернуться на главную
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
