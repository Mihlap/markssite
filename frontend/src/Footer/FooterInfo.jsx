import styles from './FooterInfo.module.scss';

const FooterInfo = () => {
  return (
    <div className={styles.FooterInfo}>
      <div className={styles.FooterInfo__info}>
        <ul className={styles.FooterInfo__socials}>
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
        <div className={styles.FooterInfo__contacts}>
          <div className={styles.FooterInfo__office}>Офис Москва</div>
          <div className={styles.FooterInfo__address}>
            <a href="https://yandex.ru/maps/-/CDdzIZ0o">Москва 3-я Ямского Поля, дом 20 строение 1 офис 704</a>
          </div>
          <div className={styles.FooterInfo__phone}>Телефон</div>
          <div className={styles.FooterInfo__number}>
            <a href="tel:+74951201226">+7 (495) 120-12-26</a>
          </div>
          <div className={styles.FooterInfo__mail}>
            <a href="mailto:mail@marksgroup.ru">mail@marksgroup.ru</a>
          </div>
        </div>
        <div className={styles.FooterInfo__footnote}>
          <a href="./Information" target="_blank">
            Документы
          </a>
          <span>&copy; laba</span>
        </div>
      </div>
    </div>
  );
};

export default FooterInfo;
