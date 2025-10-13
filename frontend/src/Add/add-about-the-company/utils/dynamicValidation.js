const isEmptyVal = (v) => {
  if (v == null) return true;
  if (typeof v === 'string') return v.trim() === '';
  if (Array.isArray(v)) return v.length === 0;
  return false;
};

export function validateDynamicBlocks(dynamicData = []) {
  const errors = {};

  dynamicData.forEach((block, bi) => {
    (block || []).forEach((inp, ii) => {
      if (inp?.required && isEmptyVal(inp.value)) {
        errors[`${bi}-${ii}`] = 'Обязательное поле для заполнения';
      }
    });
  });


  dynamicData.forEach((block, bi) => {  
    const groups = {};
    (block || []).forEach((inp, ii) => {
      if (!inp?.pairKey) return;
      if (!groups[inp.pairKey]) groups[inp.pairKey] = [];
      groups[inp.pairKey].push({ ii, inp });
    });

    Object.values(groups).forEach((arr) => {
      if (arr.length < 2) return;
      const allEmpty = arr.every(({ inp }) => isEmptyVal(inp.value));
      const allFilled = arr.every(({ inp }) => !isEmptyVal(inp.value));
      if (!allEmpty && !allFilled) {        
        arr.forEach(({ ii }) => {
          const k = `${bi}-${ii}`;
          if (!errors[k]) errors[k] = 'Заполните оба поля';
        });
      }
    });
  });

  return { ok: Object.keys(errors).length === 0, errors };
}
