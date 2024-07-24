import React from 'react';
import styles from './GalleryTabs.module.scss';
import mockImg from '../icons/gallery-tabs.jpg';

const GalleryTabs = ({ handleMouseEnter, handleMouseLeave, handleMouseHover }) => {
  return (
    <>
      <section className={styles.GalleryTabs}>
        <h2 className={styles.GalleryTabs__title}>
          Жизнь на&nbsp;<span>MARKS`e</span>
        </h2>
        <div className={styles.GalleryTabs__buttons}>
          <button className={styles.active} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseHover={handleMouseHover}>
            Вечеринка '24
          </button>
          <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseHover={handleMouseHover}>
            Вечеринка '24
          </button>
          <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseHover={handleMouseHover}>
            День строителя '24
          </button>
          <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseHover={handleMouseHover}>
            Новогодний event '23
          </button>
          <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseHover={handleMouseHover}>
            Тропическая вечеринка '23
          </button>
          <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseHover={handleMouseHover}>
            Тропическая вечеринка '23
          </button>
          <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseHover={handleMouseHover}>
            День строителя '23
          </button>
          <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseHover={handleMouseHover}>
            Вечеринка '22
          </button>
          <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseHover={handleMouseHover}>
            Вечеринка супер кул '22
          </button>
          <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseHover={handleMouseHover}>
            Вечеринка '22
          </button>
        </div>
        <div
          className={styles.GalleryTabs__content}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseHover={handleMouseHover}>
          <img src={mockImg} alt=""></img>
        </div>
      </section>
    </>
  );
};

export default GalleryTabs;
