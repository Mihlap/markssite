import { useEffect, useState } from 'react';

export function useNotification(timeout = 3000) {
  const [message, setMessage] = useState({ text: '', type: null });

  useEffect(() => {
    if (!message.type) return;
    const timer = setTimeout(() => setMessage({ text: '', type: null }), timeout);
    return () => clearTimeout(timer);
  }, [message, timeout]);

  const showMessage = (text, type) => setMessage({ text, type });

  return { message, showMessage };
}
