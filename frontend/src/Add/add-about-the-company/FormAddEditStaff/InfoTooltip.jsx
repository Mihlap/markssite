import { useEffect, useRef, useState, memo } from 'react';

export default memo(function InfoTooltip({
  title,
  body,
  linkText,
  linkHref = '#',
  icon,
  trigger,
  placement = 'top',
  isOpen: controlledOpen,
  onOpenChange,
  onClose,
  className,
  style,
  tipStyle,
  anchorRef,
}) {
  const [open, setOpen] = useState(false);
  const isControlled = typeof controlledOpen === 'boolean';
  const actualOpen = isControlled ? controlledOpen : open;
  const internalTriggerRef = useRef(null);
  const tipRef = useRef(null);
  const triggerRef = anchorRef || internalTriggerRef;
  const [coords, setCoords] = useState(null);
  const [isLinkHovered, setIsLinkHovered] = useState(false);

  useEffect(() => {
    function onDocMouseDown(e) {
      if (!actualOpen) return;
      if (
        tipRef.current &&
        !tipRef.current.contains(e.target) &&
        triggerRef &&
        !(triggerRef.current && triggerRef.current.contains(e.target))
      ) {
        if (!isControlled) setOpen(false);
        onOpenChange?.(false);
        onClose?.();
      }
    }
    function onKey(e) {
      if (!actualOpen) return;
      if (e.key === 'Escape') {
        if (!isControlled) setOpen(false);
        onOpenChange?.(false);
        onClose?.();
      }
    }
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [actualOpen, isControlled, onOpenChange, onClose, triggerRef]);

  useEffect(() => {
    if (!actualOpen) {
      setCoords(null);
      return;
    }
    const compute = () => {
      if (!triggerRef?.current || !tipRef?.current) return;

      const triggerEl = triggerRef.current;
      const anchorRect = triggerEl.getBoundingClientRect();
      const tipRect = tipRef.current.getBoundingClientRect();

      const spacing = 8;
     
     let left = anchorRect.right - tipRect.width + 169;
      const minLeft = 8;
      const maxLeft = window.innerWidth - tipRect.width - 8;
    
      if (left < minLeft) left = minLeft;
      if (left > maxLeft) left = maxLeft;

      let top;
      if (placement === 'top') {
        top = anchorRect.top - tipRect.height - spacing;
      } else {
        top = anchorRect.bottom + spacing;
      }
     
      const arrowLeft = anchorRect.left + anchorRect.width / 2 - left - 8;

      setCoords({
        left: Math.round(left + window.scrollX),
        top: Math.round(top + window.scrollY),
        arrowLeft: Math.max(8, Math.min(tipRect.width - 24, arrowLeft)),
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
  }, [actualOpen, placement, triggerRef]);

  const toggleInternal = () => {
    const next = !actualOpen;
    if (!isControlled) setOpen(next);
    onOpenChange?.(next);
    if (!next) onClose?.();
  };

  const handleLinkClick = (e) => {
    e.stopPropagation();
    if (linkHref && linkHref !== '#') {
      window.open(linkHref, '_blank');
    }
  };

  const tipBaseStyle = {
    position: 'fixed',
    zIndex: 1000,
    maxWidth: 203,
    height: 'auto',
    padding: '8px 16px',
    alignItems: 'center',
    borderRadius: 17,
    background: 'rgba(29, 46, 67, 0.40)',
    ...tipStyle,
  };

  const titleStyle = {
    color: 'var(--white-F6F6F6)',
    fontFamily: 'Raleway',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '20px',
    fontVariantNumeric: 'lining-nums proportional-nums',
  };

  const linkBaseStyle = {
    color: 'var(--white-F6F6F6)',
    fontFamily: 'Raleway',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '20px',
    fontVariantNumeric: 'lining-nums proportional-nums',
    textDecoration: 'none',
    cursor: 'pointer',
  };

  const linkHoverStyle = {
    color: 'var(--light-blue-D4EDFB)',
    fontFamily: 'Raleway',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '20px',
    fontVariantNumeric: 'lining-nums proportional-nums',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationSkipInk: 'none',
    textDecorationThickness: 'auto',
    textUnderlineOffset: 'auto',
    textUnderlinePosition: 'from-font',
    cursor: 'pointer',
  };

  return (
    <div className={className} style={{ position: 'relative', display: 'inline-block', ...style }}>
      {!anchorRef && (
        <button
          type="button"
          ref={internalTriggerRef}
          onClick={toggleInternal}
          aria-expanded={actualOpen}
          aria-haspopup="dialog"
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            margin: 0,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
          }}>
          {trigger ? (
            trigger
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M7.9987 10.6087V7.27539M7.99479 5.27539H8.00078M7.9987 1.27539C11.6654 1.27539 14.6654 4.27539 14.6654 7.94206C14.6654 11.6087 11.6654 14.6087 7.9987 14.6087C4.33203 14.6087 1.33203 11.6087 1.33203 7.94206C1.33203 4.27539 4.33203 1.27539 7.9987 1.27539Z"
                stroke="#566272"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      )}

      {/* тултип */}
      {actualOpen && (
        <div
          ref={tipRef}
          role="dialog"
          aria-label={typeof title === 'string' ? title : 'Подсказка'}
          style={{
            ...(coords ? { left: coords.left, top: coords.top } : { visibility: 'hidden' }),
            ...tipBaseStyle,
          }}>
          <button
            type="button"
            onClick={() => {
              if (!isControlled) setOpen(false);
              onOpenChange?.(false);
              onClose?.();
            }}
            aria-label="Закрыть подсказку"
            style={{
              position: 'absolute',
              right: 16,
              top: 12,
              width: '12px',
              height: '12px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M12.502 1.0332L7.20703 6.32812L12.498 11.6191L11.791 12.3262L6.5 7.03516L1.20898 12.3262L0.501953 11.6191L5.79297 6.32812L0.498047 1.0332L1.20508 0.326172L6.5 5.62109L11.7949 0.326172L12.502 1.0332Z"
                fill="#F6F6F6"
              />
            </svg>
          </button>

          <div>
            <div style={titleStyle}>{title}</div>
            {icon && <div>{icon}</div>}
          </div>

          {/* {body && <div style={{ marginTop: 8 }}>{body}</div>} */}

          {linkText && (
            <div style={{ marginTop: 6 }}>
              <a
                href={linkHref}
                onClick={handleLinkClick}
                onMouseEnter={() => setIsLinkHovered(true)}
                onMouseLeave={() => setIsLinkHovered(false)}
                style={isLinkHovered ? linkHoverStyle : linkBaseStyle}
                target="_blank"
                rel="noopener noreferrer">
                {linkText}
              </a>
            </div>
          )}

          {/* стрелочка */}
          <div
            style={
              placement === 'top'
                ? {
                    position: 'absolute',
                    left: 18,
                    bottom: -8,
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderTop: '8px solid #9aa0a7',
                  }
                : {
                    position: 'absolute',
                    left: 18,
                    top: -8,
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderBottom: '8px solid #9aa0a7',
                  }
            }
          />
        </div>
      )}
    </div>
  );
});
