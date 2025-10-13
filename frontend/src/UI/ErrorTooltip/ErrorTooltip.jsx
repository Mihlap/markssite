import { memo, useEffect, useRef, useState } from 'react';

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export default memo(function ErrorTooltip({ anchorRef, text, isOpen, onOpenChange, maxWidth = 260 }) {
  const tipRef = useRef(null);
  const [coords, setCoords] = useState(null);
  const [hover, setHover] = useState(false);
  const [locallyClosed, setLocallyClosed] = useState(false);

  useEffect(() => {
    if (isOpen) setLocallyClosed(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || locallyClosed) {
      setCoords(null);
      return;
    }
    const compute = () => {
      if (!anchorRef?.current || !tipRef?.current) return;
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const tipRect = tipRef.current.getBoundingClientRect();
      const spacing = 8;
      let left = anchorRect.left + (anchorRect.width - tipRect.width) / 2;
      left = clamp(left, 8, window.innerWidth - tipRect.width - 8);
      const top = anchorRect.bottom + spacing;
      let arrowLeft = tipRect.width / 2 - 8;
      arrowLeft = clamp(arrowLeft, 8, tipRect.width - 24);
      setCoords({
        left: Math.round(left + window.scrollX),
        top: Math.round(top + window.scrollY),
        arrowLeft,
      });
    };
    requestAnimationFrame(compute);
    const onResize = () => requestAnimationFrame(compute);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [isOpen, locallyClosed, anchorRef]);

  useEffect(() => {
    if (!isOpen || locallyClosed) return;
    const onDocMouseDown = (e) => {
      if (!tipRef.current) return;
      if (!tipRef.current.contains(e.target) && !(anchorRef?.current && anchorRef.current.contains(e.target))) {
        setLocallyClosed(true);
        onOpenChange?.(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setLocallyClosed(true);
        onOpenChange?.(false);
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, locallyClosed, anchorRef, onOpenChange]);

  if (!isOpen || locallyClosed) return null;

  const BG = '#e00747';

  const tipStyle = {
    position: 'fixed',
    zIndex: 1000,
    maxWidth,
    padding: '6px 10px',
    paddingRight: 34,
    borderRadius: 12,
    background: BG,
    color: '#fff',
    fontFamily: 'Raleway, system-ui, -apple-system, Segoe UI, Roboto, Arial',
    fontSize: 13,
    lineHeight: '18px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  };

  const closeBtnStyle = {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 16,
    height: 16,
    border: 'none',
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: hover ? 1 : 0.8,
    transform: hover ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 0.15s ease',
  };

  return (
    <div
      ref={tipRef}
      role="alert"
      aria-live="assertive"
      style={{ ...(coords ? { left: coords.left, top: coords.top } : { visibility: 'hidden' }), ...tipStyle }}>
      <button
        type="button"
        aria-label="Закрыть подсказку"
        onClick={() => {
          setLocallyClosed(true);
          onOpenChange?.(false);
        }}
        style={closeBtnStyle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}>
        <svg
          width={hover ? '13' : '12'}
          height={hover ? '13' : '12'}
          viewBox="0 0 13 13"
          fill="none"
          style={{ transition: 'all 0.15s ease' }}>
          <path
            d="M12.502 1.0332L7.20703 6.32812L12.498 11.6191L11.791 12.3262L6.5 7.03516L1.20898 12.3262L0.501953 11.6191L5.79297 6.32812L0.498047 1.0332L1.20508 0.326172L6.5 5.62109L11.7949 0.326172L12.502 1.0332Z"
            fill={hover ? '#fff' : 'rgba(255,255,255,0.9)'}
          />
        </svg>
      </button>

      <div style={{ paddingRight: 6 }}>{text}</div>

      <div
        style={{
          position: 'absolute',
          left: coords?.arrowLeft ?? 18,
          top: -8,
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderBottom: `8px solid ${BG}`,
        }}
      />
    </div>
  );
});
