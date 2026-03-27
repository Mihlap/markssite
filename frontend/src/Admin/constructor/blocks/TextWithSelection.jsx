import React from 'react';
import { Controller } from 'react-hook-form';
import { UiMarksTextarea, UiMarksGrayWrap } from '../../ui';

export default function TextWithSelection({ control, index, onRemove }) {
  return (
    <UiMarksGrayWrap btnClose={true} handlerClick={onRemove} customStyles={{ padding: '38px 1rem 32px 1rem' }}>
      <Controller
        name={`constructorBlocks.${index}.textarea`}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <UiMarksTextarea
            name={`constructorBlocks.${index}.textarea`}
            label="Текстовый блок выделенный"
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
