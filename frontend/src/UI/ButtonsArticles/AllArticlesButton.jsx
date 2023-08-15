import React, { useEffect, useRef } from 'react';
import gsap from "gsap";
import { Link } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
    Все статьи
    </button>
    </Link>
  )
}

export default AllArticlesButton;