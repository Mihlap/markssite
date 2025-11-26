import React, { useCallback, useEffect, useLayoutEffect, useRef, useState, Suspense, lazy } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import clsx from 'clsx';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VacancySlider from '../VacancySlider/VacancySlider';
import LoadingVacancy from '../../../Loading/LoadingVacancy';
import RenderVacancySections from '../RenderVacancySections/RenderVacancySections';
import { fetchEmployees } from '../../../store/Slice/vacanciesSlice';
import VacancyFormContactSimple from '../../../UI/VacancyFormContact/VacancyFormContactSimple';
import VacancyFormContact from '../../../UI/VacancyFormContact/VacancyFormContact';
import ModalVacancyFormSend from '../../../UI/VacancyFormContact/ModalVacancyFormSend';
import { advantages } from './const/advantages';
import BenefitsVacancy from '../BenefitsVacancy/BenefitsVacancy';
import VacancyRequirements from '../../ui/mesh/VacancyRequirements';
import styles from './VacanciesMainCard.module.scss';
// hooks
import { useScreenSize } from './hooks/useScreenSize';
import { useStickyVisibility } from './hooks/useStickyVisibility';

import star1 from '../icons/star-header-1.png';
import star2 from '../icons/star-header-2.png';
import star3 from '../icons/star-header-3.png';

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

const Button = lazy(() => import('../../ui/button/Button'));

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const VacanciesMainCard = ({ handleMouseEnter, handleMouseLeave, handleMouseHover }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const activePage = useSelector((state) => state.activePage.page);
  const vacancies = useSelector((state) => state.vacancies.vacancies);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const { width } = useScreenSize();

  const formRef = useRef(null); // якорь чтоб спуститься к форме
  const showOnRef = useRef(null); // первый якорь
  const hideOnRef = useRef(null); // второй якорь

  const formButtonRef = useRef(null);
  const rocketRef = useRef(null);
  const sputnikRef = useRef(null);
  const container = useRef();
  const firstStarRef = useRef(null);
  const secondStarRef = useRef(null);
  const threeStarRef = useRef(null);

  const { isShown, isHidden } = useStickyVisibility(showOnRef, hideOnRef);

  useGSAP(
    () => {
      const stars = [
        { ref: firstStarRef, rotate: 100, initialPosition: -50 },
        { ref: secondStarRef, rotate: -100, initialPosition: 50 },
        { ref: threeStarRef, rotate: 100, initialPosition: -50 },
      ];

      stars.forEach(({ ref, rotate, initialPosition }) => {
        gsap.fromTo(
          ref.current,
          { rotateZ: initialPosition }, // ← начальный угол
          {
            rotateZ: rotate, // ← конечный угол
            ease: 'none',
            scrollTrigger: {
              trigger: container.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    },
    { scope: container }
  );

  useEffect(() => {
    dispatch(fetchEmployees(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (vacancies && vacancies.length > 0) {
      const selectedVac = vacancies.find((vacancy) => vacancy.id === parseInt(id));
      setSelectedVacancy(selectedVac);
    }
  }, [vacancies, id]);

  const handleScrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          <div ref={container} className={styles['section-top__title']}>
            <img ref={firstStarRef} className={styles['section-top__star']} src={star1} alt="иконка звезды" />
            <img ref={secondStarRef} className={styles['section-top__star']} src={star2} alt="иконка звезды" />
            <img ref={threeStarRef} className={styles['section-top__star']} src={star3} alt="иконка звезды" />
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
                  <div key={item.id}>
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
              <Suspense fallback={<p>loading...</p>}>
                <Button
                  withBackground
                  className={clsx(
                    styles['sticky-floating-btn'],
                    isShown && styles['sticky-floating-btn_visible'],
                    isHidden && styles['sticky-floating-btn_hidden']
                  )}
                  click={handleScrollToForm}>
                  {activePage === 'internships' ? 'Откликнуться на стажировку' : 'Откликнуться на вакансию'}
                </Button>
              </Suspense>
              <RenderVacancySections showOnRef={showOnRef} vacancy={vacancies[0]} />
            </div>
          </div>
          <aside className={styles['section-top__aside']}>
            <VacancyRequirements vacancy={vacancies[0]} variant="default" />
            <VacancyFormContactSimple
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              handleMouseHover={handleMouseHover}
              setIsLoading={setIsLoading}
              setIsModalOpen={setIsModalOpen}
              vacancyTitleSimple={selectedVacancy?.title}
              buttonText={activePage === 'internships' ? 'Откликнуться на стажировку' : 'Откликнуться на вакансию'}
              inputPaddingTop={width >= 1024 && width <= 1600 ? '2rem' : undefined}
            />
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
                  src={width <= 767 ? vectorAround2 : vectorAround}
                  alt={width <= 767 ? 'vectorAround2' : 'vectorAround'}
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
            <div className={styles.main_vacancyWrapper__locationBlockLocation}>
              <div className={styles.rocketVectorAround1Block}>
                <img className={styles.rocket} src={rocket1} alt={rocket1} />
                <img
                  className={styles.vectorAround1}
                  src={width <= 767 ? vectorAround : vectorAround1}
                  alt={width <= 767 ? 'vectorAround' : 'vectorAround1'}
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
            hideOnRef={hideOnRef}
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(VacanciesMainCard);
