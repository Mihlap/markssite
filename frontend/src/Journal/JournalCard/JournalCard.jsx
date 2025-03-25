import React, { useState } from 'react';
// import catPlaceholder from './catPlaceholder.png';
import styles from './JournalCard.module.scss';


const TABS = {
  ARTICLE: 'Статья',
  ANNOTATION: 'Аннотация',
  CONTENT: 'Содержание',
};

function JournalCard({ journal }) {
  const [activeTab, setActiveTab] = useState(TABS.ARTICLE);
 const authors = journal?.authors || [];
  const authorsToDisplay = authors.slice(0, 6);

   const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.journal_card}>    
      <div className="journal-card__left">
        <div className="journal-card__authors-grid">
          {authorsToDisplay.map((author, index) => {
            const imageUrl = author.image; // Если у автора нет фото, показываем котика
            return (
              <img key={index} src={imageUrl} alt={`Автор ${author.name || ''}`} className="journal-card__author-img" />
            );
          })}
        </div>
      </div>

      {/* Правая часть: видна всегда, независимо от ширины экрана */}
      <div className="journal-card__right">
        <div className="journal-card__tabs">
          <button
            className={`journal-card__tab-btn ${activeTab === TABS.ARTICLE ? 'active' : ''}`}
            onClick={() => handleTabClick(TABS.ARTICLE)}>
            Статья
          </button>
          <button
            className={`journal-card__tab-btn ${activeTab === TABS.ANNOTATION ? 'active' : ''}`}
            onClick={() => handleTabClick(TABS.ANNOTATION)}>
            Аннотация
          </button>
          <button
            className={`journal-card__tab-btn ${activeTab === TABS.CONTENT ? 'active' : ''}`}
            onClick={() => handleTabClick(TABS.CONTENT)}>
            Содержание
          </button>
        </div>

        <div className="journal-card__content">
          {/* Вкладка «Статья» */}
          {activeTab === TABS.ARTICLE && (
            <>
              <h3 className="journal-card__title">{journal.title}</h3>
              <div className="journal-card__info">
                {/* 
                  Пример вывода организаций, локаций и даты (адаптируйте под свою структуру).
                  Допустим, journal.organizations — это массив объектов { name: '...' } или { value: '...' },
                  а journal.locations — массив { name: '...' } или { value: '...' }.
                */}
                <p>
                  {journal.organizations?.map((org) => org.value || org.name).join(', ')};{' '}
                  {journal.locations?.map((loc) => loc.value || loc.name).join(', ')}
                </p>
                <p>{journal.publication_date}</p>
              </div>
            </>
          )}

          {/* Вкладка «Аннотация» */}
          {activeTab === TABS.ANNOTATION && (
            <div className="journal-card__annotation">
              {/* Предположим, аннотация приходит в journal.annotation */}
              {journal.annotation ? journal.annotation : 'Текст аннотации...'}
            </div>
          )}

          {/* Вкладка «Содержание» */}
          {activeTab === TABS.CONTENT && (
            <div className="journal-card__content-section">
              {/* Предположим, содержание приходит в journal.content */}
              {journal.content ? journal.content : 'Текст содержания...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JournalCard;
