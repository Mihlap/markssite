import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Company from "./Company/Company";
import Header from "./Header/Header";
// import Competentions from "./Competentions/Competentions";
import Contacts from "./Contacts/Contacts";
// import Project from "./Project/Project";
// import Publics from "./Publics/Publics";
import NotFound from "./NotFound/NotFound";
import Portal from "./Portal/Portal";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import WinePark from "./Project/WinePark/WinePark";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Badaevsky from "./articlesProject/Badaevsky/Badaevsky";
import Slava from "./Project/Slava/Slava";
import Loading from "./Loading/Loading";
import PrimePark from "./Project/PrimePark/PrimePark";
import HotelAppart from "./Project/Hotel_appart/HotelAppart";
import WineParkArticles from "./articlesProject/WinePark/WineParkArticles";

const App = () => {
  const location = useLocation();
  const [isScrollDisabled, setIsScrollDisabled] = useState(false);

  const [loading, setLoading] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [isHidden, setHidden] = useState(false);


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
  setTimeout(() => {
    setLoading(false);
  }, 3500);

  function handleClickScroll() {
    setIsScrollDisabled(!isScrollDisabled);
  }

  return (
    <>
      {loading === true ? (
        <Loading />
      ) : (
        <>
          <Navbar
            handleClickScroll={handleClickScroll}
            setNavOpen={setNavOpen}
            navOpen={navOpen}
          />
          <TransitionGroup>
            <CSSTransition key={location.key} classNames="fade" timeout={300}>
              <Routes location={location}>
                <Route
                  path="/"
                  element={
                    <Header navOpen={navOpen} isHidden={isHidden} />
                  }
                />
                {/* <Route path="/competention" element={<Competentions />} /> */}
                {/* <Route path="/project" element={<Project />} /> */}
                {/* <Route path="/public" element={<Publics />} /> */}
                <Route path="/company" element={<Company />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/portal" element={<Portal />} />
                <Route path="*" element={<NotFound />} />
                ``
                <Route path="/winepark" element={<WinePark />} />
                <Route
                  path="/winepark-article"
                  element={<WineParkArticles />}
                />
                <Route path="/badaevsky" element={<Badaevsky />} />
                <Route path="/slava" element={<Slava />} />
                <Route path="/prime-park" element={<PrimePark />} />
                <Route path="/hotel-appart" element={<HotelAppart />} />
              </Routes>
            </CSSTransition>
          </TransitionGroup>
          <Footer />
        </>
      )}
    </>
  );
};

export default App;
