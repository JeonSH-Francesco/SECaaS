FROM node

RUN npm install -g serve

RUN mkdir /app

WORKDIR /app

COPY ./build ./build

ENTRYPOINT ["serve", "-s", "build"]