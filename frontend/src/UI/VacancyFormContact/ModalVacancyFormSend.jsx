import React from 'react';
import Modal from 'react-modal';
import styles from './ModalVacancyFormSend.module.scss'

const ModalVacancyFormSend  = ({ isOpen, onRequestClose, title, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={styles.modalContentFormSend}
      overlayClassName={styles.modalOverlayFormSend}
    >
      <div className={styles.modalWrapperFormSend}>
        <h2 className={styles.modalTitleFormSend}>{title}</h2>
        <p className={styles.modalMessageFormSend}>{message}</p>
        <button className={styles.closeButtonFormSend} onClick={onRequestClose}>
          <p className={styles.closeButtonFormSendTitle}>Закрыть</p>
          </button>
      </div>
    </Modal>
  );
};

export default ModalVacancyFormSend;
