import React, { useEffect, useRef } from 'react';
import gsap from "gsap";
import { Link } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import style from './../ButtonsProjects/AllProjectsButton.module.css';

const AllVacancyButton = () => {
  const refs = {
    link: useRef(null),
   };
 
  useEffect(() => {
    window.scrollTo(20, 0);
 
    const { link } = refs;
    gsap.set([link.current], { opacity: 0 });
 
    gsap.to(link.current, { duration: 1, opacity: 1, delay: 1 });
     
    gsap.registerPlugin(ScrollTrigger);
 
  }, []);
  return (
    <Link to="/portal/vacancies" ref={refs.link}>
    <button className={style.button_link_vacancy}>
      <div className={style.button_link_allProjectButton}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M14 8L9 12.5L14 17" stroke="#566272"/>
</svg>
</div>
   <div className={style.button_name_allProjectButton}>Все вакансии</div>
    </button>
    </Link>
  )
}

export default AllVacancyButton;