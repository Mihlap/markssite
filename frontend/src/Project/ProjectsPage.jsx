import { useEffect, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import CompanySlider from '../UI/Company_Slider/CompanySlider';
import { useProjects, useWindowWidth } from '../hooks';
import FilterToolbar from './components/FilterToolbar';
import ProjectGrid from './components/ProjectGrid';


const ProjectModal = lazy(() => import('./components/ProjectModal'));
const SearchInput = lazy(() => import('./components/SearchInput'));

export default function ProjectsPage() {
  const [selectOnCompetencies, setSelectOnCompetencies] = useState('Все');
  const [selectedCity, setSelectedCity] = useState('');
  const [modalCity, setModalCity] = useState(false);

  const { isMobile, isTablet } = useWindowWidth();
  const isHide = useSelector((state) => state.toggle.isActiveForButton1);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } = useProjects({
    limit: 6,
    view: selectOnCompetencies,
    city: selectedCity,
  });

  const projects = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTabsActive = useCallback(
    (el) => !modalCity && (el === selectOnCompetencies || (!selectOnCompetencies && el === 'Все')),
    [modalCity, selectOnCompetencies]
  );

  const handleTabsFilter = useCallback((viewConstruction) => {
    setSelectOnCompetencies(viewConstruction);
  }, []);

  const handleClickModal = useCallback(() => {
    setModalCity(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalCity(false);
  }, []);

  const handleCityClick = useCallback((city) => {
    setSelectedCity(city);
    setSelectOnCompetencies('');
    setModalCity(false);
  }, []);

  const handleCityReset = useCallback(() => {
    setSelectedCity('');
    setSelectOnCompetencies('Все');
  }, []);

  const handleSearchCity = useCallback((value) => {
    setSelectedCity(value);
  }, []);

  return (
    <>
      <CompanySlider />
      {/* <div className={s.wrap}> */}
      {isMobile && (
        <Suspense fallback={<>Loading...</>}>
          <SearchInput onSearch={handleSearchCity} />
        </Suspense>
      )}
      <FilterToolbar
        onFilter={handleTabsFilter}
        onModal={handleClickModal}
        onActive={handleTabsActive}
        onCityReset={handleCityReset}
        isHide={isHide}
        isDevice={[isMobile, isTablet]}
        city={selectedCity}
      />
      {/* </div> */}
      <ProjectGrid
        projects={projects}
        isPending={isPending}
        isError={isError}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      />
      <Suspense fallback={<>Loading...</>}>
        <ProjectModal
          isOpen={modalCity}
          onClose={handleModalClose}
          selectedCity={selectedCity}
          onCityClick={handleCityClick}
          onSearch={handleSearchCity}
        />
      </Suspense>
    </>
  );
}
