import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./Project.module.css";
import {
  setSelectedViewConstruction,
  setSelectedCity,
  getFetchFormFilter,
  getFetchFormCityFilter,
  getFetchFormLocationFilter,
} from "../store/Slice/projectSlice";
import Company_Slider from "../UI/Company_Slider/Company_Slider";
import { extractCityFromCountryCity, getUserGeolocation } from "./utils";
import "../UI/Company_Slider/Company_Slider.css";
import "../UI/ButtonsProjects/AllProjectsButton.module.css";
import { fetchToggleStateAsync } from "../store/Slice/toggleSlice";

const Host = process.env.REACT_APP_SERVER_HOST;

export default function Project() {
  const buttonChoose = [
    "Все",
    "Автодорожные",
    "Уникальные объекты",
    "Аэропорты",
    "Жилищное строительство",
    "Архитектура",
    "Концепция",
    "Адаптация концепций",
    "Дизайн-проекты",
    "Документация РП П",
    "Инженерия",
    "Подземные сооружения",
    "Линейные объекты",
    "Конструктив",
    "Научно-техническое сопровождение",
    "BIM",
  ];

  const buttonCity = [
    "Москва",
    "Санкт-Петербург",
    "Грозный",
    "Тюмень",
    "Омск",
    "Екатеринбург",
    "Уфа",
  ];

  const colors = {
    Архитектура: "#FF7F6A",
    BIM: "#75BBFD",
    Конструкции: "#566272",
    Дизайн: "#FAA8BD",
    Инженерия: "#90B734",
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("viewConstruction");

  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.projects);
  const selectedViewConstruction = useSelector(
    (state) => state.project.selectedViewConstruction
  );
  const selectedCity = useSelector((state) => state.project.selectedCity);
  const selectedLocation = useSelector(
    (state) => state.project.selectedLocation
  );
  const isActive = useSelector((state) => state.toggle.isActiveForButton1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isModalProjectOpen, setIsModalProjectOpen] = useState(false);
  const [userGeolocation, setUserGeolocation] = useState(null);
  const [isFocusedProject, setIsFocusedProject] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [value, setValue] = useState("");
  const addressInputRef = useRef(null);
  const [selectOnCompetencies, setSelectOnCompetencies] = useState(
    category || "Все"
  );
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [swiper, setSwiper] = useState(null);
  const navigate = useNavigate();

  const projectsPerPage = 100;
  const isMobileScreen = screenWidth <= 768;

  // console.log(projects);
  useEffect(() => {
    window.scrollTo(0, 0); // Прокрутите страницу вверх при монтировании компонента
  }, []);


  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    dispatch(setSelectedViewConstruction(category || "Все"));
    dispatch(getFetchFormFilter(projectsPerPage, selectedViewConstruction));
    dispatch(getFetchFormCityFilter(projectsPerPage, selectedCity));
    dispatch(getFetchFormLocationFilter(projectsPerPage, selectedLocation));
    dispatch(fetchToggleStateAsync());
    setLoading(false);
  }, [dispatch, projectsPerPage, location.search, category]);

  useEffect(() => {
    getUserGeolocation()
      .then((geolocation) => setUserGeolocation(geolocation))
      .catch((error) =>
        console.error("Ошибка при получении геопозиции:", error)
      );
  }, []);

  function handleFocus() {
    setIsFocusedProject(true);
  }

  function handleChange(event) {
    const address = event.target.value.toLowerCase();
    setValue(address);
    setIsValid(address === "");
    setIsTyping(true);
    setSelectOnCompetencies("");
    if (!address) {
      dispatch(setSelectedCity(""));
      setSelectOnCompetencies("Все");
    }
    // console.log(address);
  }

  const handleAddressSubmit = (event) => {
    event.preventDefault();
  };

  function handleBlur(event) {
    setIsFocusedProject(true);
    const address = event.target.value;
    if (!address) {
      setIsFocusedProject(false);
      dispatch(setSelectedCity(""));
    }
    setValue(address);
    setIsValid(isValid);
    dispatch(setSelectedCity(""));
    setSelectOnCompetencies("");
    if (value.trim() === "") {
      setSelectOnCompetencies("Все");
    }
  }

  const handleButtonClick = (viewConstruction) => {
    if (
      selectedCity !== "" ||
      selectedViewConstruction !== viewConstruction ||
      selectedViewConstruction === viewConstruction
    ) {
      dispatch(setSelectedCity(""));
      dispatch(setSelectedViewConstruction(viewConstruction));
      dispatch(
        getFetchFormFilter(currentPage, projectsPerPage, viewConstruction)
      );
    } else {
      dispatch(setSelectedCity(""));
      dispatch(setSelectedViewConstruction(""));
      dispatch(getFetchFormFilter(currentPage, projectsPerPage, ""));
    }
    setCurrentPage(1);
    setValue("");
    setIsTyping(false);
    setSelectOnCompetencies("");
  };

  const handleButtonCityClick = (countryCity) => {
    if (isTyping) {
      dispatch(setSelectedCity(""));
      setIsTyping(false);
    }
    dispatch(setSelectedCity(countryCity));
    dispatch(getFetchFormCityFilter(currentPage, projectsPerPage, countryCity));
    setCurrentPage(1);
    setSelectOnCompetencies("");
  };

  const handleSelectCityClick = (e) => {
    e.preventDefault();
    setIsModalProjectOpen(true);
    setValue("");
    setIsTyping(false);
    setSelectOnCompetencies("");
  };

  const handleModalClose = (e, viewConstruction) => {
    e.preventDefault();
    setIsModalProjectOpen(false);
    setSelectedViewConstruction(selectOnCompetencies);
    setSelectOnCompetencies("");
    setIsTyping(false);
    setIsFocusedProject(false);
    setIsValid(true);
    setSelectedCity("");
    if (selectOnCompetencies === viewConstruction) {
      setSelectedCity("");
    }
    if (value.trim() === "") {
      setSelectOnCompetencies("Все");
    }
    dispatch(
      setSelectedViewConstruction(selectOnCompetencies === viewConstruction)
    );
  };

  const currentLocation = userGeolocation
    ? `${userGeolocation.latitude}, ${userGeolocation.longitude}`
    : "Москва";

  const handleScroll = () => {
    const isAtBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight;

    if (isAtBottom && !loading) {
      loadMoreProjects();
    }
  };

  const loadMoreProjects = async () => {
    setLoading(true);
    setCurrentPage((prev) => prev + 1);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const filteredProjects = projects
    .filter((project) =>
      selectOnCompetencies === "Все"
        ? true
        : project.viewConstruction?.includes(selectOnCompetencies)
    )
    .filter((project) => {
      const projectCity = extractCityFromCountryCity(project.countryCity);
      return selectedCity === "" ? true : projectCity === selectedCity;
    })
    .filter((project) => {
      const searchValue = value?.toLowerCase();
      const projectLocation = project.location?.toLowerCase();
      const projectCity = extractCityFromCountryCity(
        project.countryCity
      )?.toLowerCase();
      return (
        projectLocation?.includes(searchValue) &&
        (selectedCity === "" || projectCity === selectedCity?.toLowerCase())
      );
    });

  // console.log(filteredProjects, "9999999999999999999999999999999999");

  return (
    <>
    <Helmet>
    <title>Marks Group</title>
  </Helmet>
    <div className={styles.project_main}>
      <Company_Slider />
      <div className={styles.project_slider_text}>
        <p className={styles.actuality_text}>
          {/* Актуальные кейсы MARKS GROUP */}
          </p>
        <span className={styles.projects_name_text}>Проекты</span>
      </div>
      {screenWidth && (
        <div
          onSubmit={handleAddressSubmit}
          className={styles.searchCityAddress_wrapper}
        >
          <div className={styles.searchCityAddress_location_project_group}>
            <label
              className={`${styles.searchCityAddress_label_project} ${
                isFocusedProject ? styles.focused : ""
              }`}
            >
              <input
                id="text-input"
                ref={addressInputRef}
                className={styles.address_and_city_choose_location}
                type="address"
                value={value}
                onFocus={handleFocus}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength="50"
                size="60"
                required
                autoComplete="off"
              />
              <div className={styles.line_modal_project}></div>
              <div className={styles.placeholder_modal_project}>
                <div className={styles.lupa_svg_modal_project}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="Frame 4665" clipPath="url(#clip0_3684_1098)">
                      <g id="Group 5">
                        <path
                          id="Union"
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12.9219 6.7676C12.9219 9.67654 10.5637 12.0347 7.6548 12.0347C4.74586 12.0347 2.3877 9.67654 2.3877 6.7676C2.3877 3.85865 4.74586 1.50049 7.6548 1.50049C10.5637 1.50049 12.9219 3.85865 12.9219 6.7676ZM10.7887 12.7669C9.85175 13.2573 8.78567 13.5347 7.6548 13.5347C3.91743 13.5347 0.887695 10.505 0.887695 6.7676C0.887695 3.03023 3.91743 0.000488281 7.6548 0.000488281C11.3922 0.000488281 14.4219 3.03023 14.4219 6.7676C14.4219 8.82566 13.5032 10.6691 12.0535 11.9103L14.7265 14.5833C15.0194 14.8762 15.0194 15.3511 14.7265 15.644C14.4336 15.9369 13.9587 15.9369 13.6658 15.644L10.7887 12.7669Z"
                          fill="#959DA6"
                        />
                      </g>
                    </g>
                    <defs>
                      <clipPath id="clip0_3684_1098">
                        <rect
                          width="16"
                          height="16"
                          fill="white"
                          transform="translate(0 0.000488281)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <p className={styles.text_placeholder_modal_project}>
                  Ведите адрес или город
                </p>
              </div>
            </label>
          </div>
        </div>
      )}
      {screenWidth && (
        <Swiper
          onSwiper={setSwiper}
          slidesPerView="auto"
          spaceBetween={8}
          className={styles.my_swiper2_button_group_project}
          touch="true"
        >
          <div className={styles.button_group_project}>
            {buttonChoose &&
              buttonChoose?.map((el, index) => (
                <SwiperSlide
                  key={el}
                  onClick={() => handleButtonClick(el)}
                  className={`${styles.menu__button__allProject} ${
                    !isModalProjectOpen &&
                    (el === selectedViewConstruction ||
                      (index === 0 && !selectedViewConstruction))
                      ? styles.active
                      : ""
                  }`}
                  style={{ width: "fit-content" }}
                >
                  <p type="button" className={styles.menu_button_items}>
                    {el}
                  </p>
                </SwiperSlide>
              ))}
          </div>
        </Swiper>
      )}
      {/* этот isActive скрывает фильтрацию  */}
      {!isActive && (
        <div className={styles.menu_button_group_project_wrapper_main}>
          <div className={styles.menu_button_group_project_wrapper}>
            <div className={styles.menu_button_group_project}>
              {buttonChoose.map((el, index) => (
                <div
                  key={el}
                  className={`${styles.button_wrapper} ${
                    showButton ? "" : index ? styles.hidden : ""
                  }`}
                >
                  <button
                    className={`${styles.menu__button__allProject} ${
                      !isModalProjectOpen &&
                      (el === selectedViewConstruction ||
                        (index === 0 && !selectedViewConstruction))
                        ? styles.active
                        : ""
                    }`}
                    onClick={() => handleButtonClick(el)}
                  >
                    <p className={styles.menu_button_items}>{el}</p>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            className={styles.menu__button__choose__city}
            onClick={handleSelectCityClick}
          >
            <div className={styles.icon__svg_button__choose__city}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="icon">
                  <path
                    id="Vector"
                    d="M8.00016 7.66665C7.55814 7.66665 7.13421 7.49105 6.82165 7.17849C6.50909 6.86593 6.3335 6.44201 6.3335 5.99998C6.3335 5.55795 6.50909 5.13403 6.82165 4.82147C7.13421 4.50891 7.55814 4.33331 8.00016 4.33331C8.44219 4.33331 8.86611 4.50891 9.17867 4.82147C9.49123 5.13403 9.66683 5.55795 9.66683 5.99998C9.66683 6.21885 9.62372 6.43558 9.53996 6.63779C9.4562 6.83999 9.33344 7.02373 9.17867 7.17849C9.02391 7.33326 8.84018 7.45602 8.63797 7.53978C8.43576 7.62354 8.21903 7.66665 8.00016 7.66665ZM8.00016 1.33331C6.76249 1.33331 5.5755 1.82498 4.70033 2.70015C3.82516 3.57532 3.3335 4.7623 3.3335 5.99998C3.3335 9.49998 8.00016 14.6666 8.00016 14.6666C8.00016 14.6666 12.6668 9.49998 12.6668 5.99998C12.6668 4.7623 12.1752 3.57532 11.3 2.70015C10.4248 1.82498 9.23784 1.33331 8.00016 1.33331Z"
                    fill="#1D2E43"
                  />
                </g>
              </svg>
            </div>
            <div className={styles.button_choose_city}>Выбрать город</div>
          </button>
        </div>
      )}
      <Modal
        className={styles.modal_wrapper_project_location}
        modal={document.querySelector(".modal")}
        modalStyleZIndex={9999}
        isOpen={isModalProjectOpen}
        onRequestClose={(e) => {
          handleModalClose(e, selectOnCompetencies);
        }}
        onAfterOpen={() => {
          setIsModalProjectOpen(true);
          document.body.style.overflow = "hidden";
          document.body.classList.add("modal-open");
        }}
        onAfterClose={() => {
          document.body.style.overflow = "";
          document.body.classList.remove("modal-open");
        }}
        ariaHideApp={false}
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
        <div
          onClick={(e) => {
            handleModalClose(e, selectOnCompetencies);
          }}
          className={`${styles.modal_project_close} ${styles.fixed_modal_project}`}
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
        <div className={styles.modal_project_container}>
          <div className={styles.modal_project_description}>
            Вы здесь:
            <div className={styles.modal_pointer_location}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="icon / 24 / mdi:map-marker">
                  <path
                    id="Vector"
                    d="M14.0002 13.4172C13.2266 13.4172 12.4847 13.1099 11.9378 12.5629C11.3908 12.0159 11.0835 11.2741 11.0835 10.5005C11.0835 9.72698 11.3908 8.98512 11.9378 8.43813C12.4847 7.89115 13.2266 7.58386 14.0002 7.58386C14.7737 7.58386 15.5156 7.89115 16.0626 8.43813C16.6095 8.98512 16.9168 9.72698 16.9168 10.5005C16.9168 10.8836 16.8414 11.2628 16.6948 11.6167C16.5482 11.9706 16.3334 12.2921 16.0626 12.5629C15.7917 12.8338 15.4702 13.0486 15.1163 13.1952C14.7625 13.3418 14.3832 13.4172 14.0002 13.4172ZM14.0002 2.33386C11.8342 2.33386 9.757 3.19428 8.22546 4.72582C6.69391 6.25737 5.8335 8.33459 5.8335 10.5005C5.8335 16.6255 14.0002 25.6672 14.0002 25.6672C14.0002 25.6672 22.1668 16.6255 22.1668 10.5005C22.1668 8.33459 21.3064 6.25737 19.7749 4.72582C18.2433 3.19428 16.1661 2.33386 14.0002 2.33386Z"
                    fill="#1D2E43"
                  />
                </g>
              </svg>
            </div>
          </div>
          <div className={styles.modal_project_city_location}>
            {currentLocation}
          </div>
        </div>
        <form onSubmit={handleAddressSubmit}>
          <div className={styles.location_project_group}>
            <label
              className={`${styles.label_project} ${
                isFocusedProject ? styles.focused : ""
              }`}
            >
              <input
                id="text-input"
                ref={addressInputRef}
                className={styles.address_and_city_choose_location}
                type="address"
                value={value}
                onFocus={handleFocus}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength="50"
                size="60"
                required
                autoComplete="off"
              />
              <div className={styles.line_modal_project}></div>
              <div className={styles.placeholder_modal_project}>
                <div className={styles.lupa_svg_modal_project}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="Frame 4665" clipPath="url(#clip0_3684_1098)">
                      <g id="Group 5">
                        <path
                          id="Union"
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12.9219 6.7676C12.9219 9.67654 10.5637 12.0347 7.6548 12.0347C4.74586 12.0347 2.3877 9.67654 2.3877 6.7676C2.3877 3.85865 4.74586 1.50049 7.6548 1.50049C10.5637 1.50049 12.9219 3.85865 12.9219 6.7676ZM10.7887 12.7669C9.85175 13.2573 8.78567 13.5347 7.6548 13.5347C3.91743 13.5347 0.887695 10.505 0.887695 6.7676C0.887695 3.03023 3.91743 0.000488281 7.6548 0.000488281C11.3922 0.000488281 14.4219 3.03023 14.4219 6.7676C14.4219 8.82566 13.5032 10.6691 12.0535 11.9103L14.7265 14.5833C15.0194 14.8762 15.0194 15.3511 14.7265 15.644C14.4336 15.9369 13.9587 15.9369 13.6658 15.644L10.7887 12.7669Z"
                          fill="#959DA6"
                        />
                      </g>
                    </g>
                    <defs>
                      <clipPath id="clip0_3684_1098">
                        <rect
                          width="16"
                          height="16"
                          fill="white"
                          transform="translate(0 0.000488281)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <p className={styles.text_placeholder_modal_project}>
                  Ведите адрес или город
                </p>
              </div>
            </label>
          </div>
        </form>
        <div className={styles.text_object_modal_project}>
          Наши объекты есть
        </div>
        <div className={styles.modal_project_button_group}>
          {buttonCity.map((el) => (
            <div key={el} className={styles.button_modal_project_wrapper}>
              <button
                className={`${styles.menu__button__modal__project} ${
                  el === selectedCity ? styles.active : ""
                }`}
                onClick={() => handleButtonCityClick(el)}
                disabled={!isValid}
                style={{
                  backgroundColor: !isValid ? "#959DA6" : "",
                  pointerEvents: !isValid ? "none" : "auto",
                  opacity: !isValid ? 0.6 : 1,
                }}
              >
                <p className={styles.menu_button_items}>{el}</p>
              </button>
            </div>
          ))}
        </div>
      </Modal>
      <section className={styles.section_project}>
        <div className={styles.section_project__block}>
          {filteredProjects &&
            filteredProjects?.map((project) => {
              if (!project) {
                return null;
              }

              return (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className={styles.section_project__block_cart}
                >
                  <div
                    className={styles.cart_project}
                    // style={{
                    //   height: `${project.style?.split(",")[1]}rem`,
                    //   width: `${project.style?.split(",")[0]}rem`,
                    // }}
                  >
                    <div className={styles.cart_project__container}>
                      <img
                        className={styles.cart_project__img}
                        // style={{
                        //   height: `${project.style?.split(",")[1]}rem`,
                        //   width: `${project.style?.split(",")[0]}rem`,
                        //   }}
                        src={`${Host}/images/imageAdd/${
                          project.imageProject
                            ? project.imageProject
                            : project.imageTitle
                        }`}
                        alt={
                          project.imageProject
                            ? project.imageProject
                            : project.imageTitle
                        }
                      />
                      <div className={styles.project_content__wrapper}>
                        <div
                          className={
                            styles.container_wrapper_title_city_data_block
                          }
                        >
                          <div className={styles.cart_project_title}>
                            {project.title}
                          </div>
                          <div className={styles.cart_project__address}>
                            {project.countryCity}{" "}
                            <div className={styles.cart_project__address__svg}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="2"
                                height="2"
                                viewBox="0 0 2 2"
                                fill="none"
                              >
                                <circle cx="1" cy="1" r="1" fill="#959DA6" />
                              </svg>{" "}
                            </div>
                            {project.monthYear}
                          </div>
                        </div>
                        <div className={styles.cart_project__content}>
                          <div className={styles.cart_project__widget}>
                            {(() => {
                              try {
                                const selectCompetencies = JSON.parse(
                                  project.selectCompetencies
                                );

                                return selectCompetencies.map((competency) => (
                                  <div
                                    key={competency.value}
                                    className={
                                      styles.el_project_selectCompetencies
                                    }
                                    style={{
                                      color: colors[competency.value],
                                      borderColor: colors[competency.value],
                                      border: "1px solid",
                                      padding: "3px 6px",
                                      borderRadius: "34px",
                                    }}
                                  >
                                    {competency.label}
                                  </div>
                                ));
                              } catch (error) {
                                if (
                                  typeof project.selectCompetencies === "string"
                                ) {
                                  if (
                                    !project.selectCompetencies.includes(",")
                                  ) {
                                    const label =
                                      project.selectCompetencies.trim();
                                    return (
                                      <div
                                        key={label}
                                        className={
                                          styles.el_project_selectCompetencies
                                        }
                                        style={{
                                          color: colors[label],
                                          borderColor: colors[label],
                                          border: "1px solid",
                                          padding: "3px 6px",
                                          borderRadius: "34px",
                                        }}
                                      >
                                        {label}
                                      </div>
                                    );
                                  } else {
                                    return project.selectCompetencies
                                      .split(",")
                                      .map((value) => {
                                        const label = value.trim();
                                        return (
                                          <div
                                            key={value}
                                            className={
                                              styles.el_project_selectCompetencies
                                            }
                                            style={{
                                              color: colors[value],
                                              borderColor: colors[value],
                                              border: "1px solid",
                                              padding: "3px 6px",
                                              borderRadius: "34px",
                                            }}
                                          >
                                            {label}
                                          </div>
                                        );
                                      });
                                  }
                                }
                                return null;
                              }
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </section>
    </div>
    </>
  );
}
