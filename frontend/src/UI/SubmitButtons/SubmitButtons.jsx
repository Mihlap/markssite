import { memo } from 'react';

function SubmitButtons({
  classNames = {},
  onCancel,
  saveDisabled = false,
  saveType = 'submit',
  saveProps = {},
  cancelProps = {},
}) {

  const { wrapper, save, cancel } = classNames;

  return (
    <div className={wrapper}>
      <button type={saveType} className={save} disabled={saveDisabled} aria-label="Сохранить" {...saveProps} />
      <button
        type="button"
        className={cancel}
        aria-label="Отмена"
        onClick={(e) => {
          e?.preventDefault?.();
          e?.stopPropagation?.();
          onCancel?.(e);
        }}
        {...cancelProps}
      />
    </div>
  );
}

export default memo(SubmitButtons);
