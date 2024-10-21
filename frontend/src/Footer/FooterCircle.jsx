import React from 'react';
import styles from './FooterCircle.module.scss';

const FooterCircle = () => {
  return (
    <footer className={styles.FooterCircle}>
      <div className={styles.FooterCircle__main}>
        <div className={styles.FooterCircle__action}>
          <div className={styles.FooterCircle__open}>
            <span>Обсудим ваш</span>
            <span>проект</span>
          </div>
        </div>
        <div className={styles.FooterCircle__info}>
          <ul className={styles.FooterCircle__socials}>
            <li>
              <a href="#">vk</a>
            </li>
            <li>
              <a href="#">yt</a>
            </li>
            <li>
              <a href="#">ru</a>
            </li>
            <li>
              <a href="#">tg</a>
            </li>
          </ul>
          <div className={styles.FooterCircle__contacts}>
            <div className={styles.FooterCircle__office}>Офис Москва</div>
            <div className={styles.FooterCircle__address}>
              <a href="https://yandex.ru/maps/-/CDdzIZ0o">Москва 3-я Ямского Поля, дом 20 строение 1 офис 704</a>
            </div>
            <div className={styles.FooterCircle__phone}>Телефон</div>
            <div className={styles.FooterCircle__number}>
              <a href="tel:+74951201226">+7 (495) 120-12-26</a>
            </div>
            <div className={styles.FooterCircle__mail}>
              <a href="mailto:mail@marksgroup.ru">mail@marksgroup.ru</a>
            </div>
          </div>
          <div className={styles.FooterCircle__footnote}>
            <a href="https://yandex.ru/maps/-/CDdzIZ0o">Документы</a>
            <span>&copy; laba</span>
          </div>
        </div>
      </div>

      <div className={styles.FooterCircle__layer}>
        <div className={styles.FooterCircle__action}>
          <a href="#" className={styles.FooterCircle__link}>
            Осталось только нажать
          </a>
        </div>
        <div className={styles.FooterCircle__info}>
          <ul className={styles.FooterCircle__socials}>
            <li>
              <a href="#">vk</a>
            </li>
            <li>
              <a href="#">yt</a>
            </li>
            <li>
              <a href="#">ru</a>
            </li>
            <li>
              <a href="#">tg</a>
            </li>
          </ul>
          <div className={styles.FooterCircle__contacts}>
            <div className={styles.FooterCircle__office}>Офис Москва</div>
            <div className={styles.FooterCircle__address}>
              <a href="https://yandex.ru/maps/-/CDdzIZ0o">Москва 3-я Ямского Поля, дом 20 строение 1 офис 704</a>
            </div>
            <div className={styles.FooterCircle__phone}>Телефон</div>
            <div className={styles.FooterCircle__number}>
              <a href="tel:+74951201226">+7 (495) 120-12-26</a>
            </div>
            <div className={styles.FooterCircle__mail}>
              <a href="mailto:mail@marksgroup.ru">mail@marksgroup.ru</a>
            </div>
          </div>
          <div className={styles.FooterCircle__footnote}>
            <a href="https://yandex.ru/maps/-/CDdzIZ0o">Документы</a>
            <span>&copy; laba</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterCircle;
