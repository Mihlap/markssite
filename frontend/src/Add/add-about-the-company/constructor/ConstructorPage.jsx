import { memo, useMemo } from 'react';
import styles from './ConstructorPage.module.scss';

import quoteRight from '../../add-articles/constructor/svg/icomoon-free_quotes-right.svg';
import quoteLeft from '../../add-articles/constructor/svg/icomoon-free_quotes-right2.svg';
import svg1 from '../../add-articles/constructor/svg/Group4650.svg';
import svg2 from './svg/card_additional_block1.svg';
import svg3 from './svg/card_additional_block6.svg';
import svg6 from './svg/card_additional_block5.svg';
import svg7 from './svg/card_additional_block4.svg';
import svg11 from './svg/card additional block_new.svg';
import svg12 from './svg/card additional block_item.svg';
import svg9 from '../../add-articles/constructor/svg/Group46412.svg';
import svg10 from '../../add-articles/constructor/svg/Group4348.svg';

function ConstructorPage({ handleClick, missingBlocks = [], isHistoryForm = false }) {
  const missing = useMemo(() => new Set(missingBlocks), [missingBlocks]);

  return (
    <div className={styles.div_conteiner}>
      
      {/* Товарищ года (ОБЯЗАТЕЛЬНЫЙ БЛОК) - только для истории */}
      {isHistoryForm && (
        <div
          className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockOne} ${styles.div_conteiner__blockOnePersonOfYear} ${missing.has('personOfYear') ? styles.required_missing : ''
            }`}
          onClick={() => {
            const inputs = [
              { type: 'file', label: 'Человек года', required: true },
            ];
            const meta = { blockId: 'personOfYear', requiredBlock: true };
            handleClick(inputs, meta);
          }}>
          <img src={svg12} alt="person_of_year" />
        </div>
      )}

      {/* Текст в рамочке */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockEight}`}
        onClick={() => {
          const inputs = [
            {
              type: 'textarea',
              label: 'Текстовый блок в рамке',
              placeholder: 'Нет ограничения по символам',
              required: true,
            },
          ];
          const meta = { blockId: 'frameText', requiredBlock: false };
          handleClick(inputs, meta);
        }}>
        <img className={styles.div_conteiner__blockEight_img} src={svg10} alt="10" />
      </div>

      {/* Картинка + описание (ОБЯЗАТЕЛЬНЫЙ БЛОК) */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockOne} ${missing.has('imageWithCaption') ? styles.required_missing : ''
          }`}
        onClick={() => {
          const inputs = [
            { type: 'file', label: 'Изображение', required: true },
            { type: 'text', label: 'Описание', placeholder: 'Описание', required: false },
          ];
          const meta = { blockId: 'imageWithCaption', requiredBlock: true };
          handleClick(inputs, meta);
        }}>
        <img src={svg1} alt="svg_one" />
      </div>

      {/* Цитата (ОБЯЗАТЕЛЬНЫЙ БЛОК) */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockNine} ${missing.has('quote') ? styles.required_missing : ''
          }`}
        onClick={() => {
          const inputs = [
            { type: 'file', label: 'Автор цитаты', required: false, pairKey: 'quoteAuthor' },
            {
              type: 'text',
              label: 'ФИО/Описание',
              placeholder: 'ФИО/Описание',
              required: false,
              pairKey: 'quoteAuthor',
            },
            { type: 'textarea', label: 'Цитата', placeholder: 'Нет ограничения по символам', required: true },
          ];
          const meta = { blockId: 'quote', requiredBlock: true };
          handleClick(inputs, meta);
        }}>
        <div className={styles.block_quote_img}>
          <img className={styles.div_conteiner__blockNine_imgLeft} src={quoteLeft} alt="кавычки вверх" />
          <img src={svg10} alt="svg_10" />
          <img src={quoteRight} className={styles.div_conteiner__blockNine_imgRight} alt="кавычки вниз" />
        </div>
      </div>

      {/* Markdown */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockThree}`}
        onClick={() => {
          const inputs = [{ type: 'markdown', label: 'Тело статьи', required: true }];
          const meta = { blockId: 'markdown', requiredBlock: false };
          handleClick(inputs, meta);
        }}>
        <img src={svg2} alt="markdown" />
      </div>

      {/* Текстовый блок выделенный */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockTen}`}
        onClick={() => {
          const inputs = [
            {
              type: 'textarea',
              label: 'Текстовый блок выделенный',
              placeholder: 'Нет ограничения по символам',
              required: true,
            },
          ];
          const meta = { blockId: 'callout', requiredBlock: false };
          handleClick(inputs, meta);
        }}>
        <img src={svg9} alt="svg_9" />
      </div>

      {/* Интересный факт (ОБЯЗАТЕЛЬНЫЙ БЛОК) */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockFour} ${missing.has('fact') ? styles.required_missing : ''
          }`}
        onClick={() => {
          const inputs = [
            { type: 'file', label: 'Изображение', required: false },
            { type: 'textarea', label: 'Интересный факт', placeholder: 'Нет ограничения по символам', required: true },
            { type: 'file', label: 'Портрет сотрудника', required: false, pairKey: 'factPortrait' },
            {
              type: 'text',
              label: 'ФИО/Описание',
              placeholder: 'ФИО/Описание',
              required: false,
              pairKey: 'factPortrait',
            },
          ];
          const meta = { blockId: 'fact', requiredBlock: true };
          handleClick(inputs, meta);
        }}>
        <div className={styles.block_quote_img}>
          <img src={svg7} alt="svg_7" />
        </div>
      </div>

      {/* Текст с фоном */}
      <div
        className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockFive}`}
        onClick={() => {
          const inputs = [
            {
              type: 'textarea',
              label: 'Текстовый блок с фоном',
              placeholder: 'Нет ограничения по символам',
              required: true,
            },
          ];
          const meta = { blockId: 'bgText', requiredBlock: false };
          handleClick(inputs, meta);
        }}>
        <img src={svg3} alt="svg_3" />
      </div>

      {/* Товарищ с именем (ОБЯЗАТЕЛЬНЫЙ БЛОК) - только для истории */}
      {isHistoryForm && (
        <div
          className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockOne} ${styles.div_conteiner__blockOnePersonWithName} ${missing.has('personWithName') ? styles.required_missing : ''
            }`}
          onClick={() => {
            const inputs = [
              { type: 'file', label: 'Портрет сотрудника', required: true },
              {
                type: 'text',
                label: 'ФИО/Описание',
                placeholder: 'ФИО/Описание',
                required: false,
              },
            ];
            const meta = { blockId: 'personWithName', requiredBlock: true };
            handleClick(inputs, meta);
          }}>
          <img src={svg11} alt="person_with_name" />
        </div>
      )}

      {/* Текст с точкой - не отображается в формах истории */}
      {!isHistoryForm && (
        <div
          className={`${styles.div_conteiner__item} ${styles.div_conteiner__blockSix}`}
          onClick={() => {
            const inputs = [
              {
                type: 'textarea',
                label: 'Текстовый блок с точкой',
                placeholder: 'Нет ограничения по символам',
                required: true,
              },
            ];
            const meta = { blockId: 'dotList', requiredBlock: false };
            handleClick(inputs, meta);
          }}>
          <img src={svg6} alt="svg_6" />
        </div>
      )}
    </div>
  );
}

export default memo(ConstructorPage);
