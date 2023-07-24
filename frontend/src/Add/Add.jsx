import React, { useEffect } from "react";
import styles from "./Add.module.scss";
import AddNavbar from "./add-navbar/AddNavbar";
import { Route, Routes } from "react-router-dom";
import HomeAdmin from "./HomeAdmin";
import AddProject from "./add-project/AddProject";
import AddArticles from "./add-articles/AddArticles";
import AddCompany from "./add-about-the-company/AddCompany";
import { useDispatch, useSelector } from "react-redux";
import { getFetchForm } from "../store/Slice/projectSlice";
import { getZaprosData } from "../store/Slice/searchProjectMainSlice";

export default function Add({ user, setNavBarOpen, setShowFooter }) {
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.projects);
  const projects = useSelector((state) => state.searchproject.projects);

    useEffect(() => {
      dispatch(getFetchForm());
      dispatch(getZaprosData());
    }, [dispatch]);
  console.log(projects);
  return (
    <div className={styles.add_container}>
      <AddNavbar
        setNavBarOpen={setNavBarOpen}
        setShowFooter={setShowFooter}
        user={user}
      />
      <Routes>
        <Route path="/" element={<HomeAdmin />} />
        <Route
          path="add-a-project"
          element={<AddProject user={user} project={project} />}
        />
        <Route path="add-a-articles" element={<AddArticles />} />
        <Route path="add-a-company" element={<AddCompany />} />
      </Routes>
    </div>
  );
}
