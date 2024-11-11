import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FooterInfo from './FooterInfo';
import styles from './FooterCircle.module.scss';
import { useDispatch } from 'react-redux';
import { setCursorVariant } from '../store/Slice/cursorSlice';

const FooterCircle = ({ handleMouseEnterFooterMore, handleMouseLeaveFooter }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTabletScreen, setIsTabletScreen] = useState(window.innerWidth < 1024);
  const dispatch = useDispatch();
  const navigate = useNavigate();

useEffect(() => {
    const handleResize = () => setIsTabletScreen(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

const initialMask = useMemo(
    () =>
      isTabletScreen
        ? 'radial-gradient(circle at 283px 105px, transparent 0px, black 0)'
        : 'radial-gradient(circle at 605px 200px, transparent 0px, black 0)',
    [isTabletScreen]
  );

  const hoverMask = useMemo(
    () =>
      isTabletScreen
        ? 'radial-gradient(circle at 283px 105px, transparent 275px, black 0)'
        : 'radial-gradient(circle at 605px 200px, transparent 570px, black 0)',
    [isTabletScreen]
  );

 const handleMouseEnterBlock = useCallback(() => {
    setIsHovered(true);
    dispatch(setCursorVariant('textFooterEnter'));
    dispatch(setCursorVariant('textFooterWhiteEnter'));
  }, [dispatch]);

  const handleMouseLeaveBlock = useCallback(() => {
    setIsHovered(false);
    dispatch(setCursorVariant('textLeaveFooter'));
    dispatch(setCursorVariant('textLeaveWhiteFooter'));
  }, [dispatch]);

  const handleClick = useCallback(() => {
    navigate('/footerForm');
  }, [navigate]);

  return (
    <footer className={styles.FooterCircle}>
      <motion.div
        className={styles.FooterCircle__main}
        initial={{ maskImage: initialMask }}
        animate={{
          maskImage: isHovered ? hoverMask : initialMask,
          transition: { duration: 0.5 },
        }}>
        <div
          className={styles.FooterCircle__action}
          onMouseEnter={handleMouseEnterBlock}
          onMouseLeave={handleMouseLeaveBlock}
          onClick={handleClick}>
          <div className={styles.FooterCircle__open}>
            <div>Обсудим ваш</div>
            <div>проект</div>
          </div>
        </div>
        <FooterInfo
          handleMouseEnterFooterMore={handleMouseEnterFooterMore}
          handleMouseLeaveFooter={handleMouseLeaveFooter}
        />
      </motion.div>

      <div className={styles.FooterCircle__layer}>
        <div
          className={styles.FooterCircle__action}
          onMouseEnter={handleMouseEnterBlock}
          onMouseLeave={handleMouseLeaveBlock}
          onClick={handleClick}>
          <span className={`${styles.FooterCircle__link} ${isHovered ? styles.animate : ''}`}>
            Осталось только нажать
          </span>
        </div>
        <FooterInfo />
      </div>
    </footer>
  );
};

export default FooterCircle;
