import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import styles from "./VacanciesMainCard.module.scss";
import AllVacancyButton from "../../UI/ButtonVacancy/AllVacancyButton";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../../store/Slice/vacanciesSlice";
import { useParams } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Error from "../../Loading/Error/Error";
import LoadingCircle from "../../Loading/LoadingCircle";
import VacancyFormContactSimple from "../../UI/VacancyFormContact/VacancyFormContactSimple";
import VacancyFormContact from "../../UI/VacancyFormContact/VacancyFormContact";
import RenderVacancySections from "./RenderVacancySections";

import star3d_1 from "./icons/star3d_1.png";
import star3d_2 from "./icons/star3d_2.png";
import star3d_3 from "./icons/star3d_3.png";
import star3d_4 from "./icons/star3d_4.png";
import star3d_5 from "./icons/star3d_5.png";
import star3d_6 from "./icons/star3d_6.png";
import star3d_7 from "./icons/star3d_7.png";
import star3d_8 from "./icons/star3d_8.png";
import heart from "./icons/heart.png";
import heart2 from "./icons/heart2.png";
import rocket from "./icons/rocket.png";
import rocketBig from "./icons/rocketBig.png";
import sputnik from "./icons/sputnik.png";
import vectorAround from "./icons/VectorAround.png";
import vectorAround1 from "./icons/VectorAround1.png";
import frame1 from "./icons/frame1.png";
import frame2 from "./icons/frame2.png";
import frame3 from "./icons/frame3.png";
import frame4 from "./icons/frame4.png";

gsap.registerPlugin(ScrollTrigger);

const VacanciesMainCard = ({
  handleMouseEnter,
  handleMouseLeave,
  handleMouseHover,
}) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const vacancies = useSelector((state) => state.vacancies.vacancies);
  const loading = useSelector((state) => state.vacancies.loading);
  const error = useSelector((state) => state.vacancies.error);
  const [selectedVacancy, setSelectedVacancy] = useState(null);

  const formRef = useRef(null);
  const buttonRef = useRef(null);
  const rocketRef = useRef(null);
  const sputnikRef = useRef(null);

  useEffect(() => {
    dispatch(fetchEmployees(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (vacancies && vacancies.length > 0) {
        setSelectedVacancy(vacancies[0]);
    }
  }, [vacancies]);

  useEffect(() => {   const buttonAnimation = gsap.to(buttonRef.current, {
    y: () => {
      const formTop = formRef.current.offsetTop;
      const buttonTop = buttonRef.current.offsetTop;
      return formTop - buttonTop;
    },
    opacity: 1,
    ease: "none",
    scrollTrigger: {
      trigger: buttonRef.current,
      start: "top center",
      end: () => `+=${document.documentElement.scrollHeight - window.innerHeight}`,
      scrub: true,
    },
  });
  


    const rocketAnimation = gsap.fromTo(
        rocketRef.current,
        { x: 0, opacity: 1 },
        {
            x: 150,
            opacity: 1,
            duration: 1,
            scrollTrigger: {
                trigger: rocketRef.current,
                start: "bottom bottom",
                end: "bottom bottom",
                scrub: true,
            },
        }
    );

    const sputnikAnimation = gsap.fromTo(
        sputnikRef.current,
        { x: 0, opacity: 1 },
        {
            x: -150,
            opacity: 1,
            duration: 1,
            scrollTrigger: {
                trigger: sputnikRef.current,
                start: "bottom bottom",
                end: "bottom top",
                scrub: true,
            },
        }
    );

    return () => {
        buttonAnimation.kill();
        rocketAnimation.kill();
        sputnikAnimation.kill();
    };
  }, [formRef, buttonRef, rocketRef, sputnikRef]);


  return (
    <>
      <Helmet>
        <title>Marks Group</title>
      </Helmet>
      <div className={styles.main_vacancyWrapper}>
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
                </div>{" "}
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
                    <VacancyFormContactSimple
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                      buttonRef={buttonRef}
                    />
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
          </span>
          <img
            className={styles.main_vacancyWrapper__offerHeart}
            src={heart}
            alt={heart}
          />
        </div>
        <div className={styles.main_vacancyWrapper__wrapperFrameBlock}>
          <div className={styles.main_vacancyWrapper__frameBlock}>
            <div className={styles.main_vacancyWrapper__frameBlock_frame}>
              <img
                className={styles.main_vacancyWrapper__frame}
                src={frame1}
                alt={frame1}
              />
              <span className={styles.main_vacancyWrapper__frameSpan}>
                Опыт работы на&nbsp;уникальных объектах
              </span>
            </div>
            <div className={styles.main_vacancyWrapper__frameBlock_frame}>
              <img
                className={styles.main_vacancyWrapper__frame}
                src={frame2}
                alt={frame2}
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
                src={frame3}
                alt={frame3}
              />
              <span className={styles.main_vacancyWrapper__frameSpan}>
                Создаем атмосферу менторства и&nbsp;наставничества
              </span>
            </div>
            <div className={styles.main_vacancyWrapper__frameBlock_frame}>
              <img
                className={styles.main_vacancyWrapper__frame}
                src={frame4}
                alt={frame4}
              />
              <span className={styles.main_vacancyWrapper__frameSpan}>
                Даем почву для&nbsp;воплощения ваших идей
              </span>
            </div>
          </div>
        </div>
        <div className={styles.main_vacancyWrapper__wrapperTextBlock}>
          <RenderVacancySections />
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
               <div
            className={styles.background8}
            ref={rocketRef}
            style={{ backgroundImage: `url(${rocketBig})` }}
          />
               <div
            className={styles.background9}
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
                  src={vectorAround}
                  alt={vectorAround}
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
            <div className={styles.locationTitle}>Расположение</div>
            <span className={styles.locationText}>
              Офис в&nbsp;центре Москвы, метро
              <br />
              Белорусская
            </span>
            <div className={styles.main_vacancyWrapper__locationBlockLocation}>
              <div className={styles.rocketVectorAround1Block}>
             <img className={styles.rocket} src={rocket} alt={rocket} />
             <img
               className={styles.vectorAround1}
               src={vectorAround1}
               alt={vectorAround1}
                />
                </div>
              <div
                className={styles.main_vacancyWrapper__locationWrapperLocation}
              >
                <div className={styles.locationLabel}>От&nbsp;метро</div>
                <div className={styles.locationValue}>10&nbsp;мин</div>
              </div>
              <div className={styles.main_vacancyWrapper__spanWrapperLocation}>
                <span className={styles.spanLocationText}>Комфортный оборудованный офис, кофе чай печеньки по утрам</span>
                <span className={styles.spanLocationText}>Мы предоставляем все оборудование для комфортной работы и отдыха</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.main_vacancyWrapper__vacancyFormWrapper} ref={formRef}>
          <VacancyFormContact
            initialDirection={selectedVacancy?.direction}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            handleMouseHover={handleMouseHover}
            buttonRef={buttonRef}            
          />
        </div>
      </div>
    </>
  );
};

export default VacanciesMainCard;
