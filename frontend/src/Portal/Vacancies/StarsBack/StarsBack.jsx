import React, { useEffect, useRef } from 'react';
import star_1 from '../icons/star-1.png';
import star_2 from '../icons/star-2.png';
import star_3 from '../icons/star-3.png';
import star_4 from '../icons/star-4.png';

const StarsBack = ({ section, styles }) => {
  const containerRef = useRef(null);
  const star1Ref = useRef(null);
  const star2Ref = useRef(null);
  const star3Ref = useRef(null);
  const star4Ref = useRef(null);

  const ROTATION_DEG_VALUE = 90;
  const BLUR_VALUE = 30;

  const handleScroll = () => {
    if (!containerRef.current) return;

    const containerTop = containerRef.current.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    const scrollY = -containerTop + windowHeight / 2;

    [star1Ref, star3Ref].forEach((ref) => {
      if (ref.current) {
        ref.current.style.transform = `rotate(${(scrollY / windowHeight) * ROTATION_DEG_VALUE}deg)`;
      }
    });

    [star2Ref, star4Ref].forEach((ref) => {
      if (ref.current) {
        ref.current.style.transform = `rotate(${(-scrollY / windowHeight) * ROTATION_DEG_VALUE}deg)`;
      }
    });

    [star1Ref, star2Ref, star3Ref, star4Ref].forEach((ref) => {
      if (ref.current) {
        ref.current.style.filter = `blur(${Math.min(BLUR_VALUE, (scrollY / windowHeight) * BLUR_VALUE)}px)`;
      }
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef}>
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
    </div>
  );
};

export default StarsBack;
