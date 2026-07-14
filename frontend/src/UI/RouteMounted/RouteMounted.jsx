import { useEffect } from 'react';

export default function RouteMounted({ onMounted, children }) {
  useEffect(() => {
    onMounted?.();
  }, [onMounted]);

  return children;
}
