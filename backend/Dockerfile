FROM node:18-alpine

WORKDIR /backend/

# Установка postgresql-client для проверки готовности БД
RUN apk update && apk add --no-cache postgresql-client

COPY package*.json /backend/

RUN npm install

COPY . /backend/

EXPOSE 3002

COPY ./startup.sh /backend/

RUN chmod +x /backend/startup.sh

ENTRYPOINT [ "sh", "/backend/startup.sh" ]
