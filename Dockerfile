FROM node:lts-alpine

WORKDIR /app

RUN  apk add --no-cache git && \
     git clone --depth 1 https://github.com/phaserjs/template-webpack.git .

COPY package.json .
COPY webpack/config.js webpack/config.js
COPY webpack/config.prod.js webpack/config.prod.js

RUN npm install

CMD npm run dev
