import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import Modal from 'react-modal';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Company.module.css';
import gsap from 'gsap';
import { Helmet } from 'react-helmet-async';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
// import SliderMobile from '../UI/SliderHeader/SliderMobile';
import SliderHeader from '../UI/SliderHeader/SliderHeader';
import TableCompany from '../UI/TableCompany/TableCompany';
import TableCompanyMobile from '../UI/TableCompany/TableCompanyMobile';
import {
  incrementDepartment,
  incrementGap,
  incrementScient,
  incrementScienceDegree,
} from '../store/Slice/counterSlice';

import { fetchCategoryStaff, selectCard, setCategory } from '../store/Slice/StaffSlice';
import LoadingCircle from '../Loading/LoadingCircle';
import Error from '../Loading/Error/Error';

import bracket from '../icons/bracket.svg';
import bracket_dark from '../icons/bracket_dark.svg';
import CompanyFormContacts from '../UI/CompanyFormContacts/CompanyFormContacts';
// import CompanySubscriptionForm from '../UI/CompanySubscriptionForm/CompanySubscriptionForm';
import CounterCompanyMobile from '../UI/CounterCompanyMobile';
import CounterCompanyMobile2 from '../UI/CounterCompanyMobile2';
// import CompanyGroupSlider from "./CompanyGroupSlider/CompanyGroupSlider";
import CompanySlider from './CompanySlider/CompanySlider';
import ModalVacancyFormSend from '../UI/VacancyFormContact/ModalVacancyFormSend';
import SkeletonLoader from './SkeletonLoader/SkeletonLoader';
import SkeletonLoaderSlider from './SkeletonLoader/SkeletonLoaderSlider ';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

