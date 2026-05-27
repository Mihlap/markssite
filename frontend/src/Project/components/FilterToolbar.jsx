import { Swiper, SwiperSlide } from 'swiper/react';

import { Icon } from '../icon';
import Button from '../ui/Button';
import { BUTTON_CHOOSE } from '../const';

import s from '../styles/Project.module.css';

function CrossIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function FilterToolbar({ onFilter, onModal, onActive, onCityReset, isHide, isDevice = [], city }) {
  const [isMobile, isTablet] = isDevice;

  const cityButton = city ? (
    <Button
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
    <Button option="city" label="Выбрать город" onClick={onModal} iconLeft={<Icon />} />
  );

  return (
    <>
      {isMobile && (
        <Swiper slidesPerView="auto" spaceBetween={8} touch="true" slidesOffsetBefore={16}>
          {BUTTON_CHOOSE.map((el) => (
            <SwiperSlide key={el} style={{ width: 'auto' }}>
              <Button label={el} isActive={onActive(el)} onClick={() => onFilter(el)} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {!isMobile && (
        <div className={s.wrap_tabs}>
          <div className={s.wrap_tabs_btn}>
            {BUTTON_CHOOSE.map((el, i) => (
              <Button key={i} label={el} isActive={onActive(el)} onClick={() => onFilter(el)} />
            ))}
          </div>
          {cityButton}
        </div>
      )}
    </>
  );
}
