#!/bin/sh

set -e

if [ "$SET_CAP_NET_BIND_SERVICE" = "true" ]; then
  echo "Setting CAP_NET_BIND_SERVICE on Nginx"

  apk add --no-cache libcap-setcap
  setcap 'CAP_NET_BIND_SERVICE=ep' /usr/sbin/nginx
fi
