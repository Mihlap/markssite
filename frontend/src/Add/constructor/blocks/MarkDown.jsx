import { Controller } from 'react-hook-form';
import { UiMarksMarkDown, UiMarksGrayWrap } from '../../ui';

export default function MarkDown({ control, index, onRemove }) {
  return (
    <UiMarksGrayWrap
      btnClose={true}
      handlerClick={onRemove}
      customStyles={{ padding: '38px 1rem 32px 1rem' }}>
      <Controller
        name={`constructorBlocks.${index}.textarea`}
        control={control}
        render={({ field: { value, onChange } }) => (
          <UiMarksMarkDown value={value || ''} onChange={onChange} color="salmon" />
        )}
      />
    </UiMarksGrayWrap>
  );
}
