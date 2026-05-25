import { useEffect, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { useInView } from 'react-intersection-observer';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useProjects, useGeolocation, useWindowWidth } from '../hooks';
import CompanySlider from '../UI/Company_Slider/CompanySlider';
import catPhoto from '../img/default-photo.jpeg';
import SearchInput from './SearchInput';

import { BUTTON_CHOOSE } from './const';
import Button from './ui/Button';
import Item from './Item';
import { Icon } from './icon';
import styles from './styles/Project.module.css';

const CityModal = lazy(() => import('./CityModal'));
const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

export default function Project() {
  const [selectOnCompetencies, setSelectOnCompetencies] = useState('Все');
  const [selectedCity, setSelectedCity] = useState('');
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } = useProjects({
    limit: 6,
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

  if (isPending) {
    return <p className={styles.notification}>Проекты загружаются.</p>;
  }
  if (!isPending && filteredProjects.length === 0) {
    return <p className={styles.notification}>Проекты не найдены.</p>;
  }
  if (isFetchingNextPage) {
    return <p className={styles.notification}>Загрузка...</p>;
  }
  if (isError) {
    return <p className={styles.notification}>Не удалось загрузить проекты. Попробуйте обновить страницу.</p>;
  }

  return (
    <>
      <Helmet>
        <title>MARKS GROUP</title>
      </Helmet>
      <section className={styles.project_main}>
        <div className={styles.project_slider_box}>
          <CompanySlider />
          <div className={styles.project_slider_text}>
            <p className={styles.actuality_text}>Креативные пространства от MARKS GROUP</p>
            <span className={styles.projects_name_text}>Проекты</span>
          </div>
        </div>
        {isMobile && <SearchInput resetKey={searchResetKey} onSearch={setSearchValue} />}
        {(isMobile || isTablet) && (
          <Swiper slidesPerView="auto" spaceBetween={8} touch="true">
            {visibleButtons.map((el, i) => (
              <SwiperSlide
                key={el}
                onClick={() => handleButtonClick(el)}
                className={`${styles.tabs} ${i === 0 ? styles.firstSlide : ''} ${isButtonActive(el) ? styles.active : ''}`}>
                {el}
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        {!isMobile && !isActive && (
          <div className={styles.menu_button_group_project_wrapper_main}>
            <div className={styles.menu_button_group_project}>
              {visibleButtons.map((el, i) => (
                <Button key={i} label={el} isActive={isButtonActive(el)} onClick={() => handleButtonClick(el)} />
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
        </>
      </section>
    </>
  );
}
