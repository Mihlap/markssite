import React, { useState, useCallback } from 'react';
import { InputMask } from '@react-input/mask';
import Select from 'react-select';
import variantStyles from './VacancyFormContactUniversal.module.css';
import 'react-phone-number-input/style.css';

const Host = process.env.REACT_APP_SERVER_HOST;

const directionOptions = [
  { value: 'Другое направление', label: 'Другое направление' },
  { value: 'Архитектура', label: 'Архитектура' },
  { value: 'Конструктив', label: 'Конструктив' },
  { value: 'Инженерия', label: 'Инженерия' },
  { value: 'Научно-техническое сопровождение', label: 'Научно-техническое сопровождение' },
  { value: 'BIM', label: 'BIM' },
  { value: 'Аналитика', label: 'Аналитика' },
  { value: 'Финансы', label: 'Финансы' },
  { value: 'Дизайн', label: 'Дизайн' },
  { value: 'IT', label: 'IT' },
  { value: 'Администрирование', label: 'Администрирование' },
  { value: 'Бэк офис', label: 'Бэк офис' },
  { value: 'Стажировки', label: 'Стажировки' },
  { value: 'Управление', label: 'Управление' },
];

const maskOptions = {
  mask: '+7 (___) ___-__-__',
  replacement: { _: /\d/ },
};

const VacancyFormContactUniversal = ({ variant: variantProp = 'full' }) => {
  const [phone, setPhone] = useState('');
  const [isValidPhone, setIsValidPhone] = useState(true);

  const handlePhoneChange = useCallback((event) => {
    setPhone(event.target.value);
    setIsValidPhone(true);
  }, []);

  const handlePhoneBlur = useCallback(() => {
    const phoneNumberRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    setIsValidPhone(phoneNumberRegex.test(phone));
  }, [phone]);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const phoneNumberRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
      const valid = phoneNumberRegex.test(phone);
      setIsValidPhone(valid);
      if (!valid) return;

      const formDataToSend = new FormData();
      formDataToSend.append('phone', phone);

      fetch(`${Host}/api-mail/portalSubmitForm`, {
        method: 'POST',
        body: formDataToSend,
      }).catch((error) => {
        console.error('Error:', error);
      });
    },
    [phone]
  );

  const formClassName = variantProp === 'full' ? variantStyles.fullForm : variantStyles.simpleForm;

  return (
    <form className={formClassName} onSubmit={handleSubmit}>
      <div>
        <div>
          <div>
            <div>
              <label>
                <input type="text" name="name" placeholder="" value="" readOnly />
              </label>
            </div>
            <div>
              <label>
                <InputMask
                  mask={maskOptions.mask}
                  replacement={maskOptions.replacement}
                  showMask={true}
                  name="phone"
                  placeholder=""
                  value={phone}
                  onChange={handlePhoneChange}
                  onBlur={handlePhoneBlur}
                  autoComplete="off"
                />
                {!isValidPhone && phone.length > 0 && <span>Некорректный телефон</span>}
              </label>
            </div>
            <div>
              <label>
                <input type="text" name="city" placeholder="" value="" readOnly />
              </label>
            </div>
          </div>
          <div>
            <div>
              <label>
                <Select
                  name="choose"
                  isMulti={false}
                  options={directionOptions}
                  placeholder={'Выбрать направление'}
                  isSearchable={false}
                  isClearable={true}
                />
              </label>
            </div>
            <div>
              <label>
                <input type="text" name="letter" placeholder="" value="" readOnly />
              </label>
            </div>
            <div>
              <label>
                <input type="text" name="resume" placeholder="" value="" readOnly />
              </label>
            </div>
          </div>
          <div>
            <button type="submit" id="submit-button">
              <p>Отправить</p>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default React.memo(VacancyFormContactUniversal);
