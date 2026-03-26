import React, { useRef } from 'react';
import { Controller } from 'react-hook-form';
import { UiMarksInput, UiPhotoPreview, UiMarksGrayWrap } from '../../ui';

export default function Slider({ control, index, onRemove }) {
       const imageRef = useRef(null);
  return (
    <UiMarksGrayWrap
      btnClose={true}
      handlerClick={onRemove}
      customStyles={{ padding: '38px 16px 32px 16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <Controller
        name={`constructorBlocks.${index}.image`}
        control={control}
        render={({ field: { onChange, value } }) => {
          const currentCount = value?.length || 0;
          const remaining = 8 - currentCount;
          return (
          <>
            {currentCount < 8 && (
              <UiMarksInput
                type="file"
                color="salmon"
                name={`constructorBlocks.${index}.image`}
                label="Слайдер *допускается загрузка 8ми изображений"
                accept="image/*"
                multiple
                inputRef={imageRef}
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files).slice(0, remaining);
                  const existing = value || [];
                  onChange([...existing, ...newFiles].slice(0, 8));
                  if (imageRef.current) imageRef.current.value = '';
                }}
              />
            )}
            <UiPhotoPreview
              files={value}
              variant="grid-8"
              label={currentCount === 8 ? 'Слайдер *допускается загрузка 8ми изображений' : undefined}
              color="salmon"
              onRemove={(i) => {
                const newFiles = value.filter((_, idx) => idx !== i);
                onChange(newFiles);
                if (newFiles.length === 0 && imageRef.current) imageRef.current.value = '';
              }}
              customStyles={currentCount < 8 ? { paddingTop: '0.5rem' } : null}
            />
          </>
        );}}
      />
    </UiMarksGrayWrap>
  );
}
