import React from "react";
import styles from "./Loader.module.scss";

export default function LoadingCircle() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className={styles.div_svg}>
        <svg
          className={styles.spinner}
          width="165px"
          height="165px"
          viewBox="0 0 66 66"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className={styles.path}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            cx="33"
            cy="33"
            r="26"
          ></circle>
        </svg>
      </div>
    </div>
  );
}
