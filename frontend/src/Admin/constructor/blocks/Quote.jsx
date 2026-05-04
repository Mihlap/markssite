import React from 'react';
import { Controller } from 'react-hook-form';
import { UiMarksTextarea, UiMarksGrayWrap, UiMarksInput, UiPhotoPreview } from '../../ui';

export default function Quote({ control, index, onRemove, clearErrors, showAuthor = true }) {
  const imageRef = React.useRef(null);

  return (
    <UiMarksGrayWrap
      btnClose={true}
      handlerClick={onRemove}
      customStyles={{ padding: '38px 1rem 32px 1rem', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {showAuthor && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Controller
            name={`constructorBlocks.${index}.image`}
            control={control}
            render={({ field: { onChange, value }, fieldState }) =>
              value?.length > 0 ? (
                <UiPhotoPreview
                  files={value}
                  variant="portrait"
                  label="Автор цитаты"
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
                  info
                  name={`constructorBlocks.${index}.image`}
                  label="Автор цитаты"
                  accept="image/*"
                  inputRef={imageRef}
                  error={fieldState.error?.message}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    onChange(file ? [file] : []);
                    if (file) clearErrors?.(`constructorBlocks.${index}.image`);
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
      )}
      <Controller
        name={`constructorBlocks.${index}.textarea`}
        control={control}
        render={({ field, fieldState }) => (
          <UiMarksTextarea
            name={`constructorBlocks.${index}.textarea`}
            label="Цитата"
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
    </UiMarksGrayWrap>
  );
}
