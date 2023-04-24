import React from 'react';
import styles from './Footer.module.css';
import marks from '.././icons/© marksdigital.svg';

const Footer = () => {
  return (
<div className={styles.main}>
    <div className={styles.mail}>
     <a href="mailto:mail@marksgroup.ru">mail@marksgroup.ru</a>
     </div>
     <div className={styles.block_lang}>
   <p className={styles.en}>EN</p>
</div>
     <div className={`${styles.office} ${styles.a}`}>Офис Москва</div>
     <div className={styles.social_links}>
  <a href="https://vk.com/profile" style={{marginRight: '21px'}}>VK </a>
  <a href="https://www.instagram.com/profile/" style={{marginRight: '25px'}}>IG </a>
  <a href="https://www.behance.net/profile" style={{marginRight: '22px'}}>BE </a>
  <a href="https://telegram.me/profile">TG</a>
</div>
<div className={styles.tel}>+7(495) 120-12-26</div>
     <div className={styles.address}>Москва З-я ул. Ямского Поля, дом 20 строение 1 офис 704</div>
     <div className={styles.job}>
      <a href="/" style={{marginRight: '24px'}}>Сотрудникам</a>
      <a href="/" >Документы</a>
      <a href="/">
      <img className={styles.marks} src={marks} alt="image_marks"/>  
      </a>
</div>
</div>
  )
} 

export default Footer;