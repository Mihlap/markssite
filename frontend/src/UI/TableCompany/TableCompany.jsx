import React, { useState } from "react";
import styles from "./TableCompany.module.css";
import tableData from "./tableData";

const TableCompany = () => {
  const [showAll, setShowAll] = useState(false);

  const tdStyle = {
    paddingTop: "36px",
    paddingBottom: "36px",
    borderTop: "1px solid var(--dark-gray-566272)",
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordWrap: 'break-word',
   };

  const tdStyle4 = {
    padding: "36px 45px 36px 30px",
    borderTop: "1px solid var(--dark-gray-566272)",
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
          {tableData.slice(0, showAll ? tableData.length : 6).map((el, index) => (
            <tr key={index}>
              <td className={styles.tdStyle1} style={tdStyle}>
                {el.title}
              </td>
              <td className={styles.tdStyle2} style={tdStyle}>
                {el.nomination}
              </td>
              <td className={styles.tdStyle3} style={tdStyle}>
              {el.prize}
              </td>
              <td className={styles.tdStyle4} style={tdStyle4}>
               {el.year}
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
