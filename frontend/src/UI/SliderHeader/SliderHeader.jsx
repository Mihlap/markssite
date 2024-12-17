import React, { useState, useEffect, useRef } from 'react';
import styles from './SliderHeader.module.scss';

const awardsImages = [
  { src: './assets/1.png', alt: 'award1' },
  { src: './assets/2.png', alt: 'award2' },
  { src: './assets/7.png', alt: 'award7' },
  { src: './assets/8.png', alt: 'award8' },
  { src: './assets/3.png', alt: 'award3' },
  { src: './assets/4.png', alt: 'award4' },
  { src: './assets/5.png', alt: 'award5' },
  { src: './assets/6.png', alt: 'award6' },
  { src: './assets/9.png', alt: 'award9' },
  { src: './assets/10.png', alt: 'award10' },
];

const companiesImages = [
  { src: './assets/logo/logo1.png', alt: 'company1' },
  { src: './assets/logo/logo2.png', alt: 'company2' },
  { src: './assets/logo/logo3.png', alt: 'company3' },
  { src: './assets/logo/logo4.png', alt: 'company4' },
  { src: './assets/logo/logo5.png', alt: 'company5' },
  { src: './assets/logo/logo6.png', alt: 'company6' },
  { src: './assets/logo/logo7.png', alt: 'company7' },
  // { src: './assets/logo/logo8.png', alt: 'company8' },
  { src: './assets/logo/logo9.png', alt: 'company9' },
  { src: './assets/logo/logo10.png', alt: 'company10' },
  { src: './assets/logo/logo11.png', alt: 'company11' },
  { src: './assets/logo/logo12.png', alt: 'company12' },
  // { src: './assets/logo/logo13.png', alt: 'company13' },
  { src: './assets/logo/logo14.png', alt: 'company14' },
  { src: './assets/logo/logo15.png', alt: 'company15' },
  { src: './assets/logo/logo16.png', alt: 'company16' },
  { src: './assets/logo/logo17.png', alt: 'company17' },
  { src: './assets/logo/logo18.png', alt: 'company18' },
  { src: './assets/logo/logo19.png', alt: 'company19' },
  { src: './assets/logo/logo20.png', alt: 'company20' },
  { src: './assets/logo/logo21.png', alt: 'company21' },
  { src: './assets/logo/logo22.png', alt: 'company22' },
  { src: './assets/logo/logo23.png', alt: 'company23' },
  { src: './assets/logo/logo24.png', alt: 'company24' },
  { src: './assets/logo/logo25.png', alt: 'company25' },
  { src: './assets/logo/logo26.png', alt: 'company26' },
  { src: './assets/logo/logo27.png', alt: 'company27' },
  { src: './assets/logo/logo28.png', alt: 'company28' },
  { src: './assets/logo/logo29.png', alt: 'company29' },
  { src: './assets/logo/logo30.png', alt: 'company30' },
  { src: './assets/logo/logo31.png', alt: 'company31' },
  { src: './assets/logo/logo32.png', alt: 'company32' },
  { src: './assets/logo/logo33.png', alt: 'company33' },
  { src: './assets/logo/logo34.png', alt: 'company34' },
  { src: './assets/logo/logo35.png', alt: 'company35' },
  { src: './assets/logo/logo36.png', alt: 'company36' },
  { src: './assets/logo/logo37.png', alt: 'company37' },
  { src: './assets/logo/logo38.png', alt: 'company38' },
  { src: './assets/logo/logo39.png', alt: 'company39' },
  { src: './assets/logo/logo40.png', alt: 'company40' },
  { src: './assets/logo/logo41.png', alt: 'company41' },
  { src: './assets/logo/logo42.png', alt: 'company42' },
  { src: './assets/logo/logo43.png', alt: 'company43' },
  { src: './assets/logo/logo44.png', alt: 'company44' },
];

const SliderHeader = ({ isAwards }) => {
  const [show, setShow] = useState(false);
  const marqueeRef = useRef(null);

  // Определение, какие изображения использовать
  const images = isAwards ? awardsImages : companiesImages;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShow(true);
          observer.disconnect(); // Прекращаем наблюдение, как только компонент станет видимым
        }
      },
      { threshold: 0.5 } // Порог видимости: 50%
    );

    observer.observe(marqueeRef.current); // Наблюдаем за элементом слайдера
    return () => observer.disconnect(); // Чистим наблюдателя при размонтировании компонента
  }, []);

  return (
    <div className={styles.SliderHeader}>
      <div ref={marqueeRef} className={styles.marqueeContainer}>
        {show && (
          <div className={styles.SliderHeader__marquee}>
            {Array.from({ length: 10 }).flatMap((_, i) =>
              images.map((image, index) => (
                <div
                  key={`${i}-${index}`}
                  className={`${styles.SliderHeader__item} ${isAwards ? '' : styles.SliderHeader__item_companies}`}>
                  <img src={image.src} alt={image.alt} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SliderHeader;

// // Тикер на библиотеке react-fast-marquee
// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import Marquee from 'react-fast-marquee';
// import styles from './SliderHeader.module.css';

// const SliderHeader = () => {
//   const [show, setShow] = useState(false);
//   const marqueeRef = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) {
//           setShow(true);
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.5 } // Измените порог при необходимости
//     );

//     observer.observe(marqueeRef.current);
//     return () => observer.disconnect();
//   }, []);

//   const marqueeProps = useMemo(
//     () => ({
//       gradient: true,
//       speed: 80,
//       direction: 'left',
//       spacing: 10,
//       autoFill: true,
//       gaps: null,
//       gradientColor: 'transparent',
//     }),
//     []
//   );

//   const images = [
//     { src: './assets/1.png', alt: 'image1' },
//     { src: './assets/2.png', alt: 'image2' },
//     { src: './assets/7.png', alt: 'image7' },
//     { src: './assets/8.png', alt: 'image8' },
//     { src: './assets/3.png', alt: 'image3' },
//     { src: './assets/4.png', alt: 'image4' },
//     { src: './assets/5.png', alt: 'image5' },
//     { src: './assets/6.png', alt: 'image6' },
//   ];

//   return (
//     <div className={styles.logo}>
//       <div ref={marqueeRef}>
//         {show && (
//           <Marquee {...marqueeProps} style={{ paddingLeft: '18.26vw', width: 'calc(100% - 18.26vw) *100%' }}>
//             {images.map((image, index) => (
//               <div className={styles.item} key={index}>
//                 <img src={image.src} alt={image.alt} />
//               </div>
//             ))}
//           </Marquee>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SliderHeader;
