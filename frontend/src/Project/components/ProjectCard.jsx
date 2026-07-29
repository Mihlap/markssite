import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router';
import gsap from 'gsap';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { ScrollTrigger, MotionPathPlugin } from 'gsap/all';
import ProjectCardSlider from '../../UI/Project&ArticleCardSlider/ProjectCardSlider';
import styles from '../styles/ProjectCard.module.css';
import { useProject, useProjects } from '../../hooks';
import SliderContainerProjectCard from '../../UI/Project&ArticleCardSlider/SliderContainerProjectCard';

import { handleScroll, onVerticalScroll, onWheel, shareToVK, shareToTelegram, shareToWhatsApp } from '../utils/utils';
import placehold from '../icon/placehold.webp';
import next from '../../icons/next.svg';
import previous from '../../icons/previous.svg';
import ConstructorBlockRenderer from '../ConstructorProject/ConstructorBlockRenderer';
import NotFound from '../../NotFound/NotFound';
import { containsListTags, renderListWithDots } from '../utils/utils';
import AllProjectsButton from '../../UI/ButtonsProjects/AllProjectsButton';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

const ProjectCard = React.memo(({ handleMouseEnter, handleMouseLeave, handleMouseHover }) => {
  const { id } = useParams();
  const sliderCardRef = useRef(null);
  const { data: project, isLoading: isProjectLoading } = useProject(id);
  const { data: projectsData } = useProjects({ limit: 20 });
  const projects = useMemo(() => projectsData?.pages.flatMap((p) => p.data) ?? [], [projectsData]);

  const [enableVerticalScroll, setEnableVerticalScroll] = useState(true);
  const [isHorizontalScroll, setIsHorizontalScroll] = useState(false);
  const [, setIsAtRightEdge] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200));

  const refs = useRef({
    title: useRef(null),
    address: useRef(null),
    selectCompetencies: useRef(null),
    blockLeft: useRef(null),
    blockRight: useRef(null),
    blockDescription: useRef(null),
    leftImg1: useRef(null),
    leftImg4: useRef(null),
    constructorBlock: useRef(null),
  }).current;

  const elementsRight = useMemo(
    () =>
      [
        refs.blockDescription.current,
        refs.blockLeft.current,
        refs.blockRight.current,
        refs.leftImg1.current,
        refs.leftImg4.current,
        refs.constructorBlock.current,
      ].filter(Boolean),
    [refs]
  );

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      gsap.set([refs.title.current, refs.address.current], { opacity: 0 });
      gsap.to(refs.title.current, { duration: 1, opacity: 1, delay: 0.5 });
      gsap.to(refs.selectCompetencies.current, { duration: 1, opacity: 1, delay: 1 });
      gsap.to(refs.address.current, { duration: 1, opacity: 1, delay: 0.7 });

      elementsRight.forEach((element) => {
        if (element) {
          gsap.from(element, {
            x: '-100%',
            opacity: 0,
            duration: 1.5,
            delay: 1,
            ease: 'power4.out',
            scrollTrigger: { trigger: element },
          });
          gsap.from(element, { duration: 1, clipPath: { start: '100%' } });
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementsRight]);

  useEffect(() => {
    const el = sliderCardRef.current;
    if (!el) return;

    const verticalScrollHandler = (e) => onVerticalScroll(el, e, setEnableVerticalScroll);
    const wheelHandler = (e) => onWheel(el, e, enableVerticalScroll, isHorizontalScroll, setIsHorizontalScroll);
    const scrollHandler = () =>
      handleScroll(el, projects, setEnableVerticalScroll, setIsHorizontalScroll, setIsAtRightEdge);

    el.addEventListener('wheel', verticalScrollHandler, { passive: false });
    el.addEventListener('wheel', wheelHandler, { passive: false });
    el.addEventListener('scroll', scrollHandler);

    return () => {
      el.removeEventListener('wheel', verticalScrollHandler);
      el.removeEventListener('wheel', wheelHandler);
      el.removeEventListener('scroll', scrollHandler);
    };
  }, [enableVerticalScroll, isHorizontalScroll, projects]);

  const handleResize = useCallback(() => setWindowWidth(window.innerWidth), []);
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const currentIndex = useMemo(() => projects.findIndex((p) => p.id === project?.id), [projects, project]);
  const previousIndex = (currentIndex - 1 + projects.length) % projects.length;
  const nextIndex = (currentIndex + 1) % projects.length;
  const previousProject = projects[previousIndex];
  const nextProject = projects[nextIndex];

  const getImageSource = useCallback((image) => {
    if (!image) return placehold;
    const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;
    return image.startsWith('http') ? image : `${bucket_url}/images/imageAdd/${image}`;
  }, []);

  const imageOpenSource = useMemo(() => getImageSource(project?.imageOpen), [project, getImageSource]);
  const imageCloseSource = useMemo(() => getImageSource(project?.imageClose), [project, getImageSource]);

  const randomProjects = useMemo(() => [...projects].sort(() => 0.5 - Math.random()).slice(0, 20), [projects]);

  const renderCompetencies = useCallback((competenciesString, isSlider = false) => {
    const className = isSlider
      ? styles.div_el_selectCompetencies_projectCard
      : styles.el_project_selectCompetencies__block__card;

    const colors = {
      Архитектура: '#FF7F6A',
      BIM: '#75BBFD',
      Конструкции: '#566272',
      Дизайн: '#FAA8BD',
      Инженерия: '#90B734',
    };

    const getStyle = (item) => {
      if (!isSlider) {
        return { border: '1px solid', padding: '3px 6px', borderRadius: '34px' };
      }

      const label = typeof item === 'string' ? item : item.label || item.value;
      const keyForColor = typeof item === 'string' ? label : item.value;
      const color = colors[keyForColor] || '#000';

      return {
        color,
        borderColor: color,
        border: '0.5px solid',
        padding: '3px 6px',
        borderRadius: '34px',
      };
    };

    const renderItem = (item, key) => {
      const label = typeof item === 'string' ? item : item.label || item.value;
      return (
        <div key={key} className={className} style={getStyle(item)}>
          {label}
        </div>
      );
    };

    try {
      const parsed = JSON.parse(competenciesString);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      return items.map((item, index) => renderItem(item, item.value || index));
    } catch {
      if (typeof competenciesString === 'string') {
        if (!competenciesString.includes(',')) {
          const label = competenciesString.trim();
          return renderItem(label, label);
        }

        return competenciesString.split(',').map((value) => {
          const label = value.trim();
          return renderItem(label, value);
        });
      }

      return null;
    }
  }, []);

  const projectMetrics = useMemo(
    () =>
      [
        { value: project?.totalArea, text: 'Общая площадь', unit: 'м²' },
        { value: project?.siteArea, text: 'Площадь участка', unit: 'га' },
        { value: project?.floors, text: 'Этажность' },
        { value: project?.altitude, text: 'Высотность', unit: 'м' },
        { value: project?.constructionVolume, text: 'Строительный объем', unit: 'м³' },
        { value: project?.numberOfLanes, text: 'Количество полос' },
        { value: project?.long, text: 'Длинна', unit: 'км' },
      ].filter((item) => item.value),
    [project]
  );

  if (isProjectLoading) return null;
  if (!project) return <NotFound />;

  return (
    <>
      <Helmet>
        <title>{project.title || 'MARKS GROUP'}</title>
        <meta property="og:image" content={`${bucket_url}/images/imageAdd/${project.imageProject}`} />
      </Helmet>

      <div className={styles.main_project_card}>
        <ProjectCardSlider slidesCard={[project]} />

        <div className={styles.all_button_div} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <AllProjectsButton />
        </div>
        <div className={styles.section_project__block__card}>
          <div className={styles.cart_project__block__card}>
            <div className={styles.cart_project__container__block__card}>
              <div className={styles.project_content__wrapper__block__card}>
                <div className={styles.cart_project__content__block__card}>
                  <div className={styles.cart_project__widget__block__card} ref={refs.selectCompetencies}>
                    {renderCompetencies(project.selectCompetencies)}
                  </div>
                  <div className={styles.cart_project_title__block__card} ref={refs.title}>
                    {project.title}
                  </div>
                </div>
              </div>
              <div className={styles.cart_project__address__block__card} ref={refs.address}>
                {project.countryCity}
                <div className={styles.cart_project__address__svg__block__card}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="2" height="2" viewBox="0 0 2 2" fill="none">
                    <circle cx="1" cy="1" r="1" fill="#F6F6F6" />
                  </svg>
                </div>
                {project.monthYear}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.header_content}>
            <div ref={refs.blockLeft} className={styles.header_content_left}>
              <div className={styles.title_block}>
                <div className={styles.left_title}>
                  {project.titleTextBlock}
                  <div className={`${styles.left_meta} ${styles.left_meta_castom}`}>
                    {project.degreeParticipation.split(',').join(', ')}
                  </div>
                </div>
              </div>
              <div className={styles.title_text}>{project.descriptionProject}</div>
              <div className={styles.result_container}>
                {projectMetrics.slice(0, 3).map((item) => (
                  <div key={item.text} className={styles.result_block}>
                    <div className={styles.result_number}>
                      {item.value} {item.unit && <span>{item.unit}</span>}
                    </div>
                    <div className={styles.result_text}>{item.text}</div>
                  </div>
                ))}
              </div>
              {windowWidth < 767 && (
                <div className={styles.result_container_mobile}>
                  {projectMetrics.slice(0, 3).map((item) => (
                    <div key={item.text} className={styles.result_block}>
                      <div className={styles.result_number_mobile}>
                        {item.value}
                        {item.unit && <span>{item.unit}</span>}
                      </div>
                      <div className={styles.result_text_mobile}>{item.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div ref={refs.blockRight} className={styles.header_content_right}>
              <div className={styles.title_block_mobile}>
                <div className={styles.left_title}>
                  {project.titleTextBlock}
                  <div className={`${styles.left_meta} ${styles.left_meta_castom}`}>
                    {project.degreeParticipation.split(',').join(', ')}
                  </div>
                </div>
              </div>
              <div className={styles.title_text_mobile}>{project.descriptionProject}</div>
              <div className={styles.local_container}>
                {[
                  { title: 'Расположение', text: project.location },
                  { title: 'Статус', text: project.statusObject !== 'undefined' ? project.statusObject : '—' },
                  {
                    title: 'Публикация',
                    content: (
                      <>
                        <Link to={project.linkToPublication || '—'} target="_blank">
                          <div className={`${styles.publicationLink} ${styles.local_text}`}>{project.publication}</div>
                        </Link>
                        <Link to={project.linkToPublicationTwo} target="_blank">
                          <div className={`${styles.publicationLink} ${styles.local_text}`}>
                            {project.publicationTwo || '—'}
                          </div>
                        </Link>
                      </>
                    ),
                  },
                  {
                    title: 'Степень участия',
                    text: (project.degreeParticipation || '—').split(',').map((elem, i, arr) => (
                      <span key={i}>
                        {elem.trim()}
                        {i < arr.length - 1 ? ', ' : ''}
                      </span>
                    )),
                  },
                  { title: 'Заказчик', text: project.customer || '—' },
                  {
                    title: 'Стадия',
                    text: (project.awards || '—').split(',').map((award, i, arr) => (
                      <span key={i}>
                        {award.trim()}
                        {i < arr.length - 1 ? ', ' : ''}
                      </span>
                    )),
                  },
                ].map((item, index) => (
                  <div key={index} className={styles.local_container_wrapper_block}>
                    <div className={styles.local_title}>{item.title}</div>
                    <div className={styles.local_text}>{item.content || item.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.blockImg}>
            <div className={styles.container}>
              <div className={styles.item}>
                <img ref={refs.leftImg1} className={styles.item_img} src={imageOpenSource} alt="" loading="lazy" />
              </div>

              <div ref={refs.blockDescription} className={styles.description_object_container}>
                <div className={styles.description_object_block}>
                  {project.headingTextBlock && (
                    <div className={styles.description_object_title}>
                      <h2 className={styles.blockHeadingTitle_heading}>{project.headingTextBlock}</h2>
                    </div>
                  )}
                  <div className={styles.description_object_text1}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: containsListTags(project.textBlock)
                          ? renderListWithDots(project.textBlock)
                          : renderListWithDots(project.textBlock),
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.div_conteiner} ref={refs.constructorBlock}>
                {project?.Constructors?.map(({ data: innerBlocks }, outerIndex) => (
                  <div key={outerIndex}>
                    {innerBlocks?.map((block, innerIndex) => (
                      <ConstructorBlockRenderer
                        key={innerIndex}
                        block={block}
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                      />
                    ))}
                  </div>
                ))}
              </div>

              <div className={`${styles.item} ${styles.item_img_close}`}>
                <img
                  ref={refs.leftImg4}
                  className={`${styles.item_img} ${styles.item_img_close1}`}
                  src={imageCloseSource}
                  alt=""
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className={styles.button_project_projectCard}>
            {previousProject && (
              <Link
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={styles.button_project_link_projectCard1}
                to={`/project/${previousProject.id}`}>
                <div className={styles.previous_svg_projectCard}>
                  <img src={previous} alt="Previous" />
                  <span className={styles.previous__span_projectCard}>{previousProject.title}</span>
                </div>
              </Link>
            )}
            {nextProject && (
              <Link
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={styles.button_project_link_projectCard2}
                to={`/project/${nextProject.id}`}>
                <div className={styles.next_svg_projectCard}>
                  <span className={styles.next__span_projectCard}>{nextProject.title}</span>
                  <img src={next} alt="Next" />
                </div>
              </Link>
            )}
          </div>

          <div className={styles.social_links_projectCard}>
            {[
              { name: 'VK', handler: shareToVK, style: { marginRight: '21px' } },
              { name: 'WA', handler: shareToWhatsApp, style: { marginRight: '25px' } },
              { name: 'TG', handler: shareToTelegram },
            ].map((social) => (
              <button
                key={social.name}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => social.handler(project, bucket_url)}>
                <span className={styles.social_links_item} style={{ ...social.style, color: '#FF7F6A' }}>
                  {social.name}
                </span>
              </button>
            ))}
          </div>
          <div className={styles.share_project}>Поделиться проектом</div>
        </div>

        <div className={styles.project_name_text}>Ещё по теме</div>
        <div className={styles.main_project_projectCard}>
          <Swiper
            className={styles.slider_card_container_project_projectCard}
            id="slider_card_container_project"
            ref={sliderCardRef}
            spaceBetween={30}
            slidesPerView="auto"
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
            {randomProjects.map((randomProject, index) => {
              const photoSrc = randomProject?.imageProject
                ? randomProject.imageProject.startsWith('http')
                  ? randomProject.imageProject
                  : `${bucket_url}/images/imageAdd/${randomProject.imageProject}`
                : placehold;

              return (
                <SwiperSlide
                  key={randomProject.id}
                  className={styles.slider_container_item_card_projectCard}
                  style={{ paddingTop: index % 2 === 1 ? '10rem' : '0' }}>
                  <Link to={`/project/${randomProject.id}`}>
                    <div className={styles.wrapper_container_item_card_projectCard}>
                      <img
                        className={styles.container__imageTitle_projectCard}
                        src={photoSrc}
                        alt=""
                        onMouseEnter={handleMouseHover}
                        onMouseLeave={handleMouseLeave}
                        loading="lazy"
                      />
                    </div>
                    <div className={styles.wrapper_container_title_selectCompetencies_projectCard}>
                      <div className={styles.container_wrapper_title_city_data_block_projectCard}>
                        <div className={styles.container__title_projectCard}>{randomProject.title}</div>
                        <div className={styles.countryCity_monthYear_projectCard}>
                          <div className={styles.container__countryCity_projectCard}>{randomProject.countryCity}</div>
                          <div className={styles.cart_project__address__svg_projectCard}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="2" height="2" viewBox="0 0 2 2" fill="none">
                              <circle cx="1" cy="1" r="1" fill="#959DA6" />
                            </svg>
                          </div>
                          <div className={styles.container__monthYear_projectCard}>{randomProject.monthYear}</div>
                        </div>
                      </div>
                      <div className={styles.wrapper_container__selectCompetencies_projectCard}>
                        <div className={styles.container__selectCompetencies_projectCard}>
                          {renderCompetencies(randomProject.selectCompetencies, true)}
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div className={styles.project_container_projectCard_sliderMobile}>
          <SliderContainerProjectCard projects={randomProjects} />
        </div>
      </div>
    </>
  );
});

export default ProjectCard;
