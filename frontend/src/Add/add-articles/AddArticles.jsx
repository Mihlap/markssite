import React, { useCallback, useEffect, useState } from 'react';
import styles from '../style/style-card.module.scss';
import AddNews from './AddNews/AddNews';
import AddJournal from './AddJournal/AddJournal';
import { fetchToggleStateForButton2Async, updateToggleStateForButton2Async } from '../../store/Slice/toggleSlice';

import news from '../add-navbar/icon/hr.svg';
import journal from '../add-navbar/icon/internships.svg';
import { useDispatch, useSelector } from 'react-redux';

const filters = ['Новости', 'Marks Journal'];
const icons = [news, journal]; 

export default function AddArticles({ user }) {
  const dispatch = useDispatch();
  const [selectedFilter, setSelectedFilter] = useState('Новости');
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);
  const isActiveForButton2 = useSelector((state) => state.toggle.isActiveForButton2);

    useEffect(() => {   
      dispatch(fetchToggleStateForButton2Async());
    }, [dispatch]);

   const handleFilterChange = useCallback((filter, index) => {
     setActiveButtonIndex(index);
     setSelectedFilter(filter);
   }, []);
  
    const toggleActive = useCallback(() => {
      dispatch(updateToggleStateForButton2Async(!isActiveForButton2));
    }, [dispatch, isActiveForButton2]);

  return (
    <section className={styles.card_components_admin}>
      <div className={styles.card_components_admin__block}>
        <div className={styles.card_components_admin__block_title_btn}>
          <div className={styles.card_components_admin__title}>Публикации</div>
        <div className={styles.card_components_admin__hide_block} style={{ marginTop: 20}}>
          <div className={styles.card_components_admin__hide_text}>Скрыть фильтрацию</div>
          <div className={`${styles.toggleButton} ${isActiveForButton2 ? styles.active : ''}`} onClick={toggleActive}>
            <div className={styles.circle}></div>
          </div>
        </div>
        </div>
        <div className={styles.card_components_admin__buttonFilter}>
          {filters.map((filter, index) => (
            <button
              key={index}
              className={`${styles.card_components_admin__buttonFilter__group} ${
                activeButtonIndex === index ? styles.activeButtonVacancy : ''
              } ${index === 0 ? styles.noAnimation : ''}`}
              onClick={() => handleFilterChange(filter, index)}>
              <img
                className={`${styles.card_components_admin__buttonFilter__icons} ${
                  activeButtonIndex === index ? styles.activeIcon : ''
                }`}
                src={icons[index]}
                alt={filter}
              />
              {filter}
            </button>
          ))}
        </div>
        <div>{selectedFilter === 'Новости' ? <AddNews user={user} /> : <AddJournal />}</div>
      </div>
    </section>
  );
}
