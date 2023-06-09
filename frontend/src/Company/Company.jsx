import React, { useEffect, useRef, useState } from "react";
import styles from "./Company.module.css";
import Company_Slider from "../UI/Company_Slider/Company_Slider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SliderMobile from "../UI/SliderHeader/SliderMobile";
import CompanyGroupSlider from "../UI/CompanyGroupSlider/CompanyGroupSlider";
import TableCompany from "../UI/TableCompany/TableCompany";

import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryStaff } from "../store/Slice/StaffSlice";
import LoadingCircle from "../Loading/LoadingCircle";
import Error from "../Loading/Error/Error";

import bracket from "../icons/bracket.svg";
import bracket_dark from "../icons/bracket_dark.svg";
import plusNine from "../icons/+9.svg";
import CompanyFormContacts from "../UI/CompanyFormContacts/CompanyFormContacts";
import CompanySubscriptionForm from "../UI/CompanySubscriptionForm/CompanySubscriptionForm";

export default function Company() {
  const [countPercent, setCountPercent] = useState(0);
  const [countHuman, setCountHuman] = useState(0);
  const [countProject, setCountProject] = useState(0);

  const [countDepartment, setCountDepartment] = useState(0);
  const [countGap, setCountGap] = useState(0);
  const [countScient, setCountScient] = useState(0);
  const [countScienceDegree, setCountScienceDegree] = useState(0);
  const [showCards, setShowCards] = useState(false);
  const [activeButton, setActiveButton] = useState("Руководство");

  const blockSlider = useRef(null);
  const blockSliderNext = useRef(null);
  const nameCompanyRef = useRef(null);
  const thisBlockRef = useRef(null);

  const dispatch = useDispatch();
  const { categoryId, staff, loading, error } = useSelector(
    (state) => state.staff
  );

  const handleButtonClick = (categoryId) => {
    setActiveButton(categoryId);
    dispatch(fetchCategoryStaff(categoryId));
  };

  useEffect(() => {
    setTimeout(() => {
      dispatch(fetchCategoryStaff(categoryId));
      setShowCards(true);
    }, 100);
  }, [dispatch, categoryId]);

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
    function handleScroll() {
      if (nameCompanyRef.current && thisBlockRef.current) {
        const nameCompanyRect = nameCompanyRef.current.getBoundingClientRect();
        const thisBlockRect = thisBlockRef.current.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > thisBlockRect.top && screenWidth >= 1948) {
          const translateYValue = nameCompanyRect.height + 212;
          nameCompanyRef.current.style.transform = `translateY(${translateYValue}px)`;
          thisBlockRef.current.style.transform = `translateY(${translateYValue}px) translateX(143px) rotate(-90deg)`;
        } else if (scrollTop > thisBlockRect.top && screenWidth < 1948) {
          const translateYValue = nameCompanyRect.height + 212;
          nameCompanyRef.current.style.transform = `translateY(${translateYValue}px)`;
          thisBlockRef.current.style.transform = `translateY(${translateYValue}px) translateX(143px) rotate(-90deg)`;
        } else {
          nameCompanyRef.current.style.transform = "none";
          thisBlockRef.current.style.transform = "rotate(-180deg)";
        }
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (loading) {
    return <LoadingCircle />;
  }

  if (error) {
    return (
      <div>
        {" "}
        <Error error={error} />
      </div>
    );
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
          <button
            onClick={() => handleButtonClick("Руководство")}
            className={`${styles.button_leader} ${styles.button_hover} ${
              activeButton === "Руководство" ? styles.active : ""
            }`}
          >
            Руководство
          </button>
          <button
            onClick={() => handleButtonClick("Руководители отделов")}
            className={`${styles.button_department} ${styles.button_hover} ${
              activeButton === "Руководители отделов" ? styles.active : ""
            }`}
          >
            Руководители отделов
          </button>
          <button
            onClick={() =>
              handleButtonClick("Научно-техническое сопровождение")
            }
            className={`${styles.button_support} ${styles.button_hover} ${
              activeButton === "Научно-техническое сопровождение"
                ? styles.active
                : ""
            }`}
          >
            Научно-техническое сопровождение
          </button>
          <button
            onClick={() => handleButtonClick("HR")}
            className={`${styles.button_hr} ${styles.button_hover} ${
              activeButton === "HR" ? styles.active : ""
            }`}
          >
            HR
          </button>
        </div>
      </div>
      <div
        className={styles.card_container}
        style={{ opacity: showCards ? 1 : 0 }}
      >
        <ul className={styles.card_container_ul}>
          {staff &&
            staff?.map((el) => (
              <li key={el.id} {...el} className={styles.container__item_stuff}>
                <img
                  className={styles.container__img_stuff}
                  src={el.attributes.img}
                  alt={el.attributes.img}
                />
                <div className={styles.container__item_name_stuff}>
                  {el.attributes.name}
                </div>
                <div className={styles.container__item_position_stuff}>
                  {el.attributes.position}
                </div>
              </li>
            ))}
        </ul>
      </div>
      <div className={styles.fon}>
        <div className={styles.form_wrapper}>
          <CompanyFormContacts />
          <CompanySubscriptionForm />
        </div>
      </div>
    </div>
  );
}
