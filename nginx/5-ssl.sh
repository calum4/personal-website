#!/bin/sh

set -e

if [ ! -e /etc/ssl/private/personal-website.key ] || [ ! -e /etc/ssl/certs/personal-website.crt ]
then
  openssl req -x509 -nodes -days 5475 -newkey rsa:2048 -keyout /etc/ssl/private/personal-website.key -out /etc/ssl/certs/personal-website.crt -batch
  openssl dhparam -dsaparam -out /etc/nginx/dhparam.pem 4096
fi
