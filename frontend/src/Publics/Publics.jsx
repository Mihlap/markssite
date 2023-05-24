import React from 'react';
import Navbar from '../Navbar/Navbar';
import styles from './Publics.module.css';

const Publics = () => {
  return (
    <>
    <Navbar/>
    <div className={styles.public}>
 <h1>Здесь будет страница Публикаций</h1>
    </div>
    </>
  )
}

export default Publics;