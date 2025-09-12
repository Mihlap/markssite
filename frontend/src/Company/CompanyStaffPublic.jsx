import { useEffect, useMemo, useState, useCallback } from 'react';
import Modal from 'react-modal';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { useDispatch, useSelector } from 'react-redux';
import { fetchStaffByCategoryPublic } from '../store/Slice/StaffSliceNew';
import { fetchStaffCategoryTogglesAsync } from '../store/Slice/toggleSlice';

import styles from './Company.module.css';
import SkeletonLoader from './SkeletonLoader/SkeletonLoader';
import SkeletonLoaderSlider from './SkeletonLoader/SkeletonLoaderSlider ';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

const CAT_META = [
  { name: 'Руководство', key: 'leadership' },
  { name: 'Научно-техническое сопровождение', key: 'science' },
  // { name: 'HR', key: 'hr' },
];

const photoSrc = (row) => {
  const name = row?.img;
  if (!name) return `${bucket_url}/images/imageStuff/no_photo.png`;
  return /^https?:\/\//i.test(String(name)) ? name : `${bucket_url}/images/imageStuff/${name}`;
};

export default function CompanyStaffPublic({ handleMouseEnter, handleMouseLeave, handleMouseHover }) {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.staff);
  const staffCats = useSelector((s) => s.toggle.staffCats);

  const [category, setCategory] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const [showCards, setShowCards] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 767 : false);

  useEffect(() => {
    dispatch(fetchStaffCategoryTogglesAsync());
  }, [dispatch]);

  const visibleCats = useMemo(() => CAT_META.filter((c) => !staffCats[c.key]), [staffCats]);

  useEffect(() => {
    if (!visibleCats.length) {
      setCategory(null);
      setActiveButton(null);
      return;
    }
    if (!category || staffCats[CAT_META.find((c) => c.name === category)?.key]) {
      setCategory(visibleCats[0].name);
      setActiveButton(visibleCats[0].name);
    }
  }, [visibleCats, staffCats, category]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (category) {
      dispatch(fetchStaffByCategoryPublic(category)).then(() => setShowCards(true));
    }
  }, [category, dispatch]);

  const ordered = useMemo(() => {
    const arr = (items || []).slice();
    arr.sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0) || new Date(a.createdAt) - new Date(b.createdAt));
    return arr;
  }, [items]);

  const handleOpenCard = useCallback(
    (id) => {
      const row = ordered.find((x) => x.id === id);
      if (!row) return;
      setSelectedCard({ ...row, img: photoSrc(row) });
      setIsModalOpen(true);
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    },
    [ordered]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCard(null);
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
  }, []);

  const onCategoryClick = useCallback((cat) => {
    setActiveButton(cat);
    setCategory(cat);
  }, []);

  const bulletSymbol = '•';
  const aboutKeys = useMemo(() => Array.from({ length: 30 }, (_, i) => `about${i + 1}`), []);

  return (
    <>
      <div className={styles.specialist_wrapper}>
        <div className={styles.specialist}>Специалисты</div>
   
        {isMobile ? (
          <Swiper slidesPerView="auto" spaceBetween={8} className={styles.my_swiper_button_group} touch="true">
            <div className={styles.button_group}>
              {visibleCats.map((c) => (
                <SwiperSlide
                  key={c.key}
                  onClick={(e) => {
                    e.preventDefault();
                    onCategoryClick(c.name);
                  }}
                  className={`${styles.button_hover} ${activeButton === c.name ? styles.active : ''}`}
                  style={{ width: 'fit-content' }}>
                  <p type="button">{c.name}</p>
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        ) : (
          <div className={styles.button_group}>
            {visibleCats.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onCategoryClick(c.name);
                }}
                className={`${styles.button_hover} ${activeButton === c.name ? styles.active : ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>
 
      <div className={styles.card_container} style={{ opacity: showCards ? 1 : 0 }}>
        <ul className={styles.card_container_ul}>
          {error ? (
            <div className={styles.error}>Ошибка: {String(error)}</div>
          ) : loading ? (
            <SkeletonLoader itemCount={8} />
          ) : ordered?.length ? (
            ordered.map((el) => (
              <li
                key={el.id}
                data-user-id={el.id}
                className={styles.container__item_stuff}
                onClick={() => handleOpenCard(el.id)}
                onMouseEnter={handleMouseHover}
                onMouseLeave={handleMouseLeave}>
                <div className={styles.wrapper_container_item_stuff}>
                  <img
                    className={`${styles.container__img_stuff} ${showCards ? 'loaded' : ''}`}
                    src={photoSrc(el)}
                    onError={(e) => {
                      e.currentTarget.src = `${bucket_url}/images/imageStuff/no_photo.png`;
                    }}
                    alt={el.name || 'staff'}
                    loading="lazy"
                  />
                </div>
                <div className={styles.container__item_name_stuff}>{el.name}</div>
                <div className={styles.container__item_position_stuff}>{el.position}</div>
              </li>
            ))
          ) : (
            <div className={styles.card_components_admin__null_project}>Сотрудников пока нет.</div>
          )}
        </ul>
      </div>
    
      {isMobile && (
        <div className={styles.slider_card_wrapper}>
          {loading ? (
            <SkeletonLoaderSlider itemCount={8} isMobile />
          ) : (
            <Swiper
              className={styles.slider_card_container}
              loop={true}
              slidesPerView={1.1}
              spaceBetween={0}
              touch="true">
              {ordered?.map((el) => (
                <SwiperSlide
                  key={el.id}
                  data-user-id={el.id}
                  className={styles.slide_container_item_stuff}
                  onClick={() => handleOpenCard(el.id)}>
                  <div className={styles.wrapper_container_item_stuff}>
                    <img
                      className={`${styles.container__img_stuff} ${showCards ? 'loaded' : ''}`}
                      src={photoSrc(el)}
                      onError={(e) => {
                        e.currentTarget.src = `${bucket_url}/images/imageStuff/no_photo.png`;
                      }}
                      alt={el.name || 'staff'}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.container__item_name_stuff}>{el.name}</div>
                  <div className={styles.container__item_position_stuff}>{el.position}</div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      )}

      {!isMobile && (
        <div className={styles.slider_card_wrapper}>
          {loading ? (
            <SkeletonLoaderSlider itemCount={8} isMobile={false} />
          ) : (
            <Swiper
              className={styles.slider_card_container}
              loop={true}
              slidesPerView={2.2}
              spaceBetween={0}
              touch="true">
              {ordered?.map((el) => (
                <SwiperSlide
                  key={el.id}
                  data-user-id={el.id}
                  className={styles.slide_container_item_stuff}
                  onClick={() => handleOpenCard(el.id)}>
                  <div className={styles.wrapper_container_item_stuff}>
                    <img
                      className={`${styles.container__img_stuff} ${showCards ? 'loaded' : ''}`}
                      src={photoSrc(el)}
                      onError={(e) => {
                        e.currentTarget.src = `${bucket_url}/images/imageStuff/no_photo.png`;
                      }}
                      alt={el.name || 'staff'}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.container__item_name_stuff}>{el.name}</div>
                  <div className={styles.container__item_position_stuff}>{el.position}</div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      )}

      {isModalOpen && selectedCard && (
        <Modal
          className={styles.modal_wrapper}
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          onAfterOpen={() => {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('modal-open');
          }}
          onAfterClose={() => {
            document.body.style.overflow = '';
            document.body.classList.remove('modal-open');
          }}
          ariaHideApp={false}
          style={{
            overlay: { zIndex: 10, backgroundColor: '#2C3B447A' },
            content: { zIndex: 10, overflow: 'auto', WebkitOverflowScrolling: 'touch' },
          }}>
          <div key={selectedCard.id} className={styles.modal_context}>
            <div
              className={`${styles.modal_close} ${styles.fixed}`}
              onClick={handleCloseModal}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.00025 8.70733L0.707107 16.0005L0 15.2934L7.29314 8.00023L2.41697e-05 0.707107L0.707131 0L8.00025 7.29312L15.2934 0L16.0005 0.707107L8.70736 8.00023L16.0005 15.2934L15.2934 16.0005L8.00025 8.70733Z"
                  fill="black"
                />
              </svg>
            </div>

            <div className={styles.modal_container}>
              <div className={styles.modal}>
                <img className={styles.modal_img_stuff} src={selectedCard.img} alt={selectedCard.name} />
              </div>
            </div>
            <div className={styles.modal_name_stuff}>{selectedCard.name}</div>
            {selectedCard.position && (
              <div className={styles.modal_description_stuff} style={{ color: '#6b7280', marginTop: 6 }}>
                {selectedCard.position}
              </div>
            )}
            {selectedCard.description && (
              <div className={styles.modal_description_stuff}>{selectedCard.description}</div>
            )}
            {selectedCard.profileContent && (
              <div className={styles.modal_about_stuff} style={{ marginTop: 12 }}>
                {selectedCard.profileContent}
              </div>
            )}
            {aboutKeys.map((k) =>
              selectedCard[k] ? (
                <div key={k} className={styles.modal_about_stuff1}>
                  <div className={styles.modal_about_stuff_symbol}>{bulletSymbol}</div>
                  {selectedCard[k]}
                </div>
              ) : null
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