export default function Company({ handleMouseEnter, handleMouseLeave, handleMouseHover }) {
  const videoSource = useMemo(
    () => ({
      large: `${bucket_url}/images/video/company_full.mp4`,
      medium: `${bucket_url}/images/video/company_ipad.mp4`,
      small: `${bucket_url}/images/video/company_mob.mp4`,
    }),
    []
  );

  const videoSource2 = useMemo(
    () => ({
      large: `${bucket_url}/images/video/main_company_full.mp4`,
      medium: `${bucket_url}/images/video/main_company_ipad.mp4`,
      small: `${bucket_url}/images/video/main_company_mobile.mp4`,
    }),
    []
  );

  // const [windowWidth] = useState(window.innerWidth);
  const [countPercent, setCountPercent] = useState(0);
  const [countHuman, setCountHuman] = useState(0);
  const [countProject, setCountProject] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [, setSwiper] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [currentIndexCompany, setCurrentIndexCompany] = useState(0);
  const swiperCompanyRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [videoSrc2, setVideoSrc2] = useState(null);

  const [showCards, setShowCards] = useState(false);
  const [activeButton, setActiveButton] = useState('Руководство');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingFormContacts, setIsLoadingFormContacts] = useState(false);
  const [modalOpenFormContacts, setModalOpenFormContacts] = useState(false);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);
  const [modalOpenSubscription, setModalOpenSubscription] = useState(false);

  const dispatch = useDispatch();
  const { selectedCard, category, staff, error, loading } = useSelector((state) => state.staff);

  const blockSlider = useRef(null);
  const nameCompanyRef = useRef(null);
  const thisBlockRef = useRef(null);

  const countDepartment = useSelector((state) => state.counter.countDepartment);
  const countGap = useSelector((state) => state.counter.countGap);
  const countScient = useSelector((state) => state.counter.countScient);
  const countScienceDegree = useSelector((state) => state.counter.countScienceDegree);

  const [ref, inView] = useInView({
    threshold: 0.5,
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener('resize', handleResize);

    // Очистка обработчика при размонтировании
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const symbol = '•';

  const filteredStaff = staff.filter((staff) => {
    const categoryArray =
      staff.category.startsWith('{') && staff.category.endsWith('}')
        ? staff.category.slice(1, -1).split(',')
        : [staff.category];

    return categoryArray.some((cat) => cat.trim().replace(/"/g, '') === category);
  });

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };

    return () => {
      window.removeEventListener('scroll', scrollToTop);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1025) {
        setVideoSrc2(videoSource2.large);
        setVideoSrc(videoSource.large);
      } else if (screenWidth >= 768 && screenWidth <= 1024) {
        setVideoSrc2(videoSource2.medium);
        setVideoSrc(videoSource.medium);
      } else {
        setVideoSrc2(videoSource2.small);
        setVideoSrc(videoSource.medium);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [videoSource.large, videoSource.medium, videoSource2.large, videoSource2.medium, videoSource2.small]);

  useEffect(() => {
    const fetchData = async () => {
      if (category) {
        await dispatch(fetchCategoryStaff(category));
        setShowCards(true);
      }
    };

    fetchData();
  }, [category, dispatch]);

  const handleButtonClick = useCallback(
    (newCategory, selectedCardId) => {
      if (selectedCardId) {
        dispatch(selectCard(selectedCardId));
        setIsModalOpen(true);
      } else {
        setIsModalOpen(false);
        dispatch(selectCard(null));
        setShowCards(true);
        if (newCategory !== category) {
          setActiveButton(newCategory);
          dispatch(setCategory(newCategory));
        }
      }
    },
    [category, dispatch]
  );

  useEffect(() => {
    const timer1 = setTimeout(() => {
      if (countPercent < 1300) {
        setCountPercent(countPercent + 20);
      }
      if (countProject < 200) {
        setCountProject(countProject + 5);
      }
      if (countHuman < 19) {
        setCountHuman(countHuman + 1);
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
      }, 80);
      return () => clearTimeout(timer1);
    }
  }, [dispatch, countDepartment, countGap, countScient, countScienceDegree, inView, ref]);

  useEffect(() => {
    gsap?.registerPlugin(ScrollTrigger);

    const { elementsRight } = { elementsRight: [blockSlider.current] };

    gsap?.from(elementsRight, {
      x: '-100%',
      opacity: 0,
      duration: 1.5,
      delay: 0.5,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: elementsRight,
        start: 'top 80%',
      },
    });
  }, []);

  useEffect(() => {
    const nameCompanyElement = nameCompanyRef.current;
    const thisBlockElement = thisBlockRef.current;

    function handleScroll() {
      if (nameCompanyElement && thisBlockElement) {
        const nameCompanyRect = nameCompanyElement.getBoundingClientRect();
        const thisBlockRect = thisBlockElement.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > thisBlockRect.top && screenWidth >= 2000) {
          const translateYValue = nameCompanyRect.height + 190;
          nameCompanyElement.style.transform = `translateY(${translateYValue}px)`;
          thisBlockElement.style.transform = `translateY(150px) translateX(10vw) rotate(-90deg)`;
        } else if (scrollTop > thisBlockRect.top && screenWidth < 1999 && screenWidth >= 1480) {
          const translateYValue = nameCompanyRect.height + 200;
          nameCompanyElement.style.transform = `translateY(${translateYValue}px)`;
          thisBlockElement.style.transform = `translateY(170px) translateX(10vw) rotate(-90deg)`;
        } else if (scrollTop > thisBlockRect.top && screenWidth <= 1479) {
          const translateYValue = nameCompanyRect.height + 230;
          nameCompanyElement.style.transform = `translateY(${translateYValue}px)`;
          thisBlockElement.style.transform = `translateY(180px) translateX(10vw) rotate(-90deg)`;
        } else {
          nameCompanyElement.style.transform = 'none';
          thisBlockElement.style.transform = 'rotate(-180deg)';
        }
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // не стирать эту функцию!!!
  // const handlePCardCompanyClick = useCallback((index) => {
  //   setCurrentIndexCompany(index);
  //   if (swiperCompanyRef.current && swiperCompanyRef.current.slideTo) {
  //     swiperCompanyRef.current.slideTo(index);
  //   }
  // }, []);

  const buttonsStuff = useMemo(
    () => [
      { name: 'Руководство', onClick: handleButtonClick },
      // { name: "Руководители отделов", onClick: handleButtonClick },
      { name: 'Научно-техническое сопровождение', onClick: handleButtonClick },
      // { name: "HR", onClick: handleButtonClick },
    ],
    [handleButtonClick]
  );

  if (error) {
    return (
      <div>
        {' '}
        <Error error={error.message} />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Marks Group</title>
      </Helmet>
      <div className={styles.company_main}>
        {/* <Company_Slider /> */}
        <div className={styles.company_intro}>
          <div className={styles.block_video_company}>
            {videoSrc2 && (
              <video
                playsInline
                preload="metadata"
                webkitplaysinline="true"
                autoPlay
                muted
                loop
                id="bg-video"
                className={styles.bg_video}>
                <source src={videoSrc2} type="video/mp4" preload="auto" />
              </video>
            )}
          </div>
          <div ref={blockSlider} className={styles.underSlider_text_wrapper}>
            <span className={styles.span_underSlider_text1}>
              Создаём пространства будущего.
              <br />
              Знаковые проекты от&nbsp;ведущих специалистов <br />
              в&nbsp;области комплексного проектирования
            </span>
            <span className={styles.span_underSlider_text2}>О&nbsp;компании</span>
            {isMobile && <CounterCompanyMobile />}
            {!isMobile && (
              <div className={styles.div_counter_wrapper}>
                <div className={styles.container_text}>
                  <div className={styles.div_underSlider_text}>
                    <div className={styles.text_svg}>
                      <img src={bracket} alt="bracket" />
                    </div>
                    <p>{countPercent}</p>
                  </div>
                  <span className={styles.span_underSlider_text}>Квалифицированных специалистов</span>
                </div>
                <div className={styles.container_text}>
                  <div className={styles.div_underSlider_text}>
                    <div className={styles.text_svg}>
                      <img src={bracket} alt="bracket" />
                    </div>
                    <p>{countProject}</p>
                  </div>
                  <span className={styles.span_underSlider_text}>Проектов реализовано</span>
                </div>
                <div className={styles.container_text}>
                  <div className={styles.div_underSlider_text}>
                    <div className={styles.text_svg}>
                      <img src={bracket} alt="bracket" />
                    </div>
                    <p>{countHuman}</p>
                  </div>
                  <span className={styles.span_underSlider_text}>Лет на&nbsp;рынке</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.sliderMobile_wrapper}>
          {/* <SliderMobile /> */}
          <SliderHeader />
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
              <p>
                MARKS GROUP &ndash; ключевая компания в&nbsp;сфере генерального проектирования, начиная
                от&nbsp;концепции и&nbsp;заканчивая авторским надзором за&nbsp;строительством объекта и&nbsp;его
                введением в&nbsp;эксплуатацию.
              </p>
              <br />
              {/* <br /> */}
              <p>
                С&nbsp;2005&nbsp;года непрерывный опыт проектирования уникальных объектов, жилых и&nbsp;общественных
                зданий, промышленных предприятий и&nbsp;объектов транспортной инфраструктуры.
              </p>
              <br />
              {/* <br /> */}
              <p>MARKS GROUP. Вдохновляющие проекты для&nbsp;амбициозных заказчиков.</p>
            </div>
            <div className={styles.main_counter_wrapper}>{isMobile && <CounterCompanyMobile2 />}</div>
            {!isMobile && (
              <div className={styles.right_counter_wrapper} ref={ref}>
                <div className={styles.container_text_right}>
                  <div className={styles.div_underSlider_text_right}>
                    <div className={styles.text_svg_right}>
                      <img src={bracket_dark} alt="bracket_dark" />
                    </div>
                    <p className={styles.number}>{countDepartment}</p>
                  </div>
                  <span className={styles.span_underSlider_text_right}>Регионов присутствия</span>
                </div>
                <div className={styles.container_text_right}>
                  <div className={styles.div_underSlider_text_right}>
                    <div className={styles.text_svg_right}>
                      <img src={bracket_dark} alt="bracket_dark" />
                    </div>
                    <p className={styles.number}>{countGap}</p>
                  </div>
                  <span className={styles.span_underSlider_text_right}>Объектов транспортной инфраструктуры</span>
                </div>
                <div className={styles.container_text_right}>
                  <div className={`${styles.div_underSlider_text_right} ${styles.div_underSlider_text_right_last}`}>
                    <div className={styles.text_svg_right}>
                      <img src={bracket_dark} alt="bracket_dark" />
                    </div>
                    <p className={styles.number}>{countScient}</p>
                  </div>
                  <span className={styles.span_underSlider_text_right}>
                    Объектов жилого и&nbsp;общественного назначения
                  </span>
                </div>
                <div className={styles.container_text_right}>
                  <div className={`${styles.div_underSlider_text_right} ${styles.div_underSlider_text_right_last}`}>
                    <div className={styles.text_svg_right}>
                      <img src={bracket_dark} alt="bracket_dark" />
                    </div>
                    <p className={styles.number}>{countScienceDegree}%</p>
                    {/* <p className={styles.number_metr}>м<sup className={styles.small_sup}>2</sup></p> */}
                  </div>
                  <span className={styles.span_underSlider_text_right}>
                    Объёма проектирования с&nbsp;применением цифровых технологий
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <CompanySlider />
        {/* <div className={styles.company_group_name}>
          Состав группы компаний
          <p className={styles.plus_nine} style={{ verticalAlign: "top" }}>
        <CompanySlider />
            <img src={plusNine} alt="plus_nine" />
            <span>+ 4</span>
          </p>
        </div> */}
        {/* <div className={styles.company_group_slider}>
        </div> */}
        <div className={styles.awards_wrapper}>
          Награды и&nbsp;премии
          <div className={styles.years_div}>/2005-2024/</div>
        </div>
        <div className={styles.list_project}>
          Список проектов, которые были отмечены конкурсами в&nbsp;разных номинациях за&nbsp;годы практики с&nbsp;2005
          года
        </div>
        {isMobile && <TableCompanyMobile />}
        {!isMobile && (
          <TableCompany
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            handleMouseHover={handleMouseHover}
          />
        )}
        <div className={styles.specialist_wrapper}>
          <div className={styles.specialist}>Специалисты</div>
          {isMobile && (
            <Swiper
              onSwiper={setSwiper}
              slidesPerView="auto"
              spaceBetween={8}
              className={styles.my_swiper_button_group}
              touch="true">
              <div className={styles.button_group}>
                {buttonsStuff &&
                  buttonsStuff?.map((button, index) => (
                    <SwiperSlide
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        button.onClick(button.name);
                      }}
                      className={`${styles.button_hover} ${activeButton === button.name ? styles.active : ''}`}
                      style={{ width: 'fit-content' }}>
                      <p type="button">{button.name}</p>
                    </SwiperSlide>
                  ))}
              </div>
            </Swiper>
          )}
          {!isMobile && (
            <div className={styles.button_group}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick('Руководство');
                }}
                className={`${styles.button_leader} ${styles.button_hover} ${
                  activeButton === 'Руководство' ? styles.active : ''
                }`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                Руководство
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick('Научно-техническое сопровождение');
                }}
                className={`${styles.button_support} ${styles.button_hover} ${
                  activeButton === 'Научно-техническое сопровождение' ? styles.active : ''
                }`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                Научно-техническое сопровождение
              </button>
            </div>
          )}
        </div>
        <div className={styles.card_container} style={{ opacity: showCards ? 1 : 0 }}>
          <ul className={styles.card_container_ul}>
            {loading ? (
              <SkeletonLoader itemCount={8} />
            ) : (
              filteredStaff?.map((el) => (
                <li
                  key={el.id}
                  data-user-id={el.id}
                  className={styles.container__item_stuff}
                  onClick={() => handleButtonClick(category, el.id)}
                  onMouseEnter={handleMouseHover}
                  onMouseLeave={handleMouseLeave}>
                  <div className={styles.wrapper_container_item_stuff}>
                    <img
                      className={`${styles.container__img_stuff} ${showCards ? 'loaded' : ''}`}
                      src={el.img}
                      onError={(e) => {
                        e.target.src = `${bucket_url}/images/imageStuff/no_photo.png`;
                      }}
                      alt={el.img}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.container__item_name_stuff}>{el.name}</div>
                  <div className={styles.container__item_position_stuff}>{el.position}</div>
                </li>
              ))
            )}
            {isModalOpen && selectedCard && (
              <Modal
                className={styles.modal_wrapper}
                const
                modal={document.querySelector('.modal')}
                modalStyleZIndex={10}
                isOpen={isModalOpen}
                onRequestClose={() => {
                  dispatch(selectCard(null));
                  setIsModalOpen(false);
                }}
                onAfterOpen={() => {
                  setIsModalOpen(true);
                  document.body.style.overflow = 'hidden';
                  document.body.classList.add('modal-open');
                }}
                onAfterClose={() => {
                  document.body.style.overflow = '';
                  document.body.classList.remove('modal-open');
                }}
                ariaHideApp={false}
                categoryId={category}
                style={{
                  overlay: {
                    zIndex: 10,
                    backgroundColor: '#2C3B447A',
                  },
                  content: {
                    zIndex: 10,
                    overflow: 'auto',
                    WebkitOverflowScrolling: 'touch', // Для плавной прокрутки в Safari
                    '&::WebkitScrollbar': {
                      width: '12px',
                    },
                    '&::WebkitScrollbarTrack': {
                      backgroundColor: 'transparent',
                      borderRadius: '6px',
                    },
                  },
                }}>
                {selectedCard && (
                  <div key={selectedCard.id} className={styles.modal_context}>
                    <div
                      className={`${styles.modal_close} ${styles.fixed}`}
                      onClick={() => {
                        setIsModalOpen(false);
                        dispatch(selectCard(null));
                      }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                        <img className={styles.modal_img_stuff} src={selectedCard.img} alt="" />
                      </div>
                    </div>
                    <div className={styles.modal_name_stuff}>{selectedCard.name}</div>
                    {selectedCard.description && (
                      <div className={styles.modal_description_stuff}>{selectedCard.description}</div>
                    )}
                    {selectedCard.about && <div className={styles.modal_about_stuff}>{selectedCard.about}</div>}
                    {selectedCard.about1 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about1}
                      </div>
                    )}
                    {selectedCard.about2 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about2}
                      </div>
                    )}
                    {selectedCard.about3 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about3}
                      </div>
                    )}
                    {selectedCard.about4 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about4}
                      </div>
                    )}
                    {selectedCard.about5 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about5}
                      </div>
                    )}
                    {selectedCard.about6 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about6}
                      </div>
                    )}
                    {selectedCard.about7 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about7}
                      </div>
                    )}
                    {selectedCard.about8 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about8}
                      </div>
                    )}
                    {selectedCard.about9 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about9}
                      </div>
                    )}
                    {selectedCard.about10 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about10}
                      </div>
                    )}
                    {selectedCard.about11 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about11}
                      </div>
                    )}
                    {selectedCard.about12 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about12}
                      </div>
                    )}
                    {selectedCard.about13 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about13}
                      </div>
                    )}
                    {selectedCard.about14 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about14}
                      </div>
                    )}
                    {selectedCard.about15 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about15}
                      </div>
                    )}
                    {selectedCard.about16 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about16}
                      </div>
                    )}
                    {selectedCard.about17 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about17}
                      </div>
                    )}
                    {selectedCard.about18 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about18}
                      </div>
                    )}
                    {selectedCard.about19 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about19}
                      </div>
                    )}
                    {selectedCard.about20 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about20}
                      </div>
                    )}
                    {selectedCard.about21 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about21}
                      </div>
                    )}
                    {selectedCard.about22 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about22}
                      </div>
                    )}
                    {selectedCard.about23 && (
                      <div className={styles.modal_about_stuff1}>
                        {/* <div className={styles.modal_about_stuff_symbol}>
                      {symbol}
                    </div> */}
                        {selectedCard.about23}
                      </div>
                    )}
                    {selectedCard.description1 && (
                      <div className={styles.modal_description_stuff1}>{selectedCard.description1}</div>
                    )}
                    {selectedCard.about24 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about24}
                      </div>
                    )}
                    {selectedCard.description2 && (
                      <div className={styles.modal_description_stuff1}>{selectedCard.description2}</div>
                    )}
                    {selectedCard.about25 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about25}
                      </div>
                    )}
                    {selectedCard.about26 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about26}
                      </div>
                    )}
                    {selectedCard.about27 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about27}
                      </div>
                    )}
                    {selectedCard.about28 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about28}
                      </div>
                    )}
                    {selectedCard.about29 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about29}
                      </div>
                    )}
                    {selectedCard.about30 && (
                      <div className={styles.modal_about_stuff1}>
                        <div className={styles.modal_about_stuff_symbol}>{symbol}</div>
                        {selectedCard.about30}
                      </div>
                    )}
                  </div>
                )}
              </Modal>
            )}
          </ul>
        </div>

        {isMobile && (
          <div className={styles.slider_card_wrapper}>
            {loading ? (
              <SkeletonLoaderSlider itemCount={8} isMobile />
            ) : (
              <Swiper
                className={styles.slider_card_container}
                loop={true}
                slidesPerView={1.1}
                spaceBetween={0}
                effect={'fade'}
                touch="true"
                onSlideChange={(swiper) => setCurrentIndexCompany(swiper.realIndex)}
                onSwiper={(swiper) => {
                  if (swiperCompanyRef.current === null) {
                    swiperCompanyRef.current = swiper;
                  }
                }}>
                {filteredStaff?.map((el) => (
                  <SwiperSlide
                    key={el.id}
                    data-user-id={el.id}
                    className={styles.slide_container_item_stuff}
                    onClick={() => handleButtonClick(category, el.id)}>
                    <div className={styles.wrapper_container_item_stuff}>
                      <img
                        className={`${styles.container__img_stuff} ${showCards ? 'loaded' : ''}`}
                        src={el.img}
                        onError={(e) => {
                          e.target.src = `${bucket_url}/images/imageStuff/no_photo.png`;
                        }}
                        alt={el.img}
                        loading="lazy"
                      />
                    </div>
                    <div className={styles.container__item_name_stuff}>{el.name}</div>
                    <div className={styles.container__item_position_stuff}>{el.position}</div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        )}

        {!isMobile && (
          <div className={styles.slider_card_wrapper}>
            {loading ? (
              <SkeletonLoaderSlider itemCount={8} isMobile={false} />
            ) : (
              <Swiper
                className={styles.slider_card_container}
                loop={true}
                slidesPerView={2.2}
                spaceBetween={0}
                touch="true">
                {filteredStaff?.map((el) => (
                  <SwiperSlide
                    key={el.id}
                    data-user-id={el.id}
                    className={styles.slide_container_item_stuff}
                    onClick={() => handleButtonClick(category, el.id)}>
                    <div className={styles.wrapper_container_item_stuff}>
                      <img
                        className={`${styles.container__img_stuff} ${showCards ? 'loaded' : ''}`}
                        src={el.img}
                        onError={(e) => {
                          e.target.src = `${bucket_url}/images/imageStuff/no_photo.png`;
                        }}
                        alt={el.img}
                        loading="lazy"
                      />
                    </div>
                    <div className={styles.container__item_name_stuff}>{el.name}</div>
                    <div className={styles.container__item_position_stuff}>{el.position}</div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        )}
        <div className={styles.fon}>
          <div className={styles.video_wrapper}>
            {videoSrc && (
              <video playsInline preload="metadata" webkitplaysinline="true" autoPlay muted loop id="bg-video_2">
                <source src={videoSrc} type="video/mp4" preload="auto" />
              </video>
            )}
          </div>
          <div className={styles.form_wrapper}>
            {isLoadingFormContacts && (
              <div
                style={{
                  position: 'relative',
                  height: '30vh',
                  width: window.innerWidth <= 768 ? '100vw' : '50vw',
                }}>
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                  }}>
                  <LoadingCircle />
                </div>
              </div>
            )}
            {modalOpenFormContacts && (
              <div
                style={{
                  position: 'relative',
                  height: '30vh',
                  width: window.innerWidth <= 768 ? '100vw' : '50vw',
                }}>
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                  }}>
                  <ModalVacancyFormSend
                    isOpen={modalOpenFormContacts}
                    onRequestClose={() => setModalOpenFormContacts(false)}
                    title="Заявка отправлена!"
                    message="Мы свяжемся с вами в ближайшее время!"
                    buttonText="Спасибо, жду!"
                    variant="manualClose"
                  />
                </div>
              </div>
            )}
            <div className={styles.company_form_contacts_wrapper}>
              {!isLoadingFormContacts && !modalOpenFormContacts && (
                <>
                  <CompanyFormContacts
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}
                    handleMouseHover={handleMouseHover}
                    setIsLoading={setIsLoadingFormContacts}
                    setModalOpen={setModalOpenFormContacts}
                  />
                </>
              )}
            </div>
            {isLoadingSubscription && (
              <div
                style={{
                  position: 'relative',
                  height: '30vh',
                  width: window.innerWidth <= 768 ? '100vw' : '50vw',
                }}>
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 100,
                  }}>
                  <LoadingCircle />
                </div>
              </div>
            )}
            {modalOpenSubscription && (
              <div
                style={{
                  position: 'relative',
                  height: '30vh',
                  width: window.innerWidth <= 768 ? '100vw' : '50vw',
                }}>
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 100,
                  }}>
                  <ModalVacancyFormSend
                    isOpen={modalOpenSubscription}
                    onRequestClose={() => setModalOpenSubscription(false)}
                    title="Вы подписаны!"
                    message="Если захотите завершить подписку, напишите нам!"
                    buttonText="Спасибо, жду!"
                    variant="manualClose"
                  />
                </div>
              </div>
            )}
            <div className={styles.companySubscriptionForm_wrapper}>
              {!isLoadingSubscription && !modalOpenSubscription && (
                <>
                  {/* <CompanySubscriptionForm
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}
                    handleMouseHover={handleMouseHover}
                    setIsLoading={setIsLoadingSubscription}
                    setModalOpen={setModalOpenSubscription}
                  /> */}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
