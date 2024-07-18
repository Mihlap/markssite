import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

import styles from './VideoScroll.module.scss';

const Host = process.env.REACT_APP_SERVER_HOST;

const VideoScroll = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // Начать анимацию, когда 50% элемента видимо
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.fromTo(
            videoRef.current,
            {
              height: '0',
              width: '0',
            },
            {
              height: '100vh',
              width: '100%',
              duration: 1,
            }
          );
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
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
