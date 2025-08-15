import { memo } from "react";
function OpenImageBlock({
  styles,
  inputData,
  setInputData,
  changeHandler,
  setPreviewPhotos,
  isPhotoOpenVisible,
  setIsDropPhotoVisible,
  setPreviewPhotoAva,
  setIsPhotoAvaVisible,
  setPreviewPhotoOpen,
  setIsPhotoOpenVisible,
  setPreviewPhotoClose,
  setIsPhotoCloseVisible,
  setIsLoading,
  setIsLoadingDropPhoto,
  setIsLoadingOpenImage,
  setIsLoadingCloseImage,
  isLoadingOpenImage,
  previewPhotoOpen,
  handleRemovePreviewPhotoOpen,
  bucket_url,
}) {

  const existingOpen = inputData.imageOpen && previewPhotoOpen.length === 0;

  return (
    <div className={`${styles.imageOpen_block} ${styles.flex_block_gap}`}>
      <div className={styles.form_container__checkbox_block}>
        <div>Открывающая картинка</div>
      </div>
      {!existingOpen && (
        <div style={{ display: isPhotoOpenVisible ? 'block' : 'none' }}>
          <label className={styles.slider_container__customFileUpload}>
            <input
              type="file"
              name="imageOpen"
              onChange={(event) =>
                changeHandler(
                  event,
                  inputData,
                  setInputData,
                  setPreviewPhotos,
                  setIsDropPhotoVisible,
                  setPreviewPhotoAva,
                  setIsPhotoAvaVisible,
                  setPreviewPhotoOpen,
                  setIsPhotoOpenVisible,
                  setPreviewPhotoClose,
                  setIsPhotoCloseVisible,
                  setIsLoading,
                  setIsLoadingDropPhoto,
                  setIsLoadingOpenImage,
                  setIsLoadingCloseImage
                )
              }
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M11.8346 7.54949L5.64198 7.54949C5.46544 7.54642 5.29006 7.57854 5.12606 7.64398C4.96206 7.70942 4.81274 7.80686 4.68681 7.93062C4.56088 8.05439 4.46085 8.20199 4.39257 8.36483C4.3243 8.52766 4.28913 8.70246 4.28913 8.87903C4.28913 9.0556 4.3243 9.2304 4.39257 9.39323C4.46085 9.55607 4.56088 9.70367 4.68681 9.82744C4.81274 9.9512 4.96206 10.0486 5.12606 10.1141C5.29006 10.1795 5.46544 10.2116 5.64198 10.2086L11.7538 10.1277C12.451 10.1156 13.1156 9.83011 13.6043 9.33275C14.0931 8.8354 14.367 8.16596 14.367 7.46862C14.367 6.77129 14.0931 6.10185 13.6043 5.60449C13.1156 5.10713 12.451 4.82165 11.7538 4.80953L5.64198 4.88946C4.58388 4.88946 3.56912 5.30979 2.82093 6.05798C2.07274 6.80617 1.65241 7.82093 1.65241 8.87903C1.65241 9.93713 2.07274 10.9519 2.82093 11.7001C3.56912 12.4483 4.58388 12.8686 5.64198 12.8686L11.5187 12.8752"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className={styles.slider_container__uploadTextForm}>Загрузить изображения</div>
          </label>
          {isLoadingOpenImage && <div className={styles.preview_photos_container__loading}>Загрузка . . .</div>}
        </div>
      )}
      <div>
        {previewPhotoOpen?.map((preview, index) => (
          <div key={index} className={styles.preview_photos_container__block}>
            <img className={styles.preview_photos_container__img} src={preview} alt={`Preview ${index}`} />
            <div
              className={styles.preview_photos_container__remove_icon}
              onClick={() => handleRemovePreviewPhotoOpen(index)}>
              <span></span>
            </div>
          </div>
        ))}
        {inputData?.imageOpen !== null && previewPhotoOpen.length === 0 && (
          <div className={styles.preview_photos_container__block}>
            <img
              className={styles.preview_photos_container__img}
              src={
                inputData?.imageOpen?.includes('https')
                  ? inputData.imageOpen
                  : `${bucket_url}/images/imageAdd/${inputData?.imageOpen}`
              }
              alt="Preview"
            />
            <div
              className={styles.preview_photos_container__remove_icon}
              onClick={() => handleRemovePreviewPhotoOpen()}>
              <span></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(OpenImageBlock);
