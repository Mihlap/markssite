import React, { useRef } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { UiMarksInput, UiMarksSelect } from '../../ui';

import s from './Styles.module.css';

export default function AddForm() {
  const renderCount = useRef(0);
  renderCount.current += 1;

  const { control, register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      projectName: '',
    }
  });
  return (
    <form>
      {renderCount.current > 0 && <div>Количество ре-рендеров: {renderCount.current}</div>}
      <div className={s.wrap}>
        <Controller
          name="title"
          control={control}
          rules={{ required: true }}
          render={({ field }) => <UiMarksInput label="Название проекта" name="title" {...field} />}
        />
        <Controller
          name="selectCompetencies"
          control={control}
          render={({ field }) => (
            <UiMarksSelect
              isMulti
              label="Выбрать компетенции"
              placeholder="Выберите компетенции"
              name="selectCompetencies"
              customStyles={{
                container: s.selectContainer,
              }}
              options={[
                { value: 'Архитектура', label: 'Архитектура' },
                { value: 'BIM', label: 'BIM' },
                { value: 'Конструктив', label: 'Конструктив' },
                { value: 'Инженерия', label: 'Инженерия' },
                { value: 'Дизайн', label: 'Дизайн' },
              ]}
              {...field}
            />
          )}
        />
        <Controller
          name="countryCity"
          label="Страна, город"
          control={control}
          rules={{ required: true }}
          render={({ field }) => <UiMarksInput label="Страна, город" name="countryCity" {...field} />}
        />
      </div>
    </form>
  );
}
