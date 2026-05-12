#!/bin/sh

# Ожидание готовности PostgreSQL
echo "Ожидание готовности базы данных..."
until pg_isready -h "${DB_HOST:-db}" -U "${DB_USER:-postgres}" -p 5432; do
  echo "База данных недоступна - ожидание..."
  sleep 2
done

echo "База данных готова!"

# Запуск миграций и сидеров
npm run pre-db

# Запуск сервера (используем node вместо nodemon в production)
node server.js