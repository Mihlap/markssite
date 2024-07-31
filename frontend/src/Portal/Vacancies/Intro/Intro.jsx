import React, { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger, ScrollToPlugin } from 'gsap/all';

import styles from './Intro.module.scss';

import ButtonLink from '../ButtonLink/ButtonLink';
import starsDesktop from '../icons/intro-stars.png';

const Host = process.env.REACT_APP_SERVER_HOST;

const Intro = () => {
  const videoBoxRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  }, []);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    
    mm.add('(min-width: 1024px)', () => {
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
            }
          },
        }
      );  
        return tl.scrollTrigger;
    });

    ScrollTrigger.refresh();

    return () => {
       ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      <section className={styles.Intro}>
        <div className={styles.Intro__intro}>
          <div className={styles.Intro__text}>
            <span className={styles.Intro__pretitle}>Присоединяйтесь к&nbsp;MARKS&nbsp;GROUP</span>
            <h1 className={styles.Intro__title}>Мы&nbsp;в&nbsp;поиске талантливых специалистов</h1>
            <ButtonLink text="Смотреть вакансии" currentHref="#" section="Intro" currentStyles={styles} />
          </div>
          <div className={styles.Intro__animation}>
            <img src={starsDesktop} alt=""></img>
          </div>
        </div>
        <div className={styles.Intro__video} ref={videoBoxRef}>
          <video ref={videoRef} playsInline autoPlay muted loop>
            <source src={`${Host}/videos/main_company_full.mp4`} type="video/mp4" />
          </video>
        </div>
      </section>
    </>
  );
};

export default Intro;
