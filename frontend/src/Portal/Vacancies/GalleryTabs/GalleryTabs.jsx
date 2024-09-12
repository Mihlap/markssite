import React from 'react';
import styles from './GalleryTabs.module.scss';
import mockImg from '../icons/gallery-tabs.jpg';

const GalleryTabs = ({ handleMouseEnter, handleMouseLeave }) => {
  return (
    <>
      <section className={styles.GalleryTabs}>
        <h2 className={styles.GalleryTabs__title}>
          Жизнь на&nbsp;<span>MARKS`e</span>
        </h2>
        <div className={styles.GalleryTabs__buttons}>
          <button className={styles.active} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            Вечеринка '24
          </button>
          <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            Вечеринка '24
          </button>
          <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            День строителя '24
          </button>
          <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            Новогодний event '23
          </button>
          <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            Тропическая вечеринка '23
          </button>
          <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            Тропическая вечеринка '23
          </button>
          <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            День строителя '23
          </button>
          <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            Вечеринка '22
          </button>
          <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            Вечеринка супер кул '22
          </button>
          <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            Вечеринка '22
          </button>
        </div>
        <div className={styles.GalleryTabs__content} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <img src={mockImg} alt=""></img>
        </div>
      </section>
    </>
  );
};

export default GalleryTabs;
