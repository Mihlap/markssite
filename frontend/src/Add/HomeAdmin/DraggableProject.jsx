import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import styles from "./HomeAdmin.module.scss";

const DraggableProject = ({
  project,
  index,
  moveProject,
  handleFormDelete,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);

  // Реализация Drag and Drop
  const [, drag] = useDrag({
    type: "PROJECT", // Указываем тип элемента
    item: { index }, // Передаем индекс элемента
  });

  const [, drop] = useDrop({
    accept: "PROJECT", // Принимаем только элементы типа "PROJECT"
    hover: (draggedItem) => {
      const draggedIndex = draggedItem.index;
      const targetIndex = index;
      if (draggedIndex === targetIndex) {
        return;
      }
      moveProject(draggedIndex, targetIndex); // Вызываем функцию перемещения элемента
      draggedItem.index = targetIndex; // Обновляем индекс перемещаемого элемента
    },
  });

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragEnter = () => {
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`${styles.home_admin_section__id_block} ${
        isDragging ? styles.home_admin_section__dragging : ""
      } ${isOver ? styles["drag-over"] : ""}`}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <div className={styles.home_admin_section__circle_block}>
        <div className={styles.home_admin_section__circle}></div>
        <div className={styles.home_admin_section__circle}></div>
        <div className={styles.home_admin_section__circle}></div>
        <div className={styles.home_admin_section__circle}></div>
        <div className={styles.home_admin_section__circle}></div>
        <div className={styles.home_admin_section__circle}></div>
      </div>
      <div>id: {JSON.stringify(project.IdProject)}</div>
      <button
        className={styles.home_admin_section__button_del}
        onClick={() => handleFormDelete(project.IdProject)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M9 9L15 15"
            stroke="#1D2E43"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 9L9 15"
            stroke="#1D2E43"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};


export default DraggableProject;