FROM node:12.16.2-alpine3.11

RUN apk update && apk add --no-cache nmap && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache \
      chromium \
      harfbuzz \
      "freetype>2.8" \
      ttf-freefont \
      nss

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PORT 3566
EXPOSE 3566

RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY . .
RUN npm ci
CMD [ "node", "server.js" ]
