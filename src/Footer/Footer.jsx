import React from "react";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";

const Footer = () => {
  function goToLink(link) {
    window.location.href = link;
  }
  const telegramHendler = () => {
    goToLink("https://web.telegram.org/z/#-1625972274");
  };
  // эти 3️⃣ функции 👆👇 имитируют работу Link потому что эти ссылки горят активными, хотя по ним не проходили
  function goToLinkVK(link) {
    window.location.href = link;
  }
  const vkHendler = () => {
    goToLinkVK("https://vk.com/marks_group_vk");
  };

   function mapToLink(link) {
     window.location.href = link;
   }
   const mapHendler = () => {
     mapToLink("https://yandex.ru/maps/-/CCUgmThXKA");
   };

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
          <Link to={"tel:+15551234567"} className={styles.tel}>
            +7(495) 120-12-26
          </Link>
          <span
            // to={"https://yandex.ru/maps/-/CCUgmThXKA"}
            className={styles.address}
            onClick={mapHendler}
          >
            Москва З-я ул. Ямского Поля, дом 20 строение 1 офис 704
          </span>
        </div>
        {/* правая сторона  */}
        <div className={styles.footer_block_right}>
          <div className={styles.block_lang}>
            <span className={styles.en}>EN</span>
          </div>
          <div className={styles.social_links}>
            <span
              className={styles.social_links_item}
              // to="https://vk.com/marks_group_vk"
              onClick={vkHendler}
              style={{ marginRight: "21px" }}
            >
              VK
            </span>
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
            <span
              className={styles.social_links_item}
              onClick={telegramHendler}
              // to="https://web.telegram.org/z/#-1625972274"
            >
              TG
            </span>
          </div>
          <div className={styles.job}>
            <Link className={styles.job_link} to="/">
              Сотрудникам
            </Link>
            <Link className={styles.job_link} to="/">
              Документы
            </Link>
            <div className={styles.job_link}>© MARKSDIGITAL</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
