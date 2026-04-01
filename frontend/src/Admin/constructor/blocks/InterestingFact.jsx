import React from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { UiMarksTextarea, UiMarksGrayWrap, UiPhotoPreview, UiMarksInput } from '../../ui';

export default function InterestingFact({ control, index, onRemove }) {
  const imageRef = React.useRef(null);
  const avaRef = React.useRef(null);
  

  const imageValue = useWatch({ control, name: `constructorBlocks.${index}.ava` });
  const descriptionValue = useWatch({ control, name: `constructorBlocks.${index}.description` });
  
  const hasImage = imageValue?.length > 0;
  const hasDescription = descriptionValue?.length > 0;
  return (
    <UiMarksGrayWrap
      btnClose={true}
      handlerClick={onRemove}
      customStyles={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '38px 1rem 32px 1rem' }}>
      <Controller
        name={`constructorBlocks.${index}.image`}
        control={control}
        render={({ field: { onChange, value } }) =>
          value?.length > 0 ? (
            <UiPhotoPreview
              files={value}
              variant="single"
              label="Загрузите изображение"
              color="salmon"
              onRemove={() => {
                onChange([]);
                if (imageRef.current) imageRef.current.value = '';
              }}
            />
          ) : (
            <UiMarksInput
              type="file"
              color="salmon"
              name={`constructorBlocks.${index}.image`}
              label="Изображение"
              accept="image/*"
              inputRef={imageRef}
              onChange={(e) => {
                const file = e.target.files[0];
                onChange(file ? [file] : []);
              }}
            />
          )
        }
      />
      <Controller
        name={`constructorBlocks.${index}.textarea`}
        control={control}
        rules={{
          validate: (v) => {
            const d = document.createElement('div');
            d.innerHTML = v || '';
            return d.textContent.trim().length > 0;
          },
        }}
        render={({ field }) => (
          <UiMarksTextarea
            name={`constructorBlocks.${index}.textarea`}
            label="Интересный факт"
            placeholder="Нет ограничения по символам"
            richText
            color="salmon"
            {...field}
          />
        )}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Controller
          name={`constructorBlocks.${index}.ava`}
          control={control}
          rules={{ validate: (v) => !hasDescription || v?.length > 0 || 'Требуется фото' }}
          render={({ field: { onChange, value }, fieldState }) =>
            value?.length > 0 ? (
              <UiPhotoPreview
                files={value}
                variant="portrait"
                label="Портрет сотрудника "
                color="salmon"
                onRemove={() => {
                  onChange([]);
                  if (avaRef.current) avaRef.current.value = '';
                }}
              />
            ) : (
              <UiMarksInput
                type="file"
                color="salmon"
                info
                name={`constructorBlocks.${index}.ava`}
                label="Портрет сотрудника "
                accept="image/*"
                inputRef={avaRef}
                required={!!fieldState.error}
                hint="Обязательно для загрузки"
                onChange={(e) => {
                  const file = e.target.files[0];
                  onChange(file ? [file] : []);
                }}
              />
            )
          }
        />

        <Controller
          name={`constructorBlocks.${index}.description`}
          control={control}
          rules={{ validate: (v) => !hasImage || v?.length > 0 || 'Требуется ФИО/Описание' }}
          render={({ field }) => (
            <UiMarksInput
              autoGrow
              color="salmon"
              name={`constructorBlocks.${index}.description`}
              // label="Описание"
              placeholder="ФИО/Описание"
              bordered
              {...field}
            />
          )}
        />
      </div>
    </UiMarksGrayWrap>
  );
}
