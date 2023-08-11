import React, { useState } from "react";
import BlockHeadingTitle from "./BlockHeadingTitle/BlockHeadingTitle";
import TextBlockArticles from "./TextBlockArticles/TextBlockArticles";

export default function ConstructorPage({
  inputData,
  setInputData,
}) {
  // Создаем стейт и функцию для его обновления
  const [isFullWidth, setIsFullWidth] = useState(false);
    const [isFullWidth2, setIsFullWidth2] = useState(false);


  // Определяем стиль на основе значения стейта
  const divStyle = isFullWidth ? { width: "100%" } : {};
  const divStyle2 = isFullWidth2 ? { width: "100%" } : {};

  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      <div style={divStyle}>
        <BlockHeadingTitle
          setIsFullWidth={setIsFullWidth}
          isFullWidth={isFullWidth}
          inputData={inputData}
          setInputData={setInputData}
        />
      </div>

      <div style={divStyle2}>
        <TextBlockArticles
          setIsFullWidth2={setIsFullWidth2}
          isFullWidth2={isFullWidth2}
          inputData={inputData}
          setInputData={setInputData}
        />
      </div>
    </div>
  );
}
