function extractBlockFileUrls(blockData) {
  const urls = [];

  const walk = (node) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node && typeof node === 'object') {
      if (node.type === 'file' && Array.isArray(node.value)) {
        node.value.forEach((val) => {
          if (typeof val === 'string' && val.trim()) urls.push(val.trim());
        });
      }
    }
  };

  walk(blockData);
  return urls;
}

module.exports = { extractBlockFileUrls };
