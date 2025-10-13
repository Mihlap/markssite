import { memo, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import 'react-quill-new/dist/quill.snow.css';

import StaffMarkdownEditor from './StaffMarkdownEditor';
import QuillField from '../../../UI/QuillField/QuillField';
import InfoTooltip from './InfoTooltip';
import ErrorTooltip from '../../../UI/ErrorTooltip/ErrorTooltip';

import { useInfoTooltip } from '../utils/useInfoTooltip';
import { PORTRAIT_CONTAINER_STYLE, PORTRAIT_IMG_STYLE, isPortraitLabel } from '../utils/portraitPreview';

function ConstructorSection({
  styles,
  blocks,
  openConstructor,
  handlerOpenConstructor,
  ConstructorPage,
  handleClick,
  getPreviewClassName,
  dynamicData,
  dynamicPreviews,
  handleDynamicInputChange,
  handleDeletePreview,
  setDynamicPreviews,
  handleRemoveBlock,
  mdUpload,
  mdDelete,
  fieldErrors = {},
  /** <- важно: прокиди сюда forceValidate из формы */
  forceValidate = 0,
}) {
  /** touched по ключу `${bi}-${ii}` */
  const [touched, setTouched] = useState({});
  useEffect(() => setTouched({}), [blocks.length]); // сброс при полной смене набора блоков

  /** матрица refs для якорей тултипов */
  const anchorsRef = useRef([]);
  const getAnchorRef = useCallback((bi, ii) => {
    if (!anchorsRef.current[bi]) anchorsRef.current[bi] = [];
    if (!anchorsRef.current[bi][ii]) anchorsRef.current[bi][ii] = { current: null };
    return anchorsRef.current[bi][ii];
  }, []);

  /** форс-валидация: помечаем все ошибочные как touched и скроллим к первой ошибке */
  useEffect(() => {
    if (!forceValidate) return;
    const keysWithError = Object.keys(fieldErrors || {});
    if (!keysWithError.length) return;

    setTouched((prev) => {
      const next = { ...prev };
      keysWithError.forEach((k) => (next[k] = true));
      return next;
    });

    // скролл к первому
    const firstKey = keysWithError[0];
    const [bi, ii] = firstKey.split('-').map((n) => +n);
    const ref = anchorsRef.current?.[bi]?.[ii];
    if (ref?.current) {
      ref.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
      ref.current.focus?.({ preventScroll: true });
    }
  }, [forceValidate, fieldErrors]);

  const HelpButton = () => {
    const { ref: infoBtnRef, open: tooltipOpen, toggle: toggleTooltip, closeTooltip } = useInfoTooltip(false);
    return (
      <>
        <button
          ref={infoBtnRef}
          type="button"
          style={{ display: 'inline-block', paddingLeft: '0.5rem', background: 'transparent', border: 'none' }}
          onClick={toggleTooltip}
          aria-label="Помощь">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M7.9987 10.6087V7.27539M7.99479 5.27539H8.00078M7.9987 1.27539C11.6654 1.27539 14.6654 4.27539 14.6654 7.94206C14.6654 11.6087 11.6654 14.6087 7.9987 14.6087C4.33203 14.6087 1.33203 11.6087 1.33203 7.94206C1.33203 4.27539 4.33203 1.27539 7.9987 1.27539Z"
              stroke="#566272"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <InfoTooltip
          title="Ознакомьтесь"
          linkText="с рекомендациями"
          linkHref="#"
          placement="top"
          tipStyle={{ width: 203 }}
          anchorRef={infoBtnRef}
          isOpen={tooltipOpen}
          onOpenChange={(v) => {
            if (!v) closeTooltip();
          }}
          onClose={closeTooltip}
        />
      </>
    );
  };

  const renderInputWithLabel = (inputType, labelText, placeholderText, blockIndex, inputIndex, key) => {
    const classNames = getPreviewClassName(labelText, styles);
    const showHelp = labelText === 'Портрет сотрудника' || labelText === 'Автор цитаты';
    const errKey = `${blockIndex}-${inputIndex}`;
    const hasError = !!fieldErrors[errKey];
    const required = !!dynamicData?.[blockIndex]?.[inputIndex]?.required;
    const anchorRef = getAnchorRef(blockIndex, inputIndex);

    const markTouched = () => setTouched((t) => ({ ...t, [errKey]: true }));

    return (
      <div key={key}>
        {inputType === 'text' && (
          <div className={styles.form_container__heading_block} style={{ position: 'relative' }}>
            <input
              ref={anchorRef}
              type="input"
              value={dynamicData[blockIndex][inputIndex].value || ''}
              className={`${styles.form_container__heading_block_input} ${styles.orange_color} ${
                hasError && touched[errKey] ? styles.input_error : ''
              }`}
              placeholder={placeholderText || labelText}
              onBlur={markTouched}
              onChange={(e) => {
                if (!touched[errKey]) markTouched();
                handleDynamicInputChange(blockIndex, inputIndex, e.target.value);
              }}
              aria-invalid={hasError && touched[errKey] ? 'true' : 'false'}
            />
            <label className={styles.form_container__heading_block_label}>
              {labelText}
              {required ? ' *' : ''}
            </label>

            <ErrorTooltip
              anchorRef={anchorRef}
              text={fieldErrors[errKey] || 'Заполните поле'}
              isOpen={hasError && !!touched[errKey]}
              onOpenChange={(open) => {
                if (!open) setTouched((t) => ({ ...t, [errKey]: false }));
              }}
            />
          </div>
        )}

        {inputType === 'file' && (
          <div>
            <div className={styles.form_container__checkbox_block_constructor}>
              <div>
                {labelText}
                {required ? ' *' : ''}
              </div>
            </div>

            <label
              ref={anchorRef}
              className={`${styles.slider_container__customFileUploadOrangeColor} ${
                hasError && touched[errKey] ? styles.input_error : ''
              }`}
              style={{ position: 'relative', display: 'inline-block' }}
              onBlur={markTouched}
              tabIndex={0}
              aria-invalid={hasError && touched[errKey] ? 'true' : 'false'}>
              <input
                type="file"
                multiple
                onChange={(e) => {
                  markTouched();
                  const filesArray = Array.from(e.target.files || []);
                  handleDynamicInputChange(blockIndex, inputIndex, filesArray);
                  const previewsArray = filesArray.map((file) => URL.createObjectURL(file));
                  setDynamicPreviews((prev) => {
                    const next = [...(prev || [])];
                    if (!next[blockIndex]) next[blockIndex] = [];
                    next[blockIndex][inputIndex] = previewsArray;
                    return next;
                  });
                }}
              />
              <svg className={styles.slider_container__svg} width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M11.8349 7.54949L5.64223 7.54949C5.46569 7.54642 5.2903 7.57854 5.1263 7.64398C4.96231 7.70942 4.81299 7.80686 4.68705 7.93062C4.56112 8.05439 4.4611 8.20199 4.39282 8.36483C4.32454 8.52766 4.28938 8.70246 4.28938 8.87903C4.28937 9.0556 4.32454 9.2304 4.39282 9.39323C4.4611 9.55607 4.56112 9.70367 4.68705 9.82744C4.81299 9.9512 4.96231 10.0486 5.1263 10.1141C5.2903 10.1795 5.46569 10.2116 5.64223 10.2086L11.754 10.1277C12.4512 10.1156 13.1158 9.83011 13.6046 9.33275C14.0934 8.8354 14.3673 8.16596 14.3673 7.46862C14.3673 6.77129 14.0934 6.10185 13.6046 5.60449C13.1158 5.10713 12.4512 4.82165 11.754 4.80953L5.64223 4.88946C4.58413 4.88946 3.56936 5.30979 2.82117 6.05798C2.07298 6.80617 1.65265 7.82093 1.65265 8.87903C1.65265 9.93713 2.07298 10.9519 2.82117 11.7001C3.56936 12.4483 4.58413 12.8686 5.64223 12.8686L11.5189 12.8752"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className={styles.slider_container__uploadText}>Загрузить изображения</div>

              <ErrorTooltip
                anchorRef={anchorRef}
                text={fieldErrors[errKey] || 'Загрузите файл'}
                isOpen={hasError && !!touched[errKey]}
                onOpenChange={(open) => {
                  if (!open) setTouched((t) => ({ ...t, [errKey]: false }));
                }}
              />
            </label>

            {showHelp && <HelpButton />}

            <div className={`${styles.previewContainer} ${classNames.outerDiv}`}>
              {dynamicPreviews[blockIndex]?.[inputIndex]?.map((src, index) => (
                <div
                  key={`${blockIndex}-${inputIndex}-${index}`}
                  className={classNames.innerDiv}
                  style={isPortraitLabel(labelText) ? PORTRAIT_CONTAINER_STYLE : undefined}>
                  <div className={styles.preview_photos_container_block_constructor}>
                    <img
                      src={src}
                      alt={`Preview ${index}`}
                      className={`${styles.preview_photos_container__img} ${classNames.verticalImgTwo}`}
                      style={isPortraitLabel(labelText) ? PORTRAIT_IMG_STYLE : undefined}
                    />
                    <div
                      className={styles.preview_photos_container_block_constructor__remove_icon}
                      onClick={(e) => handleDeletePreview(e, blockIndex, inputIndex, index)}>
                      <span></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {inputType === 'markdown' && (
          <div className={styles.form_container__description_text} style={{ position: 'relative' }}>
            <div ref={anchorRef} tabIndex={-1} style={{ outline: 'none' }}>
              <StaffMarkdownEditor
                value={dynamicData[blockIndex][inputIndex].value || ''}
                onChange={(v) => {
                  if (!touched[errKey]) setTouched((t) => ({ ...t, [errKey]: true }));
                  handleDynamicInputChange(blockIndex, inputIndex, v);
                }}
                onUploadFile={mdUpload}
                onDeleteFile={mdDelete}
              />
            </div>
            <label className={styles.form_container__textarea_label_constructor}>{labelText}</label>

            <ErrorTooltip
              anchorRef={anchorRef}
              text={fieldErrors[errKey] || 'Заполните блок'}
              isOpen={!!fieldErrors[errKey] && !!touched[errKey]}
              onOpenChange={(open) => {
                if (!open) setTouched((t) => ({ ...t, [errKey]: false }));
              }}
            />
          </div>
        )}

        {inputType === 'textarea' && (
          <div style={{ position: 'relative' }}>
            <div ref={anchorRef} style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1 }} />
            <QuillField
              styles={styles}
              label={labelText}
              value={dynamicData[blockIndex][inputIndex].value || ''}
              onChange={(v) => {
                if (!touched[errKey]) setTouched((t) => ({ ...t, [errKey]: true }));
                handleDynamicInputChange(blockIndex, inputIndex, v);
              }}
              placeholder={(placeholderText || labelText || '').trim()}
              scopeKey={`${blockIndex}-${inputIndex}`}
              labelStyle={labelText === 'Цитата' ? { paddingTop: 16 } : undefined}
              showToolbar={!(labelText === 'Текстовый блок с точкой' || labelText === 'Текстовый блок выделенный')}
              defaultList={labelText === 'Текстовый блок с точкой' ? 'bullet' : undefined}
              classNameInput={`${!!fieldErrors[errKey] && touched[errKey] ? styles.input_error : ''}`}
            />

            <ErrorTooltip
              anchorRef={anchorRef}
              text={fieldErrors[errKey] || 'Заполните текст'}
              isOpen={!!fieldErrors[errKey] && !!touched[errKey]}
              onOpenChange={(open) => {
                if (!open) setTouched((t) => ({ ...t, [errKey]: false }));
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const renderInputs = (inputs, blockIndex) => {
    if (!Array.isArray(inputs)) return null;
    return (
      <div key={blockIndex} className={styles.blockContainer}>
        {inputs.map((input, inputIndex) =>
          renderInputWithLabel(
            input.type,
            input.label,
            input.placeholder,
            blockIndex,
            inputIndex,
            `${blockIndex}-${inputIndex}`
          )
        )}
        <div
          key={`close-${blockIndex}`}
          className={styles.blockContainer__close_button}
          onClick={() => handleRemoveBlock(blockIndex)}
        />
      </div>
    );
  };

  return (
    <>
      <div className={styles.inputs_container}>
        {blocks.map((blockInputs, blockIndex) => (
          <div key={blockIndex} className={styles.inputBlock}>
            {renderInputs(blockInputs, blockIndex)}
          </div>
        ))}
      </div>

      <div className={styles.constructor_container}>
        <div className={styles.constructor_container__block}>
          {!openConstructor ? (
            <div className={styles.constructor_container__block_btn}>
              <button type="button" onClick={handlerOpenConstructor}>
                <svg
                  className={styles.constructor_container__svg}
                  width="41"
                  height="40"
                  viewBox="0 0 41 40"
                  fill="none">
                  <g>
                    <circle cx="20.5" cy="20" r="20" fill="#FF7F6A" />
                    <path
                      d="M10.5 20H20.5M30.5 20H20.5M20.5 20V10M20.5 20V30"
                      stroke="#F6F6F6"
                      strokeWidth="2"
                      strokeLinecap="square"
                    />
                  </g>
                </svg>
              </button>
              <div className={styles.constructor_container__text}>Добавить блок из библиотеки</div>
            </div>
          ) : (
            <ConstructorPage handleClick={handleClick} />
          )}
        </div>
      </div>
    </>
  );
}

export default memo(ConstructorSection);
