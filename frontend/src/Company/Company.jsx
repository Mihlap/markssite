import React from "react";
import styles from "./Company.module.css";
import Company_Slider from "../UI/Company_Slider/Company_Slider";


export default function Company() {
  return (
    <div className={styles.company_main}>
      <Company_Slider/>
    </div>
  );
}