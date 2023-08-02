const Host = process.env.REACT_APP_SERVER_HOST;

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
    if (width !== 28 || height !== 48) {
      return { width: 28.18, height: 48.18 };
    }
  } else if (aspectRatio < 0.8) {
    if (width !== 28 || height !== 14) {
      return { width: 27.62, height: 13.81 };
    }
  } else {
    if (width !== 28 || height !== 28) {
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

export const getImageUrls = (imageTitle) => {
  if (!imageTitle) {
    return [];
  }

  const filenames = imageTitle.replace(/{|}/g, "").split(",");

  const trimmedFilenames = filenames.map((filename) => filename.trim());

  const imageUrls = trimmedFilenames.map((filename) => `${Host}/images/${filename}`);
  return imageUrls;
};



      
      // if (screenWidth >= 1800) {
      //   setShowButton(true);
      // } else if (screenWidth >= 1441 && screenWidth <= 1799) {
      //   setShowButton(false);
      // } else if (screenWidth >= 1024 && screenWidth <= 1440) {
      //   setShowButton(false);
      // }
    