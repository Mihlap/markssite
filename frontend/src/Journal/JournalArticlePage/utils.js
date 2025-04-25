export const shareToVK = (journal) => {
  const origin = window.location.origin;
  const journalUrl = `${origin}/journal/${journal.id}`;

  const url = encodeURIComponent(journalUrl);
  const title = encodeURIComponent(journal.title);
 
  const vkUrl = `https://vk.com/share.php?url=${url}&title=${title}`;

  window.open(vkUrl, '_blank', 'noopener');
};

export const shareToWhatsAppJournal = (journal) => {
  const origin = window.location.origin;
  const journalUrl = `${origin}/journal/${journal.id}`;
  const title = journal.title;
  const message = `${title}\n${journalUrl}`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank', 'noopener');
};

export const shareToTelegram = (journal) => {
  const origin = window.location.origin;
  const journalUrl = `${origin}/journal/${journal.id}`;

  const url = encodeURIComponent(journalUrl);
  const title = encodeURIComponent(journal.title);

  const telegramUrl = `https://t.me/share/url?url=${url}&text=${title}%0A${url}`;

  window.open(telegramUrl, '_blank', 'noopener');
};
