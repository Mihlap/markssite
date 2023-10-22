import { components } from "react-select";

export const DropdownIndicator = (props) => {
    // ... содержимое компонента ...
     return (
       <components.DropdownIndicator {...props}>
         <div
           style={{
             display: "inline-block",
             transform: props.selectProps.menuIsOpen ? "rotate(180deg)" : null,
             transition: "all .2s ease",
           }}
         >
           <svg
             width="16"
             height="16"
             viewBox="0 0 16 16"
             fill="none"
             xmlns="http://www.w3.org/2000/svg"
           >
             <g id="icon">
               <path
                 id="Vector 30"
                 d="M3 6L8 11L13 6"
                 stroke={props.selectProps.menuIsOpen ? "#FF7F6A" : "#1D2E43"} // меняем здесь цвет
               />
             </g>
           </svg>
         </div>
       </components.DropdownIndicator>
     );
};

export const ValueContainer = ({ children, ...props }) => {
    // ... содержимое компонента ...
    return (
      <components.ValueContainer {...props}>
        {props.hasValue ? (
          <>
            <div
              style={{
                position: "absolute",
                top: "-1px",
                left: "2px",
                fontSize: "0.8rem",
                fontWeight: "var(--fw-400)",
                color: "var(--light-gray-C0C5CB)",
                opacity: props.hasValue ? 1 : 0, // изменение прозрачности в зависимости от наличия значения
                transition: "opacity 0.3s ease", // плавный переход
              }}
            >
              Выбрать компетенции
            </div>
            {children}
          </>
        ) : (
          children
        )}
      </components.ValueContainer>
    );
};

export const AnotherDropdownIndicator = (props) => {
    // ... содержимое компонента ...
    return (
      <components.DropdownIndicator {...props}>
        <div
          style={{
            display: "inline-block",
            transform: props.selectProps.menuIsOpen ? "rotate(180deg)" : null,
            transition: "all .2s ease",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="icon">
              <path
                id="Vector 30"
                d="M3 6L8 11L13 6"
                stroke={props.selectProps.menuIsOpen ? "#FF7F6A" : "#1D2E43"} // меняем здесь цвет
              />
            </g>
          </svg>
        </div>
      </components.DropdownIndicator>
    );
};

export const AnotherValueContainer = ({ children, ...props }) => {
    // ... содержимое компонента ...
    return (
      <components.ValueContainer {...props}>
        {props.hasValue ? (
          <>
            <div
              style={{
                position: "absolute",
                top: "-1px",
                left: "2px",
                fontSize: "0.8rem",
                fontWeight: "var(--fw-400)",
                color: "var(--light-gray-C0C5CB)",
                opacity: props.hasValue ? 1 : 0, // изменение прозрачности в зависимости от наличия значения
                transition: "opacity 0.3s ease", // плавный переход
              }}
            >
              Выберите вид строительства
            </div>
            {children}
          </>
        ) : (
          children
        )}
      </components.ValueContainer>
    );
};

export const SelectDegreeParticipationDropdownIndicator = (props) => {
  // ... содержимое компонента ...
  return (
    <components.DropdownIndicator {...props}>
      <div
        style={{
          display: "inline-block",
          transform: props.selectProps.menuIsOpen ? "rotate(180deg)" : null,
          transition: "all .2s ease",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="icon">
            <path
              id="Vector 30"
              d="M3 6L8 11L13 6"
              stroke={props.selectProps.menuIsOpen ? "#FF7F6A" : "#1D2E43"} // меняем здесь цвет
            />
          </g>
        </svg>
      </div>
    </components.DropdownIndicator>
  );
};

export const SelectDegreeParticipationValueContainer = ({ children, ...props }) => {
  // ... содержимое компонента ...
  return (
    <components.ValueContainer {...props}>
      {props.hasValue ? (
        <>
          <div
            style={{
              position: "absolute",
              top: "-3px",
              left: "2px",
              fontSize: "0.8rem",
              fontWeight: "var(--fw-400)",
              color: "var(--light-gray-C0C5CB)",
              opacity: props.hasValue ? 1 : 0, // изменение прозрачности в зависимости от наличия значения
              transition: "opacity 0.3s ease", // плавный переход
            }}
          >
            Степень участия
          </div>
          {children}
        </>
      ) : (
        children
      )}
    </components.ValueContainer>
  );
};

export const SelectStatusObjectDropdownIndicator = (props) => {
  // ... содержимое компонента ...
  return (
    <components.DropdownIndicator {...props}>
      <div
        style={{
          display: "inline-block",
          transform: props.selectProps.menuIsOpen ? "rotate(180deg)" : null,
          transition: "all .2s ease",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="icon">
            <path
              id="Vector 30"
              d="M3 6L8 11L13 6"
              stroke={props.selectProps.menuIsOpen ? "#FF7F6A" : "#1D2E43"} // меняем здесь цвет
            />
          </g>
        </svg>
      </div>
    </components.DropdownIndicator>
  );
};

export const SelectStatusObjectValueContainer = ({ children, ...props }) => {
  // ... содержимое компонента ...
  return (
    <components.ValueContainer {...props}>
      {props.hasValue ? (
        <>
          <div
            style={{
              position: "absolute",
              top: "-3px",
              left: "2px",
              fontSize: "0.8rem",
              fontWeight: "var(--fw-400)",
              color: "var(--light-gray-C0C5CB)",
              opacity: props.hasValue ? 1 : 0, // изменение прозрачности в зависимости от наличия значения
              transition: "opacity 0.3s ease", // плавный переход
            }}
          >
            Статус объекта
          </div>
          {children}
        </>
      ) : (
        children
      )}
    </components.ValueContainer>
  );
};
