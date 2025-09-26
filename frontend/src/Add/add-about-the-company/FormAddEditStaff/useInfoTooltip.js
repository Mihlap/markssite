import { useRef, useState, useCallback } from 'react';

export function useInfoTooltip(initialOpen = false) {
  const ref = useRef(null);
  const [open, setOpen] = useState(initialOpen);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const openTooltip = useCallback(() => setOpen(true), []);
  const closeTooltip = useCallback(() => setOpen(false), []);

  return {
    ref,
    open,
    setOpen,
    toggle,
    openTooltip,
    closeTooltip,
  };
}
