import compressImageFile from "browser-image-compression";
const { transliterate } = require("transliteration");
// formHelpers.js
export const removePreviewPhoto = (
  previewPhotos,
  setPreviewPhotos,
  index,
  inputData,
  setInputData,
  setIsDropPhotoVisible
) => {
  const updatedPreviewPhotos = [...previewPhotos];
  updatedPreviewPhotos.splice(index, 1);
  setPreviewPhotos(updatedPreviewPhotos);

  // Удаление фото из массива выбранных файлов
  const updatedDropPhotos = [...inputData.dropPhoto];
  updatedDropPhotos.splice(index, 1);

  const updatedImageTitle = inputData.imageTitle ? inputData.imageTitle : [];
  if (updatedImageTitle.length > index) {
    updatedImageTitle.splice(index, 1);
  }

  setInputData((prev) => ({
    ...prev,
    dropPhoto: updatedDropPhotos,
    imageTitle: updatedImageTitle,
  }));

  // Возвращаем label, если все фотографии удалены
  if (updatedPreviewPhotos.length === 0) {
    setIsDropPhotoVisible(true);
  }
};

export const removePreviewPhotoAva = (
  previewPhotoAva,
  setPreviewPhotoAva,
  index,
  inputData,
  setInputData,
  setIsPhotoAvaVisible
) => {
  const updatedPreviewPhotosAva = [...previewPhotoAva];
  updatedPreviewPhotosAva.splice(index, 1);
  setPreviewPhotoAva(updatedPreviewPhotosAva);
  setIsPhotoAvaVisible(updatedPreviewPhotosAva.length > 0);

  // Удаление фото из массива выбранных файлов
  const updatedDropPhotosAva = Array.isArray(inputData.photoAva)
  ? [...inputData.photoAva]
  : [];
updatedDropPhotosAva.splice(index, 1);

  let updatedImageAuthor = "";
  if (typeof inputData.imageAuthor === "string") {
    const imageAuthorArray = inputData.imageAuthor.split(", ");
    imageAuthorArray.splice(index, 1);
    updatedImageAuthor = imageAuthorArray.join(", ");
  }

  setInputData((prev) => ({
    ...prev,
    photoAva: updatedDropPhotosAva,
    imageAuthor: updatedImageAuthor,
  }));

};

export const removePreviewPhotoOpen = (
  previewPhotoOpen,
  setPreviewPhotoOpen,
  index,
  inputData,
  setInputData,
  setIsPhotoOpenVisible
) => {
  const updatedPreviewPhotosOpen = [...previewPhotoOpen];
  updatedPreviewPhotosOpen.splice(index, 1);
  setPreviewPhotoOpen(updatedPreviewPhotosOpen);
  setIsPhotoOpenVisible(true);

  const updatedDropPhotoOpen = Array.from(inputData.imageOpen);
  updatedDropPhotoOpen.splice(index, 1);
  setInputData((prev) => ({
    ...prev,
    imageOpen: updatedDropPhotoOpen,
  }));
};

export const removePreviewPhotoClose = (
  previewPhotoClose,
  setPreviewPhotoClose,
  index,
  inputData,
  setInputData,
  setIsPhotoCloseVisible
) => {
  const updatedPreviewPhotosOpen = [...previewPhotoClose];
  updatedPreviewPhotosOpen.splice(index, 1);
  setPreviewPhotoClose(updatedPreviewPhotosOpen);
  setIsPhotoCloseVisible(true);

  const updatedDropPhotoClose = Array.from(inputData.imageClose);
  updatedDropPhotoClose.splice(index, 1);
  setInputData((prev) => ({
    ...prev,
    imageClose: updatedDropPhotoClose,
  }));
};

function formatNumberWithThousandSeparator(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function generateUniqueName(originalName) {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 10000);
  const fileExtension = originalName.split(".").pop();

  // Транслитерация части оригинального имени файла
  const sliceOfOriginalName = transliterate(originalName.slice(0, 5));

  const newName = `file_${sliceOfOriginalName}_${timestamp}_${randomNum}.${fileExtension}`;

  // console.log("Generated name:", newName);

  return newName;
}

export async function changeHandler(
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
) {
  if (event.target.files) {
    const originalFiles = Array.from(event.target.files);

        const inputName = event.target.name;
        let isLoadingState;
        switch (inputName) {
          case "dropPhoto":
            isLoadingState = setIsLoadingDropPhoto;
            break;
          case "photoAva":
            isLoadingState = setIsLoading;
            break;
          case "imageOpen":
            isLoadingState = setIsLoadingOpenImage;
            break;
          case "imageClose":
            isLoadingState = setIsLoadingCloseImage;
            break;
          // Добавьте другие case для других input элементов, если они есть
          default:
            console.error("Unrecognized input name:", inputName);
            return;
        }


     isLoadingState(true);
    let newFiles = await Promise.all(
      originalFiles.map(async (originalFile) => {
        const uniqueName = generateUniqueName(originalFile.name);

        // Сжимаем изображение, если его размер больше 4MB
        if (originalFile.size > 2 * 1024 * 1024) {
          try {
            const compressedFile = await compressImageFile(originalFile, {
              maxSizeMB: 2,
              maxWidthOrHeight: 1920,
            });
            return new File([compressedFile], uniqueName, {
              type: compressedFile.type,
            });
          } catch (error) {
            console.error("Ошибка при сжатии файла:", error);
            return null; // В случае ошибки сжатия, вернуть null
          }
        } else {
          return new File([originalFile], uniqueName, {
            type: originalFile.type,
          });
        }
      })
    );

    // Отфильтровать null значения, если есть ошибки сжатия
    newFiles = newFiles.filter((file) => file !== null);

    switch (event.target.name) {
      case "dropPhoto":
        setInputData((prev) => ({
          ...prev,
          dropPhoto: newFiles,
        }));
        setIsDropPhotoVisible(false);
        setPreviewPhotos(newFiles.map((file) => URL.createObjectURL(file)));
        break;
      case "photoAva":
        setInputData((prev) => ({
          ...prev,
          photoAva: newFiles,
        }));
        setIsPhotoAvaVisible(false);
        setPreviewPhotoAva(newFiles.map((file) => URL.createObjectURL(file)));
        break;
      case "imageOpen":
        setInputData((prev) => ({
          ...prev,
          imageOpen: newFiles,
        }));
        setIsPhotoOpenVisible(false);
        setPreviewPhotoOpen(newFiles.map((file) => URL.createObjectURL(file)));
        break;
      case "imageClose":
        setInputData((prev) => ({
          ...prev,
          imageClose: newFiles,
        }));
        setIsPhotoCloseVisible(false);
        setPreviewPhotoClose(newFiles.map((file) => URL.createObjectURL(file)));
        break;
      default:
        console.error("Unrecognized input name:", event.target.name);
        break;
    }
    isLoadingState(false);
    event.target.value = null;
    event.target.style.display = "none";
  } else if (
    event.target.name === "totalArea" ||
    event.target.name === "siteArea" ||
    event.target.name === "floors" ||
    event.target.name === "altitude" ||
    event.target.name === "constructionVolume"
  ) {
    const onlyDigits = event.target.value.replace(/\D+/g, "");
    const formattedValue = formatNumberWithThousandSeparator(onlyDigits);
    setInputData((prev) => ({
      ...prev,
      [event.target.name]: formattedValue,
    }));
  } else {
    setInputData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }
}
