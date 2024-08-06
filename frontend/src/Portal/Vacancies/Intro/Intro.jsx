import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  }, []);

  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, []);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    const showVideo = () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: videoBoxRef.current,
          start: 'center center',
          end: 'center center',
          toggleActions: 'play none none none',
        }
      });

      tl.fromTo(
        videoRef.current,
        { display: 'none', height: '0', width: '0' },
        {
          display: 'block',
          height: '100vh',
          width: '100%',
          duration: 0.2,
          onComplete: () => {
            if (videoBoxRef.current) {
              gsap.to(window, { duration: 1, scrollTo: videoBoxRef.current });
              setVideoVisible(true);
            }
          },
        }
      );

      return () => {
        tl.scrollTrigger && tl.scrollTrigger.kill();
        tl.kill();
      };
    };

    mm.add('(min-width: 1024px)', showVideo);

    return () => {
      mm.revert();
    };
  }, [videoVisible]);

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
  }, [videoVisible]);

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
