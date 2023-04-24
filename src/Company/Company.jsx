import React from 'react';
import Navbar from '../Navbar/Navbar';
import styles from './Company.module.css';

const Company = () => {
  return (
    <>
    <Navbar/>
    <div className={styles.company}>
       <h1>Здесь будет страница о Компании</h1>
      </div>
      </>
  )
}

export default Company;
