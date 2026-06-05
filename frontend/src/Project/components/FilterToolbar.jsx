import { Swiper, SwiperSlide } from 'swiper/react';

import { Icon } from '../icon';
import {UiMarksFilterTab} from '../../UI';
import { BUTTON_CHOOSE } from '../const';

import s from '../styles/FilretToolbar.module.css';

function CrossIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function FilterToolbar({ onFilter, onModal, onActive, onCityReset, isHide, isDevice = [], city }) {
  const [isMobile] = isDevice;

  const cityButton = city ? (
    <UiMarksFilterTab
      option="city"
      isActive
      label={city}
      iconLeft={<Icon />}
      iconRight={
        <span
          role="button"
          aria-label="Сбросить город"
          onClick={(e) => {
            e.stopPropagation();
            onCityReset();
          }}>
          <CrossIcon />
        </span>
      }
      onClick={onModal}
    />
  ) : (
    <UiMarksFilterTab option="city" label="Выбрать город" onClick={onModal} iconLeft={<Icon />} />
  );

  return (
    <>
      {isMobile && (
        <Swiper slidesPerView="auto" spaceBetween={8} slidesOffsetBefore={16} className={s.wrap_swiper}>
          {BUTTON_CHOOSE.map((el) => (
            <SwiperSlide key={el} style={{ width: 'auto' }}>
              <UiMarksFilterTab label={el} isActive={onActive(el)} onClick={() => onFilter(el)} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {!isMobile && (
        <div className={s.wrap_tabs}>
          <div className={s.wrap_tabs_btn}>
            {BUTTON_CHOOSE.map((el, i) => (
              <UiMarksFilterTab key={i} label={el} isActive={onActive(el)} onClick={() => onFilter(el)} />
            ))}
          </div>
          {cityButton}
        </div>
      )}
    </>
  );
}
