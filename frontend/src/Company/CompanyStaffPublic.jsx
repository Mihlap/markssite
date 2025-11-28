import { useEffect, useMemo, useState, useCallback } from 'react';
import Modal from 'react-modal';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { useDispatch, useSelector } from 'react-redux';
import { fetchStaffByCategoryPublic } from '../store/Slice/StaffSliceNew';
import { fetchStaffCategoryTogglesAsync } from '../store/Slice/toggleSlice';

import styles from './Company.module.scss';
import SkeletonLoader from './SkeletonLoader/SkeletonLoader';
import SkeletonLoaderSlider from './SkeletonLoader/SkeletonLoaderSlider';
import StaffModalBlocks from './StaffModalBlocks';

import { isHttp, encodePathnameOnly, absolutizeToBucket } from './utils/media';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

const CAT_META = [
  { name: 'Руководство', key: 'leadership' },
  { name: 'Научно-техническое сопровождение', key: 'science' },
  // { name: 'HR', key: 'hr' },
];

const norm = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[-–—]/g, '-')
    .trim();

const aliasSetFor = (displayName) => {
  const n = norm(displayName);
  if (n === 'руководство') return new Set(['руководство', 'leadership']);
  if (n === 'научное сопровождение' || n === 'научно-техническое сопровождение') {
    return new Set(['научное сопровождение', 'научно-техническое сопровождение', 'science']);
  }
  if (n === 'hr') return new Set(['hr']);
  return new Set([n]);
};

const normalizeUrl = (v) => absolutizeToBucket(v, bucket_url);

const normalizeConstructorGroups = (groups) => {
  if (!Array.isArray(groups)) return [];
  const looksImageInput = (inp) => {
    const t = String(inp?.type || '').toLowerCase();
    const lbl = String(inp?.label || '').toLowerCase();
    return t === 'file' || t === 'image' || /изображ|image|img/.test(lbl);
  };
  return groups.map((group) =>
    (Array.isArray(group) ? group : []).map((inp) => {
      if (!inp) return inp;
      if (!looksImageInput(inp)) return inp;
      const v = inp.value;
      if (typeof v === 'string') return { ...inp, value: normalizeUrl(v) };
      if (Array.isArray(v)) {
        return {
          ...inp,
          value: v.map((vv) =>
            typeof vv === 'string' ? normalizeUrl(vv) : vv && vv.src ? { ...vv, src: normalizeUrl(vv.src) } : vv
          ),
        };
      }
      if (v && typeof v === 'object' && typeof v.src === 'string') {
        return { ...inp, value: { ...v, src: normalizeUrl(v.src) } };
      }
      return inp;
    })
  );
};

const photoSrc = (row) => {
  const name = row?.img;
  if (!name) return `${bucket_url}/images/imageStaff/no_photo.png`;
  const raw = isHttp(String(name)) ? String(name) : `${bucket_url}/images/imageStaff/${name}`;
  return encodePathnameOnly(raw);
};

