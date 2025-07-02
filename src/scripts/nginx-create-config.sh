#!/bin/bash
# Usage: nginx-create-config.sh <path>

SITE_PATH="$1"

if [[ -z "$SITE_PATH" ]]; then
    echo "Usage: $0 <path>"
    exit 1
fi

if [[ -f "$SITE_PATH" ]]; then
    echo "CONFIG_EXISTS"
    exit 0
fi

cat > "$SITE_PATH"
