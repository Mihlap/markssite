// CustomCursorAdmin.js
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./CustomCursorAdmin.scss";
import { useSelector, useDispatch } from "react-redux";
import {
  adminMouseDown,
  adminMouseUp,
} from "../../store/Slice/CustomCursorAdminSlice";

export default function CustomCursorAdmin() {
  const [mousePosition, setMousePosition] = useState({
    x: window.innerWidth / 2, // Установка начальной позиции курсора в центр экрана
    y: window.innerHeight / 2,
  });

  const cursorVariant = useSelector((state) => state.cursorAdmin);
  const dispatch = useDispatch();

  useEffect(() => {
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
      dispatch(adminMouseDown());
    };

    const handleMouseUp = () => {
      dispatch(adminMouseUp());
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
    adminDefault: {
      x: mousePosition.x,
      y: mousePosition.y,
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
  };

  return (
    <>
      {window.innerWidth >= 1025 && (
        <motion.div
          className="admin-cursor"
          variants={variants}
          animate={cursorVariant}
        ></motion.div>
      )}
    </>
  );
}
