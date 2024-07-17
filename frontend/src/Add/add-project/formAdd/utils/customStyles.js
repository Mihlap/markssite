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
  singleValue: (provided, state) => ({
    ...provided,
    fontSize: "0.8rem",
    top: "13px",
    position: "absolute",
  }),
  multiValueGeneric: (provided, state) => ({
    ...provided,
    padding: 0,
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    paddingLeft: 0, // remove left-side padding
    // other valueContainer styles
  }),
  menuList: (provided) => ({
    ...provided,
    // CSS для кастомного скролла
    overflowY: "scroll",
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(155, 155, 155, 0.7) white", // цвет полосы прокрутки и ползунка
    "&::-webkit-scrollbar": {
      width: "9px", // ширина для вертикального ползунка
      height: "9px", // высота для горизонтального ползунка
    },
    "&::-webkit-scrollbar-track": {
      background: "white", // цвет дорожки скролла
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(155, 155, 155, 0.7)", // цвет вашего ползунка
      borderRadius: "20px", // скругление углов ползунка
      border: "2px solid transparent", // границы ползунка
      backgroundClip: "content-box", // отображение фона в пределах границы/отступа/содержимого
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "rgba(155, 155, 155, 0.7)", // цвет ползунка при наведении
    },
  }),
  // dropdownIndicator: (provided, state) => ({
  //   ...provided,
  //   transform: state.menuIsOpen ? "rotate(180deg)" : null,
  //   transition: "all .2s ease",
  // }),
};



export default customStyles;