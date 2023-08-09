import React, { useState } from "react";
import BlockHeadingTitle from "./BlockHeadingTitle/BlockHeadingTitle";
import TextBlockArticles from "./TextBlockArticles/TextBlockArticles";

export default function ConstructorPage({
  inputData,
  setInputData,
  blockHeadingTitle,
  blockHeadingText,
}) {
  // Создаем стейт и функцию для его обновления
  const [isFullWidth, setIsFullWidth] = useState(false);

  // Определяем стиль на основе значения стейта
  const divStyle = isFullWidth ? { width: "100%" } : {};

  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      <div style={divStyle}>
        <BlockHeadingTitle
          setIsFullWidth={setIsFullWidth}
          isFullWidth={isFullWidth}
          inputData={inputData}
          setInputData={setInputData}
          blockHeadingTitle={blockHeadingTitle}
          blockHeadingText={blockHeadingText}
        />
      </div>

      <TextBlockArticles />
    </div>
  );
}
