# syntax=docker/dockerfile:1

FROM node:20-alpine AS base

WORKDIR /backend

RUN apk add --no-cache postgresql-client

COPY package*.json ./

RUN npm ci

FROM base AS development

COPY . .

EXPOSE 3002

COPY startup-dev.sh ./

RUN chmod +x startup-dev.sh

ENTRYPOINT ["sh", "startup-dev.sh"]

FROM base AS production

COPY . .

EXPOSE 3002

COPY startup.sh ./

RUN chmod +x startup.sh

ENTRYPOINT ["sh", "startup.sh"]
