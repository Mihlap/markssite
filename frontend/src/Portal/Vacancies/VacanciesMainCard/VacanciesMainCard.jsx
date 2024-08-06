import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { debounce } from "lodash";
import styles from "./VacanciesMainCard.module.scss";
import VacancySlider from "../VacancySlider/VacancySlider";
import LoadingVacancy from "../../../Loading/LoadingVacancy";
import RenderVacancySections from "../RenderVacancySections/RenderVacancySections";
import { fetchEmployees } from "../../../store/Slice/vacanciesSlice";
// import Error from "../../Loading/Error/Error";
// import LoadingCircle from "../../Loading/LoadingCircle";
import AllVacancyButton from "../../../UI/ButtonVacancy/AllVacancyButton";
import VacancyFormContactSimple from "../../../UI/VacancyFormContact/VacancyFormContactSimple";
import VacancyFormContact from "../../../UI/VacancyFormContact/VacancyFormContact";
import ModalVacancyFormSend from "../../../UI/VacancyFormContact/ModalVacancyFormSend";

import star3d_1 from "../icons/star3d_1.png";
import star3d_2 from "../icons/star3d_2.png";
import star3d_3 from "../icons/star3d_3.png";
import star3d_4 from "../icons/star3d_4.png";
import star3d_5 from "../icons/star3d_5.png";
import star3d_6 from "../icons/star3d_6.png";
import star3d_7 from "../icons/star3d_7.png";
import star3d_8 from "../icons/star3d_8.png";
import star3d_9 from "../icons/star3d_9.png";
import star3d_10 from "../icons/star3d_10.png";
import star3d_11 from "../icons/star3d_11.png";
import heart from "../icons/heart.svg";
import heart2 from "../icons/heart2.svg";
import rocket1 from "../icons/rocket1.svg";
import rocketBig from "../icons/rocketBig.png";
import sputnik from "../icons/sputnik.png";
import vectorAround from "../icons/VectorAround.svg";
import vectorAround1 from "../icons/VectorAround1.png";
import vectorAround2 from "../icons/vectorAround2.svg";

import frame1 from "../icons/frame/frame1.svg";
import frame2 from "../icons/frame/frame2.svg";
import frame3 from "../icons/frame/frame3.svg";
import frame4 from "../icons/frame/frame4.svg";
import BenefitsVacancy from "../BenefitsVacancy/BenefitsVacancy";

gsap.registerPlugin(ScrollTrigger);

