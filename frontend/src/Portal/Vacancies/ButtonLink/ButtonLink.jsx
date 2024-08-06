import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ButtonLink.module.scss';

// Описание компонента - ссылка с внешним видом кнопки
const ButtonLink = ({ text, to, section, currentStyles }) => {
  return (
    <>
      <Link
        to={to}
        className={`${styles.ButtonLink} ${currentStyles && section ? currentStyles[`${section}__button`] : ''}`}>
        {text}
      </Link>
    </>
  );
};

export default ButtonLink;
