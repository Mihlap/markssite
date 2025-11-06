import { useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import Company from './Company/Company';
// import CompanyNew from './Company/CompanyNew';
import Header from './Header/Header';
import Contacts from './Contacts/Contacts';
import Project from './Project/Project';
import Publics from './Publics/Publics';
import NotFound from './NotFound/NotFound';
import Information from './Information/Information';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import LoadingNew from './Loading/LoadingNew';
import Login from './Login/Login';
import Add from './Add/Add';
import HomeAdmin from './Add/HomeAdmin/HomeAdmin';
import AddProject from './Add/add-project/AddProject';
import AddArticles from './Add/add-articles/AddArticles';
import Applications from './Add/applications/Applications';
import AddHRPortal from './Add/add-hr-portal/AddHRPortal';
// import AddCompany from './Add/add-about-the-company/AddCompany';

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
import VacanciesMainCard from './Portal/Vacancies/VacanciesMainCard/VacanciesMainCard';
import VacanciesMain3 from './Portal/Vacancies/VacanciesMain/VacanciesMain3';
import Internships from './Portal/Internships/Internships';
import VacanciesComponent from './Portal/Vacancies/VacanciesMain/VacanciesComponent/VacanciesComponent';
import Footer from './Footer/Footer';
import FooterCircle from './Footer/FooterCircle';
import FooterForm from './Footer/FooterForm';
import JournalMain from './Journal/JournalMain';
import ArticleJournalPage from './Journal/JournalArticlePage/ArticleJournalPage';
import { IS_DEV } from './const/is-dev';
import NavBar from './UI/NavBar/NavBar';

export default function App() {
  const user = useSelector((state) => state.auth.user);
  const currentPage = useSelector((state) => state.user.currentPage);
  const showNavbarFooter = useSelector((state) => state.user.showNavbarFooter);
  const isActive = useSelector((state) => state.toggle.isActiveForButton3);
  const location = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(!IS_DEV);
  const [videoLoaded, setVideoLoaded] = useState(false);
  // const nodeRef = useRef(null);

  const isPortalPage =
    location.pathname.startsWith('/hr/vacancies') ||
    location.pathname.startsWith('/hr/internships') ||
    location.pathname.startsWith('/portal/vacancy');

  const isFooterFormPage = location.pathname === '/footerForm';
  const isAdminPage = location.pathname.startsWith('/admin');

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
    if (IS_DEV) return;
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
      {!IS_DEV &&
      loading &&
      location.pathname !== '/information' &&
      location.pathname !== '/hr/home' &&
      location.pathname !== '/footerForm' ? (
        <LoadingNew />
      ) : (
        <>
          {showNavbarFooter && currentPage !== 'add' && (
            <ButtonAdmin user={user} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
          )}
          {/* 🚨 МИША, это надо или нет? Если да, то надо как-то переделать эти плавные переходы, потому-что у меня почему-то
          якоря и скролы ломаются из-за этого 🚨 */}
          {/* <TransitionGroup> */}
          {/* <CSSTransition key={location.key} classNames="fade" timeout={300} nodeRef={nodeRef}> */}
          {/* <div ref={nodeRef}> */}
          {!isAdminPage && <NavBar />}
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
            <Route path="/journal/:id" element={<ArticleJournalPage />} />
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
              path="/hr/home"
              element={
                <VacanciesMain3
                  handleMouseEnter={handleMouseEnter}
                  handleMouseLeave={handleMouseLeave}
                  handleMouseHover={handleMouseHover}
                />
              }
            />
            <Route
              path="/hr/vacancies"
              element={
                <VacanciesComponent
                  handleMouseEnter={handleMouseEnter}
                  handleMouseLeave={handleMouseLeave}
                  handleMouseHover={handleMouseHover}
                />
              }
            />
            <Route
              path="/hr/internships"
              element={
                <Internships
                  handleMouseEnter={handleMouseEnter}
                  handleMouseLeave={handleMouseLeave}
                  handleMouseHover={handleMouseHover}
                />
              }
            />
            <Route
              path="/hr/vacancies/:id"
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
            {isActive && <Route path="/signup" element={<SignUpPage />} />}
            <Route path="/login" element={<Login />} />
            {user && (
              <Route path="/admin/*" element={<Add user={user} onPageChange={handlePageChange} />}>
                <Route index element={<HomeAdmin />} />
                <Route path="home" element={<HomeAdmin />} />
                <Route path="add-a-project" element={<AddProject user={user} />} />
                <Route path="add-a-articles" element={<AddArticles user={user} />} />
                <Route path="add-hr-portal" element={<AddHRPortal user={user} />} />
                {/* <Route path="add-a-company" element={<AddCompany user={user} />} /> */}
                <Route path="add-a-applications" element={<Applications />} />
              </Route>
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* </div> */}
          {/* </CSSTransition> */}
          {/* </TransitionGroup> */}
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
