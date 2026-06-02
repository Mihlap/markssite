#!/bin/sh
set -e

APP_ENV="${NODE_ENV:-development}"
DB_HOST_VALUE="${DB_HOST:-db}"
DB_USER_VALUE="${DB_USER:-postgres}"

echo "Ожидание готовности базы данных..."
until pg_isready -h "${DB_HOST_VALUE}" -U "${DB_USER_VALUE}" -p 5432; do
  echo "База данных недоступна - ожидание..."
  sleep 2
done

echo "База данных готова!"

if [ "${APP_ENV}" = "production" ]; then
  npm run pre-db
  exec node server.js
fi

echo "Миграции: docker compose exec mainServer npm run roll-up-db"
exec npm run dev