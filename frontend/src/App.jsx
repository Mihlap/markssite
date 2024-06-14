import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./App.css";
import Company from "./Company/Company";
import Header from "./Header/Header";

// import Competentions from "./Competentions/Competentions";
import Contacts from "./Contacts/Contacts";
import Project from "./Project/Project";
import Publics from "./Publics/Publics";
import NotFound from "./NotFound/NotFound";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import Information from "./Information/Information";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Loading from "./Loading/Loading";
import LoadingNew from "./Loading/LoadingNew";
import Login from "./Login/Login";
import Add from "./Add/Add";

import SignUpPage from "./Login/SignUpPage";
import ProjectCard from "./Project/ProjectCard";
import ArticleCard from "./Publics/ArticleCard";
import CustomCursor from "./UI/CustomCursor/CustomCursor";
import { useDispatch, useSelector } from "react-redux";
import { checkUserAuth } from "./store/Slice/authSlice";
import { resetCurrentPage, setCurrentPage } from "./store/Slice/userSlice";
import ButtonAdmin from "./UI/ButtonAdmin/ButtonAdmin";
import { fetchToggleStateForButton3Async } from "./store/Slice/toggleSlice";
import LoadingModal from "./Add/add-project/loading/LoadingModal";
import {
  imageHover,
  specialHover,
  textEnter,
  textFooter,
  textFooterEnter,
  textLeave,
  textLeaveFooter,
} from "./store/Slice/cursorSlice";
import CookieComponent from "./UI/CookieComponent/CookieComponent";
import Internships from "./Portal/Internships/Internships";
import Office from "./Portal/Office/Office";
import PortalMenu from "./Navbar/PortalMenu";
import VacanciesMain from "./Portal/Vacancies/VacanciesMain";
import VacanciesMainCard from "./Portal/Vacancies/VacanciesMainCard";
// import eruda from 'eruda';

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

  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    setShowPortalMenu(
      location.pathname === "/portal/vacancies" ||
        location.pathname === "/portal/internships" ||
        location.pathname === "/portal/office"
    );
  }, [location.pathname]);

  //  useEffect(() => {
  //    // Проверяем, находимся ли мы на административном маршруте
  //    const isAdminRoute = location.pathname.startsWith("/admin/");

  //    // Устанавливаем стиль для курсора в зависимости от маршрута
  //    document.body.style.cursor = isAdminRoute ? "auto" : "none";
  //  }, [location.pathname]);

  useEffect(() => {
    dispatch(checkUserAuth());
    dispatch(fetchToggleStateForButton3Async());
    // eruda.init();
  }, [dispatch]);

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const handleMouseEnter = () => {
    dispatch(textEnter());
  };

  const handleMouseEnterFooter = () => {
    dispatch(textFooter());
  };

  const handleMouseEnterFooterMore = () => {
    dispatch(textFooterEnter());
  };

  const handleMouseLeaveFooter = () => {
    dispatch(textLeaveFooter());
  };

  const handleMouseLeave = () => {
    dispatch(textLeave());
  };

  const handleMouseHover = () => {
    dispatch(imageHover());
  };

  const handleSpecialHover = () => {
    dispatch(specialHover());
  };

  const handleReturn = () => {
    dispatch(resetCurrentPage()); // Сбрасываем currentPage
    localStorage.removeItem("activeClass");
  };

  // console.log(isUserChecked);
  // таймаут для прелоудера на сайте
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
  
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (videoLoaded) {
      setLoading(false);
    }
  }, [videoLoaded]);  

  // console.log(location.pathname)
  // console.log(`пользователь 👉${user?.name}👈`);
  return (
    <HelmetProvider>
      {loading === true &&
      location.pathname.toLowerCase() !== "/information" &&
      location.pathname.toLowerCase() !== "/portal/vacancies"
      ? (
        <LoadingNew />
      ) : (
        <>
          {showNavbarFooter && currentPage !== "add" && (
            <>
            {/* для 2-й итерации !!!! не стирать */}
              {/* {showPortalMenu ? (
              <PortalMenu
                  user={user}
                  handleMouseEnter={handleMouseEnter}
                  handleMouseLeave={handleMouseLeave}
                />
             ) : ( */}
                <Navbar
                  handleMouseEnter={handleMouseEnter}
                  handleMouseLeave={handleMouseLeave}
                />
               {/* )}  */}
            </>
          )}
          {showNavbarFooter && currentPage !== "add" && (
            <ButtonAdmin
              user={user}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
            />
          )}
          <TransitionGroup>
            <CSSTransition key={location.key} classNames="fade" timeout={300}>
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
                  <Route
                    path="/project/:viewConstruction?"
                    component={<Project />}
                  />
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
                    path="/portal/vacancies"
                    element={
                      <VacanciesMain
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        handleMouseHover={handleMouseHover}
                      />
                    }
                  />
                  <Route
                    path="/vacancy/:id"
                    element={
                      <VacanciesMainCard
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
                    path="/portal/office"
                    element={
                      <Office
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        handleMouseHover={handleMouseHover}
                      />
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                  <Route path="/login" element={<Login />} />
                  {isActive && (
                    <Route path="/signup" element={<SignUpPage />} />
                  )}
                  <Route path="/test" element={<LoadingModal />} />
                  {user ? (
                  <Route
                    path="/admin/*"
                    element={
                      <>
                        <Add
                          user={user}
                          onPageChange={handlePageChange}
                          handleReturn={handleReturn}
                        />
                      </>
                    }
                  ></Route>
                ) : null}
              </Routes>
            </CSSTransition>
          </TransitionGroup>
          <CookieComponent />
          {showNavbarFooter && currentPage !== "add" && (
            <Footer
              handleMouseEnterFooter={handleMouseEnterFooter}
              handleMouseEnterFooterMore={handleMouseEnterFooterMore}
              handleMouseLeaveFooter={handleMouseLeaveFooter}
              handleMouseLeave={handleMouseLeave}
            />
          )}
          {showNavbarFooter && currentPage !== "add" && <CustomCursor />}
        </>
      )}
    </HelmetProvider>
  );
}
