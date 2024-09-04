import React, { useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger, ScrollToPlugin } from 'gsap/all';

import styles from './Intro.module.scss';

import ButtonLink from '../ButtonLink/ButtonLink';
import starsDesktop from '../icons/intro-stars.png';
import StarsImpulse from './StarsImpulse';

const Host = process.env.REACT_APP_SERVER_HOST;

const Intro = () => {
  const videoBoxRef = useRef(null);
  const videoRef = useRef(null);
  const location = useLocation();

  useLayoutEffect(() => {
    if (!gsap.core.globals().ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    }

        const tl = gsap.timeline({
      scrollTrigger: {
        trigger: videoBoxRef.current,
        start: 'top 70%', 
        end: 'bottom 30%', 
        toggleActions: 'play pause resume reset', 
        onEnter: () => {
          if (videoRef.current && videoRef.current.paused) {
            videoRef.current.play().catch((error) => {
              console.error('Ошибка воспроизведения видео:', error);
            });
          }
        },
          onLeaveBack: () => {
          if (videoRef.current) {
              videoRef.current.pause();
            }
          }, 
        },
      });
     
    tl.fromTo(
      videoRef.current,
      { autoAlpha: 0, height: '0', width: '0' },
      {
        autoAlpha: 1,
        height: '100vh',
        width: '100%',
        duration: 0.3,    
      }
    );

    ScrollTrigger.refresh();

    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
    };
  }, [location]);


  return (
    <>
      <section className={styles.Intro}>
        <div className={styles.Intro__intro}>
          <div className={styles.Intro__text}>
            <span className={styles.Intro__pretitle}>Присоединяйтесь к&nbsp;MARKS&nbsp;GROUP</span>
            <h1 className={styles.Intro__title}>Мы&nbsp;в&nbsp;поиске талантливых специалистов</h1>
            <ButtonLink text="Смотреть вакансии" to="/portal/vacancies" section="Intro" currentStyles={styles} />
          </div>
            <StarsImpulse />
          <div className={styles.Intro__animation}>
            {/* <img src={starsDesktop} alt=""></img> */}
          </div>
        </div>
        <div className={styles.Intro__video} ref={videoBoxRef}>
          <video        
            ref={videoRef}
            playsInline
            autoPlay
            muted
            loop         
            style={{ display: 'block' }}
            >
            <source src={`${Host}/videos/main_company_full.mp4`} type="video/mp4" />
          </video>
        </div>
      </section>
    </>
  );
};

export default Intro;
