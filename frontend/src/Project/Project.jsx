import { useEffect, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { useInView } from 'react-intersection-observer';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useProjects, useGeolocation, useWindowWidth } from '../hooks';
import CompanySlider from '../UI/Company_Slider/CompanySlider';
import '../UI/Company_Slider/CompanySlider.css';
import '../UI/ButtonsProjects/AllProjectsButton.module.css';
import { fetchToggleStateAsync } from '../store/Slice/toggleSlice';
import catPhoto from '../img/default-photo.jpeg';
import SearchInput from './SearchInput';

import { BUTTON_CHOOSE } from './const';
import Button from './ui/Button';
import { Icon } from './icon';
import styles from './styles/Project.module.css';
import Item from './Item';

const CityModal = lazy(() => import('./CityModal'));
const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

export default function Project() {
  const dispatch = useDispatch();
  const [selectOnCompetencies, setSelectOnCompetencies] = useState('Все');
  const [selectedCity, setSelectedCity] = useState('');
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError } = useProjects({
    limit: 12,
    view: selectOnCompetencies,
    city: selectedCity,
  });
  const projects = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);

  const isActive = useSelector((state) => state.toggle.isActiveForButton1);

  const [modalCity, setModalCity] = useState(false);
  const currentLocation = useGeolocation();
  const { isMobile, isTablet } = useWindowWidth();
  const [searchValue, setSearchValue] = useState('');
  const [searchResetKey, setSearchResetKey] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const visibleButtons = BUTTON_CHOOSE;

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
        {isMobile && (
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
        {(isMobile || isTablet) && (
          <Swiper slidesPerView="auto" spaceBetween={8} className={styles.my_swiper2_button_group_project} touch="true">
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

        {!isMobile && !isActive && (
          <div className={styles.menu_button_group_project_wrapper_main}>
            <div className={styles.menu_button_group_project}>
              {visibleButtons.map((el, i) => (
                <Button key={el.i} label={el} isActive={isButtonActive(el)} onClick={() => handleButtonClick(el)} />
              ))}
            </div>
            <Button label="Выбрать город" onClick={handleSelectCityClick} icon={<Icon />} className={styles.btnCity} />
          </div>
        )}
        <Suspense fallback={<>Loading...</>}>
          <CityModal
            isOpen={modalCity}
            onClose={handleModalClose}
            currentLocation={currentLocation}
            selectedCity={selectedCity}
            onCityClick={handleButtonCityClick}
          />
        </Suspense>
        {isError && <p style={{ textAlign: 'center', padding: '16px' }}>Не удалось загрузить проекты. Попробуйте обновить страницу.</p>}
        <>
          <section className={styles.list}>
            {filteredProjects.map((project) => {
              if (!project) return null;
              const photoName = project.imageProject;
              const photoSrc =
                photoName && photoName.includes('https')
                  ? photoName
                  : `${bucket_url}/images/imageAdd/${photoName || catPhoto}`;
              return <Item key={project.id} project={project} photoSrc={photoSrc} />;
            })}
          </section>
          <div ref={sentinelRef} />
          {isFetchingNextPage && <p style={{ textAlign: 'center', padding: '16px' }}>Загрузка...</p>}
        </>
      </div>
    </>
  );
}
