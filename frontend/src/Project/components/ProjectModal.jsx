import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { BUTTON_CITY } from '../const';
import s from '../styles/ProjectModal.module.css';
import Button from '../ui/Button';
import { Icon1, Icon2 } from '../icon';
import SearchInput from './SearchInput';

export default function ProjectModal({
  isOpen,
  onClose,
  currentLocation,
  selectedCity,
  onCityClick,
  onSearch,
}) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);

  // Gsap
  useEffect(() => {
    gsap.set(panelRef.current, { x: 600 });
    gsap.set(overlayRef.current, { opacity: 0, pointerEvents: 'none' });
  }, []);
  //Gsap
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

          <SearchInput onSearch={onSearch} />

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