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
      x: mousePosition.x - 75,
      y: mousePosition.y - 75,
      backgroundColor: "#F6F6F6",
      mixBlendMode: "difference",
    },
  };

  // const textEnter = () => {
  //     setCursorVariant('text')
  // }
  // const textLeave = () => {
  //     setCursorVariant('default')
  // }

  return (
    <>
      <motion.div
        className="cursor"
        variants={variants}
        animate={cursorVariant}
      />
    </>
  );
}
