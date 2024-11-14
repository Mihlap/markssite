import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FooterInfo from './FooterInfo';
import styles from './FooterCircle.module.scss';
import { useDispatch } from 'react-redux';
import { setCursorVariant } from '../store/Slice/cursorSlice';


const FooterCircle = ({ handleMouseEnterFooterMore, handleMouseLeaveFooter }) => {
  const [isHovered, setIsHovered] = useState(false);
   const [isClicked, setIsClicked] = useState(false);
  const [isTabletScreen, setIsTabletScreen] = useState(window.innerWidth < 1024);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();


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


 const hoverMask = useMemo(() => {
    if (isTabletScreen && window.innerWidth < 400) {    
      return 'radial-gradient(circle at 283px 105px, transparent 375px, black 0)';
    } else if (isTabletScreen && window.innerWidth < 768) {    
      return 'radial-gradient(circle at 283px 105px, transparent 575px, black 0)';
    } else if (isTabletScreen && window.innerWidth < 1024) {     
      return 'radial-gradient(circle at 283px 105px, transparent 875px, black 0)';
    } else {     
      return 'radial-gradient(circle at 605px 200px, transparent 570px, black 0)';
    }
  }, [isTabletScreen]);


  const handleMouseEnterBlock = useCallback(() => {
    if (!isTabletScreen) {
      setIsHovered(true);
      dispatch(setCursorVariant('textFooterEnter'));
      dispatch(setCursorVariant('textFooterWhiteEnter'));
    }
  }, [dispatch, isTabletScreen]);

  const handleMouseLeaveBlock = useCallback(() => {
    if (!isTabletScreen) {
      setIsHovered(false);
      dispatch(setCursorVariant('textLeaveFooter'));
      dispatch(setCursorVariant('textLeaveWhiteFooter'));
    }
  }, [dispatch, isTabletScreen]);
  

  const handleClick = useCallback(() => {
     if (isTabletScreen) {
       setIsClicked(true);
       setTimeout(() => {
         navigate('/footerForm', { state: { from: location.pathname } });
       }, 300);
     } else {
       navigate('/footerForm', { state: { from: location.pathname } });
     }
   }, [navigate, location.pathname, isTabletScreen]);


  return (
    <footer className={styles.FooterCircle}>
      <motion.div
        className={styles.FooterCircle__main}
        initial={{ maskImage: initialMask }}
        animate={{
          maskImage: isTabletScreen ? (isClicked ? hoverMask : initialMask) : isHovered ? hoverMask : initialMask,
          transition: { duration: 0.5 },
          opacity: isClicked && isTabletScreen ? 0 : 1,
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
