import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import styles from './ModalVacancyFormSend.module.scss';

const ModalVacancyFormSend = ({
  isOpen,
  onRequestClose,
  title,
  message,
  buttonText,
  autoClose = false,
  customCloseAnimation = false,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const particles = Array.from({ length: 20 });


    useEffect(() => {
      if (isOpen && autoClose) {
        //     if (window.ym) {
              // window.ym(YOUR_METRIKA_ID, 'reachGoal', 'modalOpened');
        //     }
        const timer = setTimeout(() => {
          setIsClosing(true);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }, [isOpen, autoClose]);

   

    useEffect(() => {
      if (isClosing) {
        const closeTimer = setTimeout(() => {
          onRequestClose();
        }, 1000); 

        return () => clearTimeout(closeTimer);
      }
    }, [isClosing, onRequestClose]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={`${styles.modalContentFormSend} ${isClosing && customCloseAnimation ? styles.modalClosing : ''}`}
      style={{
        overlay: {
          zIndex: 9999,
          backgroundColor: '#2C3B447A',
        },
        content: {
          zIndex: 9999,
        },
      }}>
      <div
        className={`${styles.modal_vacancy_close} ${autoClose ? styles.noCloseButton : ''}`}
        onClick={!autoClose ? onRequestClose : undefined}>
        {!autoClose && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.00025 8.70733L0.707107 16.0005L0 15.2934L7.29314 8.00023L2.41697e-05 0.707107L0.707131 0L8.00025 7.29312L15.2934 0L16.0005 0.707107L8.70736 8.00023L16.0005 15.2934L15.2934 16.0005L8.00025 8.70733Z"
              fill="black"
            />
          </svg>
        )}
      </div>
      {!isClosing && (
        <div className={styles.modalWrapperFormSend}>
          <h2 className={styles.modalTitleFormSend}>{title}</h2>
          <p className={styles.modalMessageFormSend}>{message}</p>
          {!autoClose && buttonText && (
            <button className={styles.closeButtonFormSend} onClick={onRequestClose}>
              <p className={styles.closeButtonFormSendTitle}>{buttonText}</p>
            </button>
          )}
        </div>
      )}
      {isClosing && customCloseAnimation && (
        <>
          <div className={styles.heartIcon}></div>
          {particles.map((_, index) => (
            <div
              key={index}
              className={styles.explodingParticles}
              style={{
                '--x': Math.cos((index / particles.length) * 2 * Math.PI),
                '--y': Math.sin((index / particles.length) * 2 * Math.PI),
              }}></div>
          ))}
        </>
      )}
    </Modal>
  );
};

export default ModalVacancyFormSend;