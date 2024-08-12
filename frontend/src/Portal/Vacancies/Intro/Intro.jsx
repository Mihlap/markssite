import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger, ScrollToPlugin } from 'gsap/all';

import styles from './Intro.module.scss';

import ButtonLink from '../ButtonLink/ButtonLink';
import starsDesktop from '../icons/intro-stars.png';

const Host = process.env.REACT_APP_SERVER_HOST;

const Intro = () => {
  const videoBoxRef = useRef(null);
  const videoRef = useRef(null);
  const [key, setKey] = useState(0);
  const [videoVisible, setVideoVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  }, []);

  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, []);

  useEffect(() => {
    setVideoVisible(false); 

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: videoBoxRef.current,
        start: 'top 60%',
        end: 'top 40%',
        toggleActions: 'play none none none',
        onEnter: () => {
          setVideoVisible(true);
        },
      }
    });

    tl.fromTo(
      videoRef.current,
      { display: 'none', height: '0', width: '0' },
      {
        display: 'block',
        height: '100vh',
        width: '100%',
        duration: 0.3,
        onComplete: () => {
          if (videoRef.current) {
            videoRef.current.play().catch(error => {
              console.error("Ошибка воспроизведения видео:", error);
            });
          }
        },
      }
    );

    return () => {
      tl.scrollTrigger && tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [location]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.style.display = 'none';
      videoRef.current.style.height = '0';
      videoRef.current.style.width = '0';

      videoRef.current.addEventListener('loadeddata', () => {
        setVideoVisible(true); 
      });

      videoRef.current.addEventListener('error', () => {
        setVideoVisible(false); 
      });

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadeddata', () => {
            setVideoVisible(true);
          });

          videoRef.current.removeEventListener('error', () => {
            setVideoVisible(false);
          });
        }
      };
    }
  }, []);

  return (
    <>
      <section className={styles.Intro}>
        <div className={styles.Intro__intro}>
          <div className={styles.Intro__text}>
            <span className={styles.Intro__pretitle}>Присоединяйтесь к&nbsp;MARKS&nbsp;GROUP</span>
            <h1 className={styles.Intro__title}>Мы&nbsp;в&nbsp;поиске талантливых специалистов</h1>
            <ButtonLink text="Смотреть вакансии" to="/portal/vacancies" section="Intro" currentStyles={styles} />
          </div>
          <div className={styles.Intro__animation}>
            <img src={starsDesktop} alt=""></img>
          </div>
        </div>
        <div className={styles.Intro__video} ref={videoBoxRef}>
          <video
            key={key}
            ref={videoRef}
            playsInline
            autoPlay
            muted
            loop
            style={{ display: videoVisible ? 'block' : 'none' }}
            >
            <source src={`${Host}/videos/main_company_full.mp4`} type="video/mp4" />
          </video>
        </div>
      </section>
    </>
  );
};

export default Intro;
