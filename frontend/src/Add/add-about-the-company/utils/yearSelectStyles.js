export function buildYearSelectStyles(hasError = false) {
    return {
        control: (provided, state) => {
            const isActive = state.isFocused || state.selectProps?.menuIsOpen;
            const borderColor = hasError ? '#E00747' : (isActive ? '#75BBFD' : '#959DA6');

            return {
                ...provided,
                border: 'none',
                boxShadow: 'none',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                cursor: 'default',
                borderRadius: 0,
                borderBottom: `1px solid ${borderColor}`,
                paddingLeft: 0,
                paddingRight: 0,

                '&:hover': {
                    borderBottom: `1px solid ${borderColor}`,
                },
            };
        },

        valueContainer: (provided) => ({
            ...provided,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
        }),

        singleValue: (provided) => ({
            ...provided,
            margin: 0,
            color: 'var(--gray-959DA6)',
            fontVariantNumeric: 'lining-nums proportional-nums',
            fontFamily: 'Raleway',
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '16px',
        }),

        placeholder: (provided) => ({
            ...provided,
            margin: 0,
            color: 'var(--gray-959DA6)',
            fontVariantNumeric: 'lining-nums proportional-nums',
            fontFamily: 'Raleway',
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '16px',
        }),

        input: (provided) => ({
            ...provided,
            margin: 0,
            padding: 0,
            width: 0,
            minWidth: 0,
            color: 'transparent',
            caretColor: 'transparent',
        }),

        indicatorsContainer: (provided) => ({
            ...provided,
            padding: 0,
        }),

        dropdownIndicator: (provided) => ({
            ...provided,
            padding: 0,
        }),

        menuList: (provided) => ({
            ...provided,
            maxHeight: 240,
            overflowY: 'auto',
            margin: '6px 0',

            '&::-webkit-scrollbar': {
                width: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#C0C5CB',
                borderRadius: '4px',
            },
            '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
            },
        }),

        option: (provided, state) => {
            const pivotYear = state.selectProps?.pivotYear;
            const isPivot = String(state.data.value) === String(pivotYear);

            return {
                ...provided,
                position: 'relative',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                color: isPivot
                    ? 'var(--dark-gray-566269, #566272)'
                    : 'var(--gray-959DA6, #959DA6)',
                fontWeight: isPivot ? 500 : 400,

                '&:hover': {
                    backgroundColor: 'transparent',
                    color: isPivot
                        ? 'var(--dark-gray-566269, #566272)'
                        : 'var(--gray-959DA6, #959DA6)',
                },
            };
        },

        menu: (provided) => ({
            ...provided,
            zIndex: 10,
        }),
    };
}
