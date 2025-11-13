import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { debounce } from 'lodash';
import styles from './VacanciesMainCard.module.scss';
import VacancySlider from '../VacancySlider/VacancySlider';
import LoadingVacancy from '../../../Loading/LoadingVacancy';
import RenderVacancySections from '../RenderVacancySections/RenderVacancySections';
import { fetchEmployees } from '../../../store/Slice/vacanciesSlice';
import AllVacancyButton from '../../../UI/ButtonVacancy/AllVacancyButton';
import VacancyFormContactSimple from '../../../UI/VacancyFormContact/VacancyFormContactSimple';
import VacancyFormContact from '../../../UI/VacancyFormContact/VacancyFormContact';
import ModalVacancyFormSend from '../../../UI/VacancyFormContact/ModalVacancyFormSend';
import { advantages } from './const/advantages';

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

gsap.registerPlugin(ScrollTrigger);
function setViewportUnits() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight / 100}px`);
  document.documentElement.style.setProperty('--vw', `${window.innerWidth / 100}px`);
}

const VacanciesMainCard = ({ handleMouseEnter, handleMouseLeave, handleMouseHover }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const activePage = useSelector((state) => state.activePage.page);
  const vacancies = useSelector((state) => state.vacancies.vacancies);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [isVisible, setIsVisible] = useState(window.innerWidth > 1024);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const formRef = useRef(null);
  const formButtonRef = useRef(null);
  const rocketRef = useRef(null);
  const sputnikRef = useRef(null);

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

  useEffect(() => {
    if (windowWidth < 1025 || !vacancies || !selectedVacancy) return;

    const frameId = requestAnimationFrame(setupScrollTriggers);

    return () => {
      cancelAnimationFrame(frameId);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowWidth, vacancies, selectedVacancy]);

  const setupScrollTriggers = useCallback(
    () => {
      if (!selectedVacancy) return;
      ScrollTrigger.getAll().forEach((t) => t.kill());

      const triggers = [];
      vacancies.forEach((vacancy) => {
        const blockRight = document.getElementById(`blockRight-${vacancy.id}`);
        const wrapper = document.getElementById(`wrapperTextBlock-${selectedVacancy.id}`);
        if (!blockRight || !wrapper) return;
        const trig = setupBlockAnimation(blockRight, wrapper);
        if (trig) triggers.push(trig);
      });

      return () => triggers.forEach((t) => t.kill());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [vacancies, selectedVacancy, windowWidth]
  );

  const setupBlockAnimation = (blockRight, wrapperTextBlock) => {
    const blockRightRect = blockRight.getBoundingClientRect();
    const wrapperTextBlockRect = wrapperTextBlock.getBoundingClientRect();
    let wrapperTextBlockBottom = wrapperTextBlockRect.bottom + window.scrollY - blockRightRect.height - 300;

    if (windowWidth > 1601) {
      wrapperTextBlockBottom -= 200;
    }

    return ScrollTrigger.create({
      trigger: wrapperTextBlock,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => updatePosition(self, blockRight, wrapperTextBlockBottom),
      onRefresh: (self) => updatePosition(self, blockRight, wrapperTextBlockBottom),
    });
  };

  const updatePosition = (self, blockRight, bottom) => {
    const scrollerPoint = window.scrollY + blockRight.getBoundingClientRect().height;
    if (scrollerPoint >= bottom) {
      blockRight.style.position = 'absolute';
      blockRight.style.top = `${bottom - blockRight.getBoundingClientRect().height}px`;
    } else {
      blockRight.style.position = 'fixed';
      blockRight.style.top = '0';
    }
    blockRight.style.right = '0';
  };

  useEffect(() => {
    const handleScroll = () => {
      const rocketEl = rocketRef.current;
      const sputnikEl = sputnikRef.current;

      if (!rocketEl || !sputnikEl) return;

      const scrollPosition = window.scrollY;

      let xValueRocket, xValueSputnik, rocketStart, sputnikStart;

      if (window.innerWidth > 1024) {
        xValueRocket = 80;
        xValueSputnik = -80;
        rocketStart = -150;
        sputnikStart = 0;
      } else if (window.innerWidth > 767) {
        xValueRocket = 50;
        xValueSputnik = -50;
        rocketStart = -80;
        sputnikStart = 20;
      } else {
        xValueRocket = 40;
        xValueSputnik = -40;
        rocketStart = -200;
        sputnikStart = -40;
      }

      rocketEl.style.transform = `translateX(${rocketStart + scrollPosition * (xValueRocket / window.innerHeight)}px)`;
      sputnikEl.style.transform = `translateX(${
        sputnikStart + scrollPosition * (xValueSputnik / window.innerHeight)
      }px)`;
    };

    window.addEventListener('scroll', handleScroll);

    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [windowWidth]);

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
      <div className={styles.main_vacancyWrapper}>
        {isLoading && <LoadingVacancy />}
        <ModalVacancyFormSend
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          title="Спасибо за&nbsp;отклик!"
          message="Мы изучим информацию и&nbsp;свяжемся с&nbsp;вами"
          buttonText="Спасибо,&nbsp;жду!"
          variant="manualClose"
        />
        <section className={styles['section-top']}>
          <div className={styles['section-top__title']}>
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
            <div className={styles['section-top__advantages']}>
              <div className={styles['section-top__advantages-title']}>
                <span>Marks Group предлагает тебе</span>
                <img src={heart} alt="heart" />
              </div>
              <div className={styles['section-top__advantages-item']}>
                {advantages.map((item, index) => (
                  <div key={item.id} className={styles[`cell${index + 1}`]}>
                    <img src={item.img} alt={item.title} />
                    <p className={styles['section-top__advantages-item_title']}>{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <aside className={styles['section-top__aside']}>
            {vacancies?.map((vacancy) => {
              return (
                <div>
                  <div className={styles['section-top__aside-item']}>
                    <span>Опыт&nbsp;работы:</span>
                    <span>{vacancy.experience}</span>
                  </div>
                  <div>
                    <span>Локация:</span>
                    <span>{vacancy.locationStaff}</span>
                  </div>
                  <div>
                    <span>Занятость:</span>
                    <span>{vacancy.busyness}</span>
                  </div>
                  <div>
                    <span>Режим&nbsp;работы:</span>
                    <span>{vacancy.modeOperating}</span>
                  </div>
                  <>
                    {isVisible && (
                      <VacancyFormContactSimple
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        handleMouseHover={handleMouseHover}
                        setIsLoading={setIsLoading}
                        setIsModalOpen={setIsModalOpen}
                        vacancyTitleSimple={selectedVacancy?.title}
                        buttonText={
                          activePage === 'internships' ? 'Откликнуться на стажировку' : 'Откликнуться на вакансию'
                        }
                        inputPaddingTop={windowWidth >= 1024 && windowWidth <= 1600 ? '2rem' : undefined}
                      />
                    )}
                  </>
                </div>
              );
            })}
          </aside>
        </section>
        <div className={styles.main_vacancyWrapper__3dGroup}>
          <div className={styles.background4} style={{ backgroundImage: `url(${star3d_4})` }} />
          <div className={styles.background5} style={{ backgroundImage: `url(${star3d_5})` }} />
          <div className={styles.background6} style={{ backgroundImage: `url(${star3d_6})` }} />
          <div className={styles.background7} style={{ backgroundImage: `url(${star3d_7})` }} />
          <div className={styles.background10} style={{ backgroundImage: `url(${star3d_8})` }} />
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
                <span className={styles.spanLocationText}>
                  Комфортный оборудованный офис, кофе чай печеньки по утрам
                </span>
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
          <div className={styles.main_vacancyWrapper__3dNext}>
            <div className={styles.background9next} style={{ backgroundImage: `url(${star3d_9})` }} />
            <div className={styles.background10next} style={{ backgroundImage: `url(${star3d_10})` }} />
            <div className={styles.background11next} style={{ backgroundImage: `url(${star3d_11})` }} />
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
        <div className={styles.temporaryText}>Мы ищем именно тебя!</div>
        <div className={styles.textUnderForm}>
          Оставьте ваши контакты, мы всегда&nbsp;в&nbsp;поиске талантливых профессионалов
        </div>
        <div className={styles.main_vacancyWrapper__vacancyFormWrapper} ref={formRef}>
          <VacancyFormContact
            formRef={formRef}
            initialDirection={selectedVacancy?.direction}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            handleMouseHover={handleMouseHover}
            setIsLoading={setIsLoading}
            setIsModalOpen={setIsModalOpen}
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
