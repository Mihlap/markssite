import { useEffect, useState, Suspense, lazy, useCallback, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';

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
import Loading from './Loading/LoadingNew';
import RouteMounted from './UI/RouteMounted/RouteMounted';
// import Loading from './UI/Loading/christmas/Loading';

const CustomCursor = lazy(() => import('./UI/CustomCursor/CustomCursor'));
const CookieComponent = lazy(() => import('./UI/CookieComponent/CookieComponent'));
const MarksEntityRow = lazy(() => import('./Admin/ui/EntityRow/MarksEntityRow'));

const Header = lazy(() => import('./Header/Header'));
const Contacts = lazy(() => import('./Contact/ContactPage'));

const ProjectsPage = lazy(() => import('./Project/ProjectsPage'));
const ProjectCard = lazy(() => import('./Project/components/ProjectCard'));

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

const Admin = lazy(() => import('./Admin/Admin'));
const HomeAdmin = lazy(() => import('./Admin/HomeAdmin/HomeAdmin'));
const AdminProject = lazy(() => import('./Admin/project/Project'));
const AdminArticles = lazy(() => import('./Admin/articles/Articles'));
const AdminHRPortal = lazy(() => import('./Admin/hr-portal/HRPortal'));
const AdminCompany = lazy(() => import('./Admin/about-the-company/Company'));
const Applications = lazy(() => import('./Admin/applications/Applications'));

const NotFound = lazy(() => import('./NotFound/NotFound'));

function LazyPage({ onMounted, children }) {
  return (
    <PageFade>
      <RouteMounted onMounted={onMounted}>{children}</RouteMounted>
    </PageFade>
  );
}

function shouldSkipGlobalLoader(path) {
  const normalized = path.toLowerCase();
  return (
    normalized === '/information' ||
    path.startsWith('/admin') ||
    path.startsWith('/hr/') ||
    path === '/footerForm'
  );
}

export default function App() {
  const user = useSelector((state) => state.auth.user);
  const currentPage = useSelector((state) => state.user.currentPage);
  const showNavbarFooter = useSelector((state) => state.user.showNavbarFooter);
  const isActive = useSelector((state) => state.toggle.isActiveForButton3);

  const location = useLocation();
  const dispatch = useDispatch();

  const isInitialPageLoadRef = useRef(true);

  const [loading, setLoading] = useState(() => {
    if (IS_DEV) return false;
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    return !shouldSkipGlobalLoader(path);
  });
  const [isReady, setIsReady] = useState(() => {
    if (IS_DEV) return true;
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    return shouldSkipGlobalLoader(path);
  });
  const [pageMounted, setPageMounted] = useState(false);

  const isPortalPage = location.pathname.startsWith('/hr/');
  const isFooterFormPage = location.pathname === '/footerForm';
  const isAdminPage = location.pathname.startsWith('/admin');
  const isNavPreviewPage = location.pathname === '/navbar';

  const markPageMounted = useCallback(() => setPageMounted(true), []);

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
    if (!isInitialPageLoadRef.current) return;

    isInitialPageLoadRef.current = false;
    setPageMounted(false);

    if (IS_DEV || shouldSkipGlobalLoader(location.pathname)) {
      setLoading(false);
      setIsReady(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!loading) return;

    if (IS_DEV) {
      setIsReady(true);
      return;
    }  
    setIsReady(pageMounted);
  }, [loading, pageMounted]);

  useEffect(() => {
    if (!loading || IS_DEV || isReady || shouldSkipGlobalLoader(location.pathname)) return undefined;

    const timer = setTimeout(() => {
      setIsReady(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, [loading, isReady, location.pathname]);

  useEffect(() => {
    if (!location.pathname.startsWith('/admin')) {
      dispatch(resetCurrentPage());
    }
  }, [location.pathname, dispatch]);

  const shouldShowGlobalLoader = !IS_DEV && loading && !shouldSkipGlobalLoader(location.pathname);

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
                  <LazyPage onMounted={markPageMounted}>
                    <Header
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                      handleSpecialHover={handleSpecialHover}
                    />
                  </LazyPage>
                }
              />

              <Route
                path="/project"
                element={
                  <LazyPage onMounted={markPageMounted}>
                    <ProjectsPage />
                  </LazyPage>
                }
              />


              <Route
                path="/test"
                element={
                  <LazyPage onMounted={markPageMounted}>
                    <MarksEntityRow
                      title="Ведущий инженер-конструктор"
                      desc="Экспертно-аналитический отдел"
                      id="9062234144"
                      role="manager"
                      visible="legenda"
                      onEdit
                      onToggle
                      onDelete
                    />
                  </LazyPage>
                }
              />

              <Route
                path="/project/:id"
                element={
                  <LazyPage onMounted={markPageMounted}>
                    <ProjectCard
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                    />
                  </LazyPage>
                }
              />

              <Route
                path="/company"
                element={
                  <LazyPage onMounted={markPageMounted}>
                    <CompanyNew
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                    />
                  </LazyPage>
                }
              />

              <Route
                path="/publication"
                element={
                  <LazyPage onMounted={markPageMounted}>
                    <Publics
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                    />
                  </LazyPage>
                }
              />

              <Route
                path="/publication/:id"
                element={
                  <LazyPage onMounted={markPageMounted}>
                    <ArticleCard
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                    />
                  </LazyPage>
                }
              />

              <Route
                path="/journalPage"
                element={
                  <LazyPage onMounted={markPageMounted}>
                    <JournalMain
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                    />
                  </LazyPage>
                }
              />

              <Route
                path="/journal/:id"
                element={
                  <LazyPage onMounted={markPageMounted}>
                    <ArticleJournalPage />
                  </LazyPage>
                }
              />

              <Route
                path="/contacts"
                element={
                  <LazyPage onMounted={markPageMounted}>
                    <Contacts
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                    />
                  </LazyPage>
                }
              />

              <Route
                path="/information"
                element={
                  <LazyPage onMounted={markPageMounted}>
                    <Information
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                    />
                  </LazyPage>
                }
              />

              {/* HR-портал */}
              <Route
                path="/hr/home"
                element={
                  <LazyPage onMounted={markPageMounted}>
                    <VacanciesMain3
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                    />
                  </LazyPage>
                }
              />
              <Route
                path="/hr/vacancies"
                element={
                  <LazyPage onMounted={markPageMounted}>
                    <VacanciesComponent
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                    />
                  </LazyPage>
                }
              />
              <Route
                path="/hr/internships"
                element={
                  <LazyPage onMounted={markPageMounted}>
                    <Internships
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                    />
                  </LazyPage>
                }
              />
              <Route
                path="/hr/vacancies/:id"
                element={
                  <LazyPage onMounted={markPageMounted}>
                    <VacanciesMainCard
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleMouseHover={handleMouseHover}
                    />
                  </LazyPage>
                }
              />

              <Route
                path="/footerForm"
                element={
                  <LazyPage onMounted={markPageMounted}>
                    <FooterForm
                      handleMouseEnterFooter={handleMouseEnterFooterWhite}
                      handleMouseEnterFooterMore={handleMouseEnterFooterWhiteMore}
                      handleMouseLeaveFooter={handleMouseLeaveFooterWhite}
                      handleMouseLeave={handleMouseLeave}
                    />
                  </LazyPage>
                }
              />

              {isActive && (
                <Route
                  path="/signup"
                  element={
                    <LazyPage onMounted={markPageMounted}>
                      <SignUpPage />
                    </LazyPage>
                  }
                />
              )}

              <Route
                path="/login"
                element={
                  <LazyPage onMounted={markPageMounted}>
                    <Login />
                  </LazyPage>
                }
              />

              {user && (
                <Route
                  path="/admin/*"
                  element={
                    <LazyPage onMounted={markPageMounted}>
                      <Admin user={user} onPageChange={handlePageChange} />
                    </LazyPage>
                  }>
                  <Route index element={<HomeAdmin />} />
                  <Route path="home" element={<HomeAdmin />} />
                  <Route path="add-a-project" element={<AdminProject user={user} />} />
                  <Route path="add-a-articles" element={<AdminArticles user={user} />} />
                  <Route path="add-hr-portal" element={<AdminHRPortal user={user} />} />
                  <Route
                    path="add-a-company"
                    element={
                      user?.name === 'hr778' ? (
                        <LazyPage onMounted={markPageMounted}>
                          <AdminHRPortal user={user} />
                        </LazyPage>
                      ) : (
                        <AdminCompany user={user} />
                      )
                    }
                  />
                  <Route path="add-a-applications" element={<Applications />} />
                </Route>
              )}

              <Route
                path="*"
                element={
                  <LazyPage onMounted={markPageMounted}>
                    <NotFound />
                  </LazyPage>
                }
              />
            </Routes>

            <Suspense fallback={null}>
              <CookieComponent />
            </Suspense>

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

            {showNavbarFooter && currentPage !== 'add' && (
              <Suspense fallback={null}>
                <CustomCursor />
              </Suspense>
            )}
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
