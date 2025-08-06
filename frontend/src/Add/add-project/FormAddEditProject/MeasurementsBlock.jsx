import { memo } from "react";
function MeasurementsBlock({
  styles,
  inputData,
  setInputData,
  changeHandler,
  countFilledInputs,
}) {
  return (
    <div className={styles.measure_container}>
      <div className={styles.form_container__textarea_label}>Заполните 3 значения на выбор</div>
      <div className={styles.form_container__block_gray_one}>
        <div className={`${styles.form__group} ${styles.field}`}>
          <input
            type="text"
            className={styles.form__field}
            placeholder="totalArea"
            name="totalArea"
            autoComplete="off"
            id="totalArea"
            value={inputData.totalArea}
            onChange={(event) =>
              changeHandler(
                event,
                inputData,
                setInputData,                
              )
            }
            disabled={countFilledInputs() >= 3 && !inputData.totalArea}
          />
          {inputData.totalArea && <span className={styles.measurement}>м²</span>}
          <label
            htmlFor="totalArea"
            className={`${styles.form__label} ${
              countFilledInputs() >= 3 && !inputData.totalArea ? styles.disabledLabel : ''
            }`}>
            Общая площадь, м²
          </label>
        </div>
        <div className={`${styles.form__group} ${styles.field}`}>
          <input
            type="text"
            className={styles.form__field}
            placeholder="siteArea"
            name="siteArea"
            autoComplete="off"
            id="siteArea"
            value={inputData.siteArea}
            onChange={(event) =>
              changeHandler(
                event,
                inputData,
                setInputData,                
              )
            }
            disabled={countFilledInputs() >= 3 && !inputData.siteArea}
          />
          {inputData.siteArea && <span className={styles.measurement}>га</span>}
          <label
            htmlFor="siteArea"
            className={`${styles.form__label} ${
              countFilledInputs() >= 3 && !inputData.siteArea ? styles.disabledLabel : ''
            }`}>
            Площадь участка, га
          </label>
        </div>

        <div className={`${styles.form__group} ${styles.field}`}>
          <input
            type="text"
            className={styles.form__field}
            placeholder="floors"
            name="floors"
            autoComplete="off"
            id="floors"
            value={inputData.floors}
            onChange={(event) =>
              changeHandler(
                event,
                inputData,
                setInputData,                
              )
            }
            disabled={countFilledInputs() >= 3 && !inputData.floors}
          />
          <label
            htmlFor="floors"
            className={`${styles.form__label} ${
              countFilledInputs() >= 3 && !inputData.floors ? styles.disabledLabel : ''
            }`}>
            Этажность
          </label>
        </div>
        <div className={`${styles.form__group} ${styles.field}`}>
          <input
            type="text"
            className={styles.form__field}
            placeholder="altitude"
            name="altitude"
            autoComplete="off"
            id="altitude"
            value={inputData.altitude}
            onChange={(event) =>
              changeHandler(
                event,
                inputData,
                setInputData,                
              )
            }
            disabled={countFilledInputs() >= 3 && !inputData.altitude}
          />
          {inputData.altitude && <span className={styles.measurement}>м</span>}
          <label
            htmlFor="altitude"
            className={`${styles.form__label} ${
              countFilledInputs() >= 3 && !inputData.altitude ? styles.disabledLabel : ''
            }`}>
            Высотность, м
          </label>
        </div>
        <div className={`${styles.form__group} ${styles.field}`}>
          <input
            type="text"
            className={styles.form__field}
            placeholder="constructionVolume"
            name="constructionVolume"
            autoComplete="off"
            id="constructionVolume"
            value={inputData.constructionVolume}
            onChange={(event) =>
              changeHandler(
                event,
                inputData,
                setInputData,                
              )
            }
            disabled={countFilledInputs() >= 3 && !inputData.constructionVolume}
          />
          {inputData.constructionVolume && <span className={styles.measurement}>м³</span>}
          <label
            htmlFor="constructionVolume"
            className={`${styles.form__label} ${
              countFilledInputs() >= 3 && !inputData.constructionVolume ? styles.disabledLabel : ''
            }`}>
            Строительный объем, м³
          </label>
        </div>
        <div className={`${styles.form__group} ${styles.field}`}>
          <input
            type="text"
            className={styles.form__field}
            placeholder="numberOfLanes"
            name="numberOfLanes"
            autoComplete="off"
            id="numberOfLanes"
            value={inputData.numberOfLanes}
            onChange={(event) =>
              changeHandler(
                event,
                inputData,
                setInputData,                
              )
            }
            disabled={countFilledInputs() >= 3 && !inputData.numberOfLanes}
          />
          <label
            htmlFor="numberOfLanes"
            className={`${styles.form__label} ${
              countFilledInputs() >= 3 && !inputData.numberOfLanes ? styles.disabledLabel : ''
            }`}>
            Количество полос
          </label>
        </div>
        <div className={`${styles.form__group} ${styles.field}`}>
          <input
            type="text"
            className={styles.form__field}
            placeholder="long"
            name="long"
            autoComplete="off"
            id="long"
            value={inputData.long}
            onChange={(event) =>
              changeHandler(
                event,
                inputData,
                setInputData,                
              )
            }
            disabled={countFilledInputs() >= 3 && !inputData.long}
          />
          {inputData.long && <span className={styles.measurement}>км</span>}
          <label
            htmlFor="long"
            className={`${styles.form__label} ${
              countFilledInputs() >= 3 && !inputData.long ? styles.disabledLabel : ''
            }`}>
            Длина, км
          </label>
        </div>
      </div>
    </div>
  );
}

export default memo(MeasurementsBlock);