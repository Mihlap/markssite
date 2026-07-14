import { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { UiMarksFilterTab } from '../../UI';
import { useWindowWidth } from '../../hooks/useWindowWidth';

import s from '../styles/Toolbar.module.css';

function getSlidesOffsetBefore(width) {
  if (width <= 430) return 16;
  if (width <= 768) return 56;
  if (width <= 944) return 35;
  if (width <= 1024) return 55;
  return 0;
}

export default function FilterToolbar({ tabs = [], activeTab, onTabChange }) {
    const { width } = useWindowWidth();
    const slidesOffsetBefore = useMemo(() => getSlidesOffsetBefore(width), [width]);

    if (width <= 1024) {
      return (
        <Swiper
          key={slidesOffsetBefore}
          slidesPerView="auto"
          spaceBetween={8}
          slidesOffsetBefore={slidesOffsetBefore}
          className={s.swiper}>
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
