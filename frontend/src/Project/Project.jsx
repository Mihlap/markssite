import { useEffect, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useProjects, useGeolocation } from '../hooks';
import CompanySlider from '../UI/Company_Slider/CompanySlider';
import '../UI/Company_Slider/CompanySlider.css';
import '../UI/ButtonsProjects/AllProjectsButton.module.css';
import { fetchToggleStateAsync } from '../store/Slice/toggleSlice';
import catPhoto from '../img/default-photo.jpeg';
import SearchInput from './SearchInput';

import { BUTTON_CHOOSE, COLOR } from './const';
import Button from './ui/Button';
import { Icon } from './icon';
import styles from './styles/Project.module.css';

const CityModal = lazy(() => import('./CityModal'));
const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

export default function Project({ handleMouseLeave, handleMouseHover }) {
  const dispatch = useDispatch();
  const [selectOnCompetencies, setSelectOnCompetencies] = useState('Все');
  const [selectedCity, setSelectedCity] = useState('');
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useProjects({
    limit: 12,
    view: selectOnCompetencies,
    city: selectedCity,
  });
  const projects = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);

  const { data: allData } = useProjects({ limit: 200, city: selectedCity });
  const allProjects = useMemo(() => allData?.pages.flatMap((p) => p.data) ?? [], [allData]);
  const isActive = useSelector((state) => state.toggle.isActiveForButton1);

  const [modalCity, setModalCity] = useState(false);
  const currentLocation = useGeolocation();
  const [searchValue, setSearchValue] = useState('');
  const [searchResetKey, setSearchResetKey] = useState(0);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const isMobile = screenWidth <= 1024;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleResize = useCallback(() => {
    setScreenWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    dispatch(fetchToggleStateAsync());
  }, [dispatch]);

  const handleButtonClick = useCallback((viewConstruction) => {
    setSelectedCity('');
    setSelectOnCompetencies(viewConstruction);
    setSearchResetKey((k) => k + 1);
  }, []);

  const handleButtonCityClick = useCallback((countryCity) => {
    setSelectedCity(countryCity);
    setSelectOnCompetencies('');
    setSearchResetKey((k) => k + 1);
  }, []);

  const handleSelectCityClick = useCallback((e) => {
    e.preventDefault();
    setModalCity(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalCity(false);
    setSelectedCity('');
    setSelectOnCompetencies('Все');
  }, []);

  const { ref: sentinelRef, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const categoriesSet = useMemo(() => {
    const set = new Set();

    for (const p of allProjects) {
      const vc = p.viewConstruction;
      if (Array.isArray(vc)) {
        vc.forEach((cat) => set.add(cat));
      } else if (typeof vc === 'string') {
        for (const cat of BUTTON_CHOOSE) {
          if (cat === 'Все') continue;
          if (vc.includes(cat)) set.add(cat);
        }
      }
    }

    return set;
  }, [allProjects]);

  const visibleButtons = useMemo(
    () => BUTTON_CHOOSE.filter((el) => el === 'Все' || categoriesSet.has(el)),
    [categoriesSet]
  );

  const isButtonActive = (el) => !modalCity && (el === selectOnCompetencies || (!selectOnCompetencies && el === 'Все'));

  const filteredProjects = useMemo(() => {
    if (!Array.isArray(projects)) {
      return [];
    }

    return projects.filter((project) => {
      const query = (searchValue || '').trim().toLowerCase();
      if (!query) return true;
      return (project.location || '').toLowerCase().includes(query);
    });
  }, [projects, searchValue]);

  return (
    <>
      <Helmet>
        <title>MARKS GROUP</title>
      </Helmet>
      <div className={styles.project_main}>
        <div className={styles.project_slider_box}>
          <CompanySlider />
          <div className={styles.project_slider_text}>
            <p className={styles.actuality_text}>Креативные пространства от MARKS GROUP</p>
            <span className={styles.projects_name_text}>Проекты</span>
          </div>
        </div>
        {screenWidth && (
          <div className={styles.searchCityAddress_wrapper}>
            <div className={styles.searchCityAddress_location_project_group}>
              <label className={`${styles.searchCityAddress_label_project}`}>
                <SearchInput resetKey={searchResetKey} onSearch={setSearchValue} />
                <div className={styles.line_modal_project}></div>
                <div className={styles.placeholder_modal_project}>
                  <div className={styles.lupa_svg_modal_project}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.9219 6.7676C12.9219 9.67654 10.5637 12.0347 7.6548 12.0347C4.74586 12.0347 2.3877 9.67654 2.3877 6.7676C2.3877 3.85865 4.74586 1.50049 7.6548 1.50049C10.5637 1.50049 12.9219 3.85865 12.9219 6.7676ZM10.7887 12.7669C9.85175 13.2573 8.78567 13.5347 7.6548 13.5347C3.91743 13.5347 0.887695 10.505 0.887695 6.7676C0.887695 3.03023 3.91743 0.000488281 7.6548 0.000488281C11.3922 0.000488281 14.4219 3.03023 14.4219 6.7676C14.4219 8.82566 13.5032 10.6691 12.0535 11.9103L14.7265 14.5833C15.0194 14.8762 15.0194 15.3511 14.7265 15.644C14.4336 15.9369 13.9587 15.9369 13.6658 15.644L10.7887 12.7669Z"
                        fill="#959DA6"
                      />
                    </svg>
                  </div>
                  <p className={styles.text_placeholder_modal_project}>Ведите адрес или город</p>
                </div>
              </label>
            </div>
          </div>
        )}
        <div className={styles.menu_button_group_project_wrapper_main1}>
          {isMobile && (
            <Swiper
              slidesPerView="auto"
              spaceBetween={8}
              className={styles.my_swiper2_button_group_project}
              touch="true">
              {visibleButtons.map((el, i) => (
                <SwiperSlide
                  key={el}
                  onClick={() => handleButtonClick(el)}
                  className={`${styles.menu__button__allProject} ${i === 0 ? styles.firstSlide : ''} ${isButtonActive(el) ? styles.active : ''}`}
                  style={{ width: 'fit-content' }}>
                  <p type="button" className={styles.menu_button_items}>
                    {el}
                  </p>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {!isMobile && !isActive && (
          <div className={styles.menu_button_group_project_wrapper_main}>
            <div className={styles.menu_button_group_project}>
              {visibleButtons.map((el, i) => (
                <Button key={el.i} label={el} isActive={isButtonActive(el)} onClick={() => handleButtonClick(el)} />
              ))}
            </div>
            <Button
              label="Выбрать город"
              onClick={handleSelectCityClick}
              icon={<Icon />}
            />
          </div>
        )}
        <Suspense fallback={null}>
          <CityModal
            isOpen={modalCity}
            onClose={handleModalClose}
            currentLocation={currentLocation}
            selectedCity={selectedCity}
            onCityClick={handleButtonCityClick}
          />
        </Suspense>
        <section className={styles.section_project}>
          <div className={styles.section_project__block}>
            {filteredProjects &&
              filteredProjects.slice().map((project) => {
                const defaultPhoto = catPhoto;
                const photoName = project && project?.imageProject;
                const photoSrc =
                  photoName && photoName.includes('https')
                    ? photoName
                    : `${bucket_url}/images/imageAdd/${photoName || defaultPhoto}`;
                if (!project) {
                  return null;
                }
                return (
                  <Link key={project.id} to={`/projects/${project.id}`} className={styles.section_project__block_cart}>
                    <div className={styles.cart_project}>
                      <div className={styles.cart_project__container}>
                        <img
                          className={styles.container__imageTitle_projectCard}
                          src={photoSrc}
                          onMouseEnter={handleMouseHover}
                          onMouseLeave={handleMouseLeave}
                          alt={project.imageProject || 'Default Alt Text'}
                        />
                        <div className={styles.project_content__wrapper}>
                          <div className={styles.container_wrapper_title_city_data_block}>
                            <div className={styles.cart_project_title}>{project.title}</div>
                            <div className={styles.cart_project__address}>
                              {project.countryCity}{' '}
                              <div className={styles.cart_project__address__svg}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="2"
                                  height="2"
                                  viewBox="0 0 2 2"
                                  fill="none">
                                  <circle cx="1" cy="1" r="1" fill="#959DA6" />
                                </svg>{' '}
                              </div>
                              {project.monthYear}
                            </div>
                          </div>
                          <div className={styles.cart_project__content}>
                            <div className={styles.cart_project__widget}>
                              {(() => {
                                try {
                                  const selectCompetencies = JSON.parse(project.selectCompetencies);

                                  return selectCompetencies.map((competency) => (
                                    <div
                                      key={competency.value}
                                      className={styles.el_project_selectCompetencies}
                                      style={{
                                        color: COLOR[competency.value],
                                        borderColor: COLOR[competency.value],
                                        border: '1px solid',
                                        padding: '3px 6px',
                                        borderRadius: '34px',
                                      }}>
                                      {competency.label}
                                    </div>
                                  ));
                                } catch (error) {
                                  if (typeof project.selectCompetencies === 'string') {
                                    if (!project.selectCompetencies.includes(',')) {
                                      const label = project.selectCompetencies.trim();
                                      return (
                                        <div
                                          key={label}
                                          className={styles.el_project_selectCompetencies}
                                          style={{
                                            color: COLOR[label],
                                            borderColor: COLOR[label],
                                            border: '1px solid',
                                            padding: '3px 6px',
                                            borderRadius: '34px',
                                          }}>
                                          {label}
                                        </div>
                                      );
                                    } else {
                                      return project.selectCompetencies.split(',').map((value) => {
                                        const label = value.trim();
                                        return (
                                          <div
                                            key={value}
                                            className={styles.el_project_selectCompetencies}
                                            style={{
                                              color: COLOR[value],
                                              borderColor: COLOR[value],
                                              border: '1px solid',
                                              padding: '3px 6px',
                                              borderRadius: '34px',
                                            }}>
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
          <div ref={sentinelRef} />
          {isFetchingNextPage && <p style={{ textAlign: 'center', padding: '16px' }}>Загрузка...</p>}
        </section>
      </div>
    </>
  );
}
