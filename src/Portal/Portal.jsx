import React from 'react';
import Navbar from '../Navbar/Navbar';
import styles from './Portal.module.css';


const Portal = () => {
  return (
    <>
    <Navbar/>
    <div className={styles.portal}>
     <h1>Здесь будет страница HR Портал</h1>
      </div>
      </>
  )
}

export default Portal;