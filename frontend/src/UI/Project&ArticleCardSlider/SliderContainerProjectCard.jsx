import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwipeCore, { Navigation, Pagination, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import SliderItemProject from '../../Header/Swiper-project/SliderItemProject';
import './SliderContainerProjectCard.css';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

const SliderContainerProjectCard = ({ projects }) => {
  const [, setCurrentIndex] = useState(0);
  const swiperRef = useRef(null);

  SwipeCore.use([Navigation, Pagination, Autoplay]);

  const colors = {
    Архитектура: '#FF7F6A',
    BIM: '#75BBFD',
    Конструкции: '#566272',
    Дизайн: '#FAA8BD',
    Инженерия: '#90B734',
  };  

  const isFullUrl = (url) => typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'));

  return (
    <div className="swiper_container_ProjectCard">
      <Swiper
        loop={false}
        slidesPerView={1.1}
        spaceBetween={-2}
        centeredSlides={true}
        touch="true"
        className="swiper_container_project_ProjectCard"
        onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
        onSwiper={(swiper) => {
          if (swiperRef.current === null) {
            swiperRef.current = swiper;
          }
        }}>
        <div className="swiper_wrapper_ProjectCard">
          {projects?.map((project) => {
            if (!project) return null;

            const imageSrc = project.imageProject
              ? isFullUrl(project.imageProject)
                ? project.imageProject
                : `${bucket_url}/images/imageAdd/${project.imageProject}`
              : project.imageTitle
              ? isFullUrl(project.imageTitle)
                ? project.imageTitle
                : `${bucket_url}/images/imageAdd/${project.imageTitle}`
              : '';

            return (
              <SwiperSlide className="swiper_container_item" key={project.id}>
                <Link to={`/projects/${project.id}`}>
                  <SliderItemProject
                    className="swiper_item_image"
                    title={project.title}
                    src={imageSrc}
                    text={project.text}
                    id={project.link}
                    selectCompetencies={(() => {
                      try {
                        const sc = project.selectCompetencies;

                        if (Array.isArray(sc)) {
                          return sc.map((item, idx) => {
                            let label = '';
                            let color = '#000';

                            if (typeof item === 'string') {
                              label = item.trim();
                              color = colors[label] || '#000';
                            } else if (item && (item.value || item.label)) {
                              label = item.label || item.value;
                              color = colors[item.value] || '#000';
                            } else {
                              return null;
                            }

                            return (
                              <div
                                key={idx}
                                className="div_el_selectCompetencies_ProjectCard"
                                style={{
                                  color,
                                  borderColor: color,
                                  border: '0.5px solid',
                                  padding: '3px 6px',
                                  borderRadius: '34px',
                                }}>
                                {label}
                              </div>
                            );
                          });
                        } else if (typeof sc === 'string') {
                          const label = sc.trim();
                          const color = colors[label] || '#000';
                          return (
                            <div
                              className="div_el_selectCompetencies_ProjectCard"
                              style={{
                                color,
                                borderColor: color,
                                border: '0.5px solid',
                                padding: '3px 6px',
                                borderRadius: '34px',
                              }}>
                              {label}
                            </div>
                          );
                        }
                      } catch {
                        return null;
                      }
                    })()}
                    countryCity={project.countryCity}
                    monthYear={project.monthYear}
                  />
                </Link>
              </SwiperSlide>
            );
          })}
        </div>
      </Swiper>  
    </div>
  );
};

export default SliderContainerProjectCard;
