FROM node:18-alpine

WORKDIR /backend/

#RUN apk update && apk add postgresql-client

COPY package*.json /backend/

#RUN npm cache clean --force
RUN npm install
#RUN npm install bcrypt

COPY . /backend/

EXPOSE 3002

COPY ./startup.sh /backend/

RUN chmod +x /backend/startup.sh

ENTRYPOINT [ "sh", "/backend/startup.sh" ]
