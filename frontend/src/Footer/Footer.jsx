import React from 'react';
import styles from './Footer.module.scss';
import { Link } from 'react-router-dom';

const Footer = ({ handleMouseEnterFooter, handleMouseEnterFooterMore, handleMouseLeaveFooter, handleMouseLeave }) => {

  function mapToLink(link, event) {
     if (event && event.preventDefault) {
       event.preventDefault();
     }
    window.location.href = link;
  }


 const mapHandler = (event) => {
   mapToLink('https://yandex.ru/maps/-/CCUgmThXKA', event);
 };

  return (
    <footer className={styles.footer} onMouseEnter={handleMouseEnterFooter} onMouseLeave={handleMouseLeave}>
      <div id="contacts" className={styles.footer__container}>
        {/* левая сторона  */}
        <div className={styles.footer__block_left}>
          <div className={styles.footer__mail}>
            <Link
              to="mailto:hr@marksgroup.ru"
              onMouseEnter={handleMouseEnterFooterMore}
              onMouseLeave={handleMouseLeaveFooter}>
              <span>hr@marksgroup.ru</span>
            </Link>
          </div>
          <div className={styles.footer__office}>
            <p>Офис&nbsp;·&nbsp;Москва</p>
          </div>
          <div className={styles.footer__contacts}>
            <div>
              <Link
                to={'tel:+74951201226'}
                className={styles.footer__tel}
                style={{ fontVariantNumeric: 'lining-nums' }}
                onMouseEnter={handleMouseEnterFooterMore}
                onMouseLeave={handleMouseLeaveFooter}>
                <span>+7&nbsp;(495)&nbsp;120-12-26</span>
              </Link>
            </div>
            <div
              className={styles.footer__address} // to={"https://yandex.ru/maps/-/CCUgmThXKA"}
            >
              <div
                role="button"
                tabIndex="0"
                onClick={(event) => mapHandler(event)}
                onMouseEnter={handleMouseEnterFooterMore}
                onMouseLeave={handleMouseLeaveFooter}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    mapHandler(e);
                  }
                }}
                className={styles.footer__address}>
                <span>Москва З-я&nbsp;ул.&nbsp;Ямского Поля, д.&nbsp;20, с. 1, офис&nbsp;704</span>
              </div>
            </div>
          </div>
        </div>

        {/* правая сторона  */}
        <div className={styles.footer__block_right}>
          {/* <div className={styles.footer__lang}>
            <span className={styles.en}>EN</span>
          </div> */}
          <div id="projects" className={styles.footer__socials}>
            <Link
              to="https://vk.com/marks_group_vk"
              target="_blank"
              onMouseEnter={handleMouseEnterFooterMore}
              onMouseLeave={handleMouseLeaveFooter}>
              <span
                // onClick={vkHendler}
                style={{ marginRight: '21px' }}>
                VK
              </span>
            </Link>
            {/* <Link
              to="https://instagram.com/marks_group?igshid=YmMyMTA2M2Y="
              target="_blank"
              onMouseEnter={handleMouseEnterFooterMore}
              onMouseLeave={handleMouseLeaveFooter}
            >
              <span
                style={{ marginRight: "25px" }}
              >
                IG
              </span>
            </Link> */}
            <Link to="https://www.youtube.com/@marks_group" target="_blank">
              <span
                style={{ marginRight: '22px' }}
                onMouseEnter={handleMouseEnterFooterMore}
                onMouseLeave={handleMouseLeaveFooter}>
                YT
              </span>
            </Link>
            <Link
              to="https://t.me/marks_group"
              target="_blank"
              onMouseEnter={handleMouseEnterFooterMore}
              onMouseLeave={handleMouseLeaveFooter}>
              <span
              // onClick={telegramHendler}
              >
                TG
              </span>
            </Link>
          </div>
          <div className={styles.footer__documents}>
            <Link
              to="./Information"
              target="_blank"
              onMouseEnter={handleMouseEnterFooterMore}
              onMouseLeave={handleMouseLeaveFooter}
              className={styles.footer__documents_link}
            >
              <span>Документы</span>
            </Link>
            <div className={styles.footer__copyright}>©&nbsp;MARKSLAB</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
