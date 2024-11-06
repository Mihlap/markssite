import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FooterInfo from './FooterInfo';
import styles from './FooterCircle.module.scss';

const FooterCircle = ({
  handleMouseEnterFooter,
  handleMouseEnterFooterMore,
  handleMouseLeaveFooter,
  handleMouseLeave,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTabletScreen, setIsTabletScreen] = useState(false);

  // Обновляем состояние экрана при изменении его ширины
  useEffect(() => {
    const handleResize = () => {
      setIsTabletScreen(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Определяем начальный стиль `maskImage` в зависимости от ширины экрана
  const initialMask = isTabletScreen
    ? 'radial-gradient(circle at 283px 105px, transparent 0px, black 0)'
    : 'radial-gradient(circle at 605px 200px, transparent 0px, black 0)';

  // Определяем стиль `maskImage` при ховере в зависимости от ширины экрана
  const hoverMask = isTabletScreen
    ? 'radial-gradient(circle at 283px 105px, transparent 275px, black 0)'
    : 'radial-gradient(circle at 605px 200px, transparent 570px, black 0)';

  return (
    <footer className={styles.FooterCircle}>
      <motion.div
        className={styles.FooterCircle__main}
        initial={{ maskImage: initialMask }}
        animate={{
          maskImage: isHovered ? hoverMask : initialMask,
          transition: { duration: 0.5 },
        }}>
        <div className={styles.FooterCircle__action}>
          <div
            className={styles.FooterCircle__open}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <div>Обсудим ваш</div>
            <div>проект</div>
          </div>
        </div>
        <FooterInfo />
      </motion.div>
      <div className={styles.FooterCircle__layer}>
        <div className={styles.FooterCircle__action}>
          <a href="" className={`${styles.FooterCircle__link} ${isHovered ? styles.animate : ''}`}>
            Осталось только нажать
          </a>
        </div>
        <FooterInfo />
      </div>
    </footer>
  );
};

export default FooterCircle;
