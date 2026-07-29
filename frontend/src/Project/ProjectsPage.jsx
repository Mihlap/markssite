import { useEffect, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router';
import CompanySlider from '../UI/Company_Slider/CompanySlider';
import { useProjects, useWindowWidth } from '../hooks';
import FilterToolbar from './components/FilterToolbar';
import ProjectGrid from './components/ProjectGrid';
import { BUTTON_CHOOSE } from './const';

const ProjectModal = lazy(() => import('./components/ProjectModal'));
const SearchInput = lazy(() => import('./components/SearchInput'));

function resolveViewFromSearch(searchParams) {
  const view = searchParams.get('viewConstruction');
  if (view && BUTTON_CHOOSE.includes(view)) return view;
  return 'Все';
}

export default function ProjectsPage() {
  const [searchParams] = useSearchParams();
  const [selectOnCompetencies, setSelectOnCompetencies] = useState(() => resolveViewFromSearch(searchParams));
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
    setSelectOnCompetencies(resolveViewFromSearch(searchParams));
  }, [searchParams]);

  useEffect(() => {
    if (window.location.hash !== '#block-header-anchor') {
      window.scrollTo(0, 0);
      return;
    }

    const frame = requestAnimationFrame(() => {
      const el = document.getElementById('block-header-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollTo(0, 0);
    });

    return () => cancelAnimationFrame(frame);
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
      <div id="block-header-anchor">
        <FilterToolbar
          onFilter={handleTabsFilter}
          onModal={handleClickModal}
          onActive={handleTabsActive}
          onCityReset={handleCityReset}
          isHide={isHide}
          isDevice={[isMobile, isTablet]}
          city={selectedCity}
        />
      </div>
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
