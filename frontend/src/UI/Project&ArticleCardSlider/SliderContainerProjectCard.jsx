import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwipeCore from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
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
                      let competencies = [];
                      const sc = project.selectCompetencies;

                      if (Array.isArray(sc)) {
                        competencies = sc;
                      } else if (typeof sc === 'string') {                    
                        try {
                          const parsed = JSON.parse(sc);
                          competencies = Array.isArray(parsed) ? parsed : [parsed];
                        } catch {                       
                          competencies = sc.split(',').map((v) => v.trim());
                        }
                      }

                       return competencies.map((item, idx) => {
                        const label = typeof item === 'string' ? item : item.label || item.value;
                        const keyForColor = typeof item === 'string' ? label : item.value;
                        const color = colors[keyForColor] || '#000';

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
