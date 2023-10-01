import React, { useEffect } from 'react'
import styles from './Applications.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchToggleStateForButton3Async, updateToggleStateForButton3Async } from '../../store/Slice/toggleSlice';

export default function Applications() {
  const dispatch = useDispatch();
 const isActiveForButton3 = useSelector(
   (state) => state.toggle.isActiveForButton3
 );
  
  useEffect(() => {
    dispatch(fetchToggleStateForButton3Async());
  }, [dispatch]);

  const toggleActive = () => {
    dispatch(updateToggleStateForButton3Async(!isActiveForButton3));
  };
  return (
    <section className={styles.Applications}>
      <div className={styles.Applications__title}>Управление</div>
      <div>
        <div className={styles.Applications__hide_block}>
          <div className={styles.Applications__hide_text}>
            Открыть роут для регистрации
          </div>
          <div
            className={`${styles.toggleButton} ${
              isActiveForButton3 ? styles.active : ""
            }`}
            onClick={toggleActive}
          >
            <div className={styles.circle}></div>
          </div>
        </div>
        <h3 className={styles.Applications__hide_text}>
          Пользователи из базы данных
        </h3>
        <ul>
          <li>влад</li>
          <li>миша</li>
          <li>кто-то</li>
        </ul>
      </div>
    </section>
  );
}
