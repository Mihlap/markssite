import React from 'react'
import styles from './AddProject.module.scss'

export default function AddProject() {


  return (
    <section className={styles.project_components_admin}>
      <div className={styles.project_components_admin__title}>Проекты</div>

      <button className={styles.project_components_admin__button}>
        <div>
          <div>
            <svg
              width="41"
              height="40"
              viewBox="0 0 41 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="icon">
                <circle
                  id="Ellipse 4"
                  cx="20.5"
                  cy="20"
                  r="20"
                  fill="#F6F6F6"
                />
                <path
                  id="Vector 10"
                  d="M10.5 20H20.5M30.5 20H20.5M20.5 20V10M20.5 20V30"
                  stroke="#75BBFD"
                  stroke-width="2"
                  stroke-linecap="square"
                />
              </g>
            </svg>
          </div>
          <div>Добавить проект на главную</div>
        </div>
      </button>
    </section>
  );
}