const VacanciesMainCard = ({
  handleMouseEnter,
  handleMouseLeave,
  handleMouseHover,
}) => {
  const dispatch = useDispatch();
  const { id } = useParams();
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

 
  // useEffect(() => {
  //   if (vacancies && vacancies.length > 0 && selectedVacancy) {
  //     setupScrollTriggers();
  
  //     return () => {
  //       ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  //     };
  //   }
  // }, [vacancies, windowWidth, selectedVacancy]);
  
  

  useEffect(() => {
     const handleResizeDebounced = debounce(() => {
      setIsVisible(window.innerWidth > 1024);
      setWindowWidth(window.innerWidth);
    }, 100);

    window.addEventListener("resize", handleResizeDebounced);

    return () => {
      window.removeEventListener("resize", handleResizeDebounced);
      handleResizeDebounced.cancel();
    };
  }, []);

  useEffect(() => {  
    dispatch(fetchEmployees(id));
  }, [dispatch, id]);


  useEffect(() => {
    if (vacancies && vacancies.length > 0) {
      const selectedVac = vacancies.find(
        (vacancy) => vacancy.id === parseInt(id)
      );
      setSelectedVacancy(selectedVac);
    }
  }, [vacancies, id]);

   useEffect(() => {
    if (windowWidth < 1025 || !vacancies || !selectedVacancy) return;
  
    const frameId = requestAnimationFrame(setupScrollTriggers);  

    return () => {
      cancelAnimationFrame(frameId);    
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [windowWidth, vacancies, selectedVacancy]);
  
  const setupScrollTriggers = () => {
    if (!selectedVacancy) return;
     const triggers = [];
  
    vacancies.forEach((vacancy) => {
      const blockRight = document.getElementById(`blockRight-${vacancy.id}`);
      const wrapperTextBlock = document.getElementById(`wrapperTextBlock-${selectedVacancy.id}`);
      if (!blockRight || !wrapperTextBlock) return;
  
      const trigger = setupBlockAnimation(blockRight, wrapperTextBlock);
      if (trigger) triggers.push(trigger); 
    });
  
    return () => {
       triggers.forEach(trigger => trigger.kill());
    };
  };
  
  const setupBlockAnimation = (blockRight, wrapperTextBlock) => {
    const blockRightRect = blockRight.getBoundingClientRect();
    const wrapperTextBlockRect = wrapperTextBlock.getBoundingClientRect();
    let wrapperTextBlockBottom = wrapperTextBlockRect.bottom + window.scrollY - blockRightRect.height - 350;
  
    if (windowWidth > 1601) {
      wrapperTextBlockBottom -= 200;  
    }  
  
    return ScrollTrigger.create({
      trigger: wrapperTextBlock,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: self => updatePosition(self, blockRight, wrapperTextBlockBottom),
      onRefresh: self => updatePosition(self, blockRight, wrapperTextBlockBottom)
    });
  };
  
  const updatePosition = (self, blockRight, bottom) => {
    const scrollerPoint = window.scrollY + blockRight.getBoundingClientRect().height;
    if (scrollerPoint >= bottom) {
      blockRight.style.position = "absolute";
      blockRight.style.top = `${bottom - blockRight.getBoundingClientRect().height}px`;
    } else {
      blockRight.style.position = "fixed";
      blockRight.style.top = "0";
    }
    blockRight.style.right = "0";
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
      sputnikEl.style.transform = `translateX(${sputnikStart + scrollPosition * (xValueSputnik / window.innerHeight)}px)`;
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
      const initialButtonBottom =
        button.getBoundingClientRect().bottom + window.scrollY + 10;

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
      window.addEventListener("scroll", updateButtonPosition);

      return () => {
        window.removeEventListener("scroll", updateButtonPosition);
      };
    }, 300);
  }, []);

  const handleScrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
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
        />
        <div
          className={styles.main_vacancy_block__background1}
          style={{ backgroundImage: `url(${star3d_1})` }}
        />
        <div
          className={styles.main_vacancy_block__background2}
          style={{ backgroundImage: `url(${star3d_2})` }}
        />
        <div
          className={styles.main_vacancy_block__background3}
          style={{ backgroundImage: `url(${star3d_3})` }}
        />
        <div className={styles.main_vacancy_block}>
          <div className={styles.main_vacancy_block__wrapper}>
            {vacancies?.map((vacancy) => (
              <div key={vacancy.id} className={styles.main_vacancy_block__item}>
                <div className={styles.main_vacancy_block__blockLeft}>
                  <div className={styles.main_vacancy_block__vacancyTitle}>
                    {vacancy.title}
                  </div>
                  <div className={styles.main_vacancy_block__vacancyDetails}>
                    <ul className={styles.main_vacancy_block__vacancyTitle1}>
                      <li
                        className={
                          styles.main_vacancy_block__vacancyTitle1__titleKey
                        }
                      >
                        Мы ищем:
                      </li>
                      <li
                        className={
                          styles.main_vacancy_block__vacancyTitle1__titleValue1
                        }
                        dangerouslySetInnerHTML={{
                          __html: vacancy.searchStaff,
                        }}
                      ></li>
                    </ul>
                  </div>
                </div>
                <div
                  className={styles.main_vacancy_block__blockRightWrapper}
                  id={`blockRight-${vacancy?.id}`}
                >
                  <div className={styles.main_vacancy_block__blockRight}>
                    <div
                      className={`${styles.main_vacancy_block__detailItem} ${styles.topLeftSquare}`}
                    >
                      <span className={styles.main_vacancy_block__detailKey}>
                        Опыт&nbsp;работы:
                      </span>
                      <span className={styles.main_vacancy_block__detailValue}>
                        {vacancy.experience}
                      </span>
                    </div>
                    <div
                      className={`${styles.main_vacancy_block__detailItem} ${styles.topRightSquare}`}
                    >
                      <span className={styles.main_vacancy_block__detailKey}>
                        Локация:
                      </span>
                      <span className={styles.main_vacancy_block__detailValue}>
                        {vacancy.locationStaff}
                      </span>
                    </div>
                    <div
                      className={`${styles.main_vacancy_block__detailItem} ${styles.bottomLeftSquare}`}
                    >
                      <span className={styles.main_vacancy_block__detailKey}>
                        Занятость:
                      </span>
                      <span className={styles.main_vacancy_block__detailValue}>
                        {vacancy.busyness}
                      </span>
                    </div>
                    <div
                      className={`${styles.main_vacancy_block__detailItem} ${styles.bottomRightSquare}`}
                    >
                      <span className={styles.main_vacancy_block__detailKey}>
                        Режим&nbsp;работы:
                      </span>
                      <span className={styles.main_vacancy_block__detailValue}>
                        {vacancy.modeOperating}
                      </span>
                    </div>
                    <div className={styles.vacancyFormWrapperSimple}>
                      {isVisible && (
                        <VacancyFormContactSimple
                          handleMouseEnter={handleMouseEnter}
                          handleMouseLeave={handleMouseLeave}
                          handleMouseHover={handleMouseHover}
                          setIsLoading={setIsLoading}
                          setIsModalOpen={setIsModalOpen}
                          vacancyTitleSimple={selectedVacancy?.title}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            className={styles.main_vacancy_block__all_button}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <AllVacancyButton />
          </div>
        </div>
        <div className={styles.main_vacancyWrapper__offer}>
          <span className={styles.main_vacancyWrapper__offerName}>
            Marks Group предлагает тебе
            <img
              className={styles.main_vacancyWrapper__offerHeart}
              src={heart}
              alt={heart}
            />
          </span>
        </div>
        <div className={styles.main_vacancyWrapper__wrapperFrameBlock}>
          <div className={styles.main_vacancyWrapper__frameBlock}>
            <div className={styles.main_vacancyWrapper__frameBlock_frame}>
              <img
                className={styles.main_vacancyWrapper__frame}
                src={frame2}
                alt={frame2}
              />
              <span className={styles.main_vacancyWrapper__frameSpan}>
                Опыт работы на&nbsp;уникальных объектах
              </span>
            </div>
            <div className={styles.main_vacancyWrapper__frameBlock_frame}>
              <img
                className={styles.main_vacancyWrapper__frame}
                src={frame1}
                alt={frame1}
              />
              <span className={styles.main_vacancyWrapper__frameSpan}>
                Развитие карьерного и&nbsp;личностного потенциала
              </span>
            </div>
          </div>
          <div className={styles.main_vacancyWrapper__frameBlock}>
            <div className={styles.main_vacancyWrapper__frameBlock_frame}>
              <img
                className={styles.main_vacancyWrapper__frame}
                src={frame4}
                alt={frame4}
              />
              <span className={styles.main_vacancyWrapper__frameSpan}>
                Создаем атмосферу менторства и&nbsp;наставничества
              </span>
            </div>
            <div className={styles.main_vacancyWrapper__frameBlock_frame}>
              <img
                className={styles.main_vacancyWrapper__frame}
                src={frame3}
                alt={frame3}
              />
              <span className={styles.main_vacancyWrapper__frameSpan}>
                Даем почву для&nbsp;воплощения ваших идей
              </span>
            </div>
          </div>
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
              ref={formButtonRef}
            >
              <p className={styles.main_vacancyWrapper__button_name_vacancy}>
                Откликнуться на вакансию
              </p>
            </button>
          )}
        </div>
        <div className={styles.main_vacancyWrapper__wrapperTextBlock}>
          <div id={`wrapperTextBlock-${selectedVacancy?.id}`}>
            <RenderVacancySections />
          </div>
        </div>
        <div className={styles.main_vacancyWrapper__3dGroup}>
          <div
            className={styles.background4}
            style={{ backgroundImage: `url(${star3d_4})` }}
          />
          <div
            className={styles.background5}
            style={{ backgroundImage: `url(${star3d_5})` }}
          />
          <div
            className={styles.background6}
            style={{ backgroundImage: `url(${star3d_6})` }}
          />
          <div
            className={styles.background7}
            style={{ backgroundImage: `url(${star3d_7})` }}
          />
          <div
            className={styles.background10}
            style={{ backgroundImage: `url(${star3d_8})` }}
          />
          <div className={styles.background8}
            ref={rocketRef}
            style={{ backgroundImage: `url(${rocketBig})` }}
          />
          <div className={styles.background9}
            ref={sputnikRef}
            style={{ backgroundImage: `url(${sputnik})` }}
          />
          <div className={styles.main_vacancyWrapper__aboutBlockWrapper}>
            <div className={styles.main_vacancyWrapper__aboutBlockTitle}>
              Немного о&nbsp;нас
            </div>
            <span className={styles.main_vacancyWrapper__aboutBlockText}>
              MARKS GROUP генеральный
              <br />
              проектировщик
            </span>
            <div className={styles.main_vacancyWrapper__wrapperCountBlock}>
              <div className={styles.countItem}>
                <div className={styles.countLabel}>На&nbsp;рынке</div>
                <div className={styles.countValue}>17&nbsp;лет</div>
              </div>
              <div className={styles.countItem}>
                <img className={styles.offerHeart2} src={heart2} alt={heart2} />
                <img
                  className={styles.vectorAround}
                  src={window.innerWidth <= 767 ? vectorAround2 : vectorAround}
                  alt={
                    window.innerWidth <= 767 ? "vectorAround2" : "vectorAround"
                  }
                />
                <div className={styles.countLabel}>Специалистов</div>
                <div className={styles.countValue}>+1000</div>
              </div>
              <div className={styles.countItem1}>
                <div className={styles.countLabel}>Реализованных проектов</div>
                <div className={styles.countValue}>+200</div>
              </div>
            </div>
          </div>
          <div className={styles.main_vacancyWrapper__locationWrapper}>
            <div className={styles.locationTitle}>Расположение</div>{" "}
            {windowWidth && (
              <span className={styles.locationText}>
                Офис в&nbsp;центре Москвы, метро{" "}
                {windowWidth <= 1024 ? " " : <br />} Белорусская
              </span>
            )}
            <div className={styles.main_vacancyWrapper__locationBlockLocation}>
              <div className={styles.rocketVectorAround1Block}>
                <img className={styles.rocket} src={rocket1} alt={rocket1} />
                <img
                  className={styles.vectorAround1}
                  src={window.innerWidth <= 767 ? vectorAround : vectorAround1}
                  alt={
                    window.innerWidth <= 767 ? "vectorAround" : "vectorAround1"
                  }
                />
              </div>
              <div
                className={styles.main_vacancyWrapper__locationWrapperLocation}
              >
                <div className={styles.locationLabel}>От&nbsp;метро</div>
                <div className={styles.locationValue}>10&nbsp;мин</div>
              </div>
              <div className={styles.main_vacancyWrapper__spanWrapperLocation}>
                <span className={styles.spanLocationText}>
                  Комфортный оборудованный офис, кофе чай печеньки по утрам
                </span>
                <span className={styles.spanLocationText}>
                  Мы предоставляем все оборудование для комфортной работы и
                  отдыха
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
            <div
              className={styles.background9next}
              style={{ backgroundImage: `url(${star3d_9})` }}
            />
            <div
              className={styles.background10next}
              style={{ backgroundImage: `url(${star3d_10})` }}
            />
            <div
              className={styles.background11next}
              style={{ backgroundImage: `url(${star3d_11})` }}
            />
          </div>
          <div className={styles.frameBlockLeft}>
            <div className={styles.blockTitle}>Плюсы работы с&nbsp;нами</div>
            <span className={styles.blockText}>
              Безусловная любовь к&nbsp;профессии
            </span>
            <span className={styles.blockText1}>
              Мы любим не&nbsp;только профессию, но&nbsp;и&nbsp;наш коллектив,
              делаем все, что&nbsp;бы сотрудникам было приятно и&nbsp;комфортно.
              Каждый понедельник - отмечаем фруктовый день, весело гуляем
              на&nbsp;корпоративах, проводим спортивные и&nbsp;светские
              мероприятия
            </span>
          </div>
          <div className={styles.frameBlockRight}>
            <BenefitsVacancy />
          </div>
        </div>
        <div className={styles.temporaryText}>Мы ищем именно тебя!</div>
        <div className={styles.textUnderForm}>
          Оставьте ваши контакты, мы всегда&nbsp;в&nbsp;поиске талантливых
          профессионалов
        </div>
        <div
          className={styles.main_vacancyWrapper__vacancyFormWrapper}
          ref={formRef}
        >
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
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(VacanciesMainCard);
