import React, { useEffect, useState } from 'react';
import styles from './TableCompany.module.css';
import tableData from './tableData';

const TableCompanyMobile = () => {
  const [showTable, setShowTable] = useState(null);

  const tdStyle = {
    paddingTop: '1rem',
    paddingBottom: '1rem',
    borderTop: '1px solid var(--dark-gray-566272)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordWrap: 'break-word',
  };

  const tdStyle5 = {
    padding: '1rem 1rem',
    borderTop: '1px solid var(--dark-gray-566272)',
  };

  const handleShowTable = (index) => {
    setShowTable(index === showTable ? null : index);
  };

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };

    const scrollToTableHeader = () => {
      const element = document.getElementById('table-header-anchor');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        window.location.replace('#table-header-anchor');
      }
    };

    const hash = window.location.hash;
    if (hash === '#table-header-anchor') {
      scrollToTableHeader();
    } else {
      scrollToTop();
    }

    return () => {
      window.removeEventListener('scroll', scrollToTop);
      window.removeEventListener('scroll', scrollToTableHeader);
    };
  }, []);

  return (
    <>
      <table className={styles.tableStyle} id="table-header-anchor">
        <tbody>
          {tableData.map((el, index) => (
            <React.Fragment key={index}>
              <tr onClick={() => handleShowTable(index)}>
                <td style={tdStyle} className={styles.tdStyle1}>
                  {el.title}
                </td>
                <td style={tdStyle} className={styles.tdStyle4}>
                  {el.year}
                </td>
                <td
                  style={tdStyle5}
                  className={`${styles.tdStyle5} ${styles.svgContainer} ${showTable === index ? styles.clicked : ''}`}>
                  <svg
                    width="12"
                    height="7"
                    viewBox="0 0 12 7"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ cursor: 'pointer' }}
                    // onClick={() => handleShowTable(index)}
                  >
                    <path d="M1 1L6 6L11 1" stroke="#1D2E43" />
                  </svg>
                </td>
              </tr>
              {showTable === index && (
                <tr className={`${styles.expandedRow} ${showTable === index ? styles.expandedOut : styles.expandedIn}`}>
                  <td colSpan="3">
                    <div className={styles.field_nomination}>
                      Номинация
                      <div className={styles.element_nomination}>{el.nomination}</div>
                    </div>
                    <div className={styles.field_prize}>
                      Приз
                      <div className={styles.element_prize}>{el.prize}</div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TableCompanyMobile;
