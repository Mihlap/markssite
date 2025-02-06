const customStyles = {
  container: (provided) => ({
    ...provided,
    border: 'none',
    width: '100%',
  }),
  control: (provided, state) => ({
    ...provided,
    border: 'none',
    backgroundColor: 'transparent',
    boxShadow: state.isFocused ? 'none' : provided.boxShadow,
    borderBottom: `1px solid ${state.isFocused ? '#75BBFD' : '#959DA6'}`,
    borderColor: 'transparent',
    '&:hover': {
      borderBottom: `1px solid ${state.isFocused ? '#75BBFD' : '#959DA6'}`,
    },
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: 'none',
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: 'transparent',
    marginLeft: -10,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#1D2E43',
    marginLeft: -5,
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#C0C5CB',
    svg: {
      width: '18px',
      height: '18px',
    },
    ':hover': {
      backgroundColor: 'transparent',
      color: '#959DA6',
      svg: {
        width: '18px',
        height: '18px',
      },
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    marginLeft: -5,
    color: '#959DA6',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#75BBFD' : 'transparent',
    color: state.isFocused ? 'white' : 'inherit',
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.3s ease-in-out',
    color: state.selectProps.menuIsOpen ? '#75BBFD' : '#C0C5CB',
    '&:hover': {
      color: state.selectProps.menuIsOpen ? '#75BBFD' : '#959DA6',
    },
  }),
  clearIndicator: (provided, state) => ({
    ...provided,
    color: state.selectProps.menuIsOpen ? '#959DA6' : '#C0C5CB',
    '&:hover': {
      color: '#959DA6',
    },
  }),
  menuList: (provided) => ({
    ...provided,
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
    '&::-ms-scrollbar': {
      width: '4px',
    },
    '&::-ms-scrollbar-thumb': {
      backgroundColor: '#C0C5CB',
      borderRadius: '4px',
    },
    '&::-ms-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    margin: '6px',
  }),
  menu: (provided) => ({
    ...provided,
    boxShadow: 'none',
    backgroundColor: '#f6f6f6',
  }),
};

export default customStyles;