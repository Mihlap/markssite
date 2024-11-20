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
}) => {
  const [isMorphing, setIsMorphing] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
 
  useEffect(() => {
    if (isOpen && autoClose) {
      const morphTimer = setTimeout(() => {
        setIsMorphing(true);
      }, 2000);

      const explodeTimer = setTimeout(() => {
        setIsExploding(true);
      }, 3000);

      const closeTimer = setTimeout(() => {
        onRequestClose();
      }, 3500);

      return () => {
        clearTimeout(morphTimer);
        clearTimeout(explodeTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [isOpen, autoClose, onRequestClose]);

  return (
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
      {!isMorphing && !isExploding && (
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
    </Modal>
  );
};

export default ModalVacancyFormSend;
