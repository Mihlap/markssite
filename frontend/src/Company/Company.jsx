import React, { useEffect, useRef, useState } from "react";
import styles from "./Company.module.css";
import Company_Slider from "../UI/Company_Slider/Company_Slider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SliderMobile from "../UI/SliderHeader/SliderMobile";

import bracket from "../icons/bracket.svg";
import bracket_dark from "../icons/bracket_dark.svg";
import plusNine from '../icons/+9.svg';
import CompanyGroupSlider from "../UI/CompanyGroupSlider/CompanyGroupSlider";
import TableCompany from "../UI/TableCompany/TableCompany";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaff } from "../store/Slice/StaffSlice";

export default function Company() {
  const [countPercent, setCountPercent] = useState(0);
  const [countHuman, setCountHuman] = useState(0);
  const [countProject, setCountProject] = useState(0);
  const blockSlider = useRef(null);
  const [countDepartment, setCountDepartment] = useState(0);
  const [countGap, setCountGap] = useState(0);
  const [countScient, setCountScient] = useState(0);
  const [countScienceDegree, setCountScienceDegree] = useState(0);
  const blockSliderNext = useRef(null);
  const nameCompanyRef = useRef(null);
  const thisBlockRef = useRef(null);
  const dispatch = useDispatch();
  const staff = useSelector((state) => state.staff);
  // const loading = useSelector((state) => state.staff.loading);
  // const error = useSelector((state) => state.staff.error);

  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      if (countPercent < 80) {
        setCountPercent(countPercent + 2);
      }
      if (countHuman < 700) {
        setCountHuman(countHuman + 20);
      }
      if (countProject < 200) {
        setCountProject(countProject + 5);
      }
    }, 50);
    return () => clearTimeout(timer1);
  }, [countPercent, countHuman, countProject]);

  useEffect(() => {
    window.scrollTo(20, 0);

    gsap.registerPlugin(ScrollTrigger);

    const { elementsRight } = { elementsRight: [blockSlider.current] };

    gsap.from(elementsRight, {
      x: "-100%",
      opacity: 0,
      duration: 1.5,
      delay: 1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: elementsRight,
        start: "top 80%",
      },
    });
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "10px 20px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const timer1 = setTimeout(() => {
            if (countDepartment < 10) {
              setCountDepartment(countDepartment + 1);
            }
            if (countGap < 80) {
              setCountGap(countGap + 2);
            }
            if (countScient < 50) {
              setCountScient(countScient + 2);
            }
            if (countScienceDegree < 30) {
              setCountScienceDegree(countScienceDegree + 2);
            }
          }, 30);
          return () => clearTimeout(timer1);
        }
      });
    }, options);

    if (blockSliderNext.current) {
      observer.observe(blockSliderNext.current);
    }

    return () => {
      if (blockSliderNext.current) {
        observer.unobserve(blockSliderNext.current);
      }
    };
  }, [
    blockSliderNext,
    countDepartment,
    countGap,
    countScient,
    countScienceDegree,
  ]);

  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

