export function getEmbedUrl(url) {
  if (!url) return null;
  if (url.includes('youtu.be')) return url.replace('youtu.be/', 'www.youtube.com/embed/');
  if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
  if (url.includes('rutube.ru/video/')) {
    const id = url.split('/video/')[1]?.split('/')[0];
    return id ? `https://rutube.ru/play/embed/${id}` : null;
  }
  if (url.includes('vk.com/video_ext.php')) return url;
  const vkMatch = url.match(/(?:vk\.com|vkvideo\.ru)\/video(-?\d+)_(\d+)/);
  if (vkMatch) return `https://vk.com/video_ext.php?oid=${vkMatch[1]}&id=${vkMatch[2]}`;
  return null;
}
