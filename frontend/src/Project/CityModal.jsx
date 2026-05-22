import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { BUTTON_CITY } from './const';
import s from './styles/CityModal.module.css';
import Button from './ui/Button';
import { Icon1, Icon2 } from './icon';

export default function CityModal({ isOpen, onClose, currentLocation, selectedCity, onCityClick }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const suggestions = focused && value.trim()
    ? BUTTON_CITY.filter((city) => city.toLowerCase().startsWith(value.trim().toLowerCase()))
    : [];

  useEffect(() => {
    setActiveIndex(-1);
  }, [value]);

  const handleSuggestionClick = (city) => {
    setValue('');
    setFocused(false);
    setActiveIndex(-1);
    onCityClick(city);
  };

  useEffect(() => {
    gsap.set(panelRef.current, { x: 600 });
    gsap.set(overlayRef.current, { opacity: 0, pointerEvents: 'none' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.set(overlayRef.current, { pointerEvents: 'auto' });
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3 });
      gsap.fromTo(panelRef.current, { x: 600 }, { x: 0, duration: 0.4, ease: 'power2.out' });
    } else {
      gsap.set(overlayRef.current, { pointerEvents: 'none' });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.25 });
      gsap.to(panelRef.current, {
        x: 600,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          document.body.style.overflow = '';
        },
      });
    }
  }, [isOpen]);


  return (
    <>
      <div ref={overlayRef} className={s.overlay} onClick={() => onClose()} />
      <div ref={panelRef} className={s.panel}>
        <button className={s.closeModal} onClick={() => onClose()} />
        <div className={s.wrap}>
          <div className={s.wrapCity}>
            <p className={s.wrapCity_title}>Вы&nbsp;здесь</p>
            <Icon1 />
            <p className={s.wrapCity_city}>{currentLocation}</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className={s.searchWrapper}>
              <label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setActiveIndex((i) => Math.max(i - 1, -1));
                    } else if (e.key === 'Enter') {
                      e.preventDefault();
                      if (activeIndex >= 0 && suggestions[activeIndex]) {
                        handleSuggestionClick(suggestions[activeIndex]);
                      } else {
                        e.target.blur();
                      }
                    } else if (e.key === 'Escape') {
                      setValue('');
                      setFocused(false);
                      e.target.blur();
                    }
                  }}
                  maxLength="50"
                  autoComplete="off"
                  placeholder=""
                  className={s.searchInput}
                />
                <div className={s.line} />
                {!value && (
                  <div className={s.placeholder}>
                    <div className={s.lupaIcon}>
                      <Icon2 />
                    </div>
                    <p>Ведите адрес или город</p>
                  </div>
                )}
              </label>
              {suggestions.length > 0 && (
                <ul className={s.suggestions}>
                  {suggestions.map((city, i) => (
                    <li key={city} className={`${s.suggestionItem} ${i === activeIndex ? s.suggestionItemActive : ''}`} onMouseDown={() => handleSuggestionClick(city)}>
                      <span className={s.match}>{city.slice(0, value.trim().length)}</span>
                      <span className={s.rest}>{city.slice(value.trim().length)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </form>

          <div className={s.wrapBtn}>
            <p className={s.wrapBtn_title}>Наши объекты есть</p>
            <div className={s.buttonGroup}>
              {BUTTON_CITY.map((el) => (
                <Button key={el} label={el} isActive={el === selectedCity} onClick={() => onCityClick(el)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
