import React, { useLayoutEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

import star_1 from '../icons/star-1.png';
import star_2 from '../icons/star-2.png';
import star_3 from '../icons/star-3.png';
import star_4 from '../icons/star-4.png';

// Анимированные звездочки с классом родительского компонента для управления стилями из родительского компонента
const StarsBack = ({ section, styles }) => {
  gsap.registerPlugin(ScrollTrigger);

  const star1Ref = useRef(null);
  const star2Ref = useRef(null);
  const star3Ref = useRef(null);
  const star4Ref = useRef(null);

  const ROTATION_DEG_VALUE = 180;
  const BLUR_VALUE = '5px';

  useLayoutEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: `.${styles[section]}`,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    tl.to([star1Ref.current, star3Ref.current], {
      rotation: ROTATION_DEG_VALUE,
    });

    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: `.${styles[section]}`,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    tl2.to([star2Ref.current, star4Ref.current], {
      rotation: -ROTATION_DEG_VALUE,
    });

    const tl3 = gsap.timeline({
      scrollTrigger: {
        trigger: `.${styles[section]}`,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    tl3.to([star1Ref.current, star2Ref.current, star3Ref.current, star4Ref.current], {
      filter: `blur(${BLUR_VALUE})`,
    });

    return () => {
      tl.kill();
      tl2.kill();
      tl3.kill();
    };
  }, [star1Ref, star2Ref, star3Ref, star4Ref]);

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
