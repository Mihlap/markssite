import React, { useState } from "react";
import { blockData } from "./utils.js";
import styles from "./BlockHeaderMain.module.css";

const BlockHeaderMain = () => {
  const [blockStates, setBlockStates] = useState(
    Array(blockData.length).fill(false)
  );

  const toggleBlock = (index) => {
    setBlockStates((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  }

  return (
    <div>
      {blockStates.map((isOpen, index) => (
        <div className={styles.block_blockHeader} key={index}>
          <div className={styles.closedBlockContent_blockHeader}>
            <div className={styles.blockNumber_blockHeader}>
              {index < 9 ? `0${index + 1}` : index + 1}
            </div>
            <div className={styles.line_blockHeader}></div>
            <div className={styles.blockTitle_blockHeader}>
              {blockData[index].title}
            </div>
          </div>
          {isOpen && (
            <div
            className={`${styles.content_blockHeader} ${
              isOpen ? styles.contentOpen_blockHeader : ""
            }`}
            >
              {blockData[index].content}
            </div>
          )}
          <div
            className={styles.toggle_blockHeader}
            onClick={() => toggleBlock(index)}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={isOpen ? "M17 14L12.5 9L8 14" : "M8 10L12.5 15L17 10"}
                stroke="#566272"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlockHeaderMain;
