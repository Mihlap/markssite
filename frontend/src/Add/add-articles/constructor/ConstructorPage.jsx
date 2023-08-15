import React, { useState } from "react";
import BlockHeadingTitle from "./BlockHeadingTitle/BlockHeadingTitle";
import TextBlockArticles from "./TextBlockArticles/TextBlockArticles";
import QuoteBlock from "./QuoteBlock/QuoteBlock";
import FrameBlock from "./FrameBlock/FrameBlock";
import ImageToDescriptionArticles from "./ImageToDescriptionArticles/ImageToDescriptionArticles";

export default function ConstructorPage({
  inputData,
  setInputData,
  onImageUpload,
}) {
  // Создаем стейт и функцию для его обновления
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [isFullWidth2, setIsFullWidth2] = useState(false);
  const [isFullWidth3, setIsFullWidth3] = useState(false);
  const [isFullWidth4, setIsFullWidth4] = useState(false);

  // Определяем стиль на основе значения стейта
  const divStyle = isFullWidth ? { width: "100%" } : {};
  const divStyle2 = isFullWidth2 ? { width: "100%" } : {};
  const divStyle3 = isFullWidth3 ? { width: "100%" } : {};
  const divStyle4 = isFullWidth4 ? { width: "100%" } : {};

  return (
    <div style={{ display: "flex", gap: "19px", flexWrap: "wrap" }}>
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

      <div style={divStyle3}>
        <FrameBlock
          setIsFullWidth3={setIsFullWidth3}
          isFullWidth3={isFullWidth3}
          inputData={inputData}
          setInputData={setInputData}
        />
      </div>

      <div style={divStyle4}>
        <ImageToDescriptionArticles
          setIsFullWidth4={setIsFullWidth4}
          isFullWidth4={isFullWidth4}
          inputData={inputData}
          setInputData={setInputData}
          onImageUpload={onImageUpload}
        />
      </div>

      {/* <div style={divStyle3}>
        <QuoteBlock
          setIsFullWidth3={setIsFullWidth3}
          isFullWidth3={isFullWidth3}
          inputData={inputData}
          setInputData={setInputData}
        />
      </div> */}
    </div>
  );
}
