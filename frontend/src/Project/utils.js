// const Host = process.env.REACT_APP_SERVER_HOST;

export const getUserGeolocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject(new Error("Геолокация не поддерживается этим браузером."));
    }
  });
};


export const resizeImage = (width, height) => {
  const aspectRatio = height / width;

  if (aspectRatio >= 1.2) {
    if (width !== '28vw' || height !== '48vh') {
      return { width: '28.18vw', height: '48.18vh' };
    }
  } else if (aspectRatio < 0.8) {
    if (width !== '28vw' || height !== '14vh') {
      return { width: 27.62, height: 13.81 };
    }
  } else {
    if (width !== '28vw' || height !== '28vh') {
      return { width: 28.18, height: 27.62 };
    }
  }
  return { width, height };
};

export const extractCityFromCountryCity = (countryCity) => {
  if (!countryCity) return "";
  const parts = countryCity.split(/[.,:\s]+/);
  if (parts.length === 1) {
    return parts[0].trim();
  } else if (parts.length > 1) {
    return parts[1].trim();
  }
  return "";
};

export const shareToVK = (project, Host) => {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(project.title);
  const imageUrl = encodeURIComponent(`${Host}/images/imageAdd/${project.imageProject}`);
  window.open(`https://vk.com/share.php?url=${url}&title=${title}&image=${encodeURIComponent(imageUrl)}`, '_blank');
};

export const shareToTelegram = (project, Host) => {
const url = encodeURIComponent(window.location.href);
const title = encodeURIComponent(project.title);
const imageUrl = encodeURIComponent(`${Host}/images/imageAdd/${project.imageProject}`);
window.open(`https://t.me/share/url?url=${url}&text=${title}&image=${encodeURIComponent(imageUrl)}`, '_blank');
};

export const shareToWhatsApp = (project, Host) => {
  const title = encodeURIComponent(`Check out this project: ${project.title}`);
  const imageUrl = `${Host}/images/imageAdd/${project.imageProject}`;
  const message = `${title}%0A${window.location.href}%0A${imageUrl}`;
  const whatsappUrl = `https://wa.me/?text=${message}`;
  window.open(whatsappUrl, '_blank');
};

export const shareToViber = (project, Host) => {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(project.title);
  const imageUrl = encodeURIComponent(`${Host}/images/imageAdd/${project.imageProject}`);
  window.open(`viber://forward?text=${text}%0A${url}%0A${encodeURIComponent(imageUrl)}`, '_blank');
};

export const handleScroll = (el, projects, setEnableVerticalScroll, setIsHorizontalScroll, setIsAtRightEdge) => {
   if (el) {
    const rect = el.getBoundingClientRect();
    const isSliderInView = rect.top <= window.innerHeight && rect.bottom >= 0;
    setEnableVerticalScroll(!isSliderInView);

    if (projects) {
      if (isSliderInView && el.scrollLeft > 0) {
        setEnableVerticalScroll(false);
        setIsHorizontalScroll(false); // Disable vertical scrolling
      } else if (
        !isSliderInView &&
        el.scrollLeft + el.clientWidth >= el.scrollWidth
      ) {
        setEnableVerticalScroll(true);
        setIsHorizontalScroll(false);
      } else if (!isSliderInView && el.scrollLeft <= 0) {
        setEnableVerticalScroll(true);
        setIsHorizontalScroll(false);
      } else if (
        !isSliderInView &&
        el.scrollLeft + el.clientWidth >= el.scrollWidth &&
        el.scrollTop + el.clientHeight >= el.scrollHeight
      ) {
        setEnableVerticalScroll(true);
        setIsHorizontalScroll(false);
      }
    }
  }

  if (el) {
    const isRightEdge = el.scrollLeft + el.clientWidth >= el.scrollWidth;
    setIsAtRightEdge(isRightEdge);
  }
};

export const onVerticalScroll = (el, e, setEnableVerticalScroll) => {
   const isScrollingUp = e.deltaY < 0;
  const isAtTop = el.scrollTop <= 0;
  const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;

  if (isScrollingUp && isAtTop) {
    setEnableVerticalScroll(false);
    el.scrollLeft += e.deltaY;
  } else if (!isAtBottom) {
    el.scrollTo({
      top: el.scrollTop + e.deltaY,
      behavior: "smooth",
    });
  } else {
    e.preventDefault();
  }
};

export const onWheel = (el, e, enableVerticalScroll, isHorizontalScroll, setIsHorizontalScroll) => {
  const isScrollingRight = e.deltaY >= 0;
  const isAtRightEdge = el.scrollLeft + el.clientWidth >= el.scrollWidth;
  const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;
  const isAtLeftEdge = el.scrollLeft <= 0;
  const isAtTop = el.scrollTop <= 0;

  if (
    isScrollingRight &&
    isAtRightEdge &&
    isAtBottom &&
    !isHorizontalScroll
  ) {
    setIsHorizontalScroll(false); // Horizontal scrolling has stopped
    el.scrollTo({
      top: el.scrollTop + e.deltaY,
      behavior: "smooth",
    });
  } else if (enableVerticalScroll && !isScrollingRight) {
    if (isAtLeftEdge && isAtTop) {
      setIsHorizontalScroll(true); // Horizontal scrolling is in progress
      el.scrollLeft += e.deltaY;
    } else if (isAtLeftEdge && !isAtTop) {
      el.scrollTo({
        top: el.scrollTop + e.deltaY,
        behavior: "smooth",
      });
    } else if (
      isAtRightEdge &&
      isAtBottom &&
      e.deltaY < 0 &&
      !isHorizontalScroll
    ) {
      setIsHorizontalScroll(false); // Allow vertical scrolling
      el.scrollLeft += e.deltaY;
    } else if (
      isAtRightEdge &&
      isAtBottom &&
      e.deltaY > 0 &&
      !isHorizontalScroll
    ) {
      setIsHorizontalScroll(true); // Disable vertical scrolling
      el.scrollTo({
        top: el.scrollTop + e.deltaY,
        behavior: "smooth",
      });
    } else {
      e.preventDefault();
    }
  } else {
    el.scrollLeft += e.deltaY;
  }
};

