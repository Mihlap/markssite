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
 let lastMousePosition = { x: 0, y: 0 };
 let isRequesting = false;

 const mouseMove = (e) => {
   lastMousePosition = {
     x: e.clientX - 16,
     y: e.clientY - 16,
   };

   if (!isRequesting) {
     window.requestAnimationFrame(() => {
       setMousePosition(lastMousePosition);
       isRequesting = false;
     });
     isRequesting = true;
   }
 };
    
    // была проблема с браузером сафари, я чуть изменил код, сейчас всё работает 

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
       color: "#ffffff",
       opacity: 0.90,
       stroke: "var(--white-F6F6F6, #F6F6F6)",
       strokeWidth: "1px",
       filter: "drop-shadow(0px 0px 7px rgba(44, 59, 68, 0.25))",
       backdropFilter: "blur(4px)",
       background:
         "linear-gradient(140deg, #FFF 3.57%, #C5D8E9 18.7%, #E4DEE3 61.44%, #EAD2D1 77.32%, #FFF 101.9%)",
     },

     specialHover: {
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
       background:
         "linear-gradient(140deg, #FFF 3.57%, #C5D8E9 18.7%, #E4DEE3 61.44%, #EAD2D1 77.32%, #FFF 101.9%)",
       opacity: 0.76,
       boxShadow: "0px 0px 7px rgba(44, 59, 68, 0.25)",
       backdropFilter: "blur(4px)",
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
          className="cursor"
          variants={variants}
          animate={cursorVariant}
        >
          {cursorVariant === "imageHover" && (
            <span>Смотреть</span>
          )}
          {cursorVariant === "specialHover" && (
            <div className="cursor-hover">Все Конкурсы</div>
          )}
        </motion.div>
      )}
    </>
  );
}