export default function CompanyStaffPublic({ handleMouseEnter, handleMouseLeave, handleMouseHover }) {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.staff);
  const staffCats = useSelector((s) => s.toggle.staffCats);

  const [category, setCategory] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const [isSwitchingCategory, setIsSwitchingCategory] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 767 : false);
  
  const showSkeleton = loading || isSwitchingCategory;

  useEffect(() => {
    dispatch(fetchStaffCategoryTogglesAsync());
  }, [dispatch]);

  const visibleCats = useMemo(() => CAT_META.filter((c) => staffCats?.[c.key] === true), [staffCats]);

  useEffect(() => {
    if (!visibleCats.length) {
      setCategory(null);
      setActiveButton(null);
      return;
    }
    const curKey = CAT_META.find((c) => c.name === category)?.key;
    const curOn = curKey ? staffCats?.[curKey] === true : false;

    if (!category || !curOn) {
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
      dispatch(fetchStaffByCategoryPublic(undefined));
    }
  }, [category, dispatch]);

  const filtered = useMemo(() => {
    const arr = Array.isArray(items) ? items : [];
    if (!category) return arr;

    const aliases = aliasSetFor(category);
    const hasAlias = (v) => aliases.has(norm(v));

    return arr.filter((it) => {
      if (it?.isVisible === false) return false;

      const cats = Array.isArray(it?.category) ? it.category : [];
      if (!cats.some(hasAlias)) return false;

      const vbc =
        it?.visibilityByCategory && typeof it.visibilityByCategory === 'object' ? it.visibilityByCategory : {};
      for (const [k, v] of Object.entries(vbc)) {
        if (v === false && hasAlias(k)) return false;
      }
      return true;
    });
  }, [items, category]);

  const ordered = useMemo(() => {
    const arr = filtered.slice();
    arr.sort(
      (a, b) =>
        (a.sortIndex ?? 0) - (b.sortIndex ?? 0) || new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return arr;
  }, [filtered]);

  const handleOpenCard = useCallback(
    (id) => {
      const row = ordered.find((x) => x.id === id);
      if (!row) return;

      let rawGroups = [];
      if (Array.isArray(row?.dynamicBlocks) && row.dynamicBlocks.length) {
        rawGroups = row.dynamicBlocks;
      } else if (Array.isArray(row?.ConstructorStaffNews) && row.ConstructorStaffNews.length) {
        rawGroups = row.ConstructorStaffNews.map((c) => (Array.isArray(c?.data) ? c.data : [])).filter((g) => g.length);
      } else if (Array.isArray(row?.Constructors) && row.Constructors.length) {
        rawGroups = row.Constructors.map((c) => c?.data).filter((g) => Array.isArray(g) && g.length);
      }

      if (Array.isArray(rawGroups) && rawGroups.length && !Array.isArray(rawGroups[0])) {
        rawGroups = [rawGroups];
      }

      const normalizedBlocks = normalizeConstructorGroups(rawGroups);

      setSelectedCard({
        ...row,
        img: photoSrc(row),
        dynamicBlocks: normalizedBlocks,
      });
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

 const onCategoryClick = useCallback(
   (cat) => {
     if (cat === category) return;

     setIsSwitchingCategory(true);
     setActiveButton(cat);
     setCategory(cat);
   },
   [category]
  );
  
  useEffect(() => {  
    if (!loading && isSwitchingCategory) {
      const t = setTimeout(() => {
        setIsSwitchingCategory(false);
      }, 150);

      return () => clearTimeout(t);
    }
  }, [loading, isSwitchingCategory]);

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

      <div
        className={styles.card_container}
        style={{ opacity: showSkeleton ? 0.4 : 1, transition: 'opacity 0.3s ease' }}>
        <ul className={styles.card_container_ul}>
          {error ? (
            <div className={styles.error}>Ошибка: {String(error)}</div>
          ) : showSkeleton ? (
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
                    className={`${styles.container__img_stuff} ${!loading ? 'loaded' : ''}`}
                    src={photoSrc(el)}
                    onError={(e) => {
                      e.currentTarget.src = `${bucket_url}/images/imageStaff/no_photo.png`;
                    }}
                    alt={el.name || 'staff'}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
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
          {showSkeleton ? (
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
                      className={`${styles.container__img_stuff} ${!loading ? 'loaded' : ''}`}
                      src={photoSrc(el)}
                      onError={(e) => {
                        e.currentTarget.src = `${bucket_url}/images/imageStaff/no_photo.png`;
                      }}
                      alt={el.name || 'staff'}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
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
          {showSkeleton ? (
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
                      className={`${styles.container__img_stuff} ${!loading ? 'loaded' : ''}`}
                      src={photoSrc(el)}
                      onError={(e) => {
                        e.currentTarget.src = `${bucket_url}/images/imageStaff/no_photo.png`;
                      }}
                      alt={el.name || 'staff'}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
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

            {(selectedCard.description || selectedCard.position) && (
              <div className={styles.modal_description_stuff}>{selectedCard.description || selectedCard.position}</div>
            )}

            <StaffModalBlocks selectedCard={selectedCard} bucketUrl={bucket_url} />
          </div>
        </Modal>
      )}
    </>
  );
}
