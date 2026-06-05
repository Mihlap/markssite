import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Swiper, SwiperSlide } from 'swiper/react';

import ArticleCardSlider from '../UI/ArticleCardSlider.jsx/ArticleCardSlider';
import SliderContainerArticleCard from '../UI/Project&ArticleCardSlider/SlideContainerArticleCard';

import { getFetchFormArticle } from '../store/Slice/articleSlice';
import { handleScroll, onVerticalScroll, onWheel, containsListTags, renderListWithDots } from '../Project/utils/utils';
import { shareToVK, shareToTelegram } from './utils';

import styles from './ArticleCard.module.css';
import catPhoto from '../img/default-photo.jpeg';
import next from '.././icons/next.svg';
import previous from '.././icons/previous.svg';
import ConstructorBlockRenderer from './ConstructorArticle/ConstructorBlockRender';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

const isFullUrl = (url = '') => /^(https?:)?\/\//i.test(url);

const pickImage = (raw, fallback = catPhoto) => {
  if (!raw) return fallback;
  return isFullUrl(raw) ? raw : `${bucket_url}/images/imageArticle/${raw}`;
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const useArticles = () => useSelector((s) => s.article.article, shallowEqual);

const ArticleCard = React.memo(({ handleMouseEnter, handleMouseLeave, handleMouseHover }) => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const sliderArticleCardRef = useRef(null);

  const articles = useArticles();
  const article = useMemo(() => articles.find((i) => i.id === Number(id)), [articles, id]);

  useEffect(() => {
    if (!articles.length) dispatch(getFetchFormArticle());
  }, [dispatch, articles.length]);

  const previousArticle = useMemo(() => {
    if (!articles.length || !article) return null;
    const currentIndex = articles.findIndex((p) => p.id === article.id);
    const prevIndex = (currentIndex - 1 + articles.length) % articles.length;
    return articles[prevIndex];
  }, [articles, article]);

  const nextArticle = useMemo(() => {
    if (!articles.length || !article) return null;
    const currentIndex = articles.findIndex((p) => p.id === article.id);
    const nextIndex = (currentIndex + 1) % articles.length;
    return articles[nextIndex];
  }, [articles, article]);

  const userSelectedBlocks = article?.ConstructorArticles?.map((el) => el.data) || [];

  const imageOpenSource = pickImage(article?.imageOpen);
  const imageCloseSource = pickImage(article?.imageClose);
  const imageAuthorSource = article?.imageAuthor ? pickImage(article.imageAuthor, '') : '';

  const randomArticles = useMemo(() => (articles.length ? shuffle(articles).slice(0, 20) : []), [articles]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 767;

  const title = useRef(null);
  const city = useRef(null);
  const author = useRef(null);
  const blockLeft = useRef(null);
  const blockRight = useRef(null);
  const blockDescription = useRef(null);
  const quoteBlockLeft = useRef(null);
  const quoteBlockRight = useRef(null);
  const frameBlock = useRef(null);
  const blockHeadingTitle = useRef(null);
  const imageToDescriptionArticle = useRef(null);
  const imageClose = useRef(null);
  const address_imageClose = useRef(null);
  const constructorBlock = useRef(null);

  const elementsRightRef = useRef([]);

  useEffect(() => {
    elementsRightRef.current = [
      blockDescription.current,
      quoteBlockLeft.current,
      quoteBlockRight.current,
      frameBlock.current,
      blockHeadingTitle.current,
      imageToDescriptionArticle.current,
      imageClose.current,
      address_imageClose.current,
      blockLeft.current,
      blockRight.current,
      constructorBlock.current,
    ];
  }, []);

  useEffect(() => {
    window.scrollTo(20, 0);

    if (title.current && city.current) {
      gsap.set([title.current, city.current], { opacity: 0 });
    }

    gsap.to(title.current, { duration: 1, opacity: 1, delay: 0.5 });
    // gsap.to(author.current, { duration: 1, opacity: 1, delay: 1 });
    // gsap.to(city.current, { duration: 1, opacity: 1, delay: 0.7 });

    // const animate = (el) => {
    //   if (!el) return;
    //   gsap.from(el, {
    //     x: '-100%',
    //     opacity: 0,
    //     duration: 1.5,
    //     delay: 1,
    //     ease: 'power4.out',
    //     scrollTrigger: { trigger: el },
    //   });
    // };

    // elementsRightRef.current.forEach(animate);
  }, []);

  const enableVerticalScrollRef = useRef(true);
  const isHorizontalScrollRef = useRef(false);
  const isAtRightEdgeRef = useRef(false);

  const verticalHandler = useCallback((e) => {
    const el = sliderArticleCardRef.current;
    onVerticalScroll(el, e, (v) => (enableVerticalScrollRef.current = v));
  }, []);

  const wheelHandler = useCallback((e) => {
    const el = sliderArticleCardRef.current;
    onWheel(
      el,
      e,
      enableVerticalScrollRef.current,
      isHorizontalScrollRef.current,
      (v) => (isHorizontalScrollRef.current = v)
    );
  }, []);

  const scrollHandler = useCallback(() => {
    const el = sliderArticleCardRef.current;
    handleScroll(
      el,
      articles,
      (v) => (enableVerticalScrollRef.current = v),
      (v) => (isHorizontalScrollRef.current = v),
      (v) => (isAtRightEdgeRef.current = v)
    );
  }, [articles]);

  useEffect(() => {
    const el = sliderArticleCardRef.current;
    if (!el) return undefined;

    el.addEventListener('wheel', verticalHandler, { passive: false });
    el.addEventListener('wheel', wheelHandler, { passive: false });
    el.addEventListener('scroll', scrollHandler, { passive: true });

    return () => {
      el.removeEventListener('wheel', verticalHandler);
      el.removeEventListener('wheel', wheelHandler);
      el.removeEventListener('scroll', scrollHandler);
    };
  }, [verticalHandler, wheelHandler, scrollHandler]);

  if (!article) return null;
  return (
    <>
      <Helmet>
        <title>{article ? article.title : 'MARKS GROUP'}</title>
        <meta property="og:image" content={article ? `${bucket_url}/images/imageArticle/${article.imageOpen}` : ''} />
      </Helmet>

      <div className={`${styles.main_article_card} article-card`}>
        <ArticleCardSlider slidesCard={[article]} />

        <div className={styles.section_article__block__card}>
          <div className={styles.cart_article__block__card}>
            <div className={styles.cart_article__container__block__card}>
              <div className={styles.article_content__wrapper__block__card}>
                <div className={styles.cart_article__content__block__card}>
                  <div className={styles.cart_article_title__block__card} ref={title}>
                    {article.title}
                  </div>
                </div>
              </div>
              <div className={styles.cart_article__author__block__card} ref={author}>
                {article.author}
              </div>
              <div className={styles.cart_article__address__block__card} ref={city}>
                {article.city}{' '}
                <div className={styles.cart_article__address__svg__block__card}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="2" height="2" viewBox="0 0 2 2" fill="none">
                    <circle cx="1" cy="1" r="1" fill="#F6F6F6" />
                  </svg>{' '}
                </div>
                {article.dataMonthYear}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.header_content}>
              <div ref={blockLeft} className={styles.header_content_left}>
                <div className={styles.title_block}>
                  <div className={styles.left_title}>{article.titleTextBlock}</div>
                </div>
                <div className={styles.title_text}>
                  {containsListTags(article.descriptionArticle) ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderListWithDots(article.descriptionArticle),
                      }}
                    />
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderListWithDots(article.descriptionArticle),
                      }}
                    />
                  )}
                </div>
                <div className={styles.result_container}></div>
              </div>

              {imageAuthorSource ? (
                <div ref={blockRight} className={styles.header_content_right}>
                  <div className={styles.local_container_photo_author}>
                    <img
                      className={styles.container__imageAuthor_articleCard}
                      src={imageAuthorSource}
                      alt={article.imageAuthor || 'Default Alt Text'}
                      loading="lazy"
                    />
                    <div className={styles.author_name}>{article.author}</div>
                    <div className={styles.text_author}>Автор статьи</div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className={styles.blockImg}>
              <div className={styles.container}>
                <div className={styles.item}>
                  <img className={styles.item_img} src={imageOpenSource} alt="" loading="lazy" />
                  <div className={styles.leftImg1_object_text1}>
                    {containsListTags(article.textBlock) ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: renderListWithDots(article.textBlock),
                        }}
                      />
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: renderListWithDots(article.textBlock),
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.div_conteiner} ref={constructorBlock}>
              {userSelectedBlocks?.map((innerBlocks, outerIndex) => (
                <div key={outerIndex}>
                  {innerBlocks?.map((block, innerIndex) => (
                    <ConstructorBlockRenderer
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      key={innerIndex}
                      block={block}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div className={styles.item_container_imageClose} ref={imageClose}>
              <div className={styles.item}>
                <img className={styles.item_img_close} src={imageCloseSource} alt="" loading="lazy" />
              </div>
            </div>

            <div className={styles.container_author_wrapper}>
              <div className={styles.container_author_address_imageClose_share_article}>
                <div className={styles.container_author_address_imageClose} ref={address_imageClose}>
                  <div className={styles.cart_article__author__block__card_imageClose}>{article.author}</div>
                  <div className={styles.cart_article__address__block__card_imageClose}>
                    {article.city}{' '}
                    <div className={styles.cart_article__address__svg__block__card_imageClose}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="2" height="2" viewBox="0 0 2 2" fill="none">
                        <circle cx="1" cy="1" r="1" fill="#959DA6" />
                      </svg>{' '}
                    </div>
                    {article.dataMonthYear}
                  </div>
                </div>

                <div className={styles.share_article}>
                  <div>Поделиться статьей</div>
                  <div id="articles" className={styles.social_links_articleCard}>
                    <button
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => shareToVK(article, bucket_url)}>
                      <span className={styles.social_links_item} style={{ marginRight: '18px', color: '#FF7F6A' }}>
                        VK
                      </span>
                    </button>

                    <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => {}}>
                      <span className={styles.social_links_item} style={{ marginRight: '18px', color: '#FF7F6A' }}>
                        IG
                      </span>
                    </button>

                    <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => {}}>
                      <span className={styles.social_links_item} style={{ marginRight: '18px', color: '#FF7F6A' }}>
                        BE
                      </span>
                    </button>

                    <button
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => shareToTelegram(article, bucket_url)}>
                      <span className={styles.social_links_item} style={{ color: '#FF7F6A' }}>
                        TG
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.button_article_articleCard}>
          {previousArticle && (
            <Link
              className={styles.button_article_link_articleCard1}
              to={`/publication/${previousArticle.id}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
              <div className={styles.previous_svg_articleCard}>
                <img src={previous} alt={previous} />
                <span className={styles.previous__span_articleCard}>
                  {isMobile ? 'Предыдущая статья' : `${previousArticle.title}`}
                </span>
              </div>
            </Link>
          )}

          {nextArticle && (
            <Link
              className={styles.button_article_link_articleCard2}
              to={`/publication/${nextArticle.id}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
              <div className={styles.next_svg_articleCard}>
                <span className={styles.next__span_articleCard}>
                  {isMobile ? 'Следующая статья' : `${nextArticle.title}`}
                </span>
                <img src={next} alt={next} />
              </div>
            </Link>
          )}
        </div>

        <div className={styles.article_name_text}>Ещё по теме</div>
        <div className={styles.swiper_article_container} />

        <div className={styles.main_article_articleCard}>
          <Swiper
            className={styles.slider_card_container_article_articleCard}
            id="slider_card_container_article"
            ref={sliderArticleCardRef}
            spaceBetween={30}
            touch="true"
            direction="horizontal"
            loop={true}
            breakpoints={{
              2500: { slidesPerView: 4.7 },
              2000: { slidesPerView: 4.2 },
              1750: { slidesPerView: 3.5 },
              1440: { slidesPerView: 2.7 },
              1300: { slidesPerView: 2.7 },
              1200: { slidesPerView: 2.5 },
              1024: { slidesPerView: 2.3 },
              900: { slidesPerView: 2.1 },
              700: { slidesPerView: 2.1 },
            }}>
            {randomArticles.map((ra, index) => {
              const imagePathsForArticle = ra.imageTitle ? ra.imageTitle.split(',').map((el) => el.trim()) : [];
              const firstImageName = imagePathsForArticle[0] || null;
              const firstImagePath = firstImageName ? pickImage(firstImageName, catPhoto) : catPhoto;

              return (
                <SwiperSlide
                  key={ra.id}
                  id="slider_container_item_card"
                  className={styles.slider_container_item_card_articleCard}
                  style={index % 2 === 1 ? { paddingTop: '10rem' } : {}}>
                  <Link to={`/publication/${ra.id}`}>
                    <div className={styles.wrapper_container_item_card_articleCard}>
                      <img
                        className={styles.container__imageTitle_articleCard}
                        src={firstImagePath}
                        alt={firstImagePath}
                        onMouseEnter={handleMouseHover}
                        onMouseLeave={handleMouseLeave}
                        loading="lazy"
                      />
                    </div>
                    <div className={styles.title_articleCard}>
                      <div className={styles.container__title_articleCard}>{ra.title}</div>
                    </div>
                    <div className={styles.countryCity_monthYear_articleCard}>
                      <div className={styles.container__countryCity_articleCard}>{ra.city} </div>
                      <div className={styles.cart_article__address__svg_articleCard}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="2" height="2" viewBox="0 0 2 2" fill="none">
                          <circle cx="1" cy="1" r="1" fill="#959DA6" />
                        </svg>{' '}
                      </div>
                      <div className={styles.container__monthYear_articleCard}>{ra.dataMonthYear}</div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        <div className={styles.article_container_articleCard_sliderMobile}>
          <SliderContainerArticleCard articles={randomArticles} />
        </div>
      </div>
    </>
  );
});

export default ArticleCard;
