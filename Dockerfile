FROM node:lts-alpine3.22 AS builder

WORKDIR /home/personal-website

RUN npm install -g typescript
RUN npm install -g @angular/cli

COPY ./bin/strip-config-comments/package.json ./bin/strip-config-comments/
COPY ./package.json ./package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

# TODO - Move to nginxinc/nginx-unprivileged
FROM nginx:1.29-alpine

EXPOSE 443

WORKDIR /usr/share/personal-website/html

RUN apk add --no-cache openssl

COPY ./nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY ./nginx/ssl-params.conf /etc/nginx/snippets/ssl-params.conf
COPY ./nginx/5-ssl.sh /docker-entrypoint.d/5-ssl.sh
COPY --chown=nginx:nginx --from=builder /home/personal-website/dist/personal-website/browser/ ./

RUN chmod +x /docker-entrypoint.d/5-ssl.sh
