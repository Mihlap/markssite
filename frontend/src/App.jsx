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
import Portal from "./Portal/Portal";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import Information from "./Information/Information";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Loading from "./Loading/Loading";
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

export default function App() {
  const user = useSelector((state) => state.auth.user);
  const currentPage = useSelector((state) => state.user.currentPage);
  const showNavbarFooter = useSelector((state) => state.user.showNavbarFooter);
  const isActive = useSelector((state) => state.toggle.isActiveForButton3);
  const location = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(checkUserAuth());
    dispatch(fetchToggleStateForButton3Async());
  }, [dispatch]);

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const handleReturn = () => {
    dispatch(resetCurrentPage()); // Сбрасываем currentPage
    localStorage.removeItem("activeClass");
  };

  // console.log(isUserChecked);
  // таймаут для прелоудера на сайте
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3500);
  }, []);

  // console.log(`пользователь 👉${user?.name}👈`);
  return (
    <HelmetProvider>
      {loading === true ? (
        <Loading />
      ) : (
        <>
          {showNavbarFooter && currentPage !== "add" && <Navbar />}
          {showNavbarFooter && currentPage !== "add" && (
            <ButtonAdmin user={user} />
          )}
          <TransitionGroup>
            <CSSTransition key={location.key} classNames="fade" timeout={300}>
              <Routes location={location}>
                <Route path="/" element={<Header user={user} />} />
                {/* <Route path="/competention" element={<Competentions />} /> */}
                <Route path="/project" element={<Project />} />
                <Route
                  path="/project/:viewConstruction?"
                  component={<Project />}
                />
                <Route path="/projects/:id" element={<ProjectCard />} />
                <Route path="/company" element={<Company />} />
                <Route path="/publication" element={<Publics />} />
                <Route path="/publication/:id" element={<ArticleCard />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/portal" element={<Portal />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/login" element={<Login />} />
                {isActive && <Route path="/signup" element={<SignUpPage />} />}
                <Route path="/information" element={<Information />} />

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
          {showNavbarFooter && currentPage !== "add" && <Footer />}
          {/* {showNavbarFooter && currentPage !== "add" && <CustomCursor />} */}
        </>
      )}
    </HelmetProvider>
  );
}
