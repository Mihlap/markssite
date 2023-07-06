import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { useInView } from "react-intersection-observer";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Company.module.css";
import Company_Slider from "../UI/Company_Slider/Company_Slider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

import SliderMobile from "../UI/SliderHeader/SliderMobile";
import TableCompany from "../UI/TableCompany/TableCompany";
import TableCompanyMobile from "../UI/TableCompany/TableCompanyMobile";
import {
  incrementDepartment,
  incrementGap,
  incrementScient,
  incrementScienceDegree,
} from "../store/Slice/counterSlice";

import {
  fetchCategoryStaff,
  selectCard,
  setCategoryId,
} from "../store/Slice/StaffSlice";
import LoadingCircle from "../Loading/LoadingCircle";
import Error from "../Loading/Error/Error";

import bracket from "../icons/bracket.svg";
import bracket_dark from "../icons/bracket_dark.svg";
import plusNine from "../icons/+9.svg";
import CompanyFormContacts from "../UI/CompanyFormContacts/CompanyFormContacts";
import CompanySubscriptionForm from "../UI/CompanySubscriptionForm/CompanySubscriptionForm";
import CounterCompanyMobile from "../UI/CounterCompanyMobile";
import CounterCompanyMobile2 from "../UI/CounterCompanyMobile2";
import CompanyGroupSlider from "../UI/CompanyGroupSlider/CompanyGroupSlider";

