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
 const [scrollPosition, setScrollPosition] = useState(0);

 useEffect(() => {
   // Функция для отключения скролла
   function disableScroll() {
     // Сохраняем текущую позицию скролла
     setScrollPosition(
       window.pageYOffset || document.documentElement.scrollTop
     );
     // Фиксируем body в текущей позиции скролла
     document.body.style.position = "fixed";
     document.body.style.top = `-${scrollPosition}px`;
   }

   // Функция для включения скролла
   function enableScroll() {
     // Разблокируем body и возвращаем его в начальное положение
     document.body.style.position = "";
     document.body.style.top = "";
     // Прокручиваем страницу до сохраненной позиции скролла
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
 }, [isScrollDisabled]);

 function handleClickScroll() {
   setIsScrollDisabled(!isScrollDisabled);
 }

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
