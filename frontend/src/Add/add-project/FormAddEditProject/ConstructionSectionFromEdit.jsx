import ReactQuill from 'react-quill-new';

export default function ConstructionSectionFromEdit({
  styles,
  dynamicData,
  setDynamicData,
  openConstructor,
  setDynamicPreviews,
  dynamicPreviews,
  handleRemoveBlock,
  handlerOpenConstructor,
  handleClick,
  ConstructorPage,
  getPreviewClassName,
  handleDynamicInputChange,
  bucket_url,
  embedLink,
}) {
  const renderInputWithLabel = (inputType, labelText, blockIndex, inputIndex, key) => {
      function handleDeletePreview(event, blockIndex, inputIndex, previewIndex) {
        event.preventDefault();
        setDynamicPreviews((prev) => {
          const newPreviews = [...prev];
          if (
            newPreviews[blockIndex] &&
            newPreviews[blockIndex][inputIndex] &&
            newPreviews[blockIndex][inputIndex][previewIndex]
          ) {
            newPreviews[blockIndex][inputIndex] = newPreviews[blockIndex][inputIndex].filter(
              (_, index) => index !== previewIndex
            );
          }
          return newPreviews;
        });
        setDynamicData((prevData) => {
          const newData = [...prevData];
          if (
            newData[blockIndex] &&
            newData[blockIndex][inputIndex] &&
            Array.isArray(newData[blockIndex][inputIndex].value) &&
            newData[blockIndex][inputIndex].value[previewIndex]
          ) {
            const updatedValue = [...newData[blockIndex][inputIndex].value];
            updatedValue.splice(previewIndex, 1);
            newData[blockIndex][inputIndex].value = updatedValue;
          }
          return newData;
        });

        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach((input) => (input.value = ''));
      }
      const classNames = getPreviewClassName(labelText);

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
                value={dynamicData[blockIndex][inputIndex]?.value ? dynamicData[blockIndex][inputIndex].value : ''}
                onChange={(e) => {
                  handleDynamicInputChange(blockIndex, inputIndex, e.target.value);
                }}
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
                  <div className={styles.form_container__checkbox_block}>
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
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none">
                      <path
                        d="M11.8346 7.54949L5.64198 7.54949C5.46544 7.54642 5.29006 7.57854 5.12606 7.64398C4.96206 7.70942 4.81274 7.80686 4.68681 7.93062C4.56088 8.05439 4.46085 8.20199 4.39257 8.36483C4.3243 8.52766 4.28913 8.70246 4.28913 8.87903C4.28913 9.0556 4.3243 9.2304 4.39257 9.39323C4.46085 9.55607 4.56088 9.70367 4.68681 9.82744C4.81274 9.9512 4.96206 10.0486 5.12606 10.1141C5.29006 10.1795 5.46544 10.2116 5.64198 10.2086L11.7538 10.1277C12.451 10.1156 13.1156 9.83011 13.6043 9.33275C14.0931 8.8354 14.367 8.16596 14.367 7.46862C14.367 6.77129 14.0931 6.10185 13.6043 5.60449C13.1156 5.10713 12.451 4.82165 11.7538 4.80953L5.64198 4.88946C4.58388 4.88946 3.56912 5.30979 2.82093 6.05798C2.07274 6.80617 1.65241 7.82093 1.65241 8.87903C1.65241 9.93713 2.07274 10.9519 2.82093 11.7001C3.56912 12.4483 4.58388 12.8686 5.64198 12.8686L11.5187 12.8752"
                        stroke="currentColor"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
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
                              src={`${bucket_url}/images/imageAdd/${src}`}
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
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none">
                        <path
                          d="M11.8346 7.54949L5.64198 7.54949C5.46544 7.54642 5.29006 7.57854 5.12606 7.64398C4.96206 7.70942 4.81274 7.80686 4.68681 7.93062C4.56088 8.05439 4.46085 8.20199 4.39257 8.36483C4.3243 8.52766 4.28913 8.70246 4.28913 8.87903C4.28913 9.0556 4.3243 9.2304 4.39257 9.39323C4.46085 9.55607 4.56088 9.70367 4.68681 9.82744C4.81274 9.9512 4.96206 10.0486 5.12606 10.1141C5.29006 10.1795 5.46544 10.2116 5.64198 10.2086L11.7538 10.1277C12.451 10.1156 13.1156 9.83011 13.6043 9.33275C14.0931 8.8354 14.367 8.16596 14.367 7.46862C14.367 6.77129 14.0931 6.10185 13.6043 5.60449C13.1156 5.10713 12.451 4.82165 11.7538 4.80953L5.64198 4.88946C4.58388 4.88946 3.56912 5.30979 2.82093 6.05798C2.07274 6.80617 1.65241 7.82093 1.65241 8.87903C1.65241 9.93713 2.07274 10.9519 2.82093 11.7001C3.56912 12.4483 4.58388 12.8686 5.64198 12.8686L11.5187 12.8752"
                          stroke="currentColor"
                          strokeWidth="0.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className={styles.slider_container__uploadText}>Загрузить изображения</div>
                    </label>
                  </div>
                  <div className={`${styles.previewContainer} ${classNames.outerDiv}`}>
                    {Array.isArray(dynamicPreviews[blockIndex]?.[inputIndex]) &&
                      dynamicPreviews[blockIndex][inputIndex].map((src, index) => {
                        let imageSrc = src;
                        if (typeof src === 'string' && src.startsWith('blob:')) {
                          // является локальным URL для предварительного просмотра
                          imageSrc = src;
                        } else if (isFullUrl(src)) {
                          // является полным URL, используем как есть
                          imageSrc = src;
                        } else if (src) {
                          // добавляем bucket_url
                          imageSrc = `${bucket_url}/images/imageAdd/${src}`;
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
              <div className={styles.form_container__textarea_length}></div>
              <ReactQuill
                ref={(el) => {
                  if (el) {
                    const editor = el.getEditor();
                    const editorElement = editor.root;
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
                required
                name={key}
                id={key}
                value={dynamicData[blockIndex][inputIndex]?.value ? dynamicData[blockIndex][inputIndex]?.value : ''}
                onChange={(value) => {
                  handleDynamicInputChange(blockIndex, inputIndex, value);
                }}
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
    if (!Array.isArray(inputs)) {
      return null;
    }
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
    <>
      <div className={styles.inputs_container}>
        {Array.isArray(dynamicData) && dynamicData.map((block, i) => renderInputs(block, i))}
      </div>

      <div className={styles.constructor_container}>
        {openConstructor ? (
          <button onClick={handlerOpenConstructor} className={styles.constructor_button}>
            Добавить блок из библиотеки
          </button>
        ) : (
          <ConstructorPage handleClick={handleClick} />
        )}
      </div>
    </>
  );
}
