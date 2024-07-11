import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwipeCore, { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SliderItemProject from "./SliderItemProject";
import "./SwiperContainerProgect.css";

const Host = process.env.REACT_APP_SERVER_HOST;

const SwiperContainerProgect = ({ projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef(null);

  SwipeCore.use([Navigation, Pagination, Autoplay]);

  const colors = {
    Архитектура: "#FF7F6A",
    BIM: "#75BBFD",
    Конструкции: "#566272",
    Дизайн: "#FAA8BD",
    Инженерия: "#90B734",
  };


  const handlePageClick = (index) => {
    setCurrentIndex(index);
    if (swiperRef.current && swiperRef.current.slideTo) {
      swiperRef.current.slideTo(index);
    }
  };

  const NewProject = projects.map((el) =>
    el && el.project !== undefined ? el.project : null
  );
  const MapProject = NewProject.map((el) =>
    el && el.project !== undefined ? el.project : null
   );
   
   const MapProjectToEdit = projects.map((el) => el.project);

   
   const combinedProjects = [...MapProject, ...MapProjectToEdit].filter(
    (project, index, self) =>
      project &&
      index === self.findIndex((p) => p && p.id === project.id)
  );


  return (
    <div className="swiper_container">
      <Swiper
        loop={false}
        slidesPerView={1.1}
     spaceBetween={-2}
     centeredSlides={true}
        // effect={"fade"}
        touch="true"
        className="swiper_container_project"
        onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
        onSwiper={(swiper) => {
          if (swiperRef.current === null) {
            swiperRef.current = swiper;
          }
        }}
      >
        <div className="swiper_wrapper">
          {combinedProjects?.map((project, index) => {
            if (!project || !project.id) {
              return null; // Пропускать проекты, у которых нет данных
            }
              return (
                <SwiperSlide className="swiper_container_item_projects" key={`${project.id}_${index}`}>
                  <Link key={project.id} to={`/projects/${project.id}`}>
                  <SliderItemProject
                    title={project.title}
                    src={`${Host}/images/imageAdd/${
                      project.imageProject ? project.imageProject : project.imageTitle
                    }`}
                    text={project.text}
                    id={project.link}
                    selectCompetencies={(() => {
                      try {
                        const selectCompetencies = project.selectCompetencies;
                    
                        if (Array.isArray(selectCompetencies)) {
                          // ... (то же, что и в предыдущем коде)
                        } else if (typeof project.selectCompetencies === "string") {
                          // Если строка с одним значением и без запятых, отобразить компетенцию
                          if (!project.selectCompetencies.includes(",")) {
                            const label = project.selectCompetencies.trim();
                            return (
                              <div
                                key={label}
                                className="div_el_selectCompetencies"
                                style={{
                                  color: colors[label],
                                  borderColor: colors[label],
                                  border: "0.5px solid",
                                  padding: "3px 6px",
                                  borderRadius: "34px",
                                }}
                              >
                                {label}
                              </div>
                            );
                          } else {
                            // Строка с несколькими значениями, разделенными запятыми
                            return project.selectCompetencies.split(",").map((value) => {
                              const label = value.trim();
                              return (
                                <div
                                  key={value}
                                  className="div_el_selectCompetencies"
                                  style={{
                                    color: colors[value],
                                    borderColor: colors[value],
                                    border: "0.5px solid",
                                    padding: "3px 6px",
                                    borderRadius: "34px",
                                  }}
                                >
                                  {label}
                                </div>
                              );
                            });
                          }
                        }
                      } catch (error) {
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
      <div className="swiper_pagination_ProjectCard">
      {combinedProjects.map((_, index) => (
          <button
            key={index}
            className={`swiper_pagination_bullet_ProjectCard ${
              currentIndex === index ? "active" : ""
            }`}
            onClick={() => handlePageClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default SwiperContainerProgect;
