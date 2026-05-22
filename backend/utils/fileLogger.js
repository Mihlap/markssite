const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'admin-actions.log');

/** 62 дня логов, затем перезапись */
const LOG_RETENTION_MS = 62 * 24 * 60 * 60 * 1000;

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function formatTimestamp() {
  return new Date().toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function hasAdminSession(req) {
  const user = req.session?.user;
  return Boolean(user && (user.name || user.userName) && user.id != null);
}

function getSessionLogContext(req) {
  const user = req.session?.user;
  const userName = user?.name ?? user?.userName ?? null;
  const userId = user?.id != null ? String(user.id) : null;

  return {
    userName: userName || 'Неизвестный',
    userId: userId || 'N/A',
  };
}

/** Лог ресурса только для авторизованной админ-сессии */
function logResourceActionFromSession(req, params) {
  if (!hasAdminSession(req)) {
    return;
  }
  const { userName, userId } = getSessionLogContext(req);
  logResourceAction({ ...params, userName, userId });
}

/** Контекст для logFileAction при загрузке/удалении в S3 */
function buildS3LogInfo(req, resourceType, resourceId = null) {
  if (!req.session?.user) {
    return null;
  }
  const { userName, userId } = getSessionLogContext(req);
  if (userName === 'Неизвестный') {
    return null;
  }
  return {
    userName,
    userId,
    resourceType,
    resourceId: resourceId != null ? String(resourceId) : null,
  };
}

function ensureLogFile() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }

  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, '', 'utf8');
    return;
  }

  const stat = fs.statSync(LOG_FILE);
  const fileAgeMs = Date.now() - stat.birthtimeMs;

  if (fileAgeMs > LOG_RETENTION_MS) {
    const header = `[${formatTimestamp()}] === Новый журнал (предыдущий старше 2 месяцев, файл перезаписан) ===\n\n`;
    fs.writeFileSync(LOG_FILE, header, 'utf8');
  }
}

function appendToLogFile(lines) {
  ensureLogFile();
  const block = `${lines.filter(Boolean).join('\n')}\n\n`;
  fs.appendFileSync(LOG_FILE, block, 'utf8');
}

function printToConsole(coloredLines) {
  coloredLines.forEach((line) => console.log(line));
  console.log('');
}

function emitLog(plainLines, coloredLines) {
  appendToLogFile(plainLines);
  printToConsole(coloredLines);
}

/** Логирует действие пользователя с файлом */
function logFileAction({
  action,
  userName,
  userId,
  fileName,
  filePath,
  fileUrl = null,
  resourceType = null,
  resourceId = null,
}) {
  const timestamp = formatTimestamp();
  const actionEmoji = { UPLOAD: '📤', DELETE: '🗑️', UPDATE: '✏️' };
  const actionText = { UPLOAD: 'ЗАГРУЗКА', DELETE: 'УДАЛЕНИЕ', UPDATE: 'ОБНОВЛЕНИЕ' };
  const emoji = actionEmoji[action] || '📄';
  const actionName = actionText[action] || action;
  const user = userName || 'Неизвестный';
  const uid = userId || 'N/A';
  const actionColor = action === 'DELETE' ? colors.red : action === 'UPLOAD' ? colors.green : colors.yellow;

  const plain = [
    `[${timestamp}] [ФАЙЛ] [${actionName}] ${fileName || 'файл'}`,
    `  Пользователь: ${user} (ID: ${uid})`,
    filePath ? `  Путь: ${filePath}` : null,
    fileUrl ? `  URL: ${fileUrl}` : null,
    resourceType && resourceId ? `  Ресурс: ${resourceType} (ID: ${resourceId})` : null,
    resourceType && !resourceId ? `  Ресурс: ${resourceType}` : null,
  ];

  const colored = [
    `${colors.bright}${actionColor}${emoji} [${actionName}]${colors.reset} ${colors.cyan}${fileName || 'файл'}${colors.reset}`,
    `${colors.gray}   Пользователь:${colors.reset} ${colors.bright}${user}${colors.reset} ${colors.gray}(ID: ${uid})${colors.reset}`,
    `${colors.gray}   Время:${colors.reset} ${colors.bright}${timestamp}${colors.reset}`,
    filePath ? `${colors.gray}   📁 Путь:${colors.reset} ${filePath}` : null,
    fileUrl ? `${colors.gray}   🔗 URL:${colors.reset} ${fileUrl}` : null,
    resourceType && resourceId
      ? `${colors.gray}   📋 Ресурс:${colors.reset} ${resourceType} ${colors.gray}(ID: ${resourceId})${colors.reset}`
      : null,
  ];

  emitLog(plain, colored);
}

