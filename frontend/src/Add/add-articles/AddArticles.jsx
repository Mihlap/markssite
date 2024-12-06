import React, { useCallback, useState } from 'react';
import styles from '../style/style-card.module.scss';
import AddNews from './AddNews/AddNews';
import AddJournal from './AddJournal/AddJournal';


import news from '../add-navbar/icon/hr.svg';
import journal from '../add-navbar/icon/internships.svg';


const filters = ['Новости', 'Marks Journal'];
const icons = [news, journal]; 

export default function AddArticles({ user }) { 
  const [selectedFilter, setSelectedFilter] = useState('Новости');
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);


   const handleFilterChange = useCallback((filter, index) => {
     setActiveButtonIndex(index);
     setSelectedFilter(filter);
   }, []);
  
   
  return (
    <section className={styles.card_components_admin}>
      <div className={styles.card_components_admin__block}>
        <div className={styles.card_components_admin__block_title_btn}>
          <div className={styles.card_components_admin__title}>Публикации</div>      
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
