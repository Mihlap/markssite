import React, { useEffect } from 'react';
import styles from './Add.module.scss';
import AddNavbar from './add-navbar/AddNavbar';
import { Route, Routes } from 'react-router-dom';
import HomeAdmin from './HomeAdmin/HomeAdmin';
import AddProject from './add-project/AddProject';
import AddArticles from './add-articles/AddArticles';
import AddCompany from './add-about-the-company/AddCompany';
import Applications from './applications/Applications';
import AddHRPortal from './add-hr-portal/AddHRPortal';

export default function Add({ user, onPageChange, handleReturn }) {
  useEffect(() => {
    onPageChange('add'); // Передайте имя страницы в onPageChange
  }, [onPageChange]);

  return (
    <>
      <div className={styles.add_container}>
        <AddNavbar handleReturn={handleReturn} user={user} />
        <Routes>
          <Route path="/home" element={<HomeAdmin />} />
          <Route path="add-a-project" element={<AddProject user={user} />} />
          <Route path="add-a-articles" element={<AddArticles user={user} />} />
          <Route path="add-hr-portal" element={<AddHRPortal user={user} />} />
          <Route path="add-a-company" element={<AddCompany />} />
          <Route path="add-a-applications" element={<Applications />} />
        </Routes>
      </div>
    </>
  );
}
