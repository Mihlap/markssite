import React, { useEffect, useState } from "react";
import styles from "./Add.module.scss";
import AddNavbar from "./add-navbar/AddNavbar";
import { Route, Routes } from "react-router-dom";
import HomeAdmin from "./HomeAdmin/HomeAdmin";
import AddProject from "./add-project/AddProject";
import AddArticles from "./add-articles/AddArticles";
import AddCompany from "./add-about-the-company/AddCompany";
import { useDispatch, useSelector } from "react-redux";
import { getFetchForm } from "../store/Slice/projectSlice";
import { getZaprosData } from "../store/Slice/searchProjectMainSlice";
import { getFetchFormArticle } from "../store/Slice/articleSlice";
import { searchArticleLeftGet } from "../store/Slice/searchArticlePublicLeftSlice";
import { searchArticleRightGet } from "../store/Slice/searchArticlePublicRightSlice";
import { clearCurrentPage } from "../store/Slice/userSlice";
import Applications from "./applications/Applications";

export default function Add({ user, onPageChange, handleReturn }) {
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.projects);
  const projectMain = useSelector((state) => state.searchproject.projects);
  const article = useSelector((state) => state.article.article);
  const articleLeft = useSelector(
    (state) => state.searchArticlePublicLeft.articleLeft
  );
  const [arrIdProject, setArrIdProject] = useState([]);

  useEffect(() => {
    dispatch(getFetchForm());
    dispatch(getZaprosData());
    dispatch(getFetchFormArticle());
    dispatch(searchArticleLeftGet());
    dispatch(searchArticleRightGet());
  }, [dispatch]);

  useEffect(() => {
    onPageChange("add"); // Передайте имя страницы в onPageChange
  }, [onPageChange]);

  //  useEffect(() => {
  //    // Update the arrIdProject state whenever projectMain changes
  //    const newIds = projectMain.map((el) => el.IdProject);
  //    setArrIdProject(newIds);
  //  }, [projectMain]);

  return (
    <div className={styles.add_container}>
      <AddNavbar handleReturn={handleReturn} user={user} />
      <Routes>
        <Route
          path="/home"
          element={
            <HomeAdmin
              projects={project}
              articles={article}
              articleLeft={articleLeft}
            />
          }
        />
        <Route
          path="add-a-project"
          element={<AddProject user={user} project={project} />}
        />
        <Route
          path="add-a-articles"
          element={<AddArticles user={user} article={article} />}
        />
        <Route path="add-a-company" element={<AddCompany />} />
        <Route path="add-a-applications" element={<Applications />} />
      </Routes>
    </div>
  );
}
