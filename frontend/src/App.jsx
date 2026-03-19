import { useEffect, useState, Suspense, lazy } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import 'swiper/css';

import { useDispatch, useSelector } from 'react-redux';
import { checkUserAuth } from './store/Slice/authSlice';
import { resetCurrentPage, setCurrentPage } from './store/Slice/userSlice';
import { fetchToggleStateForButton3Async } from './store/Slice/toggleSlice';

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

import { IS_DEV } from './const/is-dev';

import NavBar from './UI/NavBar/NavBar';
import PageFade from './UI/PageFade/PageFade';
import ButtonAdmin from './UI/ButtonAdmin/ButtonAdmin';
import CustomCursor from './UI/CustomCursor/CustomCursor';
import CookieComponent from './UI/CookieComponent/CookieComponent';
import Loading from './Loading/LoadingNew';
import MarksEntityRow from './Add/ui/EntityRow/MarksEntityRow';
// import Loading from './UI/Loading/christmas/Loading';

const Header = lazy(() => import('./Header/Header'));
const Contacts = lazy(() => import('./Contacts/Contacts'));

const Project = lazy(() => import('./Project/Project'));
const ProjectCard = lazy(() => import('./Project/ProjectCard'));

const Publics = lazy(() => import('./Publics/Publics'));
const ArticleCard = lazy(() => import('./Publics/ArticleCard'));

const JournalMain = lazy(() => import('./Journal/JournalMain'));
const ArticleJournalPage = lazy(() => import('./Journal/JournalArticlePage/ArticleJournalPage'));

const CompanyNew = lazy(() => import('./Company/CompanyNew'));
const Information = lazy(() => import('./Information/Information'));

const VacanciesMain3 = lazy(() => import('./Portal/Vacancies/VacanciesMain/VacanciesMain3'));
const VacanciesComponent = lazy(() => import('./Portal/Vacancies/VacanciesMain/VacanciesComponent/VacanciesComponent'));
const VacanciesMainCard = lazy(() => import('./Portal/Vacancies/VacanciesMainCard/VacanciesMainCard'));
const Internships = lazy(() => import('./Portal/Internships/Internships'));

const FooterForm = lazy(() => import('./Footer/FooterForm'));
const Footer = lazy(() => import('./Footer/Footer'));
const FooterCircle = lazy(() => import('./Footer/FooterCircle'));

const Login = lazy(() => import('./Login/Login'));
const SignUpPage = lazy(() => import('./Login/SignUpPage'));

const Add = lazy(() => import('./Add/Add'));
const HomeAdmin = lazy(() => import('./Add/HomeAdmin/HomeAdmin'));
const AddProject = lazy(() => import('./Add/add-project/AddProject'));
const AddArticles = lazy(() => import('./Add/add-articles/AddArticles'));
const AddHRPortal = lazy(() => import('./Add/add-hr-portal/AddHRPortal'));
const AddCompany = lazy(() => import('./Add/add-about-the-company/AddCompany'));
const Applications = lazy(() => import('./Add/applications/Applications'));

const NotFound = lazy(() => import('./NotFound/NotFound'));

