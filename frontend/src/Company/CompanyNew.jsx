import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Company.module.scss';
import gsap from 'gsap';
import { Helmet } from 'react-helmet-async';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import SliderHeader from '../UI/SliderHeader/SliderHeader';
import TableCompany from '../UI/TableCompany/TableCompany';
import TableCompanyMobile from '../UI/TableCompany/TableCompanyMobile';
import {
  incrementDepartment,
  incrementGap,
  incrementScient,
  incrementScienceDegree,
} from '../store/Slice/counterSlice';

import LoadingCircle from '../Loading/LoadingCircle';

import bracket from '../icons/bracket.svg';
import bracket_dark from '../icons/bracket_dark.svg';
import CompanyFormContacts from '../UI/CompanyFormContacts/CompanyFormContacts';
import CounterCompanyMobile from '../UI/CounterCompanyMobile';
import CounterCompanyMobile2 from '../UI/CounterCompanyMobile2';
import CompanySlider from './CompanySlider/CompanySlider';
import ModalVacancyFormSend from '../UI/VacancyFormContact/ModalVacancyFormSend';
import CompanyStaffPublic from './CompanyStaffPublic';
import { useHashScroll } from './CompanyGroupSlider/hooks/useHashScroll';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

const VIDEO_SOURCE = {
  large: `${bucket_url}/images/video/company_full.mp4`,
  medium: `${bucket_url}/images/video/company_ipad.mp4`,
  small: `${bucket_url}/images/video/company_mob.mp4`,
};

const VIDEO_SOURCE2 = {
  large: `${bucket_url}/images/video/main_company_full.mp4`,
  medium: `${bucket_url}/images/video/main_company_ipad.mp4`,
  small: `${bucket_url}/images/video/main_company_mobile.mp4`,
};

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function CompanyNew({ handleMouseEnter, handleMouseLeave, handleMouseHover }) {
  const [countPercent, setCountPercent] = useState(0);
  const [countHuman, setCountHuman] = useState(0);
  const [countProject, setCountProject] = useState(0);

  const [videoSrc, setVideoSrc] = useState(null);
  const [videoSrc2, setVideoSrc2] = useState(null);

  const [isLoadingFormContacts, setIsLoadingFormContacts] = useState(false);
  const [modalOpenFormContacts, setModalOpenFormContacts] = useState(false);
  const [isLoadingSubscription] = useState(false);
  const [modalOpenSubscription, setModalOpenSubscription] = useState(false);

  const dispatch = useDispatch();

  const blockSlider = useRef(null);
  const nameCompanyRef = useRef(null);
  const thisBlockRef = useRef(null);

  const countDepartment = useSelector((state) => state.counter.countDepartment);
  const countGap = useSelector((state) => state.counter.countGap);
  const countScient = useSelector((state) => state.counter.countScient);
  const countScienceDegree = useSelector((state) => state.counter.countScienceDegree);

  const aliasMap = useMemo(() => ({ section1: 'history', section2: 'awards', section3: 'staff' }), []);
  useHashScroll({ aliasMap, offsetY: 120 });

  const [ref, inView] = useInView({
    threshold: 0.5,
  });

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 767 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1025) {
        setVideoSrc2(VIDEO_SOURCE2.large);
        setVideoSrc(VIDEO_SOURCE.large);
      } else if (screenWidth >= 768 && screenWidth <= 1024) {
        setVideoSrc2(VIDEO_SOURCE2.medium);
        setVideoSrc(VIDEO_SOURCE.medium);
      } else {
        setVideoSrc2(VIDEO_SOURCE2.small);
        setVideoSrc(VIDEO_SOURCE.medium);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      if (countPercent < 1300) setCountPercent(countPercent + 20);
      if (countProject < 200) setCountProject(countProject + 5);
      if (countHuman < 19) setCountHuman(countHuman + 1);
    }, 50);
    return () => clearTimeout(timer1);
  }, [countPercent, countHuman, countProject]);

  useEffect(() => {
    if (!inView) return;

    const t = setTimeout(() => {
      dispatch(incrementDepartment());
      dispatch(incrementGap());
      dispatch(incrementScient());
      dispatch(incrementScienceDegree());
    }, 80);

    return () => clearTimeout(t);
  }, [dispatch, inView]);

  useEffect(() => {
    const elementsRight = [blockSlider.current];
    const anim = gsap.from(elementsRight, {
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

    return () => {
      anim?.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  useEffect(() => {
    const nameCompanyElement = nameCompanyRef.current;
    const thisBlockElement = thisBlockRef.current;

    function handleScroll() {
      if (!nameCompanyElement || !thisBlockElement) return;

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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Helmet>
        <title>MARKS GROUP</title>
      </Helmet>

      <div className={styles.company_main}>
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
          <SliderHeader />
        </div>

        <div id="history" className={styles.about_main}>
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
                MARKS GROUP &ndash; генеральный проектировщик полного цикла, от&nbsp;концепции и&nbsp;заканчивая вводом
                объекта в&nbsp;эксплуатацию.
              </p>
              <p>
                С&nbsp;2005&nbsp;года непрерывный опыт проектирования уникальных объектов, жилых и&nbsp;общественных
                зданий, промышленных предприятий и&nbsp;объектов транспортной инфраструктуры.
              </p>
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

        <div id="awards" className={styles.awards_wrapper}>
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
        <section id="staff">
          <CompanyStaffPublic
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            handleMouseHover={handleMouseHover}
          />
        </section>
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
                  width: isMobile ? '100vw' : '50vw',
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
                  width: isMobile ? '100vw' : '50vw',
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
                <CompanyFormContacts
                  handleMouseEnter={handleMouseEnter}
                  handleMouseLeave={handleMouseLeave}
                  handleMouseHover={handleMouseHover}
                  setIsLoading={setIsLoadingFormContacts}
                  setModalOpen={setModalOpenFormContacts}
                />
              )}
            </div>

            {isLoadingSubscription && (
              <div
                style={{
                  position: 'relative',
                  height: '30vh',
                  width: isMobile ? '100vw' : '50vw',
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
                  width: isMobile ? '100vw' : '50vw',
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

            {/* <div className={styles.companySubscriptionForm_wrapper}>место под форму подписки</div> */}
          </div>
        </div>
      </div>
    </>
  );
}
