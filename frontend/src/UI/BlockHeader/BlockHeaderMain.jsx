import React, { useEffect, useState } from "react";
import { blockData } from "./utils.js";
import styles from "./BlockHeaderMain.module.css";
import { Link } from "react-router-dom";

const BlockHeaderMain = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [blockStates, setBlockStates] = useState(
    Array(blockData.length).fill(false)
  );

  const toggleBlock = (index) => {
    setBlockStates((prevState) => {
      const newState = prevState.map((state, i) =>
        i === index ? !state : false
      );
      return newState;
    });
  };
    
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobileScreen = screenWidth <= 767;

  return (
    <div className={styles.blockMainContainer}>
      {blockStates.map((isOpen, index) => (
        <div className={styles.block_blockHeader} key={index}>
          <div className={styles.closedBlockContent_blockHeader}>
            <div className={styles.blockNumber_blockHeader}>
              {index < 8 ? `0${index + 1}` : index + 1}
            </div>
            <div className={styles.line_blockHeader}></div>
            <div
              className={styles.block_hover}
              onClick={() => toggleBlock(index)}
            >
              {isMobileScreen && (
                <div
                  className={`${styles.toggle_blockHeader} ${
                    isOpen ? styles.rotate180 : ""
                  }`}
                  // onClick={() => toggleBlock(index)}
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
              )}
              <div className={styles.blockTitle_blockHeader}>
                {blockData[index].title}
                <div
                  className={`${styles.content_blockHeader} ${
                    isOpen
                      ? styles.contentOpen_blockHeader
                      : styles.contentClose_blockHeader
                  }`}
                >
                  {blockData[index].content}
                </div>

                {!isMobileScreen && (
                  <div
                    className={`${styles.toggle_blockHeader} ${
                      isOpen ? styles.rotate180 : ""
                    }`}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d={
                          isOpen ? "M17 14L12.5 9L8 14" : "M8 10L12.5 15L17 10"
                        }
                        stroke="#566272"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {isOpen && (
                <div className={styles.blocksContainer}>
                  {blockData[index].blocks.map((block, blockIndex) => (
                    <div
                      className={`${styles.block_content_name_wrapper} ${
                        isOpen
                          ? styles.contentOpen_block_content_name_wrapper
                          : styles.contentClose_block_content_name_wrapper
                      }`}
                      key={blockIndex}
                    >
                      {isMobileScreen && (
                        <div className={styles.block_content_tochka}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="4"
                            height="4"
                            viewBox="0 0 4 4"
                            fill="none"
                          >
                            <circle cx="2" cy="2" r="2" fill="#566272" />
                          </svg>
                        </div>
                      )}{" "}
                      <div className={styles.block_name_content}>
                        <div className={styles.blockName}>
                          {block.block_name}
                        </div>
                        <div className={styles.blockContent}>
                          {block.block_content}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className={styles.button_block_wrapper}>
                    <Link
                      to={`/project?${blockData[index].path}`}
                      className={styles.button_block}
                    >
                      <div className={styles.button_block_name}>
                        Смотреть
                        <br />
                        проекты
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlockHeaderMain;
