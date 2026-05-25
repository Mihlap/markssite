import { useEffect, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import CompanySlider from '../UI/Company_Slider/CompanySlider';
import { useGeolocation, useProjects, useWindowWidth } from '../hooks';
import FilterToolbar from './components/FilterToolbar';
import ProjectGrid from './components/ProjectGrid';

const ProjectModal = lazy(() => import('./components/ProjectModal'));
const SearchInput = lazy(() => import('./components/SearchInput'));

export default function ProjectsPage() {
  const [selectOnCompetencies, setSelectOnCompetencies] = useState('Все');
  const [selectedCity, setSelectedCity] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [modalCity, setModalCity] = useState(false);

  const currentLocation = useGeolocation();
  const { isMobile, isTablet } = useWindowWidth();
  const isHide = useSelector((state) => state.toggle.isActiveForButton1);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } = useProjects({
    limit: 6,
    view: selectOnCompetencies,
    city: selectedCity,
  });

  const projects = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);

  const filteredProjects = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((p) => (p?.location || '').toLowerCase().includes(query));
  }, [projects, searchValue]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTabsActive = useCallback(
    (el) => !modalCity && (el === selectOnCompetencies || (!selectOnCompetencies && el === 'Все')),
    [modalCity, selectOnCompetencies]
  );

  const handleTabsFilter = useCallback((viewConstruction) => {
    setSelectedCity('');
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

  return (
    <>
      <CompanySlider />
      {isMobile && <SearchInput onSearch={setSearchValue} />}
      <FilterToolbar
        onFilter={handleTabsFilter}
        onModal={handleClickModal}
        onActive={handleTabsActive}
        onCityReset={handleCityReset}
        isHide={isHide}
        isDevice={[isMobile, isTablet]}
        city={selectedCity}
      />
      <ProjectGrid
        projects={filteredProjects}
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
          currentLocation={currentLocation}
          selectedCity={selectedCity}
          onCityClick={handleCityClick}
        />
      </Suspense>
    </>
  );
}
