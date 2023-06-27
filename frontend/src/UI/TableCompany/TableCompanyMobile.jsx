import React, { useState } from "react";
import styles from "./TableCompany.module.css";
import tableData from "./tableData";

const TableCompanyMobile = () => {
  const [showAll, setShowAll] = useState(false);
  const [showTable, setShowTable] = useState(null);
  const [showExpanded, setShowExpanded] = useState(false);

  const tdStyle = {
    paddingTop: "1rem",
    paddingBottom: "1rem",
    borderTop: "1px solid var(--dark-gray-566272)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordWrap: "break-word",
  };

  const tdStyle5 = {
    padding: "1rem 1rem",
    borderTop: "1px solid var(--dark-gray-566272)",
  };

  const handleShowAllClick = (e) => {
    e.preventDefault();
    setShowAll(!showAll);
  };

  const handleShowTable = (index) => {
    setShowTable(index === showTable ? -1 : index);
    setShowExpanded(index === showTable && !showExpanded);
  };

  return (
    <>
      <table className={styles.tableStyle}>
        <tbody>
          {tableData
            .slice(0, showAll ? tableData.length : 6)
            .map((el, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td style={tdStyle} className={styles.tdStyle1}>
                    {el.title}
                  </td>
                  <td style={tdStyle} className={styles.tdStyle4}>
                    {el.year}
                  </td>
                  <td style={tdStyle5} className={styles.tdStyle5}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleShowTable(index)}
                    >
                      <path
                        d={
                          showTable === index
                            ? "M17 14L12.5 9L8 14"
                            : "M8 10L12.5 15L17 10"
                        }
                        stroke="#1D2E43"
                      />
                    </svg>
                  </td>
                </tr>
                {showTable === index && (
                  <tr>
                    <td
                      colSpan="3"
                      className={`${styles.expanded} ${showExpanded ? "show" : ""}`}
                    >
                      <div className={styles.field_nomination}>
                        Номинация
                        <div className={styles.element_nomination}>
                          {el.nomination}
                        </div>
                      </div>
                      <div className={styles.field_prize}>
                        Приз
                        <div className={styles.element_prize}>
                          {el.prize}
                          </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
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

export default TableCompanyMobile;
