
FROM node:latest

COPY package.json /client/package.json
COPY rollup.config.js /client/rollup.config.js

COPY src /client/src
COPY static /client/static

WORKDIR /client 

RUN npm install
RUN npm run build

CMD [ "node", "__sapper__/build" ]