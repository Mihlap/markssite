import React from 'react';
import { Controller } from 'react-hook-form';
import { UiMarksTextarea, UiMarksGrayWrap, UiPhotoPreview, UiMarksInput } from '../../ui';

export default function InterestingFact({ control, index, onRemove, clearErrors, imageFolder = 'imageAdd' }) {
  const imageRef = React.useRef(null);
  const avaRef = React.useRef(null);

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
              imageFolder={imageFolder}
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
        render={({ field, fieldState }) => (
          <UiMarksTextarea
            name={`constructorBlocks.${index}.textarea`}
            label="Интересный факт"
            placeholder="Нет ограничения по символам"
            richText
            color="salmon"
            error={fieldState.error?.message}
            {...field}
            onChange={(v) => {
              field.onChange(v);
              const d = document.createElement('div');
              d.innerHTML = v || '';
              if (d.textContent.trim()) clearErrors?.(`constructorBlocks.${index}.textarea`);
            }}
          />
        )}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Controller
          name={`constructorBlocks.${index}.ava`}
          control={control}
          render={({ field: { onChange, value }, fieldState }) =>
            value?.length > 0 ? (
              <UiPhotoPreview
                files={value}
                variant="portrait"
                label="Портрет сотрудника "
                color="salmon"
                imageFolder={imageFolder}
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
                error={fieldState.error?.message}
                onChange={(e) => {
                  const file = e.target.files[0];
                  onChange(file ? [file] : []);
                  if (file) clearErrors?.(`constructorBlocks.${index}.ava`);
                }}
              />
            )
          }
        />

        <Controller
          name={`constructorBlocks.${index}.description`}
          control={control}
          render={({ field, fieldState }) => (
            <UiMarksInput
              autoGrow
              color="salmon"
              name={`constructorBlocks.${index}.description`}
              placeholder="ФИО/Описание"
              bordered
              error={fieldState.error?.message}
              {...field}
              onChange={(e) => {
                field.onChange(e);
                if (e.target.value) clearErrors?.(`constructorBlocks.${index}.description`);
              }}
            />
          )}
        />
      </div>
    </UiMarksGrayWrap>
  );
}
