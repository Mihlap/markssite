import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import style from '../ButtonsProjects/AllProjectsButton.module.css';

const AllArticlesButton = ({ path = '/publication' }) => {
const linkRef = useRef(null);

   useEffect(() => {
     window.scrollTo(20, 0);
     gsap.set(linkRef.current, { opacity: 0 });
     gsap.to(linkRef.current, { duration: 1, opacity: 1, delay: 1 });
     gsap.registerPlugin(ScrollTrigger);
   }, []);
  
  return (
    <Link to={path} ref={linkRef}>
      <button className={style.button_link}>
        <div className={style.button_link_allProjectButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M14 8L9 12.5L14 17" stroke="#F6F6F6" />
          </svg>
        </div>
        <div className={style.button_name_allProjectButton}>Все статьи</div>
      </button>
    </Link>
  );
};

export default AllArticlesButton;
