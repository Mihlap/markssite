import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Company from "./Company/Company";
import Header from "./Header/Header";

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
import Loading from "./Loading/Loading";
import PrimePark from "./Project/PrimePark/PrimePark";
import WineParkArticles from "./articlesProject/WinePark/WineParkArticles";
import Login from "./Login/Login";
import Add from "./Add/Add";

import SignUpPage from "./Login/SignUpPage";
import axios from "axios";
import ProjectCard from "./Project/ProjectCard";


export default function App() {
  const serverHost = process.env.REACT_APP_SERVER_HOST;
  const location = useLocation();
  const [user, setUser] = useState(false);
  const [isUserChecked, setIsUserChecked] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showNavbar, setNavBarOpen] = useState(true);
  const [showFooter, setShowFooter] = useState(true);


  useEffect(() => {
    const checkUser = async () => {
      setIsLoadingUser(true);
      try {
        const response = await axios({
          method: "get",
          url: `${serverHost}/api/auth/user`,
          withCredentials: true, // Включает отправку кук с запросом
        });

        if (response.status === 200) {

          setUser(response.data.name);
          setIsUserChecked(true);
          setNavBarOpen(false); // скрываем навбар
          setShowFooter(false); // скрываем футер
        }
        setIsLoadingUser(false);
      } catch (error) {
        console.log(error);
        setIsUserChecked(true); // Добавьте эту строку
      }
    };

    if (!isUserChecked) {
      checkUser();
    }
  }, [isUserChecked]);

// console.log(isUserChecked);
  // таймаут для прелоудера на сайте
  // setTimeout(() => {
  //   setLoading(false);
  // }, 3500);


  // console.log(`пользователь 👉${user}👈`);
  return (
    <>
      {loading === true ? (
        <Loading />
      ) : (
        <>
          {showNavbar && (
            <Navbar
              user={user}
            />
          )}
          <TransitionGroup>
            <CSSTransition key={location.key} classNames="fade" timeout={300}>
              <Routes location={location}>
                <Route
                  path="/"
                  element={
                    <Header
                      user={user}
                      setNavBarOpen={setNavBarOpen}
                      setShowFooter={setShowFooter}
                    />
                  }
                />
                <Route path="/competention" element={<Competentions />} />
                <Route path="/project" element={<Project />} />
                <Route path="/projects/:id" element={<ProjectCard />} />
                <Route path="/company" element={<Company />} />
                <Route path="/publication" element={<Publics />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/portal" element={<Portal />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/winepark" element={<WinePark />} />
                <Route
                  path="/winepark-article"
                  element={<WineParkArticles />}
                />
                {/* <Route path="/badaevsky" element={<Badaevsky />} /> */}
                {/* <Route path="/slava" element={<Slava />} /> */}
                <Route path="/prime-park" element={<PrimePark />} />
                {/* <Route path="/hotel-appart" element={<HotelAppart />} /> */}
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route
                  path="/signup"
                  element={<SignUpPage setUser={setUser} />}
                />
                <Route path="/information" element={<Information />} />

                {user && !isLoadingUser ? (
                  <Route
                    path="/admin/*"
                    element={
                      <Add
                        setNavBarOpen={setNavBarOpen}
                        setShowFooter={setShowFooter}
                        user={user}
                      />
                    }
                  >
                  </Route>
                ) : null}
              </Routes>
            </CSSTransition>
          </TransitionGroup>
          {showFooter && <Footer />}
        </>
      )}
    </>
  );
};