export default function Company() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [countPercent, setCountPercent] = useState(0);
  const [countHuman, setCountHuman] = useState(0);
  const [countProject, setCountProject] = useState(0);
  const [swiper, setSwiper] = useState(null);

  const [showCards, setShowCards] = useState(false);
  const [activeButton, setActiveButton] = useState("Руководство");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);

  const blockSlider = useRef(null);
  const nameCompanyRef = useRef(null);
  const thisBlockRef = useRef(null);
  // const [currentCard, setCurrentCard] = useState(0);
  // const sliderRefCard = useRef(null);

  const dispatch = useDispatch();
  const { selectedCard, categoryId, staff, loading, error } = useSelector(
    (state) => state.staff
  );
  const countDepartment = useSelector((state) => state.counter.countDepartment);
  const countGap = useSelector((state) => state.counter.countGap);
  const countScient = useSelector((state) => state.counter.countScient);
  const countScienceDegree = useSelector(
    (state) => state.counter.countScienceDegree
  );

  const [ref, inView] = useInView({
    threshold: 0.5,
  });

  const isMobile = windowWidth <= 767;

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (error) {
      return (
        <div>
          {" "}
          <Error error={error.message} />
        </div>
      );
    }
    // setTimeout(() => {
      dispatch(selectCard(selectedCardId));
      dispatch(fetchCategoryStaff(categoryId));
      setShowCards(true);
    // }, 100);
  }, []);

  const handleButtonClick = (categoryId, selectedCardId) => {
    if (selectedCardId) {
      dispatch(selectCard(selectedCardId));
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
      setSelectedCardId(null);
      dispatch(fetchCategoryStaff(categoryId));
      setActiveButton(categoryId);
      dispatch(setCategoryId(categoryId));
    }
  };

  

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
    if (inView) {
      let timer1;
      timer1 = setTimeout(() => {
        dispatch(incrementDepartment());
        dispatch(incrementGap());
        dispatch(incrementScient());
        dispatch(incrementScienceDegree());
      }, 30);
      return () => clearTimeout(timer1);
    }
  }, [
    dispatch,
    countDepartment,
    countGap,
    countScient,
    countScienceDegree,
    inView,
  ]);

  useEffect(() => {
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
    function handleScroll() {
      if (nameCompanyRef.current && thisBlockRef.current) {
        const nameCompanyRect = nameCompanyRef.current.getBoundingClientRect();
        const thisBlockRect = thisBlockRef.current.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > thisBlockRect.top && screenWidth >= 2000) {
          const translateYValue = nameCompanyRect.height + 112;
          nameCompanyRef.current.style.transform = `translateY(${translateYValue}px)`;
          thisBlockRef.current.style.transform = `translateY(240px) translateX(-50px) rotate(-90deg)`;
        } else if (
          scrollTop > thisBlockRect.top &&
          screenWidth < 1999 &&
          screenWidth >= 1480
        ) {
          const translateYValue = nameCompanyRect.height + 212;
          nameCompanyRef.current.style.transform = `translateY(${translateYValue}px)`;
          thisBlockRef.current.style.transform = `translateY(260px) translateX(40px) rotate(-90deg)`;
        } else if (scrollTop > thisBlockRect.top && screenWidth < 1480) {
          const translateYValue = nameCompanyRect.height + 262;
          nameCompanyRef.current.style.transform = `translateY(${translateYValue}px)`;
          thisBlockRef.current.style.transform = `translateY(280px) translateX(80px) rotate(-90deg)`;
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



  return (
    <div className={styles.company_main}>
      <Company_Slider />
      <div ref={blockSlider} className={styles.underSlider_text_wrapper}>
        <span className={styles.span_underSlider_text1}>
          Самые крутые проекты! самой крутой командой
        </span>
        <span className={styles.span_underSlider_text2}>О компании</span>
        {isMobile && <CounterCompanyMobile />}
        {!isMobile && (
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
        )}
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
        <div className={styles.left_about_mobile}>
          <div className={styles.name_company}>MARKS GROUP</div>
          <div className={styles.this_block}>&mdash; ЭТО</div>
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
          <div className={styles.main_counter_wrapper}>
            {isMobile && <CounterCompanyMobile2 />}
          </div>
          {!isMobile && (
            <div ref={ref} className={styles.right_counter_wrapper}>
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
          )}
        </div>
      </div>
      <div className={styles.company_group_name}>
        Состав группы компаний
        <p className={styles.plus_nine} style={{ verticalAlign: "top" }}>
          <img src={plusNine} alt="plus_nine" />
        </p>
      </div>
      <div className={styles.company_group_slider}>
        <CompanyGroupSlider />
      </div>
      <div className={styles.awards_wrapper}>
        Награды и премии
        <div className={styles.years_div}>/2005-2022/</div>
      </div>
      <div className={styles.list_project}>
        Список проектов, которые были отмечены конкурсами в разных номинациях за
        годы практики с 2005 года
      </div>
      {isMobile && <TableCompanyMobile />}
      {!isMobile && <TableCompany />}
      <div className={styles.specialist_wrapper}>
        <div className={styles.specialist}>Специалисты</div>
        {isMobile && (
          <Swiper
            onSwiper={setSwiper}
            slidesPerView="auto"
            spaceBetween={0}
            pagination={{
              clickable: true,
            }}
            className={styles.my_swiper_button_group}
            touch="true"
          >
            <div className={styles.button_group}>
              <SwiperSlide
                className={` ${styles.button_hover} ${
                  activeButton === "Руководство" ? styles.active : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick("Руководство");
                }}
                style={{ width: "fit-content" }}
              >
                <p type="button">Руководство</p>
              </SwiperSlide>
              <SwiperSlide
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick("Руководители отделов");
                }}
                className={` ${styles.button_hover} ${
                  activeButton === "Руководители отделов" ? styles.active : ""
                }`}
                style={{ width: "fit-content" }}
              >
                <p type="button">Руководители отделов</p>
              </SwiperSlide>
              <SwiperSlide
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick("Научно-техническое сопровождение");
                }}
                className={` ${styles.button_hover} ${
                  activeButton === "Научно-техническое сопровождение"
                    ? styles.active
                    : ""
                }`}
                style={{ width: "fit-content" }}
              >
                <p type="button">Научно-техническое сопровождение</p>
              </SwiperSlide>
              <SwiperSlide
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick("HR");
                }}
                className={` ${styles.button_hover} ${
                  activeButton === "HR" ? styles.active : ""
                }`}
                style={{ width: "fit-content" }}
              >
                <p type="button">HR</p>
              </SwiperSlide>
            </div>
          </Swiper>
        )}
        {!isMobile && (
          <div className={styles.button_group}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleButtonClick("Руководство");
              }}
              className={`${styles.button_leader} ${styles.button_hover} ${
                activeButton === "Руководство" ? styles.active : ""
              }`}
            >
              Руководство
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleButtonClick("Руководители отделов");
              }}
              className={`${styles.button_department} ${styles.button_hover} ${
                activeButton === "Руководители отделов" ? styles.active : ""
              }`}
            >
              Руководители отделов
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleButtonClick("Научно-техническое сопровождение");
              }}
              className={`${styles.button_support} ${styles.button_hover} ${
                activeButton === "Научно-техническое сопровождение"
                  ? styles.active
                  : ""
              }`}
            >
              Научно-техническое сопровождение
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleButtonClick("HR");
              }}
              className={`${styles.button_hr} ${styles.button_hover} ${
                activeButton === "HR" ? styles.active : ""
              }`}
            >
              HR
            </button>
          </div>
        )}
      </div>
      <div
        className={styles.card_container}
        style={{ opacity: showCards ? 1 : 0 }}
      >
        <ul className={styles.card_container_ul}>
          {staff &&
            staff?.map((el) => (
              <li
                key={el.id}
                {...el}
                className={styles.container__item_stuff}
                onClick={() => handleButtonClick(el, el.id)}
              >
                <div className={styles.wrapper_container_item_stuff}>
                {el.attributes && el.attributes.img && (
                  <img
                    className={styles.container__img_stuff}
                    src={el.attributes.img}
                    alt={el.attributes.img}
                  />
                  )}
                </div>
                <div className={styles.container__item_name_stuff}>
                  {el.attributes.name}
                </div>
                <div className={styles.container__item_position_stuff}>
                  {el.attributes.position}
                </div>
              </li>
            ))}
          {isModalOpen && selectedCard && (
            <Modal
              className={styles.modal_wrapper}
              const
              modal={document.querySelector(".modal")}
              modalStyleZIndex={9999}
              isOpen={isModalOpen}
              onRequestClose={() => {
                setSelectedCardId(null);
                setIsModalOpen(false);
              }}
              onAfterOpen={() => {
                setIsModalOpen(true);
                document.body.style.overflow = "hidden";
                document.body.classList.add("modal-open");
              }}
              onAfterClose={() => {
                document.body.style.overflow = "";
                document.body.classList.remove("modal-open");
              }}
              ariaHideApp={false}
              categoryId={categoryId}
              style={{
                overlay: {
                  zIndex: 9999,
                  backgroundColor: "#2C3B447A",
                },
                content: {
                  zIndex: 9999,
                },
              }}
            >
              {selectedCard && (
                <div key={selectedCard.id} className={styles.modal_context}>
                  <div
                    className={`${styles.modal_close} ${styles.fixed}`}
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedCardId(null);
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.00025 8.70733L0.707107 16.0005L0 15.2934L7.29314 8.00023L2.41697e-05 0.707107L0.707131 0L8.00025 7.29312L15.2934 0L16.0005 0.707107L8.70736 8.00023L16.0005 15.2934L15.2934 16.0005L8.00025 8.70733Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  <div className={styles.modal_container}>
                    <div className={styles.modal}>
                      <img
                        className={styles.modal_img_stuff}
                        src={selectedCard.attributes.img}
                        alt={selectedCard.attributes.img}
                      />
                    </div>
                  </div>
                  <div className={styles.modal_name_stuff}>
                    {selectedCard.attributes.name}
                  </div>
                  <div className={styles.modal_description_stuff}>
                    {selectedCard.attributes.description}
                  </div>
                  <div className={styles.modal_about_stuff}>
                    {selectedCard.attributes.about}
                  </div>
                  <div className={styles.modal_about_stuff1}>
                    {selectedCard.attributes.about1}
                  </div>
                  <div className={styles.modal_about_stuff2}>
                    {selectedCard.attributes.about2}
                  </div>
                  <div className={styles.modal_about_stuff3}>
                    {selectedCard.attributes.about3}
                  </div>
                  <div className={styles.modal_about_stuff4}>
                    {selectedCard.attributes.about4}
                  </div>
                  <div className={styles.modal_about_stuff5}>
                    {selectedCard.attributes.about5}
                  </div>
                </div>
              )}
            </Modal>
          )}
        </ul>
      </div>
      {isMobile && (
        <div className={styles.slider_card_wrapper}>
          <Swiper
            className={styles.slider_card_container}
            loop={true}
            slidesPerView={2}
            spaceBetween={0}
            touch="true"
          >
            {staff?.map((el) => (
              <SwiperSlide
                key={el.id}
                className={styles.slide_container_item_stuff}
                onClick={() => handleButtonClick(el, el.id)}
              >
                <div className={styles.wrapper_container_item_stuff}>
                  <img
                    className={styles.container__img_stuff}
                    src={el.attributes.img}
                    alt={el.attributes.img}
                  />
                </div>
                <div className={styles.container__item_name_stuff}>
                  {el.attributes.name}
                </div>
                <div className={styles.container__item_position_stuff}>
                  {el.attributes.position}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      {!isMobile && (
        <div className={styles.slider_card_wrapper}>
          <Swiper
            className={styles.slider_card_container}
            loop={true}
            slidesPerView={3}
            spaceBetween={0}
            touch="true"
          >
            {staff?.map((el) => (
              <SwiperSlide
                key={el.id}
                className={styles.slide_container_item_stuff}
                onClick={() => handleButtonClick(el, el.id)}
              >
                <div className={styles.wrapper_container_item_stuff}>
                  <img
                    className={styles.container__img_stuff}
                    src={el.attributes.img}
                    alt={el.attributes.img}
                  />
                </div>
                <div className={styles.container__item_name_stuff}>
                  {el.attributes.name}
                </div>
                <div className={styles.container__item_position_stuff}>
                  {el.attributes.position}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      <div className={styles.fon}>
        <div className={styles.form_wrapper}>
          <div className={styles.company_form_contacts_wrapper}>
            <CompanyFormContacts />
          </div>
          <div className={styles.companySubscriptionForm_wrapper}>
            <CompanySubscriptionForm />
          </div>
        </div>
      </div>
    </div>
  );
}
