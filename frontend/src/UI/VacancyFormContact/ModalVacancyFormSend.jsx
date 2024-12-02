import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import styles from './ModalVacancyFormSend.module.scss';
import ExplosionAnimation from './ExplosionAnimation';

const ModalVacancyFormSend = ({
  isOpen,
  onRequestClose,
  title,
  message,
  buttonText,
  variant = 'manualClose',
  customModalWrapperFormSend = '',
}) => {
  const [isInitial, setIsInitial] = useState(true);
  const [isMorphing, setIsMorphing] = useState(false);
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    if (isOpen && variant === 'autoCloseWithHeart') {
      const transitionTimer = setTimeout(() => {
        setIsInitial(false);
        setIsMorphing(true);
      }, 1000);

      return () => clearTimeout(transitionTimer);
    }
  }, [isOpen, variant]);

  useEffect(() => {
    if (isOpen && variant === 'autoCloseWithHeart') {
      const explodeTimer = setTimeout(() => {
        setIsMorphing(false);
        setIsExploding(true);
      }, 2000);

      const closeTimer = setTimeout(() => {
        setIsExploding(false);
        onRequestClose();
      }, 2500);

      return () => {
        clearTimeout(explodeTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [isOpen, onRequestClose, variant]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        className={`${styles.modalContentFormSend} ${isInitial ? styles.initial : ''} ${
          isMorphing ? styles.morphing : ''
        } ${isExploding ? styles.exploding : ''}`}
        style={{
          overlay: {
            zIndex: 9999,
            backgroundColor: '#2C3B447A',
          },
          content: {
            zIndex: 9999,
          },
        }}>
        <div className={`${styles.modalWrapperFormSend} ${customModalWrapperFormSend}`}>
          {!isExploding && (
            <>
              <h2 className={styles.modalTitleFormSend}>{title}</h2>
              <p className={styles.modalMessageFormSend}>{message}</p>
              {variant === 'manualClose' && buttonText && (
                <button className={styles.closeButtonFormSend} onClick={onRequestClose}>
                  <p className={styles.closeButtonFormSendTitle}>{buttonText}</p>
                </button>
              )}
            </>
          )}
        </div>
      </Modal>
      {isExploding && <ExplosionAnimation />}
    </>
  );
};

export default ModalVacancyFormSend;
