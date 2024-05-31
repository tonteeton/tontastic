FROM node:lts-alpine

WORKDIR /app

RUN  apk add --no-cache git && \
     git clone --depth 1 https://github.com/phaserjs/template-webpack.git .
RUN npm install

CMD npm run dev
