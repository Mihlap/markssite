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
  autoClose = false,  
}) => {
  const [isMorphing, setIsMorphing] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
 
  useEffect(() => {
    if (isOpen && autoClose) {
      const morphTimer = setTimeout(() => {
        setIsMorphing(true);
      }, 1000);

      const explodeTimer = setTimeout(() => {
        setIsMorphing(false);
        setIsExploding(true);
      }, 1000);

      const closeTimer = setTimeout(() => {
        setIsExploding(false);
        onRequestClose();
      }, 1300);

      return () => {
        clearTimeout(morphTimer);
        clearTimeout(explodeTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [isOpen, autoClose, onRequestClose]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        className={`${styles.modalContentFormSend} ${isMorphing ? styles.modalMorphing : ''} ${
          isExploding ? styles.modalExploding : ''
        }`}
        style={{
          overlay: {
            zIndex: 9999,
            backgroundColor: '#2C3B447A',
          },
          content: {
            zIndex: 9999,
          },
        }}>
        <div className={`${styles.modalWrapperFormSend} ${isExploding ? styles.exploding : ''}`}>
          {!isMorphing && !isExploding && (
            <>
              <h2 className={styles.modalTitleFormSend}>{title}</h2>
              <p className={styles.modalMessageFormSend}>{message}</p>
              {!autoClose && buttonText && (
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
