const roadsInitialCustomization = {
  tags: { any: ['road'] },
  elements: 'geometry',
  stylers: [{ color: '#ff0000' }], // кремовый
};

const waterInitialCustomization = {
  tags: { any: ['water'] },
  elements: 'geometry',
  stylers: [{ color: '#aa00ff' }], // яркий синий
};

const groundInitialCustomization = {
  tags: { any: ['landscape', 'admin', 'land', 'transit'] },
  elements: 'geometry',
  stylers: [{ color: '#ffe600' }], // мягкий зелёный
};

const buildingInitialCustomization = {
  tags: { any: ['building'] },
  elements: 'geometry',
  stylers: [{ color: '#00fffb' }], // тёплый бежевый
};


export {
  roadsInitialCustomization,
  waterInitialCustomization,
  groundInitialCustomization,
  buildingInitialCustomization,
};