#!/bin/sh
set -e

echo "Ожидание готовности базы данных..."
until pg_isready -h "${DB_HOST:-db}" -U "${DB_USER}" -p 5432; do
  echo "База данных недоступна — ожидание..."
  sleep 2
done

echo "База данных готова!"
echo "Миграции: docker compose exec mainServer npm run roll-up-db"

exec npm run dev
