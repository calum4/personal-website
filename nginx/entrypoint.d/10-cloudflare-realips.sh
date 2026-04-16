#!/bin/sh

set -e

OUTPUT_FILE="/tmp/nginx/set_real_ip_from_cloudflare.conf"

if [ "$REALIP_FROM_CLOUDFLARE" != "true" ]; then
  echo "Skipping whitelisting Cloudflare IPs for Nginx 'set_real_ip_from'"

  echo "# REALIP_FROM_CLOUDFLARE was not 'true' " > $OUTPUT_FILE
  exit 0
fi

ip_addrs="$(curl -sS https://api.cloudflare.com/client/v4/ips | jq -r '.result.ipv4_cidrs[], .result.ipv6_cidrs[]')"

output_buf="# Generated at $( date )"

for ip_addr in $ip_addrs
do
  output_buf="$( printf "%s\nset_real_ip_from %s; \n" "$output_buf" "$ip_addr" )"
done

output_buf="$( printf "%s\n\nreal_ip_header CF-Connecting-IP;" "$output_buf" )"

echo "$output_buf" > "$OUTPUT_FILE"
