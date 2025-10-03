import styles from './ConstructorPage.module.scss';

import quoteRight from '../../add-articles/constructor/svg/icomoon-free_quotes-right.svg';
import quoteLeft from '../../add-articles/constructor/svg/icomoon-free_quotes-right2.svg';
import svg1 from '../../add-articles/constructor/svg/Group4650.svg';
import svg2 from './svg/card_additional_block1.svg';
import svg3 from './svg/card_additional_block6.svg';
import svg6 from './svg/card_additional_block5.svg';
import svg7 from './svg/card_additional_block4.svg';
import svg9 from '../../add-articles/constructor/svg/Group46412.svg';
import svg10 from '../../add-articles/constructor/svg/Group4348.svg';

export default function ConstructorPage({ handleClick }) {
  return (
    <div className={styles.div_conteiner}>
      {/* Текст в рамочке */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockEight}`}
        onClick={() => handleClick([{ type: 'textarea', label: 'Текстовый блок в рамке', required: true }], 2)}>
        <img className={styles.div_conteiner__blockEight_img} src={svg10} alt="10" />
      </div>

      {/* блок с картинкой и описание картинки  */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockOne}`}
        onClick={() =>
          handleClick(
            [
              { type: 'file', label: 'Изображение', required: true },
              { type: 'text', label: 'Описание', required: false },
            ],
            3
          )
        }>
        <img src={svg1} alt="svg_one" />
      </div>

      {/* блок с цитала с фио, описание, картинка  */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockNine}`}
        onClick={() =>
          handleClick(
            [
              { type: 'file', label: 'Автор цитаты', required: false },
              {
                type: 'text',
                label: 'ФИО/Описание',
                required: true,
              },
              { type: 'textarea', label: 'Цитата', required: true },
            ],
            4
          )
        }>
        <div className={styles.block_quote_img}>
          <img className={styles.div_conteiner__blockNine_imgLeft} src={quoteLeft} alt="ковычки вверх" />
          <img src={svg10} alt="svg_10" />
          <img src={quoteRight} className={styles.div_conteiner__blockNine_imgRight} alt="ковычки вниз" />
        </div>
      </div>

      {/* блок маркдаун */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockThree}`}
        onClick={() => handleClick([{ type: 'markdown', label: 'Тело статьи', required: true }], 1)}>
        <img src={svg2} alt="markdown" />
      </div>

      {/* Текст заметки */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockTen}`}
        onClick={() => handleClick([{ type: 'textarea', label: 'Текст заметки', required: true }], 5)}>
        <img src={svg9} alt="svg_9" />
      </div>

      {/* блок с фактом, картинка, описание, фото сотрудника  */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockFour}`}
        onClick={() =>
          handleClick(
            [
              { type: 'file', label: 'Изображение', required: false },
              { type: 'textarea', label: 'Интересный факт', required: true },
              { type: 'file', label: 'Портрет сотрудника', required: false },
              {
                type: 'text',
                label: 'ФИО/Описание',
                required: true,
              },
            ],
            4
          )
        }>
        <div className={styles.block_quote_img}>
          <img src={svg7} alt="svg_7" />
        </div>
      </div>

      {/* блок описание с фоном */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockFive}`}
        onClick={() => handleClick([{ type: 'textarea', label: 'Текст с фоном', required: true }], 1)}>
        <img src={svg3} alt="svg_3" />
      </div>

      {/* блок описание с точкой*/}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockSix}`}
        onClick={() => handleClick([{ type: 'textarea', label: 'Блок описание', required: true }], 1)}>
        <img src={svg6} alt="svg_6" />
      </div>
    </div>
  );
}
