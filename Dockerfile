FROM node:12.2-alpine

RUN mkdir -p /app
WORKDIR /app

ADD . /app

RUN /bin/sh -c "apk add --no-cache bash"
RUN yarn install