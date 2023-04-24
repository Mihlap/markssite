import React from 'react';
import Navbar from '../Navbar/Navbar';
import styles from './Project.module.css';

 const Project = () => {
  return (
  <>
      <Navbar/>
    <div className={styles.project}>
    <h1>Здесь будет страница Проектов</h1>
    </div>
    </>
  )
}

export default Project;