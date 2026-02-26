import { transliterate } from "transliteration";

function generateUniqueName(originalName) {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 10000);
  const fileExtension = originalName.split('.').pop();
  const sliceOfOriginalName = transliterate(originalName.slice(0, 5));
  const newName = `file_${sliceOfOriginalName}_${timestamp}_${randomNum}.${fileExtension}`;
  return newName;
}

// Rename file with unique name
const renameFile = (file) => {
  const uniqueName = generateUniqueName(file.name);
  return new File([file], uniqueName, { type: file.type });
}


export default renameFile;