const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#EBECEE",
    border: "none",
    boxShadow: state.isFocused ? null : provided.boxShadow,
    padding: 0,
    // other styles
  }),
  indicatorSeparator: (provided, state) => ({
    ...provided,
    display: "none",
  }),

  menu: (provided, state) => ({
    ...provided,
    backgroundColor: "#F5F6F7",
  }),

  placeholder: (provided, state) => ({
    ...provided,
    fontFamily: "Raleway",
    fontSize: "1rem",
    color: "var(--gray-959DA6)",
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: "16px",
  }),

  option: (provided, state) => ({
    ...provided,
    fontSize: "1rem",
    color: "var(--gray-959DA6)",
    backgroundColor: state.isSelected ? "#FFBFB5" : "inherit",
    "&:hover": {
      backgroundColor: "#FFBFB5",
      color: "#566272",
    },
  }),
  multiValue: (provided, state) => ({
    ...provided,
    fontFamily: "Raleway",
    backgroundColor: "none",
    color: "#27292F",
    marginTop: "13px",
  }),

  multiValueGeneric: (provided, state) => ({
    ...provided,
    padding: 0
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    paddingLeft: 0, // remove left-side padding
    // other valueContainer styles
  }),
  // dropdownIndicator: (provided, state) => ({
  //   ...provided,
  //   transform: state.menuIsOpen ? "rotate(180deg)" : null,
  //   transition: "all .2s ease",
  // }),
};



export default customStyles;