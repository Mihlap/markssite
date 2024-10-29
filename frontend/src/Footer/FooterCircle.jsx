import { useState, useEffect } from 'react';
import styles from './FooterCircle.module.scss';

import FooterInfo from './FooterInfo';

const FooterCircle = ({
  handleMouseEnterFooter,
  handleMouseEnterFooterMore,
  handleMouseLeaveFooter,
  handleMouseLeave,
}) => {
  const [isHover, setIsHover] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');

    const handleScreenResize = () => {
      setIsLargeScreen(mediaQuery.matches);
    };

    handleScreenResize();
    mediaQuery.addEventListener('change', handleScreenResize);

    return () => {
      mediaQuery.removeEventListener('change', handleScreenResize);
    };
  }, []);

  const handleCursorEnter = () => {
    setIsHover(true);
  };

  const handleCursorLeave = () => {
    setIsHover(false);
  };

  return (
    <footer className={styles.FooterCircle} onMouseEnter={handleMouseEnterFooter} onMouseLeave={handleMouseLeave}>
      <div
        className={`${styles.FooterCircle__main} ${isLargeScreen && isHover ? styles.animate : styles.resetAnimate}`}>
        <div className={styles.FooterCircle__action}>
          <div className={styles.FooterCircle__open} onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>
            <div>Обсудим ваш</div>
            <div>проект</div>
          </div>
        </div>
        <FooterInfo
          handleMouseEnterFooter={handleMouseEnterFooter}
          handleMouseEnterFooterMore={handleMouseEnterFooterMore}
          handleMouseLeaveFooter={handleMouseLeaveFooter}
          handleMouseLeave={handleMouseLeave}
        />
      </div>

      <div className={styles.FooterCircle__layer}>
        <div className={styles.FooterCircle__action}>
          <a href="#" className={`${styles.FooterCircle__link} ${isLargeScreen && isHover ? styles.animate : ''}`}>
            Осталось только нажать
          </a>
        </div>
        <FooterInfo
          handleMouseEnterFooter={handleMouseEnterFooter}
          handleMouseEnterFooterMore={handleMouseEnterFooterMore}
          handleMouseLeaveFooter={handleMouseLeaveFooter}
          handleMouseLeave={handleMouseLeave}
        />
      </div>
    </footer>
  );
};

export default FooterCircle;
