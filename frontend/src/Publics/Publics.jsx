import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { useDispatch, useSelector } from "react-redux";
import { getFetchFormArticle } from "../store/Slice/articleSlice";
import styles from "./Publics.module.css";

const Host = process.env.REACT_APP_SERVER_HOST;

export default function Publics() {
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.article.article);
  const [selectArticle, setSelectArticle] = useState("Все");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [swiper, setSwiper] = useState(null);

  const buttonChoose1 = [
    "Все",
    "Научные",
    "Опробации",
    "Интервью",
    "Литература",
    "Научно-популярные",
    "Инженерия",
    "BIM",
    "Дизайн",
    "Архитектура",
    "Конструкции",
  ];

  useEffect(() => {
    dispatch(getFetchFormArticle());
  }, [dispatch]);

  useEffect(() => {
    setSelectArticle("Все"); 
  }, []);

  const handleButtonClick = (selected) => {
    setSelectArticle(selected);
    if (selected === "Все") {
      dispatch(getFetchFormArticle()); 
    } else {
      // Здесь вы можете использовать фильтр для запроса статей по типу
      // Например, если у статьи есть поле "type", вы можете запросить статьи только этого типа
      // dispatch(fetchArticleByType(selected));
    }
  };

  // const filteredPublics = articles
  // .filter((article) =>
  //   selectOnCompetencies === "Все"
  //     ? true
  //     : article.selectCompetencies?.includes(selectOnCompetencies)
  // );
  

console.log(articles, "+++++++++++++++++++++++++++++++++++++++++++++");
  return (
    <div className={styles.public_container_main}>
      <div className={styles.public_image_header}>
        <img
          className={styles.public_image_header_img}
          src={`${Host}/images/imageArticle/image_publicPage.png`}
          alt="image_publicPage"
        />
        <div className={styles.text_container_publics}>
          <span className={styles.text1_publics}>
            Наша команда ведет активную научную жизнь!
          </span>
          <span className={styles.text2_publics}>Публикации</span>
        </div>
      </div>
      <div className={styles.menu_button_group_articles_wrapper_main}>
        <div className={styles.menu_button_group_articles_wrapper}>
          <div className={styles.menu_button_group_articles}>
            {buttonChoose1.map((el) => (
              <div key={el.id} className={styles.button_wrapper_articles}>
                <button
                  className={
                    el === selectArticle
                      ? styles.menu__button__allArticles_active
                      : styles.menu__button__allArticles
                  }
                  onClick={() => handleButtonClick(el)}
                >
                  <p className={styles.menu_button_item__allArticles}>{el}</p>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {screenWidth && (
        <Swiper
          onSwiper={setSwiper}
          slidesPerView="auto"
          spaceBetween={8}
          className={styles.my_swiper3_button_group_article}
          touch="true"
        >
          <div className={styles.button_group_article}>
            {buttonChoose1 &&
              buttonChoose1?.map((el) => (
                <SwiperSlide
                  key={el}
                  onClick={() => handleButtonClick(el)}
                  className={`${styles.menu__button__allArticles} ${
                    el === selectArticle ? styles.active : ""}`}
                  style={{ width: "fit-content" }}
                >
                  <p type="button" className={styles.menu_button_item__allArticles}>
                    {el}
                  </p>
                </SwiperSlide>
              ))}
          </div>
        </Swiper>
      )}
      <section className={styles.section_article}>
        <div className={styles.section_article__block}>
          {articles &&
            articles?.map((article) => {
              if (!article) {
                return null;
              }

              return (
                <Link
                  key={article.id}
                  to={`/publication/${article.id}`}
                  className={styles.section_article__block_cart}
                >
                  <div className={styles.cart_article}>
                    <div className={styles.cart_article__container}>
                      <img
                        className={styles.cart_article__img}
                        src={`${Host}/images/imageArticle/${article.imageTitle}`}
                        alt={article.imageTitle}
                      />
                      <div className={styles.article_content__wrapper}>
                        <div className={styles.cart_article_title}>
                          {article.titleTextBlock}
                        </div>
                        <div className={styles.cart_article__content}></div>
                      </div>
                      <div className={styles.cart_article__address}>
                        {article.city}{" "}
                        <div className={styles.cart_article__address__svg}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="2"
                            height="2"
                            viewBox="0 0 2 2"
                            fill="none"
                          >
                            <circle cx="1" cy="1" r="1" fill="#959DA6" />
                          </svg>{" "}
                        </div>
                        {article.dataMonthYear}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </section>
    </div>
  );
}
