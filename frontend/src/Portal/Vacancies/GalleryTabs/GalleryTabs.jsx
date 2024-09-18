import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './GalleryTabs.module.scss';
import mockImg from '../icons/gallery-tabs.jpg';
import { fetchEvents } from '../../../store/Slice/vacancyEventSlice';

const GalleryTabs = ({ handleMouseEnter, handleMouseLeave }) => {
  const dispatch = useDispatch();
  const [activeIndex, setActiveIndex] = useState(null);
  const { events } = useSelector((state) => state.formAddEvent);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    if (events && events.length > 0 && activeIndex === null) {
      setActiveIndex(0);
    }
  }, [events, activeIndex]);


   return (
    <>
            <section className={styles.GalleryTabs}>
        <h2 className={styles.GalleryTabs__title}>
          Жизнь на&nbsp;<span>MARKS`e</span>
        </h2>

        {events && events?.length > 0 ? (
          <>
            <div className={styles.GalleryTabs__buttons}>
              {events?.map((event, index) => (
                <button
                  key={event.id}
                  className={activeIndex === index ? styles.active : ''}
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {event.title}
                </button>
              ))}
            </div>
            <div className={styles.GalleryTabs__content} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <img src={mockImg} alt=""></img>
            </div>
          </>
        ) : (
           <div className={styles.GalleryTabs__noEvents}>
           Скоро здесь будет что-то увлекательное!
          </div>
        )}
      </section>
    </>
  );
};

export default GalleryTabs;
