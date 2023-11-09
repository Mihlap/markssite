import React from 'react';
import styles from './LoadingModal.module.scss';
import MiniLoading from '../loading/MiniLoading';


export default function LoadingModal() {
  return (
    <div className={styles.modal_section}>
      <div className={styles.modal_section__container}>
        <div className={styles.modal_section__text}>
          Проект загружается, не обновляйте страницу
        </div>
        <div>
          <MiniLoading />
        </div>
      </div>
    </div>
  );
}
