import React from 'react'
import styles from './TextBlockArticles.module.scss';

export default function TextBlockArticles() {
    return (
        <div>
        <button className={styles.TextBlockArticles_btn}>
        <svg
          width="76"
          height="33"
          viewBox="0 0 76 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="Group 4648">
            <rect
              id="Rectangle 4013"
              y="18"
              width="76"
              height="6"
              rx="3"
              fill="#F6F6F6"
            />
            <rect
              id="Rectangle 4017"
              y="9"
              width="76"
              height="6"
              rx="3"
              fill="#F6F6F6"
            />
            <rect
              id="Rectangle 4018"
              width="76"
              height="6"
              rx="3"
              fill="#F6F6F6"
            />
            <rect
              id="Rectangle 4014"
              y="27"
              width="41"
              height="6"
              rx="3"
              fill="#F6F6F6"
            />
          </g>
        </svg>
      </button>
        </div>
    );
}
