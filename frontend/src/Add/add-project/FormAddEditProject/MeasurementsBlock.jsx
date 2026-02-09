import { memo } from 'react';
import { UiMarksInput } from '../../ui/index.js';
import { MEASUREMENT_FIELDS } from './const/measurement.js';

function MeasurementsBlock({ styles, inputData, setInputData, changeHandler, countFilledInputs }) {
  return (
    <div className={styles.measure_container}>
      <div className={styles.form_container__textarea_label}>Заполните 3 значения на выбор</div>
      <div className={styles.form_container__block_gray_one}>
        {MEASUREMENT_FIELDS.map(({ name, label, measurement }) => (
          <UiMarksInput
            key={name}
            name={name}
            label={label}
            value={inputData[name]}
            onChange={(event) => changeHandler(event, inputData, setInputData)}
            disabled={countFilledInputs() >= 3 && !inputData[name]}
            measurement={measurement}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(MeasurementsBlock);