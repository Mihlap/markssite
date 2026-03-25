import React, { useState, useEffect, useCallback } from 'react';
import Icon7 from './icon/Icon7';
import s from './Styles.module.css';

export default function MarksCopyId({ id, className }) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;
    const timer = setTimeout(() => setIsCopied(false), 3000);
    return () => clearTimeout(timer);
  }, [isCopied]);

  const handleCopy = useCallback(() => {
    navigator?.clipboard?.writeText(String(id)).catch(() => {});
    setIsCopied(true);
  }, [id]);

  return (
    <div className={`${s.id}${className ? ` ${className}` : ''}`}>
      <div>id: {id}</div>
      <button title="скопировать id" className={s.copy} type="button" onClick={handleCopy}>
        {isCopied && <div className={s.copyMessage}>id скопирован</div>}
        <Icon7 />
      </button>
    </div>
  );
}
