import React from 'react';
import styles from "./ButtonLink.module.scss";

// Описание компонента - ссылка с внешним видом кнопки  
const ButtonLink = ({text, href, section, currentStyles}) => {
  console.log(currentStyles)
  return (
    <>
      <a href={href} className={`${styles.ButtonLink} ${currentStyles && section ? currentStyles[`${section}__button`] : ''}`}>{text}</a>
    </>
  );
};

export default ButtonLink;