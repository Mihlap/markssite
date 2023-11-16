import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./CustomCursor.scss";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { mouseDown, mouseUp } from "../../store/Slice/cursorSlice";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const cursorVariant = useSelector((state) => state.cursor);

  const dispatch = useDispatch();

  useEffect(() => {
    setMousePosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const mouseMove = (e) => {
      const newPosition = {
        x: e.clientX - 16,
        y: e.clientY - 16,
      };

      window.requestAnimationFrame(() => {
        if (
          newPosition.x !== mousePosition.x ||
          newPosition.y !== mousePosition.y
        ) {
          setMousePosition(newPosition);
        }
      });
    };

    const handleMouseDown = () => {
      dispatch(mouseDown());
    };

    const handleMouseUp = () => {
      dispatch(mouseUp());
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dispatch]);

  const variants = {
    default: {
      x: mousePosition.x,
      y: mousePosition.y,
      height: 24,
      width: 24,
    },

    mouseDown: {
      scale: 1.7,
      x: mousePosition.x,
      y: mousePosition.y,
    },
    mouseUp: {
      scale: 1,
      x: mousePosition.x,
      y: mousePosition.y,
    },
    text: {
      height: 64,
      width: 64,
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      backgroundColor: "transparent", // Установка фона как прозрачного
      border: "2px solid #1D2E43", // Установка синей границы, замените #1D2E43 на ваш код цвета
    },
    textFooter: {
      zIndex: 2,
      height: 24,
      width: 24,
      x: mousePosition.x - 0,
      y: mousePosition.y - 0,
      backgroundColor: "#F6F6F6",
    },
    textFooterEnter: {
      zIndex: 2,
      height: 64,
      width: 64,
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      backgroundColor: "#F6F6F6",
    },

    textLeaveFooter: {
      x: mousePosition.x,
      y: mousePosition.y,
      backgroundColor: "#F6F6F6",
    },

    mouseDownFooter: {
      scale: 1.7,
      x: mousePosition.x,
      y: mousePosition.y,
      backgroundColor: "#F6F6F6",
    },
    mouseUpFooter: {
      scale: 1,
      x: mousePosition.x,
      y: mousePosition.y,
      backgroundColor: "#F6F6F6",
    },
    imageHover: {
      height: 100,
      width: 100,
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#ffffff",
      backgroundColor: "#1D2E43",
    },
    specialHover: {
      height: 100,
      width: 100,
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#ffffff",
      backgroundColor: "#1D2E43",
    },
  };

  return (
    <div className="cursor-container">
      {window.innerWidth >= 1025 && (
        <motion.div
          className="cursor"
          variants={variants}
          animate={cursorVariant}
        >
          {cursorVariant === "imageHover" && <span>Смотреть</span>}
          {cursorVariant === "specialHover" && (
            <div className="cursor-hover">Все Конкурсы</div>
          )}
        </motion.div>
      )}
    </div>
  );
}
