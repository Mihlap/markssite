import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./CustomCursor.scss";
import { useSelector } from "react-redux";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const cursorVariant = useSelector((state) => state.cursor);

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX -16,
        y: e.clientY -16,
      });
    };

    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x,
      y: mousePosition.y,
    },
    text: {
      height: 64,
      width: 64,
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      backgroundColor: "#F6F6F6",
      mixBlendMode: "difference",
    },
    imageHover: {
      height: 100,
      width: 100,
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#F6F6F6",
      border: "1px solid #F6F6F6",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      animation: "gradient 5s ease infinite",
    },
  };

  return (
    <>
      <motion.div
        className="cursor"
        variants={variants}
        animate={cursorVariant}
      >
        {cursorVariant === "imageHover" && (
          <span className="cursor-hover">Смотреть</span>
        )}
      </motion.div>
    </>
  );
}
