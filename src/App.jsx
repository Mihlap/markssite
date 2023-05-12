import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./Header/Header";
import Company from "./Company/Company";
import Competentions from "./Competentions/Competentions";
import Contacts from "./Contacts/Contacts";
import NotFound from "./NotFound/NotFound";
import Portal from "./Portal/Portal";
import Project from "./Project/Project";
import Publics from "./Publics/Publics";
import { useEffect, useState } from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import WinePark from "./Project/WinePark/WinePark";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Badaevsky from "./articlesProject/Badaevsky/Badaevsky";
import Loading from "./Loading/Loading";


const App = () => {
  const location = useLocation();
  const [isScrollDisabled, setIsScrollDisabled] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const [loading, setLoading] = useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 7000);



  useEffect(() => {
    // Функция для отключения скролла
    function disableScroll() {
      setScrollPosition(
        window.pageYOffset || document.documentElement.scrollTop
      );
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPosition}px`;
    }

    // Функция для включения скролла
    function enableScroll() {
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollPosition || "0") * -1);
    }

    if (isScrollDisabled) {
      disableScroll();
    } else {
      enableScroll();
    }
    // Очистка эффекта
    return () => {
      enableScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScrollDisabled]);

  function handleClickScroll() {
    setIsScrollDisabled(!isScrollDisabled);
  }

  return (
    <>
      {loading === true ? (
        <Loading />
      ) : (
        <>
        <Navbar handleClickScroll={handleClickScroll} />
        <TransitionGroup>
          <CSSTransition key={location.key} classNames="fade" timeout={300}>
            <Routes location={location}>
              <Route path="/" element={<Header />} />
              <Route path="/competention" element={<Competentions />} />
              <Route path="/project" element={<Project />} />
              <Route path="/public" element={<Publics />} />
              <Route path="/company" element={<Company />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/portal" element={<Portal />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/winepark" element={<WinePark />} />
              <Route path="/badaevsky" element={<Badaevsky />} />
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
