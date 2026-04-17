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

ARG SET_CAP_NET_BIND_SERVICE

USER root

RUN apk add --no-cache openssl curl jq

COPY nginx/build-scripts/*.sh /build-scripts/
RUN chmod +x /build-scripts/*.sh && /build-scripts/*.sh && rm -r /build-scripts/

COPY nginx/entrypoint.d/*.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/*.sh

RUN mkdir -p /etc/ssl/personal-website/ && chown -R nginx:nginx /etc/ssl/personal-website
RUN mkdir -p /etc/ssl/default-server/ && chown -R nginx:nginx /etc/ssl/default-server/

COPY --chown=nginx:nginx nginx/conf.d/* /etc/nginx/conf.d/

FROM initial

USER nginx

EXPOSE 80
EXPOSE 443

WORKDIR /usr/share/personal-website/html

ENV NGINX_ENVSUBST_OUTPUT_DIR=/tmp/nginx/conf.d

COPY --chown=nginx:nginx ./nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --chown=nginx:nginx ./nginx/ssl-params.conf /etc/nginx/snippets/ssl-params.conf
COPY --chown=nginx:nginx --from=builder /home/personal-website/dist/personal-website/browser/ ./
