import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Company from "./Company/Company";
import Header from "./Header/Header";
import { useSelector } from "react-redux";
import Competentions from "./Competentions/Competentions";
import Contacts from "./Contacts/Contacts";
import Project from "./Project/Project";
import Publics from "./Publics/Publics";
import NotFound from "./NotFound/NotFound";
import Portal from "./Portal/Portal";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import Information from "./Information/Information";
import WinePark from "./Project/WinePark/WinePark";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Badaevsky from "./articlesProject/Badaevsky/Badaevsky";
import Slava from "./Project/Slava/Slava";
import Loading from "./Loading/Loading";
import PrimePark from "./Project/PrimePark/PrimePark";
import HotelAppart from "./Project/Hotel_appart/HotelAppart";
import WineParkArticles from "./articlesProject/WinePark/WineParkArticles";
import Login from "./Login/Login";
import Add from "./Add/Add";
import HomeAdmin from "./Add/HomeAdmin";
import AddProject from "./Add/add-project/AddProject";
import AddArticles from "./Add/add-articles/AddArticles";
import AddCompany from "./Add/add-about-the-company/AddCompany";


const App = () => {
  // const user = useSelector((state) => state.login.user);
  const user = 1;
  const location = useLocation();
  const [isScrollDisabled, setIsScrollDisabled] = useState(false);

  const [loading, setLoading] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [isHidden, setHidden] = useState(false);
  const [showNavbar, setNavBarOpen] = useState(true);
  const [showFooter, setShowFooter] = useState(true);

  useEffect(() => {
    const body = document.querySelector("body");
    if (navOpen) {
      // Запрещаем вертикальный скролл
      body.style.overflowY = "hidden";
    } else {
      // Разрешаем вертикальный скролл
      body.style.overflowY = "scroll";
    }
  }, [navOpen]);


  // таймаут для прелоудера на сайте
  // setTimeout(() => {
  //   setLoading(false);
  // }, 3500);

  function handleClickScroll() {
    setIsScrollDisabled(!isScrollDisabled);
  }
  return (
    <>
      {loading === true ? (
        <Loading />
      ) : (
        <>
          {showNavbar && (
            <Navbar
              user={user}
              handleClickScroll={handleClickScroll}
              setNavOpen={setNavOpen}
              navOpen={navOpen}
            />
          )}
          <TransitionGroup>
            <CSSTransition key={location.key} classNames="fade" timeout={300}>
              <Routes location={location}>
                <Route
                  path="/"
                  element={<Header user={user} navOpen={navOpen} isHidden={isHidden} />}
                />
                <Route path="/competention" element={<Competentions />} />
                <Route path="/project" element={<Project />} />
                <Route path="/public" element={<Publics />} />
                <Route path="/company" element={<Company />} />
                {/* <Route path="/contacts" element={<Contacts />} /> */}
                <Route path="/portal" element={<Portal />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/winepark" element={<WinePark />} />
                <Route
                  path="/winepark-article"
                  element={<WineParkArticles />}
                />
                <Route path="/badaevsky" element={<Badaevsky />} />
                <Route path="/slava" element={<Slava />} />
                <Route path="/prime-park" element={<PrimePark />} />
                <Route path="/hotel-appart" element={<HotelAppart />} />
                {/* <Route path="/login" element={<Login />} /> */}
                <Route path="/information" element={<Information/>}/>
                <Route
                  path="/admin/*"
                  element={
                    // Если пользователь авторизован, показываем компонент Add,
                    // иначе перенаправляем пользователя на страницу входа
                    user ? (
                      <Add
                        setNavBarOpen={setNavBarOpen}
                        setShowFooter={setShowFooter}
                        user={user}
                      />
                    ) : (
                      <Navigate to="/login" replace={true} />
                    )
                  }
                >
                  <Route path="home" element={<Add />} />
                  <Route path="add-a-project" element={<AddProject />} />
                  <Route path="add-a-articles" element={<AddArticles />} />
                  <Route path="add-a-company" element={<AddCompany />} />
                </Route>
              </Routes>
            </CSSTransition>
          </TransitionGroup>
          {showFooter && <Footer />}
        </>
      )}
    </>
  );
};

export default App;
