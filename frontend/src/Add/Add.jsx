import React from "react";
import styles from "./Add.module.scss";
import AddNavbar from "./add-navbar/AddNavbar";
import { Route, Routes } from "react-router-dom";
import HomeAdmin from "./HomeAdmin";
import AddProject from "./add-project/AddProject";
import AddArticles from "./add-articles/AddArticles";
import AddCompany from "./add-about-the-company/AddCompany";

export default function Add({ user, setNavBarOpen, setShowFooter }) {
  // console.log(reviews.map((el) => el.attributes));
  return (
    <div className={styles.add_container}>
      <AddNavbar />
      <Routes>
        <Route path="/" element={<HomeAdmin />} />
        <Route path="add-a-project" element={<AddProject />} />
        <Route path="add-a-articles" element={<AddArticles />} />
        <Route path="add-a-company" element={<AddCompany />} />
      </Routes>
    </div>
  );
}
