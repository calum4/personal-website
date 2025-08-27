#!/bin/sh

set -e

if [ ! -e /etc/ssl/personal-website/personal-website.key ] || [ ! -e /etc/ssl/personal-website/personal-website.crt ]
then
    openssl req -x509 -nodes -days 5475 -newkey rsa:2048 -keyout /etc/ssl/personal-website/personal-website.key -out /etc/ssl/personal-website/personal-website.crt -batch
    openssl dhparam -dsaparam -out /etc/ssl/personal-website/dhparam.pem 4096
fi
