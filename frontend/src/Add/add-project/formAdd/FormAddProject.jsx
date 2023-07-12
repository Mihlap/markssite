import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import styles from "./FormAddProject.module.scss";
import { fetchProject } from "../../../store/Slice/projectSlice";
import icon from "./img/Frame4684.png";

export default function FormAddProject() {
  const dispatch = useDispatch();
  const [selectedCompetencies, setSelectedCompetencies] = useState([]);
  const [selectedViewConstruction, setSelectedViewConstruction] = useState([]);
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [selectedRadio, setSelectedRadio] = useState("28,28");
  const [inputData, setInputData] = useState({
    title: "",
    selectCompetencies: [],
    countryCity: "",
    monthYear: "",
    viewConstruction: [],
    dropPhoto: [],
    photoAva: "",
  });
const removePreviewPhoto = (index) => {
  // Удаление фото из массива превью
  const updatedPreviewPhotos = [...previewPhotos];
  updatedPreviewPhotos.splice(index, 1);
  setPreviewPhotos(updatedPreviewPhotos);

  // Удаление фото из массива выбранных файлов
  const updatedDropPhotos = [...inputData.dropPhoto];
  updatedDropPhotos.splice(index, 1);
  setInputData((prev) => ({
    ...prev,
    dropPhoto: updatedDropPhotos,
  }));
};

const changeHandler = (event) => {
  if (event.target.files) {
    if (event.target.name === "dropPhoto") {
      setInputData((prev) => ({
        ...prev,
        dropPhoto: event.target.files,
      }));

      // Создание и отображение превью фото
      const filesArray = Array.from(event.target.files);
      const previewArray = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewPhotos(previewArray);
    } else if (event.target.name === "photoAva") {
      setInputData((prev) => ({
        ...prev,
        photoAva: event.target.files.length > 0 ? event.target.files : null,
      }));
    }
  } else {
    setInputData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }
};


  const submitHandler = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...inputData,
      selectCompetencies: selectedCompetencies
        .map((option) => option.label)
        .join(","),
      viewConstruction: selectedViewConstruction
        .map((option) => option.label)
        .join(","),
      radioValue: selectedRadio,
      photoAva: inputData.photoAva, // Добавлено поле "photoAva" в объект "formattedData"
    };
    console.log(formattedData, "<<<----консоль на фронте");
    dispatch(fetchProject(formattedData, setInputData));
    setSelectedCompetencies([]);
    setSelectedViewConstruction([]);
    setSelectedRadio("");
    setPreviewPhotos([]);
    setInputData({
      title: "",
      selectCompetencies: "",
      countryCity: "",
      monthYear: "",
      viewConstruction: "",
      dropPhoto: [],
      photoAva: [],
    });
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: "1px solid red",
      // остальные стили
    }),
    // другие свойства стилей
  };
  console.log(inputData);
  return (
    <div className={styles.form_container}>
      <div className={styles.form_container__title}>Новый проект</div>

      <form onSubmit={submitHandler}>
        <div className={styles.form_container__block_gray_one}>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="input"
              className={styles.form__field}
              placeholder="Название проекта"
              name="title"
              value={inputData.title}
              onChange={changeHandler}
              required
            />
            <label htmlFor="Название проекта" className={styles.form__label}>
              Название проекта
            </label>
          </div>
          <div className={`${styles.form__group} ${styles.field}`}>
            <Select
              styles={customStyles}
              isMulti
              name="selectCompetencies"
              options={[
                { value: "Архитектура", label: "Архитектура" },
                { value: "BIM", label: "BIM" },
                { value: "Конструкции", label: "Конструкции" },
                { value: "Инженерия", label: "Инженерия" },
                { value: "Дизайн", label: "Дизайн" },
              ]}
              className={styles.form__field}
              placeholder="Выбрать компетенции"
              value={selectedCompetencies}
              onChange={setSelectedCompetencies}
            />
            <label htmlFor="selectCompetencies" className={styles.form__label}>
              Выбрать компетенции
            </label>
          </div>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="input"
              className={styles.form__field}
              placeholder="countryCity"
              name="countryCity"
              value={inputData.countryCity}
              onChange={changeHandler}
              required
            />
            <label htmlFor="countryCity" className={styles.form__label}>
              Страна, город
            </label>
          </div>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="input"
              className={styles.form__field}
              placeholder="monthYear"
              name="monthYear"
              value={inputData.monthYear}
              onChange={changeHandler}
              required
            />
            <label htmlFor="monthYear" className={styles.form__label}>
              Месяц, год
            </label>
          </div>
          <div className={`${styles.form__group} ${styles.field}`}>
            <Select
              styles={customStyles}
              isMulti
              name="viewConstruction"
              value={selectedViewConstruction}
              onChange={setSelectedViewConstruction}
              options={[
                { value: "Архитектура", label: "Архитектура" },
                { value: "BIM", label: "BIM" },
                { value: "Конструкции", label: "Конструкции" },
                { value: "Инженерия", label: "Инженерия" },
                { value: "Дизайн", label: "Дизайн" },
              ]}
              className={styles.form__field}
              placeholder="Выберите вид строительства"
            />
            <label htmlFor="viewConstruction" className={styles.form__label}>
              Выберите вид строительства
            </label>
          </div>
        </div>
        <div className={styles.form_container__checkbox_block}>
          <div>
            Загрузите фото и выберете ориентацию
            <span> для отображения на странице «Проекты»</span>
          </div>
        </div>
        <label className={styles.slider_container__customFileUpload}>
          <input type="file" name="photoAva" onChange={changeHandler} />
          <div className={styles.slider_container__uploadIcon}>
            <img src={icon} alt="icon" />
          </div>
          <div className={styles.slider_container__uploadText}>
            Загрузить изображения
          </div>
        </label>
        <div className={styles.form_container__radio_container}>
          <div
            className={`${styles.form_container__radio_block_one} ${
              selectedRadio === "28,28"
                ? styles.form_container__radio_activ_block
                : ""
            }`}
          >
            <label
              className={`${styles.form_container__radio_label_one} ${
                selectedRadio === "28,28"
                  ? styles.form_container__radio_activ_label
                  : ""
              }`}
            >
              <input
                className={styles.form_container__radio_input}
                type="radio"
                name="radioGroup"
                value="28,28"
                checked={selectedRadio === "28,28"}
                onChange={(e) => setSelectedRadio(e.target.value)}
              />
            </label>
          </div>
          <div
            className={`${styles.form_container__radio_block_two} ${
              selectedRadio === "28,14"
                ? styles.form_container__radio_activ_block
                : ""
            }`}
          >
            <label
              className={`${styles.form_container__radio_label_two} ${
                selectedRadio === "28,14"
                  ? styles.form_container__radio_activ_label
                  : ""
              }`}
            >
              <input
                className={styles.form_container__radio_input}
                type="radio"
                name="radioGroup"
                value="28,14"
                checked={selectedRadio === "28,14"}
                onChange={(e) => setSelectedRadio(e.target.value)}
              />
            </label>
          </div>
          <div
            className={`${styles.form_container__radio_block_three} ${
              selectedRadio === "28,48"
                ? styles.form_container__radio_activ_block
                : ""
            }`}
          >
            <label
              className={`${styles.form_container__radio_label_three} ${
                selectedRadio === "28,48"
                  ? styles.form_container__radio_activ_label
                  : ""
              }`}
            >
              <input
                className={styles.form_container__radio_input}
                type="radio"
                name="radioGroup"
                value="28,48"
                checked={selectedRadio === "28,48"}
                onChange={(e) => setSelectedRadio(e.target.value)}
              />
            </label>
          </div>
        </div>
        <div className={styles.slider_container}>
          {/* <div className={styles.slider_container__title}>Слайдер</div> */}

          <div className={styles.form_container__checkbox_block}>
            <div>
              Слайдер
              <span> *допускается загрузка 4х изображений</span>
            </div>
          </div>

          <label className={styles.slider_container__customFileUpload}>
            <input
              type="file"
              name="dropPhoto"
              onChange={changeHandler}
              multiple
            />
            <div className={styles.slider_container__uploadIcon}>
              <img src={icon} alt="icon" />
            </div>
            <div className={styles.slider_container__uploadText}>
              Загрузить изображения
            </div>
          </label>
        </div>
        <div className={styles.preview_photos_container}>
          {previewPhotos.map((preview, index) => (
            <div key={index} className={styles.preview_photos_container__block}>
              <img
                className={styles.preview_photos_container__img}
                src={preview}
                alt={`Preview ${index}`}
              />
              <div
                className={styles.preview_photos_container__remove_icon}
                onClick={() => removePreviewPhoto(index)}
              >
                <span></span>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.form_container__button_block}>
        <button
          className={styles.form_container__button_save}
          type="submit"
        ></button>
        <button
          className={styles.form_container__button_cancel}
          type="submit"
        ></button>
        </div>
      </form>
    </div>
  );
}
