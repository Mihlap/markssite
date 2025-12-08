import { memo } from 'react';
import 'react-quill-new/dist/quill.snow.css';

import QuillField from '../../../UI/QuillField/QuillField';
import StaffMarkdownEditor from './StaffMarkdownEditor';
import InfoTooltip from './InfoTooltip';

import { useInfoTooltip } from '../utils/useInfoTooltip';
import { PORTRAIT_CONTAINER_STYLE, PORTRAIT_IMG_STYLE, isPortraitLabel } from '../utils/portraitPreview';

const REQUIRED_TEXT_MSG = 'Обязательно для заполнения';
const REQUIRED_FILE_MSG = 'Обязательно для загрузки';

const normalize = (s = '') =>
  String(s)
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const isDotListLabel = (label = '') => normalize(label) === 'текстовый блок с точкой';

const hasListHtml = (html = '') =>
  /<(u|o)l[\s\S]*?<li[\s\S]*?<\/li>[\s\S]*?<\/(u|o)l>/i.test(html) || /data-list=/.test(html);

const arrToUl = (arr = []) =>
  `<ul>${arr
    .map((v) => `<li>${String(v ?? '').trim()}</li>`)
    .filter(Boolean)
    .join('')}</ul>`;

function ConstructionSectionFromEditStaff({
  styles,
  dynamicData,
  dynamicPreviews,
  handleRemoveBlock,
  handleDynamicInputChange,
  bucket_url,
  getPreviewClassName,
  openConstructor,
  handlerOpenConstructor,
  ConstructorPage,
  handleClick,
  setDynamicPreviews,
  mdUpload,
  mdDelete,
  fieldErrors = {},
}) {
  const isFullUrl = (url = '') => /^https?:\/\//i.test(url);
  const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

  const toBucketSrc = (val) => {
    if (!val) return '';
    if (typeof val === 'string' && (val.startsWith('blob:') || isFullUrl(val))) return val;
    const base = String(bucket_url || '').replace(/\/+$/, '');
    const key = String(val).replace(/^\/+/, '');
    const normalized = key.startsWith('images/') ? key : `images/imageStaff/imagesFolder/${key}`;
    return `${base}/${normalized}`;
  };

  const onRemovePreviewLocal = (e, blockIndex, inputIndex, previewIndex) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    setDynamicPreviews?.((prev) => {
      const next = (prev || []).map((block) =>
        Array.isArray(block) ? block.map((arr) => (Array.isArray(arr) ? [...arr] : [])) : []
      );

      const arr = next?.[blockIndex]?.[inputIndex] || [];
      const removed = arr[previewIndex];
      if (typeof removed === 'string' && removed.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(removed);
        } catch { }
      }

      const newArr = arr.slice(0, previewIndex).concat(arr.slice(previewIndex + 1));
      if (!next[blockIndex]) next[blockIndex] = [];
      next[blockIndex][inputIndex] = newArr;
      return next;
    });

    const field = dynamicData?.[blockIndex]?.[inputIndex];
    if (!field) return;

    const prevVal = field.value;
    const nextVal = Array.isArray(prevVal) ? prevVal.filter((_, i) => i !== previewIndex) : '';
    handleDynamicInputChange(blockIndex, inputIndex, nextVal);
  };

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

        {tooltipOpen && (
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
        )}
      </>
    );
  };

  const renderInputWithLabel = (inputType, labelText, placeholderText, blockIndex, inputIndex, key) => {
    const labelSafe = labelText == null || labelText === '' ? placeholderText || '' : labelText;

    const classNames = getPreviewClassName(labelSafe, styles);
    const value = dynamicData?.[blockIndex]?.[inputIndex]?.value ?? '';
    const isVideo = String(labelSafe || '')
      .toLowerCase()
      .includes('видео');

    const previewsRaw =
      (Array.isArray(dynamicPreviews?.[blockIndex]?.[inputIndex]) && dynamicPreviews[blockIndex][inputIndex].length
        ? dynamicPreviews[blockIndex][inputIndex]
        : toArray(dynamicData?.[blockIndex]?.[inputIndex]?.value)) || [];

    const showHelp = labelSafe === 'Портрет сотрудника' || labelSafe === 'Автор цитаты';
    const errKey = `${blockIndex}-${inputIndex}`;
    const hasError = !!fieldErrors[errKey];
    const required = !!dynamicData?.[blockIndex]?.[inputIndex]?.required;
    const blockRequired = !!dynamicData?.[blockIndex]?.[inputIndex]?.blockRequired;

    const errorText = inputType === 'file' ? REQUIRED_FILE_MSG : REQUIRED_TEXT_MSG;

    const rawVal = dynamicData?.[blockIndex]?.[inputIndex]?.value ?? '';
    const effectiveType = inputType && String(inputType).trim() ? inputType : hasListHtml(rawVal) ? 'textarea' : 'text';

    const isDot = isDotListLabel(labelSafe) || (effectiveType === 'textarea' && hasListHtml(rawVal));

    return (
      <div key={key} data-bi={blockIndex} data-ii={inputIndex} data-type={effectiveType} data-label={labelSafe}>
        {effectiveType === 'text' && (
          <div
            className={styles.form_container__heading_block}
            style={{ position: 'relative', paddingBottom: hasError ? 22 : 0 }}>
            <input
              type="text"
              className={`${styles.form_container__heading_block_input} ${styles.orange_color} ${hasError ? styles.input_error : ''
                }`}
              placeholder={(placeholderText || labelSafe || '').trim()}
              value={typeof value === 'string' ? value : Array.isArray(value) ? value.join(', ') : String(value ?? '')}
              aria-invalid={hasError ? 'true' : 'false'}
              aria-describedby={hasError ? `err-${blockIndex}-${inputIndex}` : undefined}
              onChange={(e) => {
                if (dynamicData?.[blockIndex]?.[inputIndex]) {
                  handleDynamicInputChange(blockIndex, inputIndex, e.target.value);
                }
              }}
            />

            {hasError && (
              <div
                id={`err-${blockIndex}-${inputIndex}`}
                className={styles.required_hint}
                role="alert"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '80%',
                  right: 0,
                  pointerEvents: 'none',
                }}>
                {errorText}
              </div>
            )}

            <label className={styles.form_container__heading_block_label}>
              {labelSafe}
              {required && blockRequired}
            </label>
          </div>
        )}

        {effectiveType === 'file' && (
          <div>
            <div className={styles.form_container__checkbox_block_constructor}>
              <div>
                {labelSafe}
                {required ? ' *' : ''}
              </div>
            </div>

            <label
              className={`${styles.slider_container__customFileUploadOrangeColor} ${hasError ? styles.input_error : ''
                }`}
              aria-invalid={hasError ? 'true' : 'false'}
              aria-describedby={hasError ? `err-${errKey}` : undefined}>
              <input
                type="file"
                accept={isVideo ? 'video/*' : undefined}
                multiple={!isVideo}
                onChange={(e) => {
                  const filesArray = Array.from(e.target.files || []);
                  if (!dynamicData?.[blockIndex]?.[inputIndex]) return;

                  handleDynamicInputChange(blockIndex, inputIndex, filesArray);

                  const nextPreviews = filesArray.map((file) => URL.createObjectURL(file));
                  setDynamicPreviews?.((prev) => {
                    const next = (prev || []).map((b) => (Array.isArray(b) ? b.slice() : []));
                    if (!next[blockIndex]) next[blockIndex] = [];
                    next[blockIndex][inputIndex] = nextPreviews;
                    return next;
                  });
                }}
              />
              <svg className={styles.slider_container__svg} width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M11.8349 7.54949L5.64223 7.54949C5.46569 7.54642 5.2903 7.57854 5.1263 7.64398C4.96231 7.70942 4.81299 7.80686 4.68705 7.93062C4.56112 8.05439 4.4611 8.20199 4.39282 8.36483C4.32454 8.52766 4.28938 8.70246 4.28938 8.87903C4.28937 9.0556 4.32454 9.2304 4.39282 9.39323C4.4611 9.55607 4.56112 9.70367 4.68705 9.82744C4.81299 9.9512 4.96231 10.0486 5.1263 10.1141C5.2903 10.1795 5.46569 10.2116 5.64223 10.2086L11.754 10.1277C12.4512 10.1156 13.1158 9.83011 13.6046 9.33275C14.0934 8.8354 14.3673 8.16596 14.3673 7.46862C14.3673 6.77129 14.0934 6.10185 13.6046 5.60449C13.1158 5.10713 12.4512 4.82165 11.754 4.80953L5.64223 4.88946C4.58413 4.88946 3.56936 5.30979 2.82117 6.05798C2.07298 6.80617 1.65265 7.82093 1.65265 8.87903C1.65265 9.93713 2.07298 10.9519 2.82117 11.7001C3.56936 12.4483 4.58413 12.8686 5.64223 12.8686L11.5189 12.8752"
                  stroke="#525459"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className={styles.slider_container__uploadText} style={{ color: '#525459' }}>
                {isVideo ? 'Загрузить видеоролик' : 'Загрузить изображения'}
              </div>
            </label>

            {showHelp && <HelpButton />}

            {hasError && (
              <div id={`err-${errKey}`} className={styles.required_hint} style={{ marginTop: -10 }}>
                {REQUIRED_FILE_MSG}
              </div>
            )}

            <div className={`${styles.previewContainer} ${classNames.outerDiv}`}>
              {Array.isArray(previewsRaw) &&
                previewsRaw.map((src, index) => {
                  const url = toBucketSrc(src);
                  return (
                    <div
                      key={`${blockIndex}-${inputIndex}-${index}`}
                      className={classNames.innerDiv}
                      style={isPortraitLabel(labelSafe) ? PORTRAIT_CONTAINER_STYLE : undefined}>
                      <div className={styles.preview_photos_container_block_constructor}>
                        {isVideo ? (
                          <video
                            src={url}
                            muted
                            loop
                            autoPlay
                            className={`${styles.preview_photos_container__img} ${classNames.verticalImgTwo}`}
                          />
                        ) : (
                          <img
                            src={url}
                            alt={`Preview ${index}`}
                            className={`${styles.preview_photos_container__img} ${classNames.verticalImgTwo}`}
                            style={isPortraitLabel(labelSafe) ? PORTRAIT_IMG_STYLE : undefined}
                          />
                        )}
                        <div
                          className={styles.preview_photos_container_block_constructor__remove_icon}
                          onClick={(e) => onRemovePreviewLocal(e, blockIndex, inputIndex, index)}>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {effectiveType === 'markdown' && (
          <div className={styles.form_container__description_text} style={{ position: 'relative' }}>
            <StaffMarkdownEditor
              value={dynamicData[blockIndex][inputIndex].value || ''}
              onChange={(v) => {
                handleDynamicInputChange(blockIndex, inputIndex, v);
              }}
              onUploadFile={(file) => mdUpload(file)}
              onDeleteFile={(url) => mdDelete(url)}
              className={hasError ? styles.input_error : undefined}
              aria-invalid={hasError ? 'true' : 'false'}
              aria-describedby={hasError ? `err-${errKey}` : undefined}
            />
            <label className={styles.form_container__textarea_label_constructor}>{labelSafe}</label>
            {hasError && (
              <div id={`err-${errKey}`} className={styles.required_hint}>
                {REQUIRED_TEXT_MSG}
              </div>
            )}
          </div>
        )}

        {effectiveType === 'textarea' && (
          <div style={{ position: 'relative' }}>
            <QuillField
              styles={styles}
              label={labelSafe || 'Текстовый блок с точкой'}
              value={
                isDot
                  ? Array.isArray(value)
                    ? arrToUl(value)
                    : value || ''
                  : typeof value === 'string'
                    ? value
                    : Array.isArray(value)
                      ? value.join('\n')
                      : String(value ?? '')
              }
              onChange={(v) => {
                const cleanValue = String(v || '').trim();
                const isEmpty = !cleanValue || cleanValue === '<p><br></p>' || cleanValue === '<p></p>';
                handleDynamicInputChange(blockIndex, inputIndex, isEmpty ? '' : v);
              }}
              placeholder={(placeholderText || labelSafe || 'Нет ограничения по символам').trim()}
              scopeKey={`${blockIndex}-${inputIndex}`}
              labelStyle={normalize(labelSafe) === 'цитата' ? { paddingTop: 16 } : undefined}
              showToolbar={isDot ? true : normalize(labelSafe) !== 'текстовый блок выделенный'}
              classNameInput={`${hasError ? styles.input_error : ''}`}
              error={hasError}
              ariaInvalid={hasError ? 'true' : 'false'}
              ariaDescribedby={hasError ? `err-${errKey}` : undefined}
            />
            {hasError && (
              <div id={`err-${errKey}`} className={styles.required_hint} style={{ marginTop: 4 }}>
                {REQUIRED_TEXT_MSG}
              </div>
            )}
          </div>
        )}

        {!['text', 'file', 'markdown', 'textarea'].includes(effectiveType) && (
          <div style={{ border: '1px dashed #ccc', padding: 8, borderRadius: 8, marginTop: 8 }}>
            <QuillField
              styles={styles}
              label={labelSafe || 'Текст'}
              value={typeof value === 'string' ? value : Array.isArray(value) ? value.join('\n') : String(value ?? '')}
              onChange={(v) => handleDynamicInputChange(blockIndex, inputIndex, v)}
              scopeKey={`${blockIndex}-${inputIndex}-fallback`}
              showToolbar={true}
              classNameInput=""
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
          onClick={() => {
            handleRemoveBlock(blockIndex);
          }}
        />
      </div>
    );
  };

  return (
    <div className={styles.inputs_container}>
      {(dynamicData || []).map((blockInputs, bi) => (
        <div key={bi} className={styles.input_block}>
          {renderInputs(blockInputs, bi)}
        </div>
      ))}

      <div className={styles.constructor_container}>
        {!openConstructor ? (
          <div className={styles.constructor_container__block_btn}>
            <button type="button" onClick={handlerOpenConstructor}>
              <svg className={styles.constructor_container__svg} width="41" height="40" viewBox="0 0 41 40" fill="none">
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
          <ConstructorPage
            handleClick={(inputs, meta) => {
              handleClick(inputs, meta);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default memo(ConstructionSectionFromEditStaff);
