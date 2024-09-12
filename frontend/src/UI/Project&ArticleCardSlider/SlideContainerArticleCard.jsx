import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwipeCore, { Navigation, Pagination, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import SliderItemProject from '../../Header/Swiper-project/SliderItemProject';
import './SliderContainerProjectCard.css';
import catPhoto from '../../img/default-photo.jpeg';

const Host = process.env.REACT_APP_SERVER_HOST;

const SliderContainerArticleCard = ({ articles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef(null);

  SwipeCore.use([Navigation, Pagination, Autoplay]);

  const handlePageClick = (index) => {
    setCurrentIndex(index);
    if (swiperRef.current && swiperRef.current.slideTo) {
      swiperRef.current.slideTo(index);
    }
  };

  return (
    <div className="swiper_container_ProjectCard">
      <Swiper
        loop={false}
        slidesPerView={1.1}
        spaceBetween={-2}
        centeredSlides={true}
        touch="true"
        className="swiper_container_project_ProjectCard"
        style={{ paddingTop: '1.5rem' }}
        onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
        onSwiper={(swiper) => {
          if (swiperRef.current === null) {
            swiperRef.current = swiper;
          }
        }}
      >
        <div className="swiper_wrapper_ProjectCard">
          {articles?.map((article) => {
            if (!article) return null;

            const imagePathsForArticle = article.imageTitle ? article.imageTitle.split(',').map((el) => el.trim()) : [];

            const firstImageName = imagePathsForArticle[0] || null;
            const encodedFileName = firstImageName ? encodeURIComponent(firstImageName) : null;
            const defaultImagePath = `${catPhoto}`;
            const firstImagePath = encodedFileName
              ? `${Host}/images/imageArticle/${encodedFileName}`
              : defaultImagePath;

            return (
              <SwiperSlide className="swiper_container_item" key={article.id}>
                <Link key={article.id} to={`/publication/${article.id}`}>
                  <SliderItemProject
                    src={firstImagePath}
                    alt={firstImagePath}
                    title={article.title}
                    id={article.link}
                    countryCity={article.city}
                    monthYear={article.dataMonthYear}
                  />
                </Link>
              </SwiperSlide>
            );
          })}
        </div>
      </Swiper>
      {/* <div className="swiper_pagination_ProjectCard">
        {articles &&
          articles?.map((_, index) => (
            <button
              key={index}
              className={`swiper_pagination_bullet_ProjectCard ${
                currentIndex === index ? "active" : ""
              }`}
              onClick={() => handlePageClick(index)}
            />
          ))}
      </div> */}
    </div>
  );
};

export default SliderContainerArticleCard;
