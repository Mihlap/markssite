import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useDispatch, useSelector } from 'react-redux';
import { getFetchFormArticle, setSelectedType } from '../store/Slice/articleSlice';
import { fetchToggleStateForButton2Async } from '../store/Slice/toggleSlice';
import styles from './Publics.module.css';
import catPhoto from '../img/default-photo.jpeg';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

export default function Publics({ handleMouseEnter, handleMouseLeave, handleMouseHover }) {
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.article.article);
  const isActive = useSelector((state) => state.toggle.isActiveForButton2);

  const [selectArticle, setSelectArticle] = useState('Все');
  const [videoSrc, setVideoSrc] = useState(null);

  const videoSource = useMemo(
    () => ({
      small: `${bucket_url}/images/video/public_mob.mp4`,
      medium: `${bucket_url}/images/video/public_ipad.mp4`,
      large: `${bucket_url}/images/video/public_full.mp4`,
    }),
    []
  );

  const buttonChoices = useMemo(
    () => ['Все', 'Выступления', 'Интервью', 'Новости', 'Статьи', 'Научные публикации'],
    []
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleResize = () => {
      const width = window.innerWidth;
      setVideoSrc(width >= 1025 ? videoSource.large : videoSource.medium);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [videoSource]);

  useEffect(() => {
    dispatch(getFetchFormArticle());
    dispatch(fetchToggleStateForButton2Async());
  }, [dispatch]);

  const handleButtonClick = useCallback(
    (selected) => {
      if (selected !== selectArticle) {
        setSelectArticle(selected);
        dispatch(setSelectedType(selected));
        dispatch(getFetchFormArticle());
      }
    },
    [dispatch, selectArticle]
  );

  return (
    <>
      <Helmet>
        <title>Marks Group</title>
      </Helmet>
      <div className={styles.public_container_main}>
        <div className={styles.public_image_header}>
          {videoSrc && (
            <video
              playsInline
              preload="metadata"
              webkitplaysinline="true"
              autoPlay
              muted
              loop
              className={styles.bg_video}>
              <source src={videoSrc} type="video/mp4" />
            </video>
          )}
          <div className={styles.text_container_publics}>
            <span className={styles.text1_publics}>
              Научные достижения, интервью и&nbsp;статьи ведущих профессиональных и&nbsp;публицистических изданий
            </span>
            <span className={styles.text2_publics}>Публикации</span>
          </div>
        </div>
        {!isActive && (
          <div className={styles.menu_button_group_articles_wrapper_main}>
            <div className={styles.menu_button_group_articles}>
              {buttonChoices.map((el) => (
                <button
                  key={el}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleButtonClick(el)}
                  className={
                    el === selectArticle ? styles.menu__button__allArticles_active : styles.menu__button__allArticles
                  }>
                  <p className={styles.menu_button_item__allArticles}>{el}</p>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className={styles.menu_button_group_articles1}>
          <Swiper slidesPerView="auto" spaceBetween={8} className={styles.my_swiper3_button_group_article}>
            <div className={styles.button_group_article}>
              {buttonChoices.map((el) => (
                <SwiperSlide
                  key={el}
                  onClick={() => handleButtonClick(el)}
                  className={`${styles.menu__button__allArticles} ${el === selectArticle ? styles.active : ''}`}
                  style={{ width: 'fit-content' }}>
                  <p className={styles.menu_button_item__allArticles}>{el}</p>
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        </div>
        <section className={styles.section_article}>
          <div className={styles.section_article__block}>
            {articles.map((article) => {
              const firstImageName = article.imageTitle?.split(',')[0]?.trim();
              const firstImagePath =
                firstImageName && firstImageName.includes('https')
                  ? firstImageName
                  : `${bucket_url}/images/imageArticle/${firstImageName || catPhoto}`;

              return (
                <Link key={article.id} to={`/publication/${article.id}`} className={styles.section_article__block_cart}>
                  <div className={styles.cart_article}>
                    <div className={styles.cart_article__container}>
                      <img
                        className={styles.cart_article__img}
                        src={firstImagePath}
                        alt={article.imageTitle || 'Default Alt Text'}
                        onMouseEnter={handleMouseHover}
                        onMouseLeave={handleMouseLeave}
                      />
                      <div className={styles.article_content__wrapper}>
                        <div className={styles.cart_article_title}>{article.title}</div>
                      </div>
                      <div className={styles.cart_article__address}>
                        {article.city}
                        <div className={styles.cart_article__address__svg}>
                          <svg width="2" height="2" viewBox="0 0 2 2" fill="none">
                            <circle cx="1" cy="1" r="1" fill="#959DA6" />
                          </svg>
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
    </>
  );
}
