export const handleScroll = (prevScrollPos, setVisible, setPrevScrollPos) => {
  const currentScrollPos = window.pageYOffset;

  if (prevScrollPos > currentScrollPos) {
    setVisible(true);
  } else {
    setVisible(false);
  }

  setPrevScrollPos(currentScrollPos);
};

export const handleItemClick = (path, setActiveClass) => {
  setActiveClass(path);
  localStorage.setItem("activeClass", path);
};

export const handlePath = (location, setActiveClass) => {
  const currentPath = location.pathname;
  setActiveClass(currentPath);
};

export const handleStoredClass = (setActiveClass) => {
  const storedActiveClass = localStorage.getItem("activeClass");
  if (storedActiveClass) {
    setActiveClass(storedActiveClass);
  }
};
