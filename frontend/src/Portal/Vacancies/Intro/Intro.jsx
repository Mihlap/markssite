import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import styles from './Intro.module.scss';

import ButtonLink from '../ButtonLink/ButtonLink';
import starsDesktop from '../icons/intro-stars.png';
import StarsImpulse from './StarsImpulse';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

const Intro = () => {
  const videoBoxRef = useRef(null);
  const videoRef = useRef(null);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const videoBox = videoBoxRef.current;
    const video = videoRef.current;

    const handleVideoLoaded = () => {
      if (!video) return;

      if (!isMobile) {
        video.style.opacity = 0;
        video.style.height = '0';
        video.style.width = '0';
        video.style.transition = 'opacity 1s ease, height 1s ease, width 1s ease';
      }
    };

    const handleIntersection = (entries) => {
      if (!video) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play().catch((error) => console.error('Ошибка воспроизведения видео:', error));

          if (!isMobile) {
            video.style.opacity = 1;
            video.style.height = '100vh';
            video.style.width = '100%';
          }
        } else {
          video.pause();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: 0.5,
    });

    if (videoBox && !isMobile) {
      observer.observe(videoBox);
    }

    if (video) {
      if (video.readyState >= 3) {
        handleVideoLoaded();
      } else {
        video.addEventListener('loadeddata', handleVideoLoaded);
      }
    }

    return () => {
      if (videoBox && !isMobile) {
        observer.unobserve(videoBox);
      }
      if (video) {
        video.removeEventListener('loadeddata', handleVideoLoaded);
      }
    };
  }, [location, isMobile]);

  return (
    <>
      <section className={styles.Intro}>
        <div className={styles.Intro__intro}>
          <div className={styles.Intro__text}>
            <span className={styles.Intro__pretitle}>Присоединяйтесь к&nbsp;MARKS&nbsp;GROUP</span>
            <h1 className={styles.Intro__title}>Мы&nbsp;в&nbsp;поиске талантливых специалистов</h1>
            <ButtonLink text="Смотреть вакансии" to="/hr/vacancies" section="Intro" currentStyles={styles} />
          </div>
          {isMobile ? (
            <div className={styles.Intro__animation}>
              <img src={starsDesktop} alt="" />
            </div>
          ) : (
            <div className={styles.Intro__starsWrapper}>
              {/* <StarsImpulse /> */}
            </div>
          )}
        </div>
        <div className={styles.Intro__video} ref={videoBoxRef}>
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            loop
            style={{
              display: 'block',
              ...(isMobile ? { width: '100%', height: '50vh' } : { opacity: 0, height: '0', width: '0' }),
            }}>
            <source src={`${bucket_url}/images/video/main_company_full.mp4`} type="video/mp4" />
          </video>
        </div>
      </section>
    </>
  );
};

export default Intro;
