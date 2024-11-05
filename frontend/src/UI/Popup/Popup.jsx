import styles from './Popup.module.scss';

const contentText = {
  title: {
    init: 'Ваш запрос принят',
    afterSent: 'Спасибо! ',
  },

  desc: {
    init: 'Здесь будет какой-то текст и хотя бы 2 строки и хотя бы 2 строки',
    afterSent: 'Мы изучим Ваш запрос и свяжемся с Вами',
  },
};

const Popup = ({ isSent }) => {
  return (
    // <section className={`${styles.Popup} ${isSent ? styles.active : ''}`}>
    <section className={`${styles.Popup} ${styles.active}`}>
      <div className={styles.Popup__overlay}>
        <div className={styles.Popup__container}>
          <div className={styles.Popup__content}>
            <div className={styles.Popup__header}>
              <button className={styles.Popup__close}></button>
            </div>
            <div className={styles.Popup__body}>
              <div className={styles.Popup__title}>{contentText.title.init}</div>
              <div className={styles.Popup__desc}>{contentText.desc.init}</div>
              <button className={styles.Popup__button}>Спасибо, жду!</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Popup;
