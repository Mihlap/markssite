import { memo, useCallback, useEffect, useRef } from 'react';
import InfoTooltip from './InfoTooltip';
import { useInfoTooltip } from './useInfoTooltip';

export default memo(function PhotoNameBlock({
  styles,
  inputData,
  setInputData,
  previewPhotoAva,
  setPreviewPhotoAva,
  handleRemovePreviewPhotoAva,
  changeHandler,
  isLoading,
}) {
  const fileInputRef = useRef(null);
  const { ref: infoBtnRef, open: tooltipOpen, toggle: toggleTooltip, closeTooltip } = useInfoTooltip(false);

  const revokeAllPreviews = useCallback((arr) => {
    try {
      (arr || []).forEach((p) => p?.url && URL.revokeObjectURL(p.url));
    } catch {}
  }, []);

  const onFile = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      revokeAllPreviews(previewPhotoAva);
      const url = URL.createObjectURL(file);
      setPreviewPhotoAva([{ file, url }]);
      setInputData((p) => ({ ...p, img: file }));
      e.target.value = '';
    },
    [previewPhotoAva, revokeAllPreviews, setInputData, setPreviewPhotoAva]
  );

  const remove = useCallback(() => {
    handleRemovePreviewPhotoAva?.();
    revokeAllPreviews(previewPhotoAva);
    setPreviewPhotoAva([]);
    setInputData((p) => ({ ...p, img: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [handleRemovePreviewPhotoAva, previewPhotoAva, revokeAllPreviews, setInputData, setPreviewPhotoAva]);

  useEffect(() => {
    return () => revokeAllPreviews(previewPhotoAva);
  }, []);

  return (
    <div className={styles.form_container__block_gray_one} style={{ paddingTop: '16.44px', marginBottom: 0 }}>
      <div className={`${styles.photo_orientation_selector} ${styles.flex_block_gap}`}>
        <div className={styles.form_container__checkbox_block}>
          <div className={styles.form_container__heading_block_label} style={{ marginBottom: 0, paddingBottom: 0 }}>
            Портрет сотрудника
          </div>
        </div>

        <div>
          <label className={styles.slider_container__customFileUploadStaff}>
            <input
              ref={fileInputRef}
              type="file"
              name="photoAva"
              accept="image/*"
              onChange={onFile}
              style={{ display: 'none' }}
            />
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g>
                <path
                  d="M11.8349 7.54949L5.64223 7.54949C5.46569 7.54642 5.2903 7.57854 5.1263 7.64398C4.96231 7.70942 4.81299 7.80686 4.68705 7.93062C4.56112 8.05439 4.4611 8.20199 4.39282 8.36483C4.32454 8.52766 4.28938 8.70246 4.28938 8.87903C4.28937 9.0556 4.32454 9.2304 4.39282 9.39323C4.4611 9.55607 4.56112 9.70367 4.68705 9.82744C4.81299 9.9512 4.96231 10.0486 5.1263 10.1141C5.2903 10.1795 5.46569 10.2116 5.64223 10.2086L11.754 10.1277C12.4512 10.1156 13.1158 9.83011 13.6046 9.33275C14.0934 8.8354 14.3673 8.16596 14.3673 7.46862C14.3673 6.77129 14.0934 6.10185 13.6046 5.60449C13.1158 5.10713 12.4512 4.82165 11.754 4.80953L5.64223 4.88946C4.58413 4.88946 3.56936 5.30979 2.82117 6.05798C2.07298 6.80617 1.65265 7.82093 1.65265 8.87903C1.65265 9.93713 2.07298 10.9519 2.82117 11.7001C3.56936 12.4483 4.58413 12.8686 5.64223 12.8686L11.5189 12.8752"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
            <div className={styles.slider_container__uploadTextForm}>Загрузить изображения</div>
          </label>

          {isLoading && <div className={styles.preview_photos_container__loading}>Загрузка . . .</div>}

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
        </div>

        <div>
          {Array.isArray(previewPhotoAva) &&
            previewPhotoAva.map((preview, index) => (
              <div key={index} className={styles.preview_photos_container__block}>
                <img className={styles.preview_photos_container__img} src={preview.url} alt={`Preview ${index}`} />
                <div className={styles.preview_photos_container__remove_icon} onClick={remove}>
                  <span></span>
                </div>
              </div>
            ))}
        </div>

        <div className={styles.form_container__heading_block}>
          <input
            type="text"
            className={styles.form_container__heading_block_input}
            placeholder="ФИО"
            name="name"
            id="name"
            value={inputData.name}
            onChange={(event) => changeHandler(event, inputData, setInputData)}
            autoComplete="off"
            required
          />
        </div>
      </div>
    </div>
  );
});
