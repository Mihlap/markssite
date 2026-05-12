import styles from './FooterInfo.module.scss';

const FooterInfo = ({  
  handleMouseEnterFooterMore,
  handleMouseLeaveFooter
}) => {
  return (
    <div className={styles.FooterInfo}>
      <div className={styles.FooterInfo__info}>
        <ul className={styles.FooterInfo__socials}>
          <li>
            <a
              onMouseEnter={handleMouseEnterFooterMore}
              onMouseLeave={handleMouseLeaveFooter}
              href="https://vk.com/marks_group_vk"
              target="_blank"
              rel="noreferrer">
              vk
            </a>
          </li>
          <li>
            <a
              onMouseEnter={handleMouseEnterFooterMore}
              onMouseLeave={handleMouseLeaveFooter}
              href="https://www.youtube.com/@marks_group"
              target="_blank"
              rel="noreferrer">
              yt
            </a>
          </li>
          <li>
            <a
              onMouseEnter={handleMouseEnterFooterMore}
              onMouseLeave={handleMouseLeaveFooter}
              href="https://rutube.ru/channel/38807824/"
              target="_blank"
              rel="noreferrer">
              ru
            </a>
          </li>
          <li>
            <a
              onMouseEnter={handleMouseEnterFooterMore}
              onMouseLeave={handleMouseLeaveFooter}
              href="https://t.me/marks_group"
              target="_blank"
              rel="noreferrer">
              tg
            </a>
          </li>
        </ul>
        <div className={styles.FooterInfo__contacts}>
          <div className={styles.FooterInfo__office}>Офис Москва</div>
          <div className={styles.FooterInfo__address}>
            <a
              href="https://yandex.ru/maps/-/CDdzIZ0o"
              target="_blank"
              rel="noreferrer"
              onMouseEnter={handleMouseEnterFooterMore}
              onMouseLeave={handleMouseLeaveFooter}>
              {' '}
              Москва 3-я Ямского Поля, дом 20 строение 1 офис 704
            </a>
          </div>
          <div className={styles.FooterInfo__phone}>Телефон</div>
          <div className={styles.FooterInfo__number}>
            <a href="tel:+74951201226" onMouseEnter={handleMouseEnterFooterMore} onMouseLeave={handleMouseLeaveFooter}>
              +7 (495) 120-12-26
            </a>
          </div>
          <div className={styles.FooterInfo__mail}>
            <a
              href="mailto:mail@marksgroup.ru"
              onMouseEnter={handleMouseEnterFooterMore}
              onMouseLeave={handleMouseLeaveFooter}>
              mail@marksgroup.ru
            </a>
          </div>
        </div>
        <div className={styles.FooterInfo__footnote}>
          <a
            href="/information"
            onMouseEnter={handleMouseEnterFooterMore}
            onMouseLeave={handleMouseLeaveFooter}
            target="_blank"
            rel="noreferrer">
            Документы
          </a>
          <a
            href="https://laba-laba.ru/"
            onMouseEnter={handleMouseEnterFooterMore}
            onMouseLeave={handleMouseLeaveFooter}
            target="_blank"
            rel="noreferrer"
          >
            <span>&copy; laba</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterInfo;
