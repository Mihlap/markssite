// const Host = process.env.REACT_APP_SERVER_HOST;

export const shareToVK = (article, Host) => {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(article.title);
  const imageUrl = encodeURIComponent(`${Host}/images/imageArticle/${article.imageOpen}`);
  const vkUrl = `https://vk.com/share.php?url=${url}&title=${title}&description=Ссылка: ${imageUrl}`;
  window.open(vkUrl, '_blank');
};

export const shareToTelegram = (article, Host) => {
  const title = encodeURIComponent(`${article.title}`);
  const url = encodeURIComponent(window.location.href);
  const imageUrl = `${Host}/images/imageArticle/${article.imageOpen}`;
  const telegramMessage = `${title}%0A${url}%0AСсылка: ${imageUrl}`;
  const telegramUrl = `https://t.me/share/url?url=${url}&text=${telegramMessage}`;
  window.open(telegramUrl, '_blank');
};

export const shareToWhatsApp = (article, Host) => {
  const title = encodeURIComponent(`${article.title}`);
  const projectUrl = encodeURIComponent(window.location.href);
  const imageUrl = encodeURIComponent(`${Host}/images/imageArticle/${article.imageOpen}`);
  const message = `${title}%0A${projectUrl}%0AСсылка: ${imageUrl}`;
  const whatsappUrl = `https://wa.me/?text=${message}`;
  window.open(whatsappUrl, '_blank');
};

export const shareToViber = (article, Host) => {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(article.title);
  const imageUrl = encodeURIComponent(`${Host}/images/imageArticle/${article.imageOpen}`);
  window.open(`viber://forward?text=${text}%0A${url}%0A${encodeURIComponent(imageUrl)}`, '_blank');
};
