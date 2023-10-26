// const Host = process.env.REACT_APP_SERVER_HOST;

export const getUserGeolocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`;

          fetch(apiUrl)
            .then(response => {
              if (!response.ok) {
                throw new Error('Ошибка сети или неверный ответ сервера');
              }
              return response.json();
            })
            .then(data => {
              const city = data.address.city || data.address.town || data.address.village || data.address.county;
              if (city) {
                resolve({ latitude, longitude, city });
              } else {
                resolve({ latitude, longitude, city: "Москва" });
              }
            })
            .catch(error => reject(error));
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

// export const shareToVK = (project, Host) => {
//   const url = encodeURIComponent(window.location.href);
//   const title = encodeURIComponent(project.title);
//   const imageUrl = encodeURIComponent(`${Host}/images/imageAdd/${project.imageProject}`);
//   window.open(`https://vk.com/share.php?url=${url}&title=${title}&image=${encodeURIComponent(imageUrl)}`, '_blank');
// };

// vk-api

export const shareToVK = (project, Host) => {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(project.title);
  const imageUrl = encodeURIComponent(`${Host}/images/imageAdd/${project.imageProject}`);
  window.open(`https://vk.com/share.php?url=${url}&title=${title}&image=${imageUrl}`, '_blank');
};


// export const shareToTelegram = (project, Host) => {
// const url = encodeURIComponent(window.location.href);
// const title = encodeURIComponent(project.title);
// const imageUrl = encodeURIComponent(`${Host}/images/imageAdd/${project.imageProject}`);
// window.open(`https://t.me/share/url?url=${url}&text=${title}&image=${encodeURIComponent(imageUrl)}`, '_blank');
// };


// node-telegram-bot-api
export const shareToTelegram = (project, Host) => {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(project.title);
  const imageUrl = encodeURIComponent(`${Host}/images/imageAdd/${project.imageProject}`);
  window.open(`https://t.me/share/url?url=${url}&text=${title}&image=${imageUrl}`, '_blank');
};


export const shareToWhatsApp = (project, Host) => {
  const title = encodeURIComponent(`Check out this project: ${project.title}`);
  const imageUrl = `${Host}/images/imageAdd/${project.imageProject}`;
  const imageTag = `<img src="${imageUrl}" alt="Project Image">`;
  const message = `${title}%0A${window.location.href}%0A${imageTag}`;
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



// const userId = 123456789; // ID пользователя VK
// const accessToken = 'your_access_token'; // Ваш access token
// const groupId = 0; // ID группы, если вы хотите опубликовать в группе

// // Шаг 1: Получаем URL сервера для загрузки фото
// fetch(`https://api.vk.com/method/photos.getWallUploadServer?user_id=${userId}&group_id=${groupId}&access_token=${accessToken}&v=5.131`)
//   .then(response => response.json())
//   .then(data => {
//     // Шаг 2: Загружаем фото на сервер
//     const formData = new FormData();
//     formData.append('file', yourImageFile); // yourImageFile - это файл, который вы хотите загрузить

//     fetch(data.response.upload_url, {
//       method: 'POST',
//       body: formData
//     })
//     .then(response => response.json())
//     .then(data => {
//       // Шаг 3: Сохраняем фото на стене пользователя или группы
//       const photoData = JSON.parse(data.photo);
//       const savePhotoUrl = `https://api.vk.com/method/photos.saveWallPhoto?user_id=${userId}&group_id=${groupId}&photo=${photoData.photo}&server=${photoData.server}&hash=${photoData.hash}&access_token=${accessToken}&v=5.131`;

//       fetch(savePhotoUrl)
//         .then(response => response.json())
//         .then(data => {
//           const photoId = data.response[0].id;
//           const ownerId = data.response[0].owner_id;

//           // Шаг 4: Публикуем фото на стене пользователя или группы
//           const postUrl = `https://api.vk.com/method/wall.post?owner_id=${ownerId}&attachments=photo${ownerId}_${photoId}&access_token=${accessToken}&v=5.131`;
          
//           fetch(postUrl)
//             .then(response => response.json())
//             .then(data => {
//               console.log(data);
//             });
//         });
//     });
//   });
