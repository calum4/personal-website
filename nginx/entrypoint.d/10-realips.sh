#!/bin/bash

set -e

OUTPUT_FILE="/tmp/nginx/set_real_ip.conf"

log() {
  echo "[INFO] [10-realips.sh] $1"
}

error() {
  echo "[ERROR] [10-realips.sh] $1" >&2
}

output_buf="$( printf "# REALIP_SOURCE = '%s'\n# Generated at %s" "$REALIP_SOURCE" "$( date )" )"

if [ "$REALIP_SOURCE" = "false" ]; then
  log "Skipping setting Nginx 'set_real_ip_from'"
elif [ "$REALIP_SOURCE" = "cloudflare" ]; then
  log "Setting real_ip_from Cloudflare"

  ip_addrs="$( curl -sS https://api.cloudflare.com/client/v4/ips | jq -r '.result.ipv4_cidrs[], .result.ipv6_cidrs[]' )"

  for ip_addr in $ip_addrs
  do
    output_buf="$( printf "%s\nset_real_ip_from %s; \n" "$output_buf" "$ip_addr" )"
  done

  output_buf="$( printf "%s\n\nreal_ip_header CF-Connecting-IP;" "$output_buf" )"
elif [ "$REALIP_SOURCE" = "custom" ]; then
  log "Setting real_ip_from custom source"

  if [ "$REALIP_CUSTOM_FROM" = "" ]; then
    error "expected environment variable REALIP_CUSTOM_FROM to be set and not empty"
    exit 1
  fi

  IFS="," read -ra ADDRS <<< "$REALIP_CUSTOM_FROM"
  for addr in "${ADDRS[@]}"; do
    output_buf="$( printf "%s\nset_real_ip_from %s; \n" "$output_buf" "$addr" )"
  done

  if [ "$REALIP_CUSTOM_HEADER" = "" ]; then
    error "expected environment variable REALIP_CUSTOM_HEADER to be set and not empty"
    exit 1
  fi

  output_buf="$( printf "%s\n\nreal_ip_header %s;" "$output_buf" "$REALIP_CUSTOM_HEADER" )"
fi

echo "$output_buf" > "$OUTPUT_FILE"
