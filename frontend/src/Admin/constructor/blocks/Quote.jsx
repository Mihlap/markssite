import React from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { UiMarksTextarea, UiMarksGrayWrap, UiMarksInput, UiPhotoPreview } from '../../ui';

export default function Quote({ control, index, onRemove }) {
  const imageRef = React.useRef(null);

  const imageValue = useWatch({ control, name: `constructorBlocks.${index}.image` });
  const descriptionValue = useWatch({ control, name: `constructorBlocks.${index}.description` });

  const hasImage = imageValue?.length > 0;
  const hasDescription = descriptionValue?.length > 0;

  return (
    <UiMarksGrayWrap
      btnClose={true}
      handlerClick={onRemove}
      customStyles={{ padding: '38px 1rem 32px 1rem', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Controller
        name={`constructorBlocks.${index}.image`}
        control={control}
        rules={{ validate: (v) => !hasDescription || v?.length > 0 || 'Требуется фото' }}
        render={({ field: { onChange, value } }) =>
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
            placeholder="ФИО/Описание"
            bordered
            {...field}
          />
        )}
      />
      <Controller
        name={`constructorBlocks.${index}.textarea`}
        control={control}
        rules={{ validate: (v) => { const d = document.createElement('div'); d.innerHTML = v || ''; return d.textContent.trim().length > 0; } }}
        render={({ field }) => (
          <UiMarksTextarea
            name={`constructorBlocks.${index}.textarea`}
            label="Цитата"
            placeholder="Нет ограничения по символам"
            richText
            color="salmon"
            {...field}
          />
        )}
      />
    </UiMarksGrayWrap>
  );
}
