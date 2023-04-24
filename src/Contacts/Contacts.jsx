import React from 'react';
import Navbar from '../Navbar/Navbar';
import styles from './Contacts.module.css';

const Contacts = () => {
  return (
    <>
    <Navbar/>
    <div className={styles.contact}>
      <h1>Здесь будет страница Контактов</h1>
      </div>
      </>
  )
}

export default Contacts;