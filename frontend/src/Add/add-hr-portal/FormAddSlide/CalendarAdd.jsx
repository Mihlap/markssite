import React, { useEffect, useState, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './FormAddSlide.module.scss';

export default function CalendarAdd({ date, setDate }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);
  const calendarContainerRef = useRef(null);

  const applyStylesToCalendar = () => {
    const calendarElement = calendarContainerRef.current.querySelector('.react-calendar');
    if (!calendarElement) return;

    // Стилизация календаря
    calendarElement.style.border = 'none';
    calendarElement.style.borderRadius = '0.5rem';
    calendarElement.style.backgroundColor = '#F6F6F6';
    calendarElement.style.fontFamily = 'Raleway';
    calendarElement.style.fontWeight = '400';
    calendarElement.style.fontSize = '1rem';
    calendarElement.style.lineHeight = '1.5rem';
    calendarElement.style.marginTop = '11px';
    calendarElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)';
    calendarElement.style.paddingBottom = '1rem';

    // Стилизация кнопок переключения месяца и года
    const navigationButtons = calendarElement.querySelectorAll('.react-calendar__navigation button');
    navigationButtons.forEach((button) => {
      button.style.borderRadius = '50%';
      button.style.width = '48px';
      button.style.height = '48px';
      button.style.display = 'flex';
      button.style.justifyContent = 'center';
      button.style.alignItems = 'center';      
      button.onmouseenter = () => (button.style.backgroundColor = '#75BBFD');
      button.onmouseleave = () => (button.style.backgroundColor = '');
    });

    const tiles = calendarElement.querySelectorAll('.react-calendar__tile');
    tiles.forEach((tile) => {
      tile.style.borderRadius = '50%';
      tile.style.width = '48px';
      tile.style.height = '48px';
      tile.style.display = 'flex';
      tile.style.justifyContent = 'center';
      tile.style.alignItems = 'center';

      // Обрабатываем события мыши для ховера
      tile.addEventListener('mouseenter', () => {
        tile.style.backgroundColor = '#75BBFD';
        tile.style.color = '#F6F6F6';
      });
      tile.addEventListener('mouseleave', () => {
        tile.style.backgroundColor = '';
        tile.style.color = '';
      });
    });

    // Обновление стилей для активной даты
    const activeTiles = calendarElement.querySelectorAll(
      '.react-calendar__tile--active, .react-calendar__tile--active:enabled:hover, .react-calendar__tile--active:enabled:focus'
    );
    activeTiles.forEach((tile) => {
      tile.style.backgroundColor = '#75BBFD';
      tile.style.borderRadius = '50%';
      tile.style.width = '48px';
      tile.style.height = '48px';
      tile.style.display = 'flex';
      tile.style.justifyContent = 'center';
      tile.style.alignItems = 'center';
    });

    // Обновление стилей для текущей даты
    const todayTile = calendarElement.querySelector('.react-calendar__tile--now');
    if (todayTile) {
      todayTile.style.backgroundColor = '#FFBFB5';
      todayTile.style.borderRadius = '50%';
      todayTile.style.width = '48px';
      todayTile.style.height = '48px';
      todayTile.style.display = 'flex';
      todayTile.style.justifyContent = 'center';
      todayTile.style.alignItems = 'center';
      // Добавление событий для ховера
      todayTile.addEventListener('mouseenter', () => (todayTile.style.backgroundColor = '#75BBFD'));
      todayTile.addEventListener('mouseleave', () => (todayTile.style.backgroundColor = '#FFBFB5'));
    }

    // Стили для дней недели и выходных дней
    const weekdayLabels = calendarElement.querySelectorAll('.react-calendar__month-view__weekdays__weekday');
    weekdayLabels.forEach((label) => {
      label.style.color = '#959DA6';
    });

    // Стили для выходных
    const weekendTiles = calendarElement.querySelectorAll('.react-calendar__tile--weekend');
    weekendTiles.forEach((tile) => {
      tile.style.color = '#959DA6';
    });
  };

  useEffect(() => {
    applyStylesToCalendar();
    const observer = new MutationObserver(() => applyStylesToCalendar());
    observer.observe(calendarContainerRef.current, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [date, showCalendar]);

  const handleCalendarOpen = () => {
    setShowCalendar(!showCalendar);
    setButtonActive(!buttonActive);
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setShowCalendar(false);
    setButtonActive(true);
  };

  const formatDate = (date) => {
    return date ? date.toLocaleDateString() : 'Выбрать дату';
  };

  return (
    <div className={`${styles.photo_orientation_selector} ${styles.flex_block_gap}`} ref={calendarContainerRef}>
      <div className={styles.form_container__checkbox_block}>
        <div>Дата</div>
      </div>
      <label>
        <button
          type="button"
          onClick={handleCalendarOpen}
          className={`${styles.slider_container__customFileUpload} ${buttonActive ? styles.activeButton : ''}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.66742 0.167969C2.80003 0.167969 2.9272 0.220647 3.02097 0.314415C3.11474 0.408183 3.16742 0.535361 3.16742 0.667969V1.77997C5.05258 1.61208 6.94893 1.61208 8.83409 1.77997V0.667969C8.83409 0.535361 8.88676 0.408183 8.98053 0.314415C9.0743 0.220647 9.20148 0.167969 9.33409 0.167969C9.46669 0.167969 9.59387 0.220647 9.68764 0.314415C9.78141 0.408183 9.83409 0.535361 9.83409 0.667969V1.87864C10.3204 1.9476 10.7709 2.17385 11.1166 2.52282C11.4623 2.87179 11.6843 3.32432 11.7488 3.8113L11.8068 4.24664C12.0494 6.0773 12.0281 7.9333 11.7441 9.75864C11.6756 10.1981 11.4631 10.6023 11.14 10.9078C10.8168 11.2134 10.4013 11.4029 9.95875 11.4466L9.16342 11.5253C7.06007 11.7327 4.94143 11.7327 2.83808 11.5253L2.04275 11.4466C1.60019 11.4029 1.18469 11.2134 0.861538 10.9078C0.538385 10.6023 0.325885 10.1981 0.257418 9.75864C-0.026686 7.93373 -0.0477894 6.07753 0.194751 4.24664L0.252751 3.8113C0.317167 3.32432 0.539185 2.87179 0.884906 2.52282C1.23063 2.17385 1.68106 1.9476 2.16742 1.87864V0.667969C2.16742 0.535361 2.2201 0.408183 2.31386 0.314415C2.40763 0.220647 2.53481 0.167969 2.66742 0.167969ZM2.96409 2.8033C4.98409 2.60397 7.01742 2.60397 9.03742 2.8033L9.64075 2.8633C10.2188 2.91997 10.6808 3.3673 10.7574 3.94264L10.8154 4.37797C10.8354 4.52997 10.8534 4.68197 10.8701 4.83464H1.13142C1.14808 4.68197 1.16608 4.52997 1.18608 4.37797L1.24408 3.94264C1.28108 3.66304 1.41155 3.40417 1.61427 3.2081C1.817 3.01203 2.08008 2.89028 2.36075 2.86264L2.96409 2.8033ZM1.05208 5.83464C0.986611 7.09461 1.0514 8.35797 1.24542 9.60464C1.27978 9.82501 1.38635 10.0277 1.5484 10.181C1.71045 10.3342 1.91881 10.4293 2.14075 10.4513L2.93608 10.53C4.97408 10.7313 7.02742 10.7313 9.06542 10.53L9.86075 10.4513C10.0827 10.4293 10.291 10.3342 10.4531 10.181C10.6152 10.0277 10.7217 9.82501 10.7561 9.60464C10.9508 8.35664 11.0148 7.0933 10.9494 5.83464H1.05208Z"
              fill="currentColor"
            />
          </svg>
          <div className={styles.slider_container__uploadTextForm}>{formatDate(date)}</div>
        </button>
      </label>
      {showCalendar && <Calendar onChange={handleDateChange} value={date || new Date()} className={styles.calendar} />}
    </div>
  );
}
