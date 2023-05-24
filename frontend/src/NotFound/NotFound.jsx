import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./NotFound.module.scss";
import { Link } from "react-router-dom";

const NotFound = () => {
     const errorNumberRef = useRef(null);
     const errorTitleRef = useRef(null);
     const errorTextRef = useRef(null);

 useEffect(() => {
   const animateError = (ref, onComplete) => {
     const element = ref.current;
     const letters = element.textContent.split("");

     element.textContent = "";

     letters.forEach((letter) => {
       const span = document.createElement("span");
       span.textContent = letter;
       element.appendChild(span);
     });

     gsap.from(element.children, {
       duration: 1,
       autoAlpha: 0,
       y: 50,
       stagger: 0.1,
       onComplete,
     });
   };

   const animateText = () => {
     gsap.from(errorTextRef.current, {
       duration: 3,
       x: "-100%",
       ease: "power2.out",
     });
   };

   animateError(errorNumberRef, animateText);
   animateError(errorTitleRef);
 }, []);
  
  return (
    <section className={styles.error_section}>
      <div className={`${styles.error_block} ${styles.error_block_mobail}`}>
        <div ref={errorNumberRef} className={styles.error_number}>
          404
        </div>

        <div className={styles.error_text_block}>
          <div ref={errorTitleRef} className={styles.error_title}>
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
