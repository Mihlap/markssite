import React from "react";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";

const Footer = () => {

function goToLink(link) {
    window.location.href = link;
  }
  // const telegramHendler = () => {
  //   goToLink("https://web.telegram.org/z/#-1625972274");
  // };
  // эти 3️⃣ функции 👆👇 имитируют работу Link потому что эти ссылки горят активными, хотя по ним не проходили
  function goToLinkVK(link) {
    window.location.href = link;
  }
  // const vkHendler = () => {
  //   goToLinkVK("https://vk.com/marks_group_vk");
  // };

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
          <Link to={"tel:+15551234567"} className={styles.tel} style={{ fontVariantNumeric: 'lining-nums' }}>
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
            <Link  to="https://vk.com/marks_group_vk">
            <span
              className={styles.social_links_item}
              // onClick={vkHendler}
              style={{ marginRight: "21px" }}
            >
              VK
            </span>
            </Link>
            <Link to="https://instagram.com/marks_group?igshid=YmMyMTA2M2Y=">
            <span
              className={styles.social_links_item}
              style={{ marginRight: "25px" }}
            >
              IG
              </span>
            </Link>
            <Link to="https://youtube.com/channel/UCGlamaj4PhMQyy1zsZLtaWg?view_as=subscriber">
            <span
              className={styles.social_links_item}
              style={{ marginRight: "22px" }}
            >
              YT
              </span>
            </Link>
            <Link to="https://web.telegram.org/z/#-1625972274">
            <span
              className={styles.social_links_item}
              // onClick={telegramHendler}
            >
              TG
            </span>
            </Link>
          </div>
          <div className={styles.job}>
            <Link to="/">
              <span className={styles.job_link}>Сотрудникам</span>
            </Link>
            <Link to="/">
            <span  className={styles.job_link}> Документы</span>
             </Link>
            <span className={styles.job_link}>© MARKSDIGITAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
