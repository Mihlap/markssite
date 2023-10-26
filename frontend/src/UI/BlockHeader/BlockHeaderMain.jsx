import React, { useState } from 'react';
import { blockData } from "./utils.js";
import styles from "./BlockHeaderMain.module.css";


const BlockHeaderMain = () => {
  const [blockStates, setBlockStates] = useState(Array(blockData.length).fill(false));

  const toggleBlock = (index) => {
    setBlockStates(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  }

  return (
    <div>
      {blockStates.map((isOpen, index) => (
        <div className={styles.block} key={index}>
      {isOpen && <div className={styles.content}>{blockData[index]}</div>}
          <div className={styles.toggle} onClick={() => toggleBlock(index)}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={isOpen ? "M17 14L12.5 9L8 14" : "M8 10L12.5 15L17 10"}
                stroke="#1D2E43"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BlockHeaderMain;
