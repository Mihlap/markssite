import React from 'react';
import styles from '../../style/style-card.module.scss';

export default function AddSlideMain({ handleOpenModal }) {
  return (
    <div className={styles.card_components_admin__blockAddEvent} >
    <span className={styles.card_components_admin__title}>Жизнь на MARKS`e</span>
    <div className={styles.card_components_admin__button_block} >
              <button className={styles.card_components_admin__button}>
                <div>
                  <svg
                    className={styles.card_components_admin__icon}
                    width="41"
                    height="40"
                    viewBox="0 0 41 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <g id="icon">
                      <circle id="Ellipse 4" cx="20.5" cy="20" r="20" fill="#F6F6F6" />
                      <path
                        id="Vector 10"
                        d="M10.5 20H20.5M30.5 20H20.5M20.5 20V10M20.5 20V30"
                        stroke="#75BBFD"
                        strokeWidth="2"
                        strokeLinecap="square"
                      />
                    </g>
                  </svg>
                </div>
                <div className={styles.card_components_admin__button_text}>Добавить мероприятие</div>
              </button>
      </div>
      </div>
  )
}

