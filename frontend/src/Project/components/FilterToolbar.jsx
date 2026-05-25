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
      label={city}
      icon={<Icon />}
      iconRight={
        <span
          role="button"
          aria-label="Сбросить город"
          className={s.btnCityReset}
          onClick={(e) => {
            e.stopPropagation();
            onCityReset();
          }}>
          <CrossIcon />
        </span>
      }
      onClick={onModal}
      className={s.cityActive}
    />
  ) : (
    <Button label="Выбрать город" onClick={onModal} icon={<Icon />} className={s.btnCity} />
  );

  return (
    <>
      {(isMobile || isTablet) && (
        <Swiper slidesPerView="auto" spaceBetween={8} touch="true">
          {BUTTON_CHOOSE.map((el, i) => (
            <SwiperSlide
              key={el}
              onClick={() => onFilter(el)}
              className={`${s.tabs} ${i === 0 ? s.firstSlide : ''} ${onActive(el) ? s.active : ''}`}>
              {el}
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {!isMobile && !isHide && (
        <div className={s.menu_button_group_project_wrapper_main}>
          <div className={s.menu_button_group_project}>
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
