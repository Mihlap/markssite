import React, { useState } from "react";
import styles from "./TableCompany.module.css";

const TableCompany = () => {
  const [showAll, setShowAll] = useState(false);

  const tdStyle = {
    padding: "36px 0px",
    borderTop: "1px solid black",
   };

  const tdStyle4 = {
    padding: "36px 45px 0px 0px",
    borderTop: "1px solid black",
  };
 
  const handleShowAllClick = (e) => {
    e.preventDefault();
    setShowAll(!showAll);
  };

  return (
    <>
      <table className={styles.tableStyle}>
        <thead>
          <tr>
            <th className={styles.thStyle}>Конкурс</th>
            <th className={styles.thStyle}>Номинация</th>
            <th className={styles.thStyle}>Приз</th>
            <th className={styles.thStyle4}>Дата</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(showAll ? 10 : 6)].map((_, index) => (
            <tr key={index}>
              <td className={styles.tdStyle1} style={tdStyle}>
                Стекло в архитектуре
              </td>
              <td className={styles.tdStyle2} style={tdStyle}>
                Объект нового строительства
              </td>
              <td className={styles.tdStyle3} style={tdStyle}>
                Победитель
              </td>
              <td className={styles.tdStyle4} style={tdStyle4}>
                /_2022/
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.button_table}>
        <button className={styles.button_look_all} onClick={handleShowAllClick}>
          {showAll ? "Скрыть все" : "Смотреть все"}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={showAll ? "M17 14L12.5 9L8 14" : "M8 10L12.5 15L17 10"}
              stroke="#1D2E43"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default TableCompany;
