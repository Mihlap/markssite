import React, { useRef, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { UiMarksInput, UiMarksSelect, UiPhotoPreview } from '../../ui';
import { monthOptions, yearOptions, typesСonstruction } from '../FormAddEditProject/utils/Time';

import s from './Styles.module.css';

export default function AddForm({ onValidityChange }) {
  const photoAvaRef = useRef(null);
  const dropPhotoRef = useRef(null);
  const renderCount = useRef(0);
  renderCount.current += 1;

  const { control, handleSubmit, reset, formState: { isValid } } = useForm({
    mode: 'onChange',
  });

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);


  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form id="add-form" onSubmit={handleSubmit(onSubmit)}>
      {renderCount.current > 0 && <div>Количество ре-рендеров: {renderCount.current}</div>}
      <div className={s.wrap}>
        <Controller
          name="title"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksInput
              label="Название проекта"
              name="title"
              error={fieldState.error && 'Обязательное поле'}
              {...field}
            />
          )}
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
          render={({ field, fieldState }) => (
            <UiMarksInput
              label="Страна, город"
              name="countryCity"
              error={fieldState.error && 'Обязательное поле'}
              {...field}
            />
          )}
        />
        <div className={s.wrapSelects}>
          <Controller
            name="month"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <UiMarksSelect
                label="Месяц"
                placeholder="Месяц"
                name="month"
                error={fieldState.error && 'Обязательное поле'}
                customStyles={{
                  container: s.selectContainer,
                }}
                options={monthOptions}
                {...field}
              />
            )}
          />
          <Controller
            name="year"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <UiMarksSelect
                name="year"
                label="Год"
                placeholder="Год"
                error={fieldState.error && 'Обязательное поле'}
                customStyles={{
                  container: s.selectContainer,
                }}
                options={yearOptions}
                {...field}
              />
            )}
          />
        </div>
        <Controller
          name="viewConstruction"
          control={control}
          render={({ field }) => (
            <UiMarksSelect
              isMulti
              name="viewConstruction"
              label="Выберите вид строительства"
              placeholder="Выберите вид строительства"
              customStyles={{
                container: s.selectContainer,
              }}
              options={typesСonstruction}
              {...field}
            />
          )}
        />
      </div>

      <div className={s.photoUpload}>
        <Controller
          name="photoAva"
          control={control}
          render={({ field: { onChange, value } }) => (
            <>
              {value?.length > 0 ? (
                <UiPhotoPreview
                  files={value}
                  variant="single"
                  onRemove={() => {
                    onChange([]);
                    if (photoAvaRef.current) {
                      photoAvaRef.current.value = '';
                    }
                  }}
                />
              ) : (
                <UiMarksInput
                  type="file"
                  name="photoAva"
                  accept="image/*"
                  inputRef={photoAvaRef}
                  label="Загрузите фото превью *для отображения на&nbsp;странице &laquo;Проекты&raquo;"
                  color="grey"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    onChange(file ? [file] : []);
                  }}
                />
              )}
            </>
          )}
        />

        <Controller
          name="dropPhoto"
          control={control}
          render={({ field: { onChange, value } }) => (
            <>
              {console.log(value?.length === 4 ? 'не показать инпут' : 'показывать инпут')}
              {value?.length !== 4 && (
                <UiMarksInput
                  type="file"
                  name="dropPhoto"
                  accept="image/*"
                  multiple
                  inputRef={dropPhotoRef}
                  label="Слайдер *допускается загрузка 4х&nbsp;изображений"
                  color="grey"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length === 0) return;
                    const prev = value || [];
                    const next = [...prev, ...files].slice(0, 4);
                    onChange(next);
                    if (dropPhotoRef.current) {
                      dropPhotoRef.current.value = '';
                    }
                  }}
                />
              )}
              <UiPhotoPreview
                files={value}
                variant="grid-4"
                onRemove={(index) => {
                  const next = (value || []).filter((_, i) => i !== index);
                  onChange(next);
                }}
              />
            </>
          )}
        />
      </div>
    </form>
  );
}
