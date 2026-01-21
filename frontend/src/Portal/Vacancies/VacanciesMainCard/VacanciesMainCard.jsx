import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { debounce } from 'lodash';
import styles from './VacanciesMainCard.module.scss';
import VacancySlider from '../VacancySlider/VacancySlider';
import RenderVacancySections from '../RenderVacancySections/RenderVacancySections';
import { fetchEmployees } from '../../../store/Slice/vacanciesSlice';
import VacancyFormContactUniversal from '../../../UI/VacancyFormContact/VacancyFormContactUniversal';

import star1 from '../icons/star-header-1.png';
import star2 from '../icons/star-header-2.png';
import star3 from '../icons/star-header-3.png';

import star3d_1 from '../icons/star3d_1.png';
import star3d_2 from '../icons/star3d_2.png';
import star3d_3 from '../icons/star3d_3.png';
import star3d_4 from '../icons/star3d_4.png';
import star3d_5 from '../icons/star3d_5.png';
import star3d_6 from '../icons/star3d_6.png';
import star3d_7 from '../icons/star3d_7.png';
import star3d_8 from '../icons/star3d_8.png';
import star3d_9 from '../icons/star3d_9.png';
import star3d_10 from '../icons/star3d_10.png';
import star3d_11 from '../icons/star3d_11.png';
import heart from '../icons/heart.svg';
import heart2 from '../icons/heart2.svg';
import rocket1 from '../icons/rocket1.svg';
import rocketBig from '../icons/rocketBig.png';
import sputnik from '../icons/sputnik.png';
import vectorAround from '../icons/VectorAround.svg';
import vectorAround1 from '../icons/VectorAround1.png';
import vectorAround2 from '../icons/vectorAround2.svg';

import BenefitsVacancy from '../BenefitsVacancy/BenefitsVacancy';

// hooks
import { useWindowWidth } from '../../hooks/useWindowWidth';

// const
import { advantages } from './const/advantages';
import VacancyRequirements from '../../ui/mesh/VacancyRequirements';

gsap.registerPlugin(useGSAP, ScrollTrigger);

