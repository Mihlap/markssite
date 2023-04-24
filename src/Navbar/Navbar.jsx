import React, { useState } from 'react';
import styles from './Navbar.module.css';
import logo from '.././icons/logo.svg';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {

  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();

  function handleClick() {
    setClicked(!clicked);
   
    navigate('/')
    navigate('/competention')
    navigate('/project"')
    navigate('/public')
    navigate('/company')
    navigate('/contacts')
    navigate('/polrtal')
  }
  return (
    <>
    <Link to="/" className={`${styles.block} ${styles.block_logo}`} onClick={handleClick}>
     <img src={logo} alt="logo"/>
    </Link>
    <Link to="/competention">
    <button className={`${styles.block} ${styles.block1}`} onClick={handleClick}>
    Компетенции
    </button>
    </Link>
    <Link to="/project">
    <button className={`${styles.block} ${styles.block2}`} onClick={handleClick}>
    Проекты
    </button>
    </Link>
    <Link to="/public">
    <button className={`${styles.block} ${styles.block3}`} onClick={handleClick}>
    Публикации
    </button>
    </Link>
    <Link to="/company">
    <button className={`${styles.block} ${styles.block4}`} onClick={handleClick}>
    О Компании
    </button>
    </Link>
    <Link to="/contacts">
    <button className={`${styles.block} ${styles.block5}`} onClick={handleClick}>
    Контакты
    </button>
    </Link>
    <Link to="/portal">
    <button className={`${styles.block} ${styles.block6}`} onClick={handleClick}>
    HR портал
    </button >
    </Link>
    <button className={`${styles.block} ${styles.block_lang}`}>
       <p>EN</p>
    </button>
      </>
      )
    }

export default Navbar