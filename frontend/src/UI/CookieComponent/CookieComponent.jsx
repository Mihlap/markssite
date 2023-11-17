// CookieComponent.js
import React, { useState, useEffect } from "react";
import CookieConsent from "react-cookie-consent";

const CookieComponent = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 767;
      setIsMobile(newIsMobile);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto min-content' }}>
      <CookieConsent
        location="bottom"
        cookieName="myCookieConsent"
        buttonText="Принять"
        style={{
          display: "flex",
          justifyContent: 'center',
          alignItems: "center",
          padding: isMobile ? "0.5rem 1rem" : "0.5rem 4rem 0.5rem 2rem",
          background: "var(--light-light-gray-EBECEE)",
          color: "var(--black-1D2E43)",
          boxShadow: "0px 0px 20px 0px rgba(196, 215, 234, 0.61)",
          fontFamily: "var(--font-raleway)",
          fontSize: isMobile ? "1rem" : "1.125rem",
          fontStyle: "normal",
          fontWeight: "var(--fw-400)",
          lineHeight: isMobile ? "1.5rem" : "1.625rem",
          textAlign: isMobile ? "center" : "left",
          whiteSpace: isMobile ? "unset" : "pre-line",
        }}
        buttonStyle={{
          padding: "1rem 2rem",
          borderRadius: "4.125rem",
          border: "1px solid #C7E4FF",
          background: "linear-gradient(135deg, rgba(123, 191, 255, 0.55) 3.43%, rgba(240, 248, 255, 0.55) 177.6%)",
          fontFamily: "var(--font-raleway)",
          fontSize: "1rem",
          fontStyle: "normal",
          fontWeight: "var(--fw-400)",
          lineHeight: "1.5rem",
          cursor: "pointer",
        }}
        expires={10}
      >
       Мы используем файлы cookie и&nbsp;инструменты аналитики     
      </CookieConsent>
    </div>
  );
};

export default CookieComponent;
