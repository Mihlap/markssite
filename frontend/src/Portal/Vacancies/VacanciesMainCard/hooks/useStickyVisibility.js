import { useEffect, useState } from 'react';

export function useStickyVisibility(showOnRef, hideOnRef) {
  const [show, setShow] = useState(false);
  const [hide, setHide] = useState(false);

  // Показ кнопки — только первый раз
  useEffect(() => {
    if (!showOnRef?.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true); // показать
        }
      },
      { threshold: 0 }
    );

    observer.observe(showOnRef.current);
    return () => observer.disconnect();
  }, [showOnRef]);

  // Скрытие кнопки — когда виден hideOnRef
  useEffect(() => {
    if (!hideOnRef?.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHide(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(hideOnRef.current);
    return () => observer.disconnect();
  }, [hideOnRef]);

  const isHidden = hide; // скрыть, когда второй виден
  const isShown = show && !hide; // показывать только если show=true и hide=false

  return { isShown, isHidden };
}
