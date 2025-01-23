import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FooterInfo from './FooterInfo';
import styles from './FooterCircle.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setCursorVariant } from '../store/Slice/cursorSlice';
import { closeModal } from '../store/Slice/modalSlice';
import ModalVacancyFormSend from '../UI/VacancyFormContact/ModalVacancyFormSend';


const FooterCircle = ({ handleMouseEnterFooterMore, handleMouseLeaveFooter }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isTabletScreen, setIsTabletScreen] = useState(window.innerWidth < 1024);
  const isModalOpen = useSelector((state) => state.modal.isModalOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    if (isModalOpen) {
      window.scrollTo({
        top: document.body.scrollHeight,     
      });
    }
  }, [isModalOpen]);


  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);


useEffect(() => {
    const handleResize = () => setIsTabletScreen(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
}, []);
  

  const initialMask = useMemo(
    () =>
      isTabletScreen
        ? 'radial-gradient(circle at 283px 105px, transparent 0vw, black 0)'
        : 'radial-gradient(circle at 605px 200px, transparent 0vw, black 0)',
    [isTabletScreen]
  );


  const hoverMask = useMemo(
    () =>
      isTabletScreen
        ? 'radial-gradient(circle at 283px 105px, transparent 100vw, black 0)'
        : 'radial-gradient(circle at 605px 200px, transparent 100vw, black 0)',
    [isTabletScreen]
  );


  const handleMouseEnterBlock = useCallback(() => {
    if (!isTabletScreen) {
      dispatch(setCursorVariant('textFooterEnter'));
      dispatch(setCursorVariant('textFooterWhiteEnter'));
    }
  }, [dispatch, isTabletScreen]);
  

  const handleMouseLeaveBlock = useCallback(() => {
    if (!isTabletScreen) {
      dispatch(setCursorVariant('textLeaveFooter'));
      dispatch(setCursorVariant('textLeaveWhiteFooter'));
    }
  }, [dispatch, isTabletScreen]);

  const handleMouseEnterCircle = useCallback(() => {
    if (!isTabletScreen) {
      setIsHovered(true);
    }
  }, [isTabletScreen]);

  const handleMouseLeaveCircle = useCallback(() => {
    if (!isTabletScreen) {
      setIsHovered(false);
    }
  }, [isTabletScreen]);

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
    <>
      <footer className={styles.FooterCircle}>
        <motion.div
          className={styles.FooterCircle__main}
          initial={{ maskImage: initialMask }}
          animate={{
            maskImage: isTabletScreen ? (isClicked ? hoverMask : initialMask) : isHovered ? hoverMask : initialMask,
            transition: { duration: 1 },
            opacity: isClicked && isTabletScreen ? 0 : 1,
          }}>
          <div className={styles.FooterCircle__action}>
            <div className={styles.FooterCircle__open}>
              <div>Обсудим ваш</div>
              <div
                className={styles.FooterCircle__active}
                onClick={isTabletScreen ? handleClick : null}
                onMouseEnter={handleMouseEnterCircle}
                onMouseLeave={handleMouseLeaveCircle}
              >
                <div
                  className={styles.FooterCircle__circle}
                  onClick={handleClick}
                  // onMouseEnter={handleMouseEnterBlock}
                  onMouseLeave={handleMouseLeaveBlock}
                >
                  проект
                </div>
                <div
                  onClick={handleClick}
                  // onMouseEnter={handleMouseEnterBlock}
                  onMouseLeave={handleMouseLeaveBlock}
                  className={styles.FooterCircle__arrow}></div>
              </div>
            </div>
          </div>
          <FooterInfo
            handleMouseEnterFooterMore={handleMouseEnterFooterMore}
            handleMouseLeaveFooter={handleMouseLeaveFooter}
          />
        </motion.div>
        <div className={styles.FooterCircle__layer}>
          <div className={styles.FooterCircle__action} onClick={handleClick}>
            <span className={`${styles.FooterCircle__link} ${isHovered ? styles.animate : ''}`}>
              Осталось только нажать
            </span>
          </div>
          <FooterInfo />
        </div>
      </footer>
      <ModalVacancyFormSend
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        title="Спасибо!"
        message="Мы изучим ваш запрос и свяжемся с вами"      
        variant="autoCloseWithHeart"
        customModalWrapperFormSend={styles.specialModal}
      />
    </>
  );
};

export default FooterCircle;
