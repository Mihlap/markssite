import { useState, useEffect } from 'react';
import { getUserGeolocation } from '../Project/utils/utils';

export const useGeolocation = () => {
  const [userGeolocation, setUserGeolocation] = useState(null);

  useEffect(() => {
    getUserGeolocation()
      .then((geolocation) => setUserGeolocation(geolocation))
      .catch((error) => console.error('Ошибка при получении геопозиции:', error));
  }, []);

  return userGeolocation ? userGeolocation.city : 'Москва';
};
