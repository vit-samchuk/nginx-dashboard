#!/bin/bash
# Usage: nginx-edit-config.sh <path>

SITE_PATH="$1"

if [[ -z "$SITE_PATH" ]]; then
    echo "Usage: $0 <path>"
    exit 1
fi

if [[ ! -f "$SITE_PATH" ]]; then
    echo "CONFIG_NOT_FOUND"
    exit 1
fi

cat > "$SITE_PATH"

# if nginx -t; then
#     echo "CONFIG_UPDATED"
#     systemctl reload nginx
#     echo "NGINX_RELOADED"
#     exit 0
# else
#     echo "CONFIG_INVALID"
#     exit 1
# fi
