import { fetchProject } from "../../../store/Slice/projectSlice";

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
  setIsDropPhotoVisible(true);

  // Удаление фото из массива выбранных файлов
  const updatedDropPhotos = [...inputData.dropPhoto];
  updatedDropPhotos.splice(index, 1);
  setInputData((prev) => ({
    ...prev,
    dropPhoto: updatedDropPhotos,
  }));

  // Обновление стиля поля ввода файлов
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
  setIsPhotoAvaVisible(true);

  // Удаление фото из массива выбранных файлов
  const updatedDropPhotosAva = [...inputData.photoAva];
  updatedDropPhotosAva.splice(index, 1);
  setInputData((prev) => ({
    ...prev,
    photoAva: updatedDropPhotosAva,
  }));

  // Обновление стиля поля ввода файлов
};

 // функция сборщика, тут у нас запускаются if-else на превью фото для картинок
export function changeHandler(
  event,
  inputData,
  setInputData,
  setPreviewPhotos,
  setIsDropPhotoVisible,
  setPreviewPhotoAva,
  setIsPhotoAvaVisible
) {
  if (event.target.files) {
    if (event.target.name === "dropPhoto") {
      const filesArray = Array.from(event.target.files);
      setInputData((prev) => ({
        ...prev,
        dropPhoto: filesArray,
      }));
      setIsDropPhotoVisible(false);

      const previewArray = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewPhotos(previewArray);

      event.target.style.display = "none";
    } else if (event.target.name === "photoAva") {
      const filesArrayAva =
        event.target.files.length > 0 ? event.target.files : null;
      setInputData((prev) => ({
        ...prev,
        photoAva: filesArrayAva,
      }));
      setIsPhotoAvaVisible(false);
      const previewArray = Array.from(filesArrayAva).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewPhotoAva(previewArray);

      event.target.style.display = "none";
    }
  } else {
    setInputData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }
}
