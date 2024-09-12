import React, { useCallback, useMemo } from 'react';
import styles from './ConstructorPage.module.scss';

import svg1 from './svg/Group4650.svg';
import svg2 from './svg/Group4648.svg';
import svg3 from './svg/Group4651.svg';
import svg4 from './svg/Group4652.svg';
import svg5 from './svg/Group4649.svg';
import svg6 from './svg/Group4641.svg';

export default function ConstructorPage({ handleClick }) {
  const items = useMemo(
    () => [
      {
        svg: svg1,
        alt: 'svg_one_icon',
        handleClickArgs: [
          [
            { type: 'file', label: 'Картинка с описанием', required: true },
            { type: 'text', label: 'Описание картинки', required: false },
          ],
          0,
        ],
        styles: styles.div_conteiner__blockOne,
      },
      {
        svg: svg2,
        alt: 'svg_two_icon',
        handleClickArgs: [
          [
            { type: 'text', label: 'Заголовок', required: false },
            { type: 'textarea', label: 'Текстовый блок', required: true },
          ],
          1,
        ],
        styles: styles.div_conteiner__blockTwo,
      },
      {
        svg: svg3,
        alt: 'svg_three_icon',
        handleClickArgs: [[{ type: 'file', label: 'Блок 3 картинки', required: true }], 2],
        styles: styles.div_conteiner__blockThree,
      },
      {
        svg: svg4,
        alt: 'svg_four_icon',
        handleClickArgs: [[{ type: 'file', label: 'Блок 2е вертикальные картинки', required: true }], 3],
        styles: styles.div_conteiner__blockFour,
      },
      {
        svg: svg5,
        alt: 'svg_five_icon',
        handleClickArgs: [
          [
            {
              type: 'file',
              label: 'Слайдер *допускается загрузка 8ми изображений',
              required: true,
            },
          ],
          4,
        ],
        styles: styles.div_conteiner__blockFive,
      },
      {
        svg: svg6,
        alt: 'svg_six_icon',
        handleClickArgs: [[{ type: 'file', label: 'Видеоролик', required: true }], 5],
        styles: styles.div_conteiner__blockSix,
      },
      {
        svg: svg6,
        alt: 'svg_six_icon',
        handleClickArgs: [[{ type: 'videoLink', label: 'Ссылка на видеоролик', required: true }], 5],
        styles: styles.div_conteiner__blockVideoFrame,
        additionalContent: <p className={styles.videoText}>Видео-ссылка</p>,
      },
    ],
    []
  );

  const renderItems = useCallback(() => {
    return items.map((item, index) => (
      <div
        key={index}
        className={`${styles.div_conteiner__item} ${item.styles}`}
        onClick={() => handleClick(...item.handleClickArgs)}
      >
        {item.additionalContent && item.additionalContent}
        <img src={item.svg} alt={item.alt} />
      </div>
    ));
  }, [handleClick, items]);

  return <div className={styles.div_conteiner}>{renderItems()}</div>;
}