export default function App() {
  const user = useSelector((state) => state.auth.user);
  const currentPage = useSelector((state) => state.user.currentPage);
  const showNavbarFooter = useSelector((state) => state.user.showNavbarFooter);
  const isActive = useSelector((state) => state.toggle.isActiveForButton3);

  const location = useLocation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(!IS_DEV);
  const [isReady, setIsReady] = useState(IS_DEV);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const isPortalPage = location.pathname.startsWith('/hr/');
  const isFooterFormPage = location.pathname === '/footerForm';
  const isAdminPage = location.pathname.startsWith('/admin');
  const isNavPreviewPage = location.pathname === '/navbar';

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

  // Для футера с тёмным фоном
  const handleMouseEnterFooter = () => dispatch(textFooter());
  const handleMouseEnterFooterMore = () => dispatch(textFooterEnter());
  const handleMouseLeaveFooter = () => dispatch(textLeaveFooter());

  // Для футера с белым фоном
  const handleMouseEnterFooterWhite = () => dispatch(textFooterWhite());
  const handleMouseEnterFooterWhiteMore = () => dispatch(textFooterWhiteEnter());
  const handleMouseLeaveFooterWhite = () => dispatch(textLeaveWhiteFooter());

  useEffect(() => {
    if (videoLoaded) {
      setIsReady(true);
    }
  }, [videoLoaded]);

  useEffect(() => {
    if (IS_DEV) return;
    if (isReady) return;

    const timer = setTimeout(() => {
      setIsReady(true);
    }, 12000);

    return () => clearTimeout(timer);
  }, [isReady]);

  useEffect(() => {
    if (!location.pathname.startsWith('/admin')) {
      dispatch(resetCurrentPage());
    }
  }, [location.pathname, dispatch]);

  const shouldShowGlobalLoader =
    !IS_DEV && loading && !isPortalPage && location.pathname !== '/information' && location.pathname !== '/footerForm';

  return (
    <HelmetProvider>
      <div className="app-shell">
        <Suspense fallback={null}>
          <div className={'app-shell__content ' + (!shouldShowGlobalLoader ? 'app-shell__content--visible' : '')}>
            {showNavbarFooter && currentPage !== 'add' && (
              <ButtonAdmin user={user} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
            )}

            {!isAdminPage && !isNavPreviewPage && <NavBar />}

            <Routes location={location}>
              <Route
                path="/"
                element={
                  <PageFade>
                    <Header
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                      handleSpecialHover={handleSpecialHover}
                      setVideoLoaded={setVideoLoaded}
                    />
                  </PageFade>
                }
              />

              <Route
                path="/project"
                element={
                  <PageFade>
                    <Project
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                    />
                  </PageFade>
                }
              />

              <Route
                path="/project/:viewConstruction?"
                element={
                  <PageFade>
                    <Project />
                  </PageFade>
                }
              />

              <Route
                path="/test"
                element={
                  <MarksEntityRow
                    title="Ведущий инженер-конструктор"
                    desc="Экспертно-аналитический отдел"
                    id="9062234144"
                    role="admin"
                  />
                }
              />

              <Route
                path="/projects/:id"
                element={
                  <PageFade>
                    <ProjectCard
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                    />
                  </PageFade>
                }
              />

              <Route
                path="/company"
                element={
                  <PageFade>
                    <CompanyNew
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                    />
                  </PageFade>
                }
              />

              <Route
                path="/publication"
                element={
                  <PageFade>
                    <Publics
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                    />
                  </PageFade>
                }
              />

              <Route
                path="/publication/:id"
                element={
                  <PageFade>
                    <ArticleCard
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                    />
                  </PageFade>
                }
              />

              <Route
                path="/journalPage"
                element={
                  <PageFade>
                    <JournalMain
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                    />
                  </PageFade>
                }
              />

              <Route
                path="/journal/:id"
                element={
                  <PageFade>
                    <ArticleJournalPage />
                  </PageFade>
                }
              />

              <Route
                path="/contacts"
                element={
                  <PageFade>
                    <Contacts
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                    />
                  </PageFade>
                }
              />

              <Route
                path="/information"
                element={
                  <PageFade>
                    <Information
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                    />
                  </PageFade>
                }
              />

              {/* HR-портал */}
              <Route
                path="/hr/home"
                element={
                  <PageFade>
                    <VacanciesMain3
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                    />
                  </PageFade>
                }
              />
              <Route
                path="/hr/vacancies"
                element={
                  <PageFade>
                    <VacanciesComponent
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                    />
                  </PageFade>
                }
              />
              <Route
                path="/hr/internships"
                element={
                  <PageFade>
                    <Internships
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                    />
                  </PageFade>
                }
              />
              <Route
                path="/hr/vacancies/:id"
                element={
                  <PageFade>
                    <VacanciesMainCard
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                    />
                  </PageFade>
                }
              />

              <Route
                path="/footerForm"
                element={
                  <PageFade>
                    <FooterForm
                      handleMouseEnterFooter={handleMouseEnterFooterWhite}
                      handleMouseEnterFooterMore={handleMouseEnterFooterWhiteMore}
                      handleMouseLeaveFooter={handleMouseLeaveFooterWhite}
                      handleMouseLeave={handleMouseLeave}
                    />
                  </PageFade>
                }
              />

              {isActive && (
                <Route
                  path="/signup"
                  element={
                    <PageFade>
                      <SignUpPage />
                    </PageFade>
                  }
                />
              )}

              <Route
                path="/login"
                element={
                  <PageFade>
                    <Login />
                  </PageFade>
                }
              />

              {user && (
                <Route
                  path="/admin/*"
                  element={
                    <PageFade>
                      <Add user={user} onPageChange={handlePageChange} />
                    </PageFade>
                  }>
                  <Route index element={<HomeAdmin />} />
                  <Route path="home" element={<HomeAdmin />} />
                  <Route path="add-a-project" element={<AddProject user={user} />} />
                  <Route path="add-a-articles" element={<AddArticles user={user} />} />
                  <Route path="add-hr-portal" element={<AddHRPortal user={user} />} />
                  <Route
                    path="add-a-company"
                    element={
                      user?.name === 'hr778' ? (
                        <PageFade>
                          <AddHRPortal user={user} />
                        </PageFade>
                      ) : (
                        <AddCompany user={user} />
                      )
                    }
                  />
                  <Route path="add-a-applications" element={<Applications />} />
                </Route>
              )}

              <Route
                path="*"
                element={
                  <PageFade>
                    <NotFound />
                  </PageFade>
                }
              />
            </Routes>

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
          </div>
        </Suspense>

        {shouldShowGlobalLoader && (
          <div className="app-shell__loaderOverlay">
            <Loading isReady={isReady} onFinish={() => setLoading(false)} />
          </div>
        )}
      </div>
    </HelmetProvider>
  );
}
