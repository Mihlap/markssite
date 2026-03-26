export const extractMarkdownLinks = (text) => {
  const links = [];

  const imageRegex = /!\[[^\]]*\]\((?<url>[^)]+)\)/g;
  const linkRegex = /\[[^\]]*\]\((?<url>[^)]+)\)/g;

  for (const match of text.matchAll(imageRegex)) {
    links.push(match.groups.url);
  }
 for (const match of text.matchAll(linkRegex)) {
   const { url } = match.groups;
   if (url.toLowerCase().includes('.pdf') || url.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
     links.push(url);
   }
 }
  return links;
};
 
