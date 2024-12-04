import React, { useCallback, useState } from 'react';
import styles from '../style/style-card.module.scss';
import AddNews from './AddNews/AddNews';
import AddJournal from './AddJournal/AddJournal';
import pencilIcon from '../add-navbar/icon/pencil.svg';

const filters = ['Новости', 'Marks Journal'];

export default function AddArticles({ user }) {
  const [selectedFilter, setSelectedFilter] = useState('Новости');
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);

  const handleFilterChange = useCallback((filter) => {
    setActiveButtonIndex(filter);
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
              onClick={() => handleFilterChange(filter)}>
              <img
                className={`${styles.card_components_admin__buttonFilter__icons} ${
                  activeButtonIndex === index ? styles.activeIcon : ''
                }`}
                src={pencilIcon}
                alt={pencilIcon}
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
