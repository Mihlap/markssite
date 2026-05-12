import React, { useState, useEffect } from 'react';
import CookieConsent from 'react-cookie-consent';
import {IS_DEV} from '../../const/is-dev';

const CookieComponent = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (IS_DEV) {
    return null
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto min-content' }}>
      <CookieConsent
        location="bottom"
        cookieName="myCookieConsent"
        buttonText="Принять"
        style={{
          display: isMobile ? 'block' : 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0',
          paddingLeft: isMobile ? '0' : '32px',
          background: 'var(--light-light-gray-EBECEE)',
          color: 'var(--black-1D2E43)',
          boxShadow: 'none',
          fontFamily: 'var(--font-raleway)',
          fontSize: isMobile ? '1rem' : '1.125rem',
          fontStyle: 'normal',
          fontWeight: 'var(--fw-400)',
          lineHeight: isMobile ? '1.5rem' : '1.625rem',
          textAlign: isMobile ? 'center' : 'left',
          whiteSpace: isMobile ? 'unset' : 'pre-line',
        }}
        buttonStyle={{
          width: isMobile && '100%',
          margin: '0',
          padding: '24px 50px',
          borderRadius: '0',
          border: 'none',
          background: '#1d2e43',
          color: 'var(--white-F6F6F6)',
          fontFamily: 'var(--font-raleway)',
          fontSize: '1rem',
          fontStyle: 'normal',
          fontWeight: '600',
          lineHeight: '24px',
          cursor: 'pointer',
        }}
        expires={10}>
        Мы используем файлы cookie и&nbsp;инструменты аналитики.
      </CookieConsent>
    </div>
  );
};

export default CookieComponent;