function handleScroll() {
  const screenWidth = window.innerWidth;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const nameCompanyRect = nameCompanyRef.current.getBoundingClientRect();
  const thisBlockRect = thisBlockRef.current.getBoundingClientRect();

  if (scrollTop > thisBlockRect.top && screenWidth >= 1948) {
    const translateYValue = nameCompanyRect.height + 212;
    nameCompanyRef.current.style.transform = `translateY(${translateYValue}px)`;
    thisBlockRef.current.style.transform = `translateY(${translateYValue}px) translateX(143px) rotate(-90deg)`;
  } else if (scrollTop > thisBlockRect.top && screenWidth < 1948) {
    const translateYValue = nameCompanyRect.height + 212;
    nameCompanyRef.current.style.transform = `translateY(${translateYValue}px)`;
    thisBlockRef.current.style.transform = `translateY(${translateYValue}px) translateX(143px) rotate(-90deg)`;
  } else {
    nameCompanyRef.current.style.transform = 'none';
    thisBlockRef.current.style.transform = 'rotate(-180deg)';
  }
}


  
  return (
    <div className={styles.company_main}>
      <Company_Slider />
      <div ref={blockSlider} className={styles.underSlider_text_wrapper}>
        <span className={styles.span_underSlider_text1}>
          Самые крутые проекты! самой крутой командой
        </span>
        <span className={styles.span_underSlider_text2}>О компании</span>
        <div className={styles.div_counter_wrapper}>
          <div className={styles.container_text}>
            <div className={styles.div_underSlider_text}>
              <div className={styles.text_svg}>
                <img src={bracket} alt="bracket" />
              </div>
              <p>{countPercent}%</p>
            </div>
            <span className={styles.span_underSlider_text}>
              Объем работ выполняем собственными силами
            </span>
          </div>
          <div className={styles.container_text}>
            <div className={styles.div_underSlider_text}>
              <div className={styles.text_svg}>
                <img src={bracket} alt="bracket" />
              </div>
              <p>{countHuman}</p>
            </div>
            <span className={styles.span_underSlider_text}>
              Квалифицированных сотрудников
            </span>
          </div>
          <div className={styles.container_text}>
            <div className={styles.div_underSlider_text}>
              <div className={styles.text_svg}>
                <img src={bracket} alt="bracket" />
              </div>
              <p>{countProject}</p>
            </div>
            <span className={styles.span_underSlider_text}>
              Проектов реализовано
            </span>
          </div>
        </div>
      </div>
      <div className={styles.sliderMobile_wrapper}>
        <div className={styles.icon_partner}>
          <img src="./assets/D1.png" alt="logo" />
          <img src="./assets/D2.png" alt="logo" />
          <img src="./assets/D3.png" alt="logo" />
          <img src="./assets/D4.png" alt="logo" />
          <img src="./assets/D5.png" alt="logo" />
          <img src="./assets/D6.png" alt="logo" />
          <img src="./assets/D7.png" alt="logo" />
          <img src="./assets/D8.png" alt="logo" />
          <img src="./assets/D9.png" alt="logo" />
        </div>
        <SliderMobile />
      </div>
      <div className={styles.about_main}>
        <div className={styles.left_about}>
          <div ref={nameCompanyRef} className={styles.name_company}>
            MARKS GROUP
          </div>
          <div ref={thisBlockRef} className={styles.this_block}>
            &mdash; ЭТО
          </div>
        </div>
        <div className={styles.right_about}>
          <div className={styles.text_right_about}>
            <span>
              ГК MARKS GROUP создана на базе компании OОО «ПОДЗЕМ- ПРОЕКТ»,
              начавшей свою деятельность в 2005 году. Основателем является
              академик Ильичёв Вячеслав Александрович, более 20 лет занимавший
              пост директора НИИОСП им. Н.М. Герсеванова.
            </span>
            <br />
            <br />
            <span>
              Первым крупным объектом команды стал уникальный проект мирового
              уровня по расширению подземного пространства Государственного
              академического Большого Театра России (ГАБТ), г. Москва, где
              специалисты компании отвечали за разработку конструктивных
              решений.
            </span>
          </div>
          <div ref={blockSliderNext} className={styles.right_counter_wrapper}>
            <div className={styles.container_text_right}>
              <div className={styles.div_underSlider_text_right}>
                <div className={styles.text_svg_right}>
                  <img src={bracket_dark} alt="bracket_dark" />
                </div>
                <p className={styles.number}>{countDepartment}</p>
              </div>
              <span className={styles.span_underSlider_text_right}>
                Департаментов
              </span>
            </div>
            <div className={styles.container_text_right}>
              <div className={styles.div_underSlider_text_right}>
                <div className={styles.text_svg_right}>
                  <img src={bracket_dark} alt="bracket_dark" />
                </div>
                <p className={styles.number}>{countGap}</p>
              </div>
              <span className={styles.span_underSlider_text_right}>
                Проектов в качестве ГАП
              </span>
            </div>
            <div className={styles.container_text_right}>
              <div
                className={`${styles.div_underSlider_text_right} ${styles.div_underSlider_text_right_last}`}
              >
                <div className={styles.text_svg_right}>
                  <img src={bracket_dark} alt="bracket_dark" />
                </div>
                <p className={styles.number}>{countScient}</p>
              </div>
              <span className={styles.span_underSlider_text_right}>
                Научных работ
              </span>
            </div>
            <div className={styles.container_text_right}>
              <div
                className={`${styles.div_underSlider_text_right} ${styles.div_underSlider_text_right_last}`}
              >
                <div className={styles.text_svg_right}>
                  <img src={bracket_dark} alt="bracket_dark" />
                </div>
                <p className={styles.number}>{countScienceDegree}%</p>
              </div>
              <span className={styles.span_underSlider_text_right}>
                Сотрудников с научной степенью
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.company_group_name}>
        <span>Состав группы компаний</span>
        <div className={styles.plus_nine}>
          <img src={plusNine} alt="plus_nine" />
        </div>
      </div>
      <CompanyGroupSlider />
      <div className={styles.awards_wrapper}>Награды и премии</div>
      <div className={styles.list_project}>
        Список проектов, которые были отмечены конкурсами в разных номинациях за
        годы практики с 2005 года
      </div>
      <TableCompany />
      <div className={styles.specialist_wrapper}>
        <div className={styles.specialist}>Специалисты</div>
        <div className={styles.button_group}>
          <button className={styles.button_leader}>Руководство</button>
          <button className={styles.button_department}>
            Руководители отделов
          </button>
          <button className={styles.button_support}>
            Научно-техническое сопровождение
          </button>
          <button className={styles.button_hr}>HR</button>
        </div>
      </div>
      <div className={styles.card_container}>
        <ul>
          {staff &&
            staff.map((el) => (
              <li key={el.id} className={styles.container__item_stuff}>
                <div className={styles.container__item_title_stuff}>
                  {el.attributes.title}
                </div>
                <img
                  className={styles.add_container__img_stuff}
                  src={el.attributes.img}
                  alt={el.attributes.img}
                />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
