import { memo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

function ConstructionSectionFromEdit({
  styles,
  dynamicData,
  dynamicPreviews,
  handleRemoveBlock,
  handleDynamicInputChange,
  handleDeletePreview,
  bucket_url,
  getPreviewClassName,
  openConstructor,
  handlerOpenConstructor,
  ConstructorPage,
  handleClick,
  embedLink,
  setDynamicPreviews,
}) {
  const renderInputWithLabel = (inputType, labelText, blockIndex, inputIndex, key) => {
    const classNames = getPreviewClassName(labelText, styles);

    const isFullUrl = (url) => url.startsWith('http://') || url.startsWith('https://');

    return (
      <div key={key}>
        {inputType === 'text' && (
          <div className={styles.form_container__heading_block}>
            <input
              type="input"
              maxLength="56"
              className={`${styles.form_container__heading_block_input} ${styles.orange_color}`}
              placeholder={labelText}
              value={dynamicData[blockIndex][inputIndex]?.value || ''}
              onChange={(e) => handleDynamicInputChange(blockIndex, inputIndex, e.target.value)}
            />
            <label
              htmlFor={`input-${blockIndex}-${inputIndex}`}
              className={styles.form_container__heading_block_label}>
              {labelText}
            </label>
            <div className={styles.form_container__heading_block_input_length}>
              {(dynamicData[blockIndex]?.[inputIndex]?.value || '').length}/56
            </div>
          </div>
        )}
        {inputType === 'file' && (
          <>
            {labelText === 'Видеоролик' ? (
              <div>
                <div className={styles.form_container__checkbox_block_constructor}>
                  <div>{labelText}</div>
                </div>
                <label className={styles.slider_container__customFileUploadOrangeColor}>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const filesArray = Array.from(e.target.files);
                      handleDynamicInputChange(blockIndex, inputIndex, filesArray);

                      const previewsArray = filesArray.map((file) => URL.createObjectURL(file));
                      setDynamicPreviews((prev) => {
                        const newPreviews = [...prev];
                        if (!newPreviews[blockIndex]) {
                          newPreviews[blockIndex] = [];
                        }
                        newPreviews[blockIndex][inputIndex] = previewsArray;
                        return newPreviews;
                      });
                    }}
                  />
                  <svg
                    className={styles.slider_container__svg}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <g id="Frame 4684">
                      <path
                        id="Vector"
                        d="M11.8349 7.54949L5.64223 7.54949C5.46569 7.54642 5.2903 7.57854 5.1263 7.64398C4.96231 7.70942 4.81299 7.80686 4.68705 7.93062C4.56112 8.05439 4.4611 8.20199 4.39282 8.36483C4.32454 8.52766 4.28938 8.70246 4.28938 8.87903C4.28937 9.0556 4.32454 9.2304 4.39282 9.39323C4.4611 9.55607 4.56112 9.70367 4.68705 9.82744C4.81299 9.9512 4.96231 10.0486 5.1263 10.1141C5.2903 10.1795 5.46569 10.2116 5.64223 10.2086L11.754 10.1277C12.4512 10.1156 13.1158 9.83011 13.6046 9.33275C14.0934 8.8354 14.3673 8.16596 14.3673 7.46862C14.3673 6.77129 14.0934 6.10185 13.6046 5.60449C13.1158 5.10713 12.4512 4.82165 11.754 4.80953L5.64223 4.88946C4.58413 4.88946 3.56936 5.30979 2.82117 6.05798C2.07298 6.80617 1.65265 7.82093 1.65265 8.87903C1.65265 9.93713 2.07298 10.9519 2.82117 11.7001C3.56936 12.4483 4.58413 12.8686 5.64223 12.8686L11.5189 12.8752"
                        stroke="currentColor"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                  <div className={styles.slider_container__uploadText}>Загрузить видеоролик</div>
                </label>
                {Array.isArray(dynamicPreviews[blockIndex]?.[inputIndex]) &&
                  dynamicPreviews[blockIndex][inputIndex].map((src, index) => (
                    <div key={`${blockIndex}-${inputIndex}-${index}`} className={classNames.innerDiv}>
                      <div className={styles.preview_photos_container_block_constructor}>
                        {typeof src === 'string' && src.startsWith('blob:') ? (
                          <video
                            key={index}
                            src={src}
                            muted
                            loop
                            autoPlay
                            className={`${styles.preview_photos_container__img} ${classNames.verticalImgTwo}`}
                          />
                        ) : (
                          <video
                            key={index}
                            src={`${bucket_url}/images/imageArticle/${src}`}
                            muted
                            loop
                            autoPlay
                            className={`${styles.preview_photos_container__img} ${classNames.verticalImgTwo}`}
                          />
                        )}
                        <div
                          className={styles.preview_photos_container_block_constructor__remove_icon}
                          onClick={(e) => handleDeletePreview(e, blockIndex, inputIndex, index)}>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <>
                <div key={inputIndex}>
                  <div className={styles.form_container__checkbox_block}>
                    <div>{labelText}</div>
                  </div>
                  <label className={styles.slider_container__customFileUploadOrangeColor}>
                    <input
                      type="file"
                      onChange={(e) => {
                        const filesArray = Array.from(e.target.files);
                        handleDynamicInputChange(blockIndex, inputIndex, filesArray);

                        const previewsArray = filesArray.map((file) => URL.createObjectURL(file));
                        setDynamicPreviews((prev) => {
                          const newPreviews = [...prev];
                          if (!newPreviews[blockIndex]) {
                            newPreviews[blockIndex] = [...prev];
                          }
                          newPreviews[blockIndex][inputIndex] = previewsArray;
                          return newPreviews;
                        });
                      }}
                      multiple
                    />
                    <svg
                      className={styles.slider_container__svg}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <g id="Frame 4684">
                        <path
                          id="Vector"
                          d="M11.8349 7.54949L5.64223 7.54949C5.46569 7.54642 5.2903 7.57854 5.1263 7.64398C4.96231 7.70942 4.81299 7.80686 4.68705 7.93062C4.56112 8.05439 4.4611 8.20199 4.39282 8.36483C4.32454 8.52766 4.28938 8.70246 4.28938 8.87903C4.28937 9.0556 4.32454 9.2304 4.39282 9.39323C4.4611 9.55607 4.56112 9.70367 4.68705 9.82744C4.81299 9.9512 4.96231 10.0486 5.1263 10.1141C5.2903 10.1795 5.46569 10.2116 5.64223 10.2086L11.754 10.1277C12.4512 10.1156 13.1158 9.83011 13.6046 9.33275C14.0934 8.8354 14.3673 8.16596 14.3673 7.46862C14.3673 6.77129 14.0934 6.10185 13.6046 5.60449C13.1158 5.10713 12.4512 4.82165 11.754 4.80953L5.64223 4.88946C4.58413 4.88946 3.56936 5.30979 2.82117 6.05798C2.07298 6.80617 1.65265 7.82093 1.65265 8.87903C1.65265 9.93713 2.07298 10.9519 2.82117 11.7001C3.56936 12.4483 4.58413 12.8686 5.64223 12.8686L11.5189 12.8752"
                          stroke="currentColor"
                          strokeWidth="0.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                    <div className={styles.slider_container__uploadText}>Загрузить изображения</div>
                  </label>
                </div>
                <div className={`${styles.previewContainer} ${classNames.outerDiv}`}>
                  {Array.isArray(dynamicPreviews[blockIndex]?.[inputIndex]) &&
                    dynamicPreviews[blockIndex][inputIndex].map((src, index) => {
                      let imageSrc = src;
                      if (typeof src === 'string' && src.startsWith('blob:')) {
                        imageSrc = src;
                      } else if (isFullUrl(src)) {
                        imageSrc = src;
                      } else if (src) {
                        imageSrc = `${bucket_url}/images/imageArticle/${src}`;
                      } else {
                        return null;
                      }
                      return (
                        <div key={`${blockIndex}-${inputIndex}-${index}`} className={classNames.innerDiv}>
                          <div className={styles.preview_photos_container_block_constructor}>
                            <img
                              src={imageSrc}
                              alt={`Preview ${index}`}
                              className={`${styles.preview_photos_container__img} ${classNames.verticalImgTwo}`}
                            />
                            <div
                              className={styles.preview_photos_container_block_constructor__remove_icon}
                              onClick={(e) => handleDeletePreview(e, blockIndex, inputIndex, index)}>
                              <span></span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </>
            )}
          </>
        )}
        {inputType === 'videoLink' && (
          <div className={styles.form_container__heading_block}>
            <input
              type="url"
              value={dynamicData[blockIndex][inputIndex].value || ''}
              className={`${styles.form_container__heading_block_input} ${styles.orange_color}`}
              placeholder={labelText}
              onChange={(e) => {
                handleDynamicInputChange(blockIndex, inputIndex, e.target.value);
              }}
            />
            <label htmlFor="videoLink" className={styles.form_container__heading_block_label}>
              {labelText}
            </label>
            {embedLink && (
              <div className={classNames.outerDiv}>
                <iframe
                  width="560"
                  height="315"
                  className={styles.embedIframe}
                  src={embedLink}
                  title="Video Player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen></iframe>
              </div>
            )}
          </div>
        )}
        {inputType === 'textarea' && (
          <div key={inputIndex} className={styles.form_container__description_text}>
            <ReactQuill
              ref={(el) => {
                if (el) {
                  const editor = el.getEditor();
                  const editorElement = editor.root;
                  editorElement.style.border = 'none';
                  editorElement.style.fontSize = '16px';
                  editorElement.style.fontFamily = 'Raleway, sans-serif';
                  editorElement.style.color = 'var(--black-1D2E43)';
                  editorElement.style.padding = '1rem';
                  editorElement.style.borderRadius = '6px';
                  editorElement.style.fontWeight = 'var(--fw-400)';
                  editorElement.style.lineHeight = '16px';
                  editorElement.style.boxSizing = 'border-box';
                  editorElement.style.paddingBottom = '2.5rem';
                  editorElement.style.whiteSpace = 'pre-wrap';
                }
              }}
              style={{
                padding: '0rem',
                fontFamily: 'var(--font-raleway)',
                borderRadius: '6px',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 'var(--fw-400)',
                lineHeight: '16px',
                color: 'var(---black-1D2E43)',
                boxSizing: 'border-box',
                paddingBottom: '2.5rem',
                whiteSpace: 'pre-wrap',
              }}
              modules={{
                toolbar: [
                  ['bold', 'italic', 'underline'],
                  [{ list: 'bullet' }, { list: 'ordered' }],
                ],
                clipboard: {
                  matchVisual: false,
                },
              }}
              formats={['bold', 'italic', 'underline', 'list']}
              className={`${styles.form_container__textarea} ${styles.orange_color}`}
              required
              name={key}
              id={key}
              value={dynamicData[blockIndex][inputIndex]?.value || ''}
              onChange={(value) => handleDynamicInputChange(blockIndex, inputIndex, value)}
              placeholder={labelText}
            />
            <label htmlFor="" className={styles.form_container__textarea_label_constructor}>
              {labelText}
            </label>
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
          renderInputWithLabel(input.type, input.label, blockIndex, inputIndex, `${blockIndex}-${inputIndex}`)
        )}
        <div
          key={`close-${blockIndex}`}
          className={styles.blockContainer__close_button}
          onClick={() => handleRemoveBlock(blockIndex)}></div>
      </div>
    );
  };
 
  return (
    <div className={styles.inputs_container}>
      {dynamicData.map((blockInputs, bi) => (
        <div key={bi} className={styles.input_block}>
          {renderInputs(blockInputs, bi)}
        </div>
      ))}

      <div className={styles.constructor_container}>
        {!openConstructor ? (
          <div className={styles.constructor_container__block_btn}>
            <button type="button" onClick={handlerOpenConstructor}>
              <svg
                className={styles.constructor_container__svg}
                width="41"
                height="40"
                viewBox="0 0 41 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
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
  );
}

export default memo(ConstructionSectionFromEdit);