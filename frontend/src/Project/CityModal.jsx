import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { BUTTON_CITY } from './const';
import styles from './styles/CityModal.module.css';
import Button from './ui/Button';

export default function CityModal({ isOpen, onClose, currentLocation, selectedCity, onCityClick }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const [value, setValue] = useState('');
  const isValid = value.trim() === '';

  useEffect(() => {
    gsap.set(panelRef.current, { x: 500 });
    gsap.set(overlayRef.current, { opacity: 0, pointerEvents: 'none' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.set(overlayRef.current, { pointerEvents: 'auto' });
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3 });
      gsap.fromTo(panelRef.current, { x: 500 }, { x: 0, duration: 0.4, ease: 'power2.out' });
    } else {
      gsap.set(overlayRef.current, { pointerEvents: 'none' });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.25 });
      gsap.to(panelRef.current, {
        x: 500,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          document.body.style.overflow = '';
        },
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    setValue('');
    onClose();
  };

  return (
    <>
      <div ref={overlayRef} className={styles.overlay} onClick={handleClose} />
      <div ref={panelRef} className={styles.panel}>
        <div className={styles.closeBtn} onClick={handleClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.00025 8.70733L0.707107 16.0005L0 15.2934L7.29314 8.00023L2.41697e-05 0.707107L0.707131 0L8.00025 7.29312L15.2934 0L16.0005 0.707107L8.70736 8.00023L16.0005 15.2934L15.2934 16.0005L8.00025 8.70733Z"
              fill="black"
            />
          </svg>
        </div>

        <div className={styles.container}>
          <div className={styles.description}>
            Вы&nbsp;здесь:
            <div className={styles.pointerLocation}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M14.0002 13.4172C13.2266 13.4172 12.4847 13.1099 11.9378 12.5629C11.3908 12.0159 11.0835 11.2741 11.0835 10.5005C11.0835 9.72698 11.3908 8.98512 11.9378 8.43813C12.4847 7.89115 13.2266 7.58386 14.0002 7.58386C14.7737 7.58386 15.5156 7.89115 16.0626 8.43813C16.6095 8.98512 16.9168 9.72698 16.9168 10.5005C16.9168 10.8836 16.8414 11.2628 16.6948 11.6167C16.5482 11.9706 16.3334 12.2921 16.0626 12.5629C15.7917 12.8338 15.4702 13.0486 15.1163 13.1952C14.7625 13.3418 14.3832 13.4172 14.0002 13.4172ZM14.0002 2.33386C11.8342 2.33386 9.757 3.19428 8.22546 4.72582C6.69391 6.25737 5.8335 8.33459 5.8335 10.5005C5.8335 16.6255 14.0002 25.6672 14.0002 25.6672C14.0002 25.6672 22.1668 16.6255 22.1668 10.5005C22.1668 8.33459 21.3064 6.25737 19.7749 4.72582C18.2433 3.19428 16.1661 2.33386 14.0002 2.33386Z"
                  fill="#1D2E43"
                />
              </svg>
            </div>
          </div>
          <div className={styles.cityLocation}>{currentLocation}</div>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className={styles.locationGroup}>
            <label className={styles.labelProject}>
              <input
                className={styles.input}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={(e) => { if (!e.target.value.trim()) setValue(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); } }}
                maxLength="50"
                autoComplete="off"
                placeholder=""
              />
              <div className={styles.line} />
              <div className={styles.placeholder}>
                <div className={styles.lupaIcon}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.9219 6.7676C12.9219 9.67654 10.5637 12.0347 7.6548 12.0347C4.74586 12.0347 2.3877 9.67654 2.3877 6.7676C2.3877 3.85865 4.74586 1.50049 7.6548 1.50049C10.5637 1.50049 12.9219 3.85865 12.9219 6.7676ZM10.7887 12.7669C9.85175 13.2573 8.78567 13.5347 7.6548 13.5347C3.91743 13.5347 0.887695 10.505 0.887695 6.7676C0.887695 3.03023 3.91743 0.000488281 7.6548 0.000488281C11.3922 0.000488281 14.4219 3.03023 14.4219 6.7676C14.4219 8.82566 13.5032 10.6691 12.0535 11.9103L14.7265 14.5833C15.0194 14.8762 15.0194 15.3511 14.7265 15.644C14.4336 15.9369 13.9587 15.9369 13.6658 15.644L10.7887 12.7669Z"
                      fill="#959DA6"
                    />
                  </svg>
                </div>
                <p className={styles.placeholderText}>Ведите адрес или город</p>
              </div>
            </label>
          </div>
        </form>

        <div className={styles.objectsText}>Наши объекты есть</div>
        <div className={styles.buttonGroup}>
          {BUTTON_CITY.map((el) => (
            <Button
              key={el}
              label={el}
              isActive={el === selectedCity}
              disabled={!isValid}
              onClick={() => onCityClick(el)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
