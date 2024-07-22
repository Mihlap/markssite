import React, { useEffect, useRef } from 'react';
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import gsap from "gsap";

import star_1 from '../icons/star-1.png';
import star_2 from '../icons/star-2.png';
import star_3 from '../icons/star-3.png';
import star_4 from '../icons/star-4.png';

// Анимированные звездочки с классом родительского компонента для управления стилями из родительского компонента
const StarsBack = ({ section, styles }) => {
  const star1Ref = useRef(null);
  const star2Ref = useRef(null);
  const star3Ref = useRef(null);
  const star4Ref = useRef(null);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    [star1Ref, star3Ref].forEach(ref => {
      if (ref.current) {
        ref.current.style.transform = `rotate(${scrollY / windowHeight * 90}deg)`;
        ref.current.style.transformOrigin = "center";
      }
    });

    [star2Ref, star4Ref].forEach(ref => {
      if (ref.current) {
        ref.current.style.transform = `rotate(${-scrollY / windowHeight * 90}deg)`;
        ref.current.style.transformOrigin = "center";
      }
    });

    [star1Ref, star2Ref, star3Ref, star4Ref].forEach(ref => {
      if (ref.current) {
        ref.current.style.filter = `blur(${Math.min(5, scrollY / windowHeight * 1)}px)`;
      }
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    [star1Ref, star2Ref, star3Ref, star4Ref].forEach(ref => {
      if (ref.current) {
        ref.current.style.transformOrigin = "center center";
      }
    });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div
        className={`${styles[`${section}__star`]} ${styles[`${section}__star_1`]}`}
        style={{ backgroundImage: `url(${star_1})` }}
        ref={star1Ref}
      />
      <div
        className={`${styles[`${section}__star`]} ${styles[`${section}__star_2`]}`}
        style={{ backgroundImage: `url(${star_2})` }}
        ref={star2Ref}
      />
      <div
        className={`${styles[`${section}__star`]} ${styles[`${section}__star_3`]}`}
        style={{ backgroundImage: `url(${star_3})` }}
        ref={star3Ref}
      />
      <div
        className={`${styles[`${section}__star`]} ${styles[`${section}__star_4`]}`}
        style={{ backgroundImage: `url(${star_4})` }}
        ref={star4Ref}
      />
    </>
  );
};

export default StarsBack;