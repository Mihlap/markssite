import { Swiper, SwiperSlide } from 'swiper/react';

import { UiMarksFilterTab } from '../../UI';
import { useWindowWidth } from '../../hooks/useWindowWidth';

import s from '../styles/Toolbar.module.css';

export default function FilterToolbar({ tabs = [], activeTab, onTabChange }) {
    const { width } = useWindowWidth();

    if (width <= 1024) {
      return (
        <Swiper slidesPerView="auto" spaceBetween={8} className={s.swiper}>
          {tabs.map((tab) => (
            <SwiperSlide key={tab} style={{ width: 'auto' }}>
              <UiMarksFilterTab
                label={tab}
                option="tab"
                isActive={activeTab === tab}
                onClick={() => onTabChange?.(tab)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      );
    }

    return (
        <div className={s.wrap}>
            {tabs.map((tab) => (
                <UiMarksFilterTab
                    key={tab}
                    label={tab}
                    option="tab"
                    isActive={activeTab === tab}
                    onClick={() => onTabChange?.(tab)}
                />
            ))}
        </div>
    );
}
