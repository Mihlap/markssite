import React from 'react';
import './Loading.scss';

export default function Loading() {
  return (
    <div className="pswp__preloader__container">
      <div className="pswp__preloader__icn">
        <div className="pswp__preloader__cut">
          <div className="pswp__preloader__donut"></div>
        </div>
      </div>
    </div>
  );
}
