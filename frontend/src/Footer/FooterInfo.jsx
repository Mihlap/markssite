import styles from './FooterInfo.module.scss';

const FooterInfo = ({
  handleMouseEnterFooter,
  handleMouseEnterFooterMore,
  handleMouseLeaveFooter,
  handleMouseLeave,
}) => {
  return (
    <div className={styles.FooterInfo}>
      <div className={styles.FooterInfo__info}>
        <ul className={styles.FooterInfo__socials}>
          <li>
            <a
              onMouseEnter={handleMouseEnterFooterMore}
              onMouseLeave={handleMouseLeaveFooter}
              href="https://vk.com/marks_group_vk">
              vk
            </a>
          </li>
          <li>
            <a
              onMouseEnter={handleMouseEnterFooterMore}
              onMouseLeave={handleMouseLeaveFooter}
              href="https://www.youtube.com/@marks_group">
              yt
            </a>
          </li>
          <li>
            <a
              onMouseEnter={handleMouseEnterFooterMore}
              onMouseLeave={handleMouseLeaveFooter}
              href="https://rutube.ru/channel/38807824/">
              ru
            </a>
          </li>
          <li>
            <a
              onMouseEnter={handleMouseEnterFooterMore}
              onMouseLeave={handleMouseLeaveFooter}
              href="https://t.me/marks_group">
              tg
            </a>
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
