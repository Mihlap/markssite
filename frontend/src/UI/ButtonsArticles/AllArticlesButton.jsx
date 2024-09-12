import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import style from '../ButtonsProjects/AllProjectsButton.module.css';

const AllArticlesButton = () => {
  const refs = {
    link: useRef(null),
  };

  useEffect(() => {
    window.scrollTo(20, 0);

    const { link } = refs;
    // Скрываем заголовок, ссылку и описание перед анимацией
    gsap.set([link.current], { opacity: 0 });

    // Анимируем появление заголовка, затем ссылки, затем описания
    gsap.to(link.current, { duration: 1, opacity: 1, delay: 1 });

    gsap.registerPlugin(ScrollTrigger);
  }, []);
  return (
    <Link to="/publication" ref={refs.link}>
      <button className={style.button_link}>
        <div className={style.button_link_allProjectButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M14 8L9 12.5L14 17" stroke="#F6F6F6" />
          </svg>
        </div>
        <div className={style.button_name_allProjectButton}>Все публикации</div>
      </button>
    </Link>
  );
};

export default AllArticlesButton;
