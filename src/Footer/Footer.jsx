import React from "react";
import styles from "./Footer.module.css";
import marks from ".././icons/© marksdigital.svg";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className={styles.footer_container}>
        <div className={styles.footer_block_left}>
          <div className={styles.mail_block}>
            <Link className={styles.mail_link} to="mailto:mail@marksgroup.ru">
              mail@marksgroup.ru
            </Link>
          </div>
          <div className={styles.office}>Офис Москва</div>
          <div className={styles.tel}>+7(495) 120-12-26</div>
          <div className={styles.address}>
            Москва З-я ул. Ямского Поля, дом 20 строение 1 офис 704
          </div>
        </div>
        {/* правая сторона  */}
        <div className={styles.footer_block_right}>
          <div className={styles.block_lang}>
            <span className={styles.en}>EN | CN</span>
          </div>
          <div className={styles.social_links}>
            <Link
              className={styles.social_links_item}
              to="https://vk.com/marks_group_vk"
              style={{ marginRight: "21px" }}
            >
              VK
            </Link>
            <Link
              className={styles.social_links_item}
              to="https://instagram.com/marks_group?igshid=YmMyMTA2M2Y="
              style={{ marginRight: "25px" }}
            >
              IG
            </Link>
            <Link
              className={styles.social_links_item}
              to="https://youtube.com/channel/UCGlamaj4PhMQyy1zsZLtaWg?view_as=subscriber"
              style={{ marginRight: "22px" }}
            >
              YT
            </Link>
            <Link
              className={styles.social_links_item}
              to="https://web.telegram.org/z/#-1625972274"
            >
              TG
            </Link>
          </div>
          <div className={styles.job}>
            <Link className={styles.job_link} to="/">
              Сотрудникам
            </Link>
            <Link className={styles.job_link} to="/">
              Документы
            </Link>
            <Link className={styles.job_link} to="/">
              © MARKSDIGITAL
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
