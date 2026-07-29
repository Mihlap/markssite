import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/swiper-bundle.css';
import SliderItems from './SliderItem';
import './SwiperContainer.css';
import { Link } from 'react-router';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

export default function SwiperContainer({ article1, article2 }) {
  // const [currentIndexContainer, setCurrentIndexContainer] = useState(0);
  // const swiperContainerRef = useRef(null);
  SwiperCore.use([Navigation, Pagination, Autoplay]);

  const combinedArticles = [...article1, ...article2];

  // const handleContainerClick = (index) => {
  //   setCurrentIndexContainer(index);
  //   if (swiperContainerRef.current && swiperContainerRef.current.slideTo) {
  //     swiperContainerRef.current.slideTo(index);
  //   }
  // };

  return (
    <div className="swiper_container_wrapper">
      <Swiper
        loop={false}
        slidesPerView={1.1}
        spaceBetween={-2}
        centeredSlides={true}
        //  effect={"fade"}
        touch="true"
        className="swiper_container_articles"
        // onSlideChange={(swiper) => setCurrentIndexContainer(swiper.realIndex)}
        // onSwiper={(swiper) => {
        //   if (swiperContainerRef.current === null) {
        //     swiperContainerRef.current = swiper;
        //   }
        // }}
      >
        <div className="swiper_wrapper">
          {combinedArticles &&
            combinedArticles.map((item, index) => {
              const firstPhoto = item.imageTitle.split(', ')[0];
              return (
                <SwiperSlide className="swiper_container_item_articles" key={`${item.id}_${index}`}>
                  <Link key={item.id} to={`/publication/${item.id}`}>
                    <SliderItems
                      title={item.title}
                      src={
                        firstPhoto?.includes('https') ? firstPhoto : `${bucket_url}/images/imageArticle/${firstPhoto}`
                      }
                      city={item.city}
                      dataMonthYear={item.dataMonthYear}
                      id={item.link}
                    />
                  </Link>
                </SwiperSlide>
              );
            })}
        </div>
      </Swiper>
      {/* <div className="swiper_pagination_container">
        {combinedArticles &&
          combinedArticles.map((_, index) => (
            <button
              key={index}
              className={`swiper_pagination_bullet_container ${
                currentIndexContainer === index ? "active" : ""
              }`}
              onClick={() => handleContainerClick(index)}
            />
          ))}
      </div> */}
    </div>
  );
}
