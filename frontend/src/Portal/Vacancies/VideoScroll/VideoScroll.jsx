import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import styles from './VideoScroll.module.scss';

const Host = process.env.REACT_APP_SERVER_HOST;

const VideoScroll = () => {
  gsap.registerPlugin(ScrollTrigger);

  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    // Добавим задержку перед инициализацией ScrollTrigger
    const initScrollTrigger = () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
          end: 'bottom center',
          toggleActions: 'play none none none',
        },
      });

      tl.fromTo(
        videoRef.current,
        {
          display: 'none',
          height: '0',
          width: '0',
        },
        {
          display: 'block',
          height: '100vh',
          width: '100%',
          duration: 1,
        }
      );

      ScrollTrigger.refresh();
    };

    const timeout = setTimeout(initScrollTrigger, 500);

    return () => {
      clearTimeout(timeout);
      ScrollTrigger.kill();
    };
  }, []);

  return (
    <section className={styles.VideoScroll} ref={containerRef}>
      <video ref={videoRef} playsInline autoPlay muted loop className={styles.VideoScroll__video}>
        <source src={`${Host}/videos/main_company_full.mp4`} type="video/mp4" />
      </video>
    </section>
  );
};

export default VideoScroll;
