import { useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import Company from './Company/Company';
import Header from './Header/Header';
import Contacts from './Contacts/Contacts';
import Project from './Project/Project';
import Publics from './Publics/Publics';
import NotFound from './NotFound/NotFound';
import Navbar from './Navbar/Navbar';
import Information from './Information/Information';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import LoadingNew from './Loading/LoadingNew';
import Login from './Login/Login';
import Add from './Add/Add';

import SignUpPage from './Login/SignUpPage';
import ProjectCard from './Project/ProjectCard';
import ArticleCard from './Publics/ArticleCard';
import CustomCursor from './UI/CustomCursor/CustomCursor';
import { useDispatch, useSelector } from 'react-redux';
import { checkUserAuth } from './store/Slice/authSlice';
import { resetCurrentPage, setCurrentPage } from './store/Slice/userSlice';
import ButtonAdmin from './UI/ButtonAdmin/ButtonAdmin';
import { fetchToggleStateForButton3Async } from './store/Slice/toggleSlice';
import LoadingModal from './Add/add-project/loading/LoadingModal';
import {
  imageHover,
  specialHover,
  textEnter,
  textLeave,
  textLeaveFooter,
  textFooter,
  textFooterEnter,
  textFooterWhite,
  textFooterWhiteEnter,
  textLeaveWhiteFooter,
} from './store/Slice/cursorSlice';
import CookieComponent from './UI/CookieComponent/CookieComponent';
import PortalMenu from './Navbar/PortalMenu';
import VacanciesMainCard from './Portal/Vacancies/VacanciesMainCard/VacanciesMainCard';
import VacanciesMain3 from './Portal/Vacancies/VacanciesMain/VacanciesMain3';
import Internships from './Portal/Internships/Internships';
import VacanciesComponent from './Portal/Vacancies/VacanciesMain/VacanciesComponent/VacanciesComponent';
import Footer from './Footer/Footer';
import FooterCircle from './Footer/FooterCircle';
import FooterForm from './Footer/FooterForm';
import JournalMain from './Journal/JournalMain';

export default function App() {
  const user = useSelector((state) => state.auth.user);
  const currentPage = useSelector((state) => state.user.currentPage);
  const showNavbarFooter = useSelector((state) => state.user.showNavbarFooter);
  const isActive = useSelector((state) => state.toggle.isActiveForButton3);
  const location = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [showPortalMenu, setShowPortalMenu] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const nodeRef = useRef(null);

  const isPortalPage =
    location.pathname.startsWith('/portal/vacancies') ||
    location.pathname.startsWith('/portal/internships') ||
    location.pathname.startsWith('/portal/vacancy');

  const isFooterFormPage = location.pathname === '/footerForm';

  useEffect(() => {
    const vacancyDetailPath = /^\/portal\/vacancy\/\d+$/;
    setShowPortalMenu(
      location.pathname === '/portal/vacancies' ||
        location.pathname === '/portal/internships' ||
        vacancyDetailPath.test(location.pathname) ||
        location.pathname === '/portal/vacanciesMain'
    );
  }, [location.pathname]);

  useEffect(() => {
    dispatch(checkUserAuth());
    dispatch(fetchToggleStateForButton3Async());
  }, [dispatch]);

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const handleMouseEnter = () => dispatch(textEnter());
  const handleMouseLeave = () => dispatch(textLeave());
  const handleMouseHover = () => dispatch(imageHover());
  const handleSpecialHover = () => dispatch(specialHover());

  // Для футера с темным фоном
  const handleMouseEnterFooter = () => dispatch(textFooter());
  const handleMouseEnterFooterMore = () => dispatch(textFooterEnter());
  const handleMouseLeaveFooter = () => dispatch(textLeaveFooter());

  // Для футера с белым фоном
  const handleMouseEnterFooterWhite = () => dispatch(textFooterWhite());
  const handleMouseEnterFooterWhiteMore = () => dispatch(textFooterWhiteEnter());
  const handleMouseLeaveFooterWhite = () => dispatch(textLeaveWhiteFooter());

  // const handleReturn = () => {
  //   dispatch(resetCurrentPage());
  //   localStorage.removeItem('activeClass');
  // };

  // Таймаут для прелоудера
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (videoLoaded) {
      setLoading(false);
    }
  }, [videoLoaded]);

  useEffect(() => {
    if (!location.pathname.startsWith('/admin')) {
      dispatch(resetCurrentPage());
    }
  }, [location.pathname, dispatch]);

  return (
    <HelmetProvider>
      {loading &&
      location.pathname !== '/information' &&
      location.pathname !== '/portal/vacanciesMain' &&
      location.pathname !== '/footerForm' ? (
        <LoadingNew />
      ) : (
        <>
          {showNavbarFooter && currentPage !== 'add' && (
            <>
              {showPortalMenu ? (
                <PortalMenu user={user} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
              ) : (
                <Navbar handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
              )}
            </>
          )}
          {showNavbarFooter && currentPage !== 'add' && (
            <ButtonAdmin user={user} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
          )}
          <TransitionGroup>
            <CSSTransition key={location.key} classNames="fade" timeout={300} nodeRef={nodeRef}>
              <div ref={nodeRef}>
                <Routes location={location}>
                  <Route
                    path="/"
                    element={
                      <Header
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        handleMouseHover={handleMouseHover}
                        handleSpecialHover={handleSpecialHover}
                        setVideoLoaded={setVideoLoaded}
                      />
                    }
                  />
                  <Route
                    path="/project"
                    element={
                      <Project
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        handleMouseHover={handleMouseHover}
                      />
                    }
                  />
                  <Route path="/project/:viewConstruction?" element={<Project />} />
                  <Route
                    path="/projects/:id"
                    element={
                      <ProjectCard
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        handleMouseHover={handleMouseHover}
                      />
                    }
                  />
                  <Route
                    path="/company"
                    element={
                      <Company
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        handleMouseHover={handleMouseHover}
                      />
                    }
                  />
                  <Route
                    path="/publication"
                    element={
                      <Publics
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        handleMouseHover={handleMouseHover}
                      />
                    }
                  />
                  <Route
                    path="/publication/:id"
                    element={
                      <ArticleCard
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        handleMouseHover={handleMouseHover}
                      />
                    }
                  />
                  <Route
                    path="/journalPage"
                    element={
                      <JournalMain
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        handleMouseHover={handleMouseHover}
                      />
                    }
                  />
                  <Route
                    path="/contacts"
                    element={
                      <Contacts
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        handleMouseHover={handleMouseHover}
                      />
                    }
                  />
                  <Route
                    path="/information"
                    element={
                      <Information
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        handleMouseHover={handleMouseHover}
                      />
                    }
                  />
                  <Route
                    path="/portal/vacanciesMain"
                    element={
                      <VacanciesMain3
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        handleMouseHover={handleMouseHover}
                      />
                    }
                  />
                  <Route
                    path="/portal/vacancies"
                    element={
                      <VacanciesComponent
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        handleMouseHover={handleMouseHover}
                      />
                    }
                  />
                  <Route
                    path="/portal/internships"
                    element={
                      <Internships
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        handleMouseHover={handleMouseHover}
                      />
                    }
                  />
                  <Route
                    path="/portal/vacancy/:id"
                    element={
                      <VacanciesMainCard
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        handleMouseHover={handleMouseHover}
                      />
                    }
                  />
                  <Route
                    path="/footerForm"
                    element={
                      <FooterForm
                        handleMouseEnterFooter={handleMouseEnterFooterWhite}
                        handleMouseEnterFooterMore={handleMouseEnterFooterWhiteMore}
                        handleMouseLeaveFooter={handleMouseLeaveFooterWhite}
                        handleMouseLeave={handleMouseLeave}
                      />
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                  <Route path="/login" element={<Login />} />
                  {isActive && <Route path="/signup" element={<SignUpPage />} />}
                  <Route path="/test" element={<LoadingModal />} />
                  {user && <Route path="/admin/*" element={<Add user={user} onPageChange={handlePageChange} />} />}
                </Routes>
              </div>
            </CSSTransition>
          </TransitionGroup>
          <CookieComponent />

          {!isFooterFormPage && showNavbarFooter && currentPage !== 'add' && (
            <>
              {isPortalPage ? (
                <Footer
                  handleMouseEnterFooter={handleMouseEnterFooter}
                  handleMouseEnterFooterMore={handleMouseEnterFooterMore}
                  handleMouseLeaveFooter={handleMouseLeaveFooter}
                  handleMouseLeave={handleMouseLeave}
                />
              ) : (
                <FooterCircle
                  handleMouseEnterFooter={handleMouseEnterFooter}
                  handleMouseEnterFooterMore={handleMouseEnterFooterMore}
                  handleMouseLeaveFooter={handleMouseLeaveFooter}
                  handleMouseLeave={handleMouseLeave}
                />
              )}
            </>
          )}
          {showNavbarFooter && currentPage !== 'add' && <CustomCursor />}
        </>
      )}
    </HelmetProvider>
  );
}
