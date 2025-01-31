// src/utils/extractMarkdownLinks.js

export const extractMarkdownLinks = (markdownText) => {
  const links = [];

  const imageRegex = /!\[[^\]]*\]\((?<url>[^)]+)\)/g;
  const linkRegex = /\[[^\]]*\]\((?<url>[^)]+)\)/g;

  for (const match of markdownText.matchAll(imageRegex)) {
    links.push(match.groups.url);
  }

  for (const match of markdownText.matchAll(linkRegex)) {
    const { url } = match.groups;
    if (url.endsWith('.pdf') || url.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
      links.push(url);
    }
  }

  return [...new Set(links)];
};
