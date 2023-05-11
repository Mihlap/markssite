import React from 'react';
import "./NotFound.css";
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className="error-section">
      <div className="error-contain">
        <div className="error-text">
          <h1>404</h1>
          <p>Страница не найдена</p>
          <p>
          <Link className='error-link' to="/">вернуться на главную</Link>
          </p>
        </div>
        <div className="binoculars">
          <div className="back-bino"></div>
          <div className="left-bino"></div>
          <div className="right-bino"></div>
          <div className="left-bino-lense">
            <div className="eye"></div>
          </div>
          <div className="right-bino-lense">
            <div className="eye"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotFound