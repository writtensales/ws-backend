ARG node_version=12.5.0-alpine

FROM node:$node_version

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm i --silent

COPY . /usr/src/app/

CMD ["npm", "start"]