/** Логирует действие пользователя с данными (ресурс) */
function logResourceAction({
  action,
  userName,
  userId,
  resourceType,
  resourceId = null,
  resourceName = null,
  hasChanges = null,
}) {
  const timestamp = formatTimestamp();
  const actionEmoji = { CREATE: '➕', UPDATE: '✏️', DELETE: '🗑️' };
  const actionText = { CREATE: 'СОЗДАНИЕ', UPDATE: 'РЕДАКТИРОВАНИЕ', DELETE: 'УДАЛЕНИЕ' };
  const emoji = actionEmoji[action] || '📄';
  const actionName = actionText[action] || action;
  const user = userName || 'Неизвестный';
  const uid = userId || 'N/A';
  const resource = resourceType || 'ресурс';
  const actionColor = action === 'DELETE' ? colors.red : action === 'CREATE' ? colors.green : colors.yellow;

  const plain = [
    `[${timestamp}] [РЕСУРС] [${actionName}] ${resource}`,
    `  Пользователь: ${user} (ID: ${uid})`,
    resourceId ? `  ID ресурса: ${resourceId}` : null,
    resourceName ? `  Название: ${resourceName}` : null,
    action === 'UPDATE' && hasChanges !== null ? `  Изменения: ${hasChanges}` : null,
  ];

  const colored = [
    `${colors.bright}${actionColor}${emoji} [${actionName}]${colors.reset} ${colors.cyan}${resource}${colors.reset}`,
    `${colors.gray}   Пользователь:${colors.reset} ${colors.bright}${user}${colors.reset} ${colors.gray}(ID: ${uid})${colors.reset}`,
    `${colors.gray}   Время:${colors.reset} ${colors.bright}${timestamp}${colors.reset}`,
    resourceId ? `${colors.gray}   📋 ID ресурса:${colors.reset} ${colors.bright}${resourceId}${colors.reset}` : null,
    resourceName ? `${colors.gray}   📝 Название:${colors.reset} ${colors.bright}${resourceName}${colors.reset}` : null,
  ];

  if (action === 'UPDATE' && hasChanges !== null) {
    const changeStatus = hasChanges
      ? `${colors.green}true${colors.reset}`
      : `${colors.red}false${colors.reset}`;
    colored.push(`${colors.gray}   🔄 Изменения:${colors.reset} ${changeStatus}`);
  }

  emitLog(plain, colored);
}

function logAdminLogin({ userName, userId, ipAddress }) {
  const timestamp = formatTimestamp();
  const user = userName || 'Неизвестный';
  const uid = userId || 'N/A';
  const ip = ipAddress || 'N/A';

  emitLog(
    [
      `[${timestamp}] [АВТОРИЗАЦИЯ] ВХОД В АДМИНКУ: ${user}`,
      `  Пользователь: ${user} (ID: ${uid})`,
      `  IP: ${ip}`,
    ],
    [
      `${colors.bright}${colors.green}🔐 [ВХОД В АДМИНКУ]${colors.reset} ${colors.cyan}${user}${colors.reset}`,
      `${colors.gray}   Пользователь:${colors.reset} ${colors.bright}${user}${colors.reset} ${colors.gray}(ID: ${uid})${colors.reset}`,
      `${colors.gray}   Дата и время:${colors.reset} ${colors.bright}${timestamp}${colors.reset}`,
      `${colors.gray}   IP адрес:${colors.reset} ${colors.bright}${colors.blue}${ip}${colors.reset}`,
    ]
  );
}

function logAdminLogout({ userName, userId, ipAddress }) {
  const timestamp = formatTimestamp();
  const user = userName || 'Неизвестный';
  const uid = userId || 'N/A';
  const ip = ipAddress || 'N/A';

  emitLog(
    [
      `[${timestamp}] [АВТОРИЗАЦИЯ] ВЫХОД ИЗ АДМИНКИ: ${user}`,
      `  Пользователь: ${user} (ID: ${uid})`,
      `  IP: ${ip}`,
    ],
    [
      `${colors.bright}${colors.red}🚪 [ВЫХОД ИЗ АДМИНКИ]${colors.reset} ${colors.cyan}${user}${colors.reset}`,
      `${colors.gray}   Пользователь:${colors.reset} ${colors.bright}${user}${colors.reset} ${colors.gray}(ID: ${uid})${colors.reset}`,
      `${colors.gray}   Дата и время:${colors.reset} ${colors.bright}${timestamp}${colors.reset}`,
      `${colors.gray}   IP адрес:${colors.reset} ${colors.bright}${colors.blue}${ip}${colors.reset}`,
    ]
  );
}

module.exports = {
  logFileAction,
  logResourceAction,
  logResourceActionFromSession,
  logAdminLogin,
  logAdminLogout,
  hasAdminSession,
  getSessionLogContext,
  buildS3LogInfo,
  LOG_FILE,
};
