/**
 * Логирует действие пользователя с файлом
 * @param {Object} options - Параметры логирования
 * @param {string} options.action - Действие: 'UPLOAD', 'DELETE', 'UPDATE'
 * @param {string} options.userName - Имя пользователя
 * @param {string} options.userId - ID пользователя
 * @param {string} options.fileName - Имя файла
 * @param {string} options.filePath - Путь к файлу (folder)
 * @param {string} options.fileUrl - URL файла
 * @param {string} options.resourceType - Тип ресурса: 'project', 'article', 'vacancy' и т.д.
 * @param {string} options.resourceId - ID ресурса
 */
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
  const timestamp = new Date().toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const actionEmoji = {
    UPLOAD: '📤',
    DELETE: '🗑️',
    UPDATE: '✏️',
  };

  const actionText = {
    UPLOAD: 'ЗАГРУЗКА',
    DELETE: 'УДАЛЕНИЕ',
    UPDATE: 'ОБНОВЛЕНИЕ',
  };

  const emoji = actionEmoji[action] || '📄';
  const actionName = actionText[action] || action;
  const user = userName || 'Неизвестный';
  const uid = userId || 'N/A';

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

  const actionColor = action === 'DELETE' ? colors.red : action === 'UPLOAD' ? colors.green : colors.yellow;

  console.log(
    `${colors.bright}${actionColor}${emoji} [${actionName}]${colors.reset} ${colors.cyan}${fileName || 'файл'}${colors.reset}`
  );
  console.log(`${colors.gray}   Пользователь:${colors.reset} ${colors.bright}${user}${colors.reset} ${colors.gray}(ID: ${uid})${colors.reset}`);
  console.log(`${colors.gray}   Время:${colors.reset} ${colors.bright}${timestamp}${colors.reset}`);

  if (filePath) {
    console.log(`${colors.gray}   📁 Путь:${colors.reset} ${filePath}`);
  }
  if (fileUrl) {
    console.log(`${colors.gray}   🔗 URL:${colors.reset} ${fileUrl}`);
  }
  if (resourceType && resourceId) {
    console.log(`${colors.gray}   📋 Ресурс:${colors.reset} ${resourceType} ${colors.gray}(ID: ${resourceId})${colors.reset}`);
  }

  console.log('');
}

/**
 * Логирует действие пользователя с данными
 * @param {Object} options - Параметры логирования
 * @param {string} options.action - Действие: 'CREATE', 'UPDATE', 'DELETE'
 * @param {string} options.userName - Имя пользователя
 * @param {string} options.userId - ID пользователя
 * @param {string} options.resourceType - Тип ресурса: 'project', 'article', 'vacancy' и т.д.
 * @param {string} options.resourceId - ID ресурса
 * @param {string} options.resourceName - Название ресурса
 * @param {boolean} options.hasChanges - Были ли изменения при UPDATE (true/false)
 */
function logResourceAction({
  action,
  userName,
  userId,
  resourceType,
  resourceId = null,
  resourceName = null,
  hasChanges = null,
}) {
  const timestamp = new Date().toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const actionEmoji = {
    CREATE: '➕',
    UPDATE: '✏️',
    DELETE: '🗑️',
  };

  const actionText = {
    CREATE: 'СОЗДАНИЕ',
    UPDATE: 'РЕДАКТИРОВАНИЕ',
    DELETE: 'УДАЛЕНИЕ',
  };

  const emoji = actionEmoji[action] || '📄';
  const actionName = actionText[action] || action;
  const user = userName || 'Неизвестный';
  const uid = userId || 'N/A';
  const resource = resourceType || 'ресурс';

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

  const actionColor = action === 'DELETE' ? colors.red : action === 'CREATE' ? colors.green : colors.yellow;

  console.log(
    `${colors.bright}${actionColor}${emoji} [${actionName}]${colors.reset} ${colors.cyan}${resource}${colors.reset}`
  );
  console.log(`${colors.gray}   Пользователь:${colors.reset} ${colors.bright}${user}${colors.reset} ${colors.gray}(ID: ${uid})${colors.reset}`);
  console.log(`${colors.gray}   Время:${colors.reset} ${colors.bright}${timestamp}${colors.reset}`);

  if (resourceId) {
    console.log(`${colors.gray}   📋 ID ресурса:${colors.reset} ${colors.bright}${resourceId}${colors.reset}`);
  }

  if (resourceName) {
    console.log(`${colors.gray}   📝 Название:${colors.reset} ${colors.bright}${resourceName}${colors.reset}`);
  }

  if (action === 'UPDATE' && hasChanges !== null) {
    const changeStatus = hasChanges ? `${colors.green}true${colors.reset}` : `${colors.red}false${colors.reset}`;
    console.log(`${colors.gray}   🔄 Изменения:${colors.reset} ${changeStatus}`);
  }

  console.log('');
}

/**
 * Логирует вход пользователя в админку
 * @param {Object} options - Параметры логирования
 * @param {string} options.userName - Имя пользователя
 * @param {string} options.userId - ID пользователя
 * @param {string} options.ipAddress - IP адрес пользователя
 */
function logAdminLogin({ userName, userId, ipAddress }) {
  const timestamp = new Date().toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const user = userName || 'Неизвестный';
  const uid = userId || 'N/A';
  const ip = ipAddress || 'N/A';

  const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
  };

  console.log(
    `${colors.bright}${colors.green}🔐 [ВХОД В АДМИНКУ]${colors.reset} ${colors.cyan}${user}${colors.reset}`
  );
  console.log(`${colors.gray}   Пользователь:${colors.reset} ${colors.bright}${user}${colors.reset} ${colors.gray}(ID: ${uid})${colors.reset}`);
  console.log(`${colors.gray}   Дата и время:${colors.reset} ${colors.bright}${timestamp}${colors.reset}`);
  console.log(`${colors.gray}   IP адрес:${colors.reset} ${colors.bright}${colors.blue}${ip}${colors.reset}`);
  console.log('');
}

/**
 * Логирует выход пользователя из админки
 * @param {Object} options - Параметры логирования
 * @param {string} options.userName - Имя пользователя
 * @param {string} options.userId - ID пользователя
 * @param {string} options.ipAddress - IP адрес пользователя
 */
function logAdminLogout({ userName, userId, ipAddress }) {
  const timestamp = new Date().toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const user = userName || 'Неизвестный';
  const uid = userId || 'N/A';
  const ip = ipAddress || 'N/A';

  const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
  };

  console.log(
    `${colors.bright}${colors.red}🚪 [ВЫХОД ИЗ АДМИНКИ]${colors.reset} ${colors.cyan}${user}${colors.reset}`
  );
  console.log(`${colors.gray}   Пользователь:${colors.reset} ${colors.bright}${user}${colors.reset} ${colors.gray}(ID: ${uid})${colors.reset}`);
  console.log(`${colors.gray}   Дата и время:${colors.reset} ${colors.bright}${timestamp}${colors.reset}`);
  console.log(`${colors.gray}   IP адрес:${colors.reset} ${colors.bright}${colors.blue}${ip}${colors.reset}`);
  console.log('');
}

module.exports = { logFileAction, logResourceAction, logAdminLogin, logAdminLogout };