function setViewportUnits() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight / 100}px`);
  document.documentElement.style.setProperty('--vw', `${window.innerWidth / 100}px`);
}

const VacanciesMainCard = ({ handleMouseEnter, handleMouseLeave }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { width } = useWindowWidth();
  const activePage = useSelector((state) => state.activePage.page);
  const vacancies = useSelector((state) => state.vacancies.vacancies);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [isVisible, setIsVisible] = useState(window.innerWidth > 1024);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const pageRef = useRef(null);
  const formRef = useRef(null);
  const formButtonRef = useRef(null);
  const rocketRef = useRef(null);
  const sputnikRef = useRef(null);
  const rocketSceneRef = useRef(null);
  const topContainerRef = useRef(null);
  const firstStarRef = useRef(null);
  const secondStarRef = useRef(null);
  const thirdStarRef = useRef(null);
  const star3d4Ref = useRef(null);
  const star3d5Ref = useRef(null);
  const star3d6Ref = useRef(null);
  const star3d7Ref = useRef(null);
  const star3d8Ref = useRef(null);
  const star3d9Ref = useRef(null);
  const star3d10Ref = useRef(null);
  const star3d11Ref = useRef(null);
  const nextStarsRef = useRef(null);

  useEffect(() => {
    setViewportUnits();
    window.addEventListener('resize', setViewportUnits);
    return () => {
      window.removeEventListener('resize', setViewportUnits);
    };
  }, []);

  useEffect(() => {
    const handleResizeDebounced = debounce(() => {
      setIsVisible(window.innerWidth > 1024);
      setWindowWidth(window.innerWidth);
    }, 300);

    window.addEventListener('resize', handleResizeDebounced);

    return () => {
      window.removeEventListener('resize', handleResizeDebounced);
      handleResizeDebounced.cancel();
    };
  }, []);

  useEffect(() => {
    dispatch(fetchEmployees(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (vacancies && vacancies.length > 0) {
      const selectedVac = vacancies.find((vacancy) => vacancy.id === parseInt(id));
      setSelectedVacancy(selectedVac);
    }
  }, [vacancies, id]);

  useGSAP(
    () => {
      const rocketEl = rocketRef.current;
      const sputnikEl = sputnikRef.current;

      const stars = [
        { ref: firstStarRef, rotate: 100, initialPosition: -50 },
        { ref: secondStarRef, rotate: -100, initialPosition: 50 },
        { ref: thirdStarRef, rotate: 100, initialPosition: -50 },
      ];

      const rotatingStars = [
        { ref: star3d4Ref, from: -100, to: 50 },
        { ref: star3d5Ref, from: 100, to: -50 },
        { ref: star3d6Ref, from: -50, to: 0 },
        { ref: star3d7Ref, from: -100, to: 50 },
        { ref: star3d8Ref, from: 100, to: 0 },
      ];

      const nextStars = [
        { ref: star3d9Ref, from: -80, to: 80 },
        { ref: star3d10Ref, from: 120, to: -40 },
        { ref: star3d11Ref, from: -40, to: 60 },
      ];

      if (topContainerRef.current) {
        stars.forEach(({ ref, rotate, initialPosition }) => {
          if (!ref?.current) return;

          gsap.fromTo(
            ref.current,
            { rotateZ: initialPosition },
            {
              rotateZ: rotate,
              ease: 'none',
              scrollTrigger: {
                trigger: topContainerRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        });
      }

      if (rocketSceneRef.current) {
        rotatingStars.forEach(({ ref, from, to }) => {
          if (!ref?.current) return;

          gsap.fromTo(
            ref.current,
            { rotateZ: from },
            {
              rotateZ: to,
              ease: 'none',
              scrollTrigger: {
                trigger: rocketSceneRef.current,
                start: 'top bottom',
                end: '+=2000',
                scrub: true,
              },
            }
          );
        });
      }

      if (nextStarsRef.current) {
        nextStars.forEach(({ ref, from, to }) => {
          if (!ref?.current) return;

          gsap.fromTo(
            ref.current,
            { rotateZ: from },
            {
              rotateZ: to,
              ease: 'none',
              scrollTrigger: {
                trigger: nextStarsRef.current,
                start: 'top bottom',
                end: '+=1500',
                scrub: true,
              },
            }
          );
        });
      }

      const getMotionConfig = () => {
        if (windowWidth > 1024) {
          return { rocketDelta: 80, sputnikDelta: -80, rocketStart: -150, sputnikStart: 0 };
        }
        if (windowWidth > 767) {
          return { rocketDelta: 50, sputnikDelta: -50, rocketStart: -80, sputnikStart: 20 };
        }
        return { rocketDelta: 40, sputnikDelta: -40, rocketStart: -200, sputnikStart: -40 };
      };

      const updatePositions = (scrollPosition) => {
        const { rocketDelta, sputnikDelta, rocketStart, sputnikStart } = getMotionConfig();
        const height = window.innerHeight || 1;

        gsap.set(rocketEl, { x: rocketStart + scrollPosition * (rocketDelta / height) });
        gsap.set(sputnikEl, { x: sputnikStart + scrollPosition * (sputnikDelta / height) });
      };

      if (rocketEl && sputnikEl) {
        updatePositions(window.scrollY);

        const trigger = ScrollTrigger.create({
          trigger: rocketSceneRef.current || rocketEl,
          start: 0,
          end: () => ScrollTrigger.maxScroll(window),
          onUpdate: (self) => updatePositions(self.scroll()),
          onRefresh: (self) => updatePositions(self.scroll()),
        });

        return () => trigger.kill();
      }
    },
    { scope: pageRef, dependencies: [windowWidth] }
  );

  useLayoutEffect(() => {
    const button = formButtonRef.current;
    const form = formRef.current;
    if (!button || !form) return;

    setTimeout(() => {
      const initialButtonBottom = button.getBoundingClientRect().bottom + window.scrollY + 10;

      const updateButtonPosition = () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const formRect = form.getBoundingClientRect();

        const shouldFixButton = scrollY + windowHeight >= initialButtonBottom;
        const shouldHideButton = formRect.top <= windowHeight;

        button.classList.toggle(styles.fixed, shouldFixButton);
        button.classList.toggle(styles.hidden, shouldHideButton);
      };

      updateButtonPosition();
      window.addEventListener('scroll', updateButtonPosition);

      return () => {
        window.removeEventListener('scroll', updateButtonPosition);
      };
    }, 300);
  }, []);

  const handleScrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    return () => clearTimeout(timer);
  }, [id]);

  return (
    <>
      <Helmet>
        <title>Marks Group</title>
      </Helmet>
      <div className={styles.main_vacancyWrapper} ref={pageRef}>
        <section className={styles['section-top']}>
          <div className={styles['section-top__title']} ref={topContainerRef}>
            <img ref={firstStarRef} className={styles['section-top__star']} src={star1} alt="иконка звезды" />
            <img ref={secondStarRef} className={styles['section-top__star']} src={star2} alt="иконка звезды" />
            <img ref={thirdStarRef} className={styles['section-top__star']} src={star3} alt="иконка звезды" />
            <div className={styles['section-top__wrap']}>
              <h1 className={styles['section-top__heading']}>{vacancies[0]?.title || null}</h1>
              <div className={styles['section-top__description']}>
                <span className={styles['section-top__label']}>Мы ищем</span>
                <div
                  className={styles['section-top__html']}
                  dangerouslySetInnerHTML={{ __html: vacancies[0]?.searchStaff }}
                />
              </div>
              <div className={styles['section-top__offers-title']}>
                <span>Marks Group предлагает тебе</span>
                <img src={heart} alt="heart" />
              </div>
            </div>
            <VacancyRequirements vacancy={vacancies[0]} variant="compact" />
            <div className={styles['section-top__advantages']}>
              <div className={styles['section-top__advantages-title']}>
                <span>Marks Group предлагает тебе</span>
                <img src={heart} alt="heart" />
              </div>
              <div className={styles['section-top__advantages-item']}>
                {advantages.map((item, index) => (
                  <div className={styles['section-top__advantages-item_block']} key={item.id}>
                    <img className={styles['section-top__advantages-item_icon']} src={item.img} alt={item.title} />
                    <p className={styles.title}>
                      {item?.rows.map((row, i) => (
                        <span key={i}>
                          {row}
                          {i === 0 && <br />}
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
              <div className={styles.main_vacancyWrapper__button_vacancyWrapper}>
                {!isVisible && (
                  <button
                    className={styles.main_vacancyWrapper__button_vacancy}
                    type="submit"
                    id="submit-button"
                    onClick={handleScrollToForm}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    ref={formButtonRef}>
                    <p className={styles.main_vacancyWrapper__button_name_vacancy}>Откликнуться на вакансию</p>
                  </button>
                )}
              </div>
              <RenderVacancySections vacancy={vacancies[0]} />
            </div>
          </div>
          <aside className={styles['section-top__aside']}>
            <VacancyRequirements vacancy={vacancies[0]} variant="default" />
            <VacancyFormContactUniversal
              variant="simple"
              vacancyTitleSimple={selectedVacancy?.title}
              buttonText={activePage === 'internships' ? 'Откликнуться на стажировку' : 'Откликнуться на вакансию'}
            />
          </aside>
        </section>
        <div className={styles.main_vacancyWrapper__3dGroup} ref={rocketSceneRef}>
          <div ref={star3d4Ref} className={styles.background4} style={{ backgroundImage: `url(${star3d_4})` }} />
          <div ref={star3d5Ref} className={styles.background5} style={{ backgroundImage: `url(${star3d_5})` }} />
          <div ref={star3d6Ref} className={styles.background6} style={{ backgroundImage: `url(${star3d_6})` }} />
          <div ref={star3d7Ref} className={styles.background7} style={{ backgroundImage: `url(${star3d_7})` }} />
          <div ref={star3d8Ref} className={styles.background10} style={{ backgroundImage: `url(${star3d_8})` }} />
          <div className={styles.background8} ref={rocketRef} style={{ backgroundImage: `url(${rocketBig})` }} />
          <div className={styles.background9} ref={sputnikRef} style={{ backgroundImage: `url(${sputnik})` }} />
          <div className={styles.main_vacancyWrapper__aboutBlockWrapper}>
            <div className={styles.main_vacancyWrapper__aboutBlockTitle}>Немного о&nbsp;нас</div>
            <span className={styles.main_vacancyWrapper__aboutBlockText}>
              MARKS GROUP генеральный
              <br />
              проектировщик
            </span>
            <div className={styles.main_vacancyWrapper__wrapperCountBlock}>
              <div className={styles.countItem}>
                <div className={styles.countLabel}>На&nbsp;рынке</div>
                <div className={styles.countValue}>19&nbsp;лет</div>
              </div>
              <div className={styles.countItem}>
                <img className={styles.offerHeart2} src={heart2} alt={heart2} />
                <img
                  className={styles.vectorAround}
                  src={window.innerWidth <= 767 ? vectorAround2 : vectorAround}
                  alt={window.innerWidth <= 767 ? 'vectorAround2' : 'vectorAround'}
                />
                <div className={styles.countLabel}>Специалистов</div>
                <div className={styles.countValue}>&gt;1300</div>
              </div>
              <div className={styles.countItem1}>
                <div className={styles.countLabel}>
                  Реализованных<br></br> проектов
                </div>
                <div className={styles.countValue}>&gt;200</div>
              </div>
            </div>
          </div>
          <div className={styles.main_vacancyWrapper__locationWrapper}>
            <div className={styles.locationTitle}>Расположение</div>{' '}
            {windowWidth && (
              <span className={styles.locationText}>
                Офис в&nbsp;центре Москвы, метро {windowWidth <= 1024 ? ' ' : <br />} Белорусская
              </span>
            )}
            <div className={styles.main_vacancyWrapper__locationBlockLocation}>
              <div className={styles.rocketVectorAround1Block}>
                <img className={styles.rocket} src={rocket1} alt={rocket1} />
                <img
                  className={styles.vectorAround1}
                  src={window.innerWidth <= 767 ? vectorAround : vectorAround1}
                  alt={window.innerWidth <= 767 ? 'vectorAround' : 'vectorAround1'}
                />
              </div>
              <div className={styles.main_vacancyWrapper__locationWrapperLocation}>
                <div className={styles.locationLabel}>От&nbsp;метро</div>
                <div className={styles.locationValue}>10&nbsp;мин</div>
              </div>
              <div className={styles.main_vacancyWrapper__spanWrapperLocation}>
                <span className={styles.spanLocationText}>Комфортный оборудованный офис</span>
                <span className={styles.spanLocationText}>
                  Мы предоставляем все оборудование для комфортной работы и отдыха
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.main_vacancyWrapper__sliderBlock}>
          <div className={styles.sliderBlockText}>Как мы проводим время</div>
          <VacancySlider />
        </div>
        <div className={styles.main_vacancyWrapper__frameBlockNext}>
          <div className={styles.main_vacancyWrapper__3dNext} ref={nextStarsRef}>
            <div ref={star3d9Ref} className={styles.background9next} style={{ backgroundImage: `url(${star3d_9})` }} />
            <div
              ref={star3d10Ref}
              className={styles.background10next}
              style={{ backgroundImage: `url(${star3d_10})` }}
            />
            <div
              ref={star3d11Ref}
              className={styles.background11next}
              style={{ backgroundImage: `url(${star3d_11})` }}
            />
          </div>
          <div className={styles.frameBlockLeft}>
            <div className={styles.blockTitle}>Плюсы работы с&nbsp;нами</div>
            <span className={styles.blockText}>Безусловная любовь к&nbsp;профессии</span>
            <span className={styles.blockText1}>
              Мы любим не&nbsp;только профессию, но&nbsp;и&nbsp;наш коллектив, делаем все, что&nbsp;бы сотрудникам было
              приятно и&nbsp;комфортно. Каждый понедельник - отмечаем фруктовый день, весело гуляем
              на&nbsp;корпоративах, проводим спортивные и&nbsp;светские мероприятия
            </span>
          </div>
          <div className={styles.frameBlockRight}>
            <BenefitsVacancy />
          </div>
        </div>
        <div id="form" className={styles.temporaryText}>
          Мы ищем именно тебя!
        </div>
        <div className={styles.textUnderForm}>
          Оставьте ваши контакты, мы всегда&nbsp;в&nbsp;поиске талантливых профессионалов
        </div>
        <div className={styles.main_vacancyWrapper__vacancyFormWrapper} ref={formRef}>
          <VacancyFormContactUniversal
            variant="full"
            initialDirection={selectedVacancy?.direction}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            vacancyTitle={selectedVacancy?.title}
            centerButton={true}
            buttonText={activePage === 'internships' ? 'Откликнуться на стажировку' : 'Откликнуться на вакансию'}
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(VacanciesMainCard);
