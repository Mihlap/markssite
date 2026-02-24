import React, { useRef } from 'react';
import { Controller } from 'react-hook-form';
import { UiMarksInput, UiPhotoPreview, UiMarksGrayWrap } from '../../ui';

export default function ImageWithDesc({ control, index, onRemove }) {
  const imageRef = useRef(null);

  return (
    <UiMarksGrayWrap
      btnClose={true}
      handlerClick={onRemove}
      customStyles={{ padding: '1rem', paddingBottom: '32px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
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
              label="Загрузите изображение"
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
        render={({ field }) => (
          <UiMarksInput
            color="salmon"
            name={`constructorBlocks.${index}.description`}
            // label="Описание"
            placeholder="Описание картинки"
            bordered
            {...field}
          />
        )}
      />
    </UiMarksGrayWrap>
  );
}
