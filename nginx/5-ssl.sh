#!/bin/sh

set -e

if [ ! -e .ssl-created ]
then
  openssl req -x509 -nodes -days 5475 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt -batch
  openssl dhparam -dsaparam -out /etc/nginx/dhparam.pem 4096

  touch .ssl-created
fi
