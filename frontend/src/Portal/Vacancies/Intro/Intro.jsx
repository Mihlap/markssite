// import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import gsap from 'gsap';
// import { ScrollTrigger, ScrollToPlugin } from 'gsap/all';

// import styles from './Intro.module.scss';

// import ButtonLink from '../ButtonLink/ButtonLink';
// import starsDesktop from '../icons/intro-stars.png';
// import StarsImpulse from './StarsImpulse';

// const Host = process.env.REACT_APP_SERVER_HOST;

// const Intro = () => {
//   const videoBoxRef = useRef(null);
//   const videoRef = useRef(null);
//   const location = useLocation();
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 767);
//     };

//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   useLayoutEffect(() => {
//     if (!gsap.core.globals().ScrollTrigger) {
//       gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
//     }

//     const tl = gsap.timeline({
//       scrollTrigger: {
//         trigger: videoBoxRef.current,
//         start: 'top 70%',
//         end: 'bottom 30%',
//         toggleActions: 'play pause resume reset',
//         onEnter: () => {
//           if (videoRef.current && videoRef.current.paused) {
//             videoRef.current.play().catch((error) => {
//               console.error('Ошибка воспроизведения видео:', error);
//             });
//           }
//         },
//         onLeaveBack: () => {
//           if (videoRef.current) {
//             videoRef.current.pause();
//           }
//         },
//       },
//     });

//     const handleVideoLoaded = () => {
//       gsap.set(videoRef.current, { autoAlpha: 0, height: '0', width: '0' });

//       tl.fromTo(
//         videoRef.current,
//         { autoAlpha: 0, height: '0', width: '0' },
//         {
//           autoAlpha: 1,
//           height: '100vh',
//           width: '100%',
//           duration: 0.3,
//         }
//       );
//     };

//     if (videoRef.current) {
//       if (videoRef.current.readyState >= 3) {
//         handleVideoLoaded();
//       } else {
//         videoRef.current.addEventListener('loadeddata', handleVideoLoaded);
//       }
//     }

//     ScrollTrigger.refresh();

//     return () => {
//       if (tl.scrollTrigger) {
//         tl.scrollTrigger.kill();
//       }
//       tl.kill();
//       if (videoRef.current) {
//         videoRef.current.removeEventListener('loadeddata', handleVideoLoaded);
//       }
//     };
//   }, [location]);

//   return (
//     <>
//       <section className={styles.Intro}>
//         <div className={styles.Intro__intro}>
//           <div className={styles.Intro__text}>
//             <span className={styles.Intro__pretitle}>Присоединяйтесь к&nbsp;MARKS&nbsp;GROUP</span>
//             <h1 className={styles.Intro__title}>Мы&nbsp;в&nbsp;поиске талантливых специалистов</h1>
//             <ButtonLink text="Смотреть вакансии" to="/portal/vacancies" section="Intro" currentStyles={styles} />
//           </div>
//           {isMobile ? (
//             <div className={styles.Intro__animation}>
//               <img src={starsDesktop} alt=""></img>
//             </div>
//           ) : (
//             <div className={styles.Intro__starsWrapper}>
//               <StarsImpulse />
//             </div>
//           )}
//         </div>
//         <div className={styles.Intro__video} ref={videoBoxRef}>
//           <video ref={videoRef} playsInline autoPlay muted loop style={{ display: 'block' }}>
//             <source src={`${Host}/videos/main_company_full.mp4`} type="video/mp4" />
//           </video>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Intro;

import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Intro.module.scss';

import ButtonLink from '../ButtonLink/ButtonLink';
import starsDesktop from '../icons/intro-stars.png';
import StarsImpulse from './StarsImpulse';

const Host = process.env.REACT_APP_SERVER_HOST;

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
    const handleVideoLoaded = () => {
      const video = videoRef.current;
      if (!video) return;

      // Начальное состояние видео
      video.style.opacity = 0;
      video.style.height = '0';
      video.style.width = '0';
      video.style.transition = 'opacity 1s ease, height 1s ease, width 1s ease';
    };

    const handleIntersection = (entries) => {
      const video = videoRef.current;
      if (!video) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Вход в зону видимости: запускаем видео и анимацию
          video.play().catch((error) => console.error('Ошибка воспроизведения видео:', error));
          video.style.opacity = 1;
          video.style.height = '100vh';
          video.style.width = '100%';
        } else {
          // Выход из зоны видимости: останавливаем видео
          video.pause();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null, // Вся область видимости
      threshold: 0.5, // Процент видимой части видео для срабатывания
    });

    if (videoBoxRef.current) {
      observer.observe(videoBoxRef.current);
    }

    if (videoRef.current) {
      if (videoRef.current.readyState >= 3) {
        handleVideoLoaded();
      } else {
        videoRef.current.addEventListener('loadeddata', handleVideoLoaded);
      }
    }

    return () => {
      if (videoBoxRef.current) {
        observer.unobserve(videoBoxRef.current);
      }
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadeddata', handleVideoLoaded);
      }
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
          {isMobile ? (
            <div className={styles.Intro__animation}>
              <img src={starsDesktop} alt="" />
            </div>
          ) : (
            <div className={styles.Intro__starsWrapper}>
              <StarsImpulse />
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
            style={{ display: 'block', opacity: 0, height: '0', width: '0' }}
          >
            <source src={`${Host}/videos/main_company_full.mp4`} type="video/mp4" />
          </video>
        </div>
      </section>
    </>
  );
};

export default Intro;
