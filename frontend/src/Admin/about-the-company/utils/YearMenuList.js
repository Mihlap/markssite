import { components } from 'react-select';
import { useRef, useEffect } from 'react';
import historyStyles from '../CompanyHistory/CompanyHistory.module.scss';

export default function YearMenuList(props) {
    const menuRef = useRef(null);
    const highlightRef = useRef(null);
    const topSpacerRef = useRef(null);
    const bottomSpacerRef = useRef(null);

    useEffect(() => {
        const menuEl = menuRef.current;
        const highlightEl = highlightRef.current;
        const topSpacerEl = topSpacerRef.current;
        const bottomSpacerEl = bottomSpacerRef.current;

        if (!menuEl) return;

        const { options, selectProps } = props;
        const pivotYear = selectProps.pivotYear;
        if (!options.length) return;

        const firstOptionEl = menuEl.querySelector('[id$="-option-0"]');
        if (!firstOptionEl) return;

        const optionHeight = firstOptionEl.getBoundingClientRect().height;
        const menuHeight = menuEl.getBoundingClientRect().height;

        if (highlightEl) {
            highlightEl.style.height = `${optionHeight}px`;
        }

        const spacer = Math.max(0, menuHeight / 2 - optionHeight / 2);
        if (topSpacerEl) topSpacerEl.style.height = `${spacer}px`;
        if (bottomSpacerEl) bottomSpacerEl.style.height = `${spacer}px`;

        let idx = options.findIndex(
            (opt) => String(opt.value) === String(pivotYear)
        );
        if (idx === -1) idx = 0;

        const centerIndex = (index) => {
            const optEl = menuEl.querySelector(`[id$="-option-${index}"]`);
            if (!optEl) return;

            const menuRect = menuEl.getBoundingClientRect();
            const optRect = optEl.getBoundingClientRect();

            const menuCenterY = menuRect.top + menuRect.height / 2;
            const optCenterY = optRect.top + optionHeight / 2;

            const delta = optCenterY - menuCenterY;
            menuEl.scrollTop += delta;
        };

        menuEl.scrollTop = 0;
        centerIndex(idx);

        let currentIndex = idx;

        const onWheel = (e) => {
            e.preventDefault();
            if (!options.length) return;

            const direction = e.deltaY > 0 ? 1 : -1;
            let nextIndex = currentIndex + direction;

            if (nextIndex < 0) nextIndex = 0;
            if (nextIndex > options.length - 1) nextIndex = options.length - 1;
            if (nextIndex === currentIndex) return;

            currentIndex = nextIndex;
            centerIndex(currentIndex);

            const nextOption = options[nextIndex];
            if (nextOption && typeof selectProps.onChange === 'function') {
                selectProps.onChange(nextOption, {
                    action: 'select-option',
                    option: nextOption,
                });
            }
        };
       
        menuEl.style.cursor = 'grab';

        const onMouseDown = () => {
            menuEl.style.cursor = 'grabbing';
        };

        const onMouseUp = () => {
            menuEl.style.cursor = 'pointer';
        };

        menuEl.addEventListener('wheel', onWheel, { passive: false });
        menuEl.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            menuEl.removeEventListener('wheel', onWheel);
            menuEl.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [props.options, props.selectProps.pivotYear, props.selectProps.onChange]);

    const { innerProps, children, ...rest } = props;
    const combinedClassName = `${innerProps.className || ''} ${historyStyles.yearMenuList}`;

    return (
        <components.MenuList
            {...rest}
            innerRef={menuRef}
            innerProps={{ ...innerProps, className: combinedClassName }}
        >
            <div ref={highlightRef} className={historyStyles.yearMenuHighlight} />
            <div ref={topSpacerRef} aria-hidden="true" />
            {children}
            <div ref={bottomSpacerRef} aria-hidden="true" />
        </components.MenuList>
    );
}
