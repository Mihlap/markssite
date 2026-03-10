import React, { useEffect, useRef, useState } from 'react'
import s from './Styles.module.css';

export default function MarksSegmentedСontrols({ name, segments, callback, controlRef, defaultIndex = 0 }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const componentReady = useRef();

  useEffect(() => {
    componentReady.current = true;
  }, []);

  useEffect(() => {
    const activeSegmentRef = segments[activeIndex].ref;
    const { offsetWidth, offsetLeft } = activeSegmentRef.current;
    const { style } = controlRef.current;

    style.setProperty('--highlight-width', `${offsetWidth}px`);
    style.setProperty('--highlight-x-pos', `${offsetLeft}px`);
  }, [activeIndex, callback, controlRef, segments]);

  const onInputChange = (value, index) => {
    setActiveIndex(index);
    callback(value, index);
  };

  return (
    <div className={s.controlsContainer} ref={controlRef}>
      <div className={`${s.controls}${componentReady.current ? ` ${s.ready}` : ''}`}>
        {segments?.map((item, i) => (
          <div key={item.value} className={`${s.segment}${i === activeIndex ? ` ${s.active}` : ''}`} ref={item.ref}>
            <input
              type="radio"
              value={item.value}
              id={item.label}
              name={name}
              onChange={() => onInputChange(item.value, i)}
              checked={i === activeIndex}
            />
            <label htmlFor={item.label}>
              {item.icon && item.icon}
              {item.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
