FROM node:lts-alpine3.22 AS builder

WORKDIR /home/personal-website

RUN npm install -g typescript
RUN npm install -g @angular/cli

COPY ./bin/strip-config-comments/package.json ./bin/strip-config-comments/
COPY ./package.json ./package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM nginxinc/nginx-unprivileged:1.29-alpine3.22-slim AS initial

USER root

RUN apk add --no-cache openssl

COPY --chown=nginx:nginx ./nginx/5-ssl.sh /docker-entrypoint.d/5-ssl.sh
RUN chmod +x /docker-entrypoint.d/5-ssl.sh

COPY --chown=nginx:nginx ./nginx/1-environment-setup.sh /docker-entrypoint.d/1-environment-setup.sh
RUN chmod +x /docker-entrypoint.d/1-environment-setup.sh

RUN mkdir -p /etc/ssl/personal-website/ && chown -R nginx:nginx /etc/ssl/personal-website

RUN rm /etc/nginx/conf.d/default.conf && echo "include /tmp/nginx/conf.d/*.conf;" >> /etc/nginx/conf.d/default.conf

FROM initial

USER nginx

EXPOSE 80
EXPOSE 443

WORKDIR /usr/share/personal-website/html

ENV NGINX_ENVSUBST_OUTPUT_DIR=/tmp/nginx/conf.d

COPY ./nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY ./nginx/ssl-params.conf /etc/nginx/snippets/ssl-params.conf
COPY --from=builder /home/personal-website/dist/personal-website/browser/ ./
