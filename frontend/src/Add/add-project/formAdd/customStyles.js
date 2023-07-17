const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#EBECEE",
    border: "none",
    padding: 0,
    // other styles
  }),
  placeholder: (provided, state) => ({
    ...provided,
    fontSize: "1rem",
    color: "#959DA6",
  }),
  indicatorSeparator: (provided, state) => ({
    ...provided,
    display: "none",
  }),

  menu: (provided, state) => ({
    ...provided,
    backgroundColor: "#F5F6F7",
  }),

  option: (provided, state) => ({
    ...provided,
    color: "#959DA6",
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
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    paddingLeft: 0, // remove left-side padding
    // other valueContainer styles
  }),
};



export default customStyles;