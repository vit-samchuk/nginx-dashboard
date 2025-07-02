#!/bin/bash
# Usage: nginx-disable-site.sh <path>

if [ -z "$1" ]; then
    echo "Usage: $0 <path>"
    exit 1
fi

SITE_PATH="$1"
rm -f "$SITE_PATH"