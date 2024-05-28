import React from "react";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";

const Footer = ({
  handleMouseEnterFooter,
  handleMouseEnterFooterMore,
  handleMouseLeaveFooter,
  handleMouseLeave, 
}) => {
  function mapToLink(link, event) {
    event.preventDefault();
    window.location.href = link;
  }
  const mapHendler = (event) => {
    mapToLink("https://yandex.ru/maps/-/CCUgmThXKA");
  };
  

  return (
    <footer
      onMouseEnter={handleMouseEnterFooter}
      onMouseLeave={handleMouseLeave}
    >
      <div id="contacts" className={styles.footer_container}>
        <div className={styles.footer_block_left}>
          <div className={styles.mail_block}>
            <Link
              className={styles.mail_link}
              to="mailto:mail@marksgroup.ru"
              onMouseEnter={handleMouseEnterFooterMore}
              onMouseLeave={handleMouseLeaveFooter}
            >
              <span>mail@marksgroup.ru</span>
            </Link>
          </div>
          <div className={styles.office}>
            <p>Офис&nbsp;·&nbsp;Москва</p>
          </div>
          <div className={styles.office_contact}>
            <div className={styles.office_tel}>
              <Link
                to={"tel:+74951201226"}
                className={styles.tel}
                style={{ fontVariantNumeric: "lining-nums" }}
                onMouseEnter={handleMouseEnterFooterMore}
                onMouseLeave={handleMouseLeaveFooter}
              >
                <span>+7&nbsp;(495)&nbsp;120-12-26</span>
              </Link>
            </div>
            <div
              // to={"https://yandex.ru/maps/-/CCUgmThXKA"}
              className={styles.address}
            >
              <div
                onClick={mapHendler}
                onMouseEnter={handleMouseEnterFooterMore}
                onMouseLeave={handleMouseLeaveFooter}
              >
                <span>
                  Москва З-я&nbsp;ул.&nbsp;Ямского Поля, д.&nbsp;20, с. 1,
                  офис&nbsp;704
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* правая сторона  */}
        <div className={styles.footer_block_right}>
          {/* <div className={styles.block_lang}>
            <span className={styles.en}>EN</span>
          </div> */}
          <div id="projects" className={styles.social_links}>
            <Link
              to="https://vk.com/marks_group_vk"
              target="_blank"
              onMouseEnter={handleMouseEnterFooterMore}
              onMouseLeave={handleMouseLeaveFooter}
            >
              <span
                className={styles.social_links_item}
                // onClick={vkHendler}
                style={{ marginRight: "21px" }}
              >
                VK
              </span>
            </Link>
            <Link
              to="https://instagram.com/marks_group?igshid=YmMyMTA2M2Y="
              target="_blank"
              onMouseEnter={handleMouseEnterFooterMore}
              onMouseLeave={handleMouseLeaveFooter}
            >
              <span
                className={styles.social_links_item}
                style={{ marginRight: "25px" }}
              >
                IG
              </span>
            </Link>
            <Link to="https://youtube.com/@marksgroup5338" target="_blank">
              <span
                className={styles.social_links_item}
                style={{ marginRight: "22px" }}
                onMouseEnter={handleMouseEnterFooterMore}
                onMouseLeave={handleMouseLeaveFooter}
              >
                YT
              </span>
            </Link>
            <Link
              to="https://t.me/marks_group"
              target="_blank"
              onMouseEnter={handleMouseEnterFooterMore}
              onMouseLeave={handleMouseLeaveFooter}
            >
              <span
                className={styles.social_links_item}
                // onClick={telegramHendler}
              >
                TG
              </span>
            </Link>
          </div>
          <div className={styles.job}>
            {/* <Link className={styles.job_link} to="/">
              Сотрудникам
            </Link> */}
            <Link
              className={styles.job_link}
              to="./Information"
              target="_blank"
              onMouseEnter={handleMouseEnterFooterMore}
              onMouseLeave={handleMouseLeaveFooter}
             >
              <span>Документы</span>
            </Link>
            <div className={styles.job_link}>©&nbsp;MARKSLAB</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
