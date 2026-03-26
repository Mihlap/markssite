import { components } from 'react-select';

export default function YearDropdownIndicator(props) {
    const { menuIsOpen } = props.selectProps;
   
    const controlIsFocused = props.isFocused;
   
    const active = menuIsOpen || controlIsFocused;

    return (
        <components.DropdownIndicator {...props}>
            <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                style={{
                    transform: menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease',
                    display: 'block',
                }}
            >
                <path
                    d="M4 6l4 4 4-4"
                    fill="none"
                    stroke={active ? '#75BBFD' : '#C0C5CB'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </components.DropdownIndicator>
    );
}
