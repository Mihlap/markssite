import { Route, Routes } from "react-router-dom";
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

const App = () => {
  const [isScrollDisabled, setIsScrollDisabled] = useState(false);

  // функция выключения скрола
  function handleClickScroll() {
    setIsScrollDisabled((prevState) => !prevState);
  }

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (isScrollDisabled) {
      // Запретить прокрутку
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      body.style.position = "fixed";
      body.style.width = "100%";
    } else {
      // Разрешить прокрутку
      html.style.overflow = "";
      body.style.overflowX = "auto";
      body.style.overflowY = "scroll";
      body.style.position = "";
      body.style.width = "";
    }

    return () => {
      // Восстановить значения по умолчанию при размонтировании компонента
      html.style.overflow = "";
      body.style.overflowX = "";
      body.style.overflowY = "";
      body.style.position = "";
      body.style.width = "";
    };
  }, [isScrollDisabled]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Header handleClickScroll={handleClickScroll} />}
        />
        <Route path="/competention" element={<Competentions />} />
        <Route path="/project" element={<Project />} />
        <Route path="/public" element={<Publics />} />
        <Route path="/company" element={<Company />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/portal" element={<Portal />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
