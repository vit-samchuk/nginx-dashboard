#!/bin/bash
# Usage: nginx-enable-site.sh <site_path> <enabled_dir>

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <site_path> <enabled_dir>"
    exit 1
fi

SITE_PATH="$1"
ENABLED_DIR="$2"

# Убедимся, что файл существует
if [ ! -f "$SITE_PATH" ]; then
    echo "Error: site config '$SITE_PATH' does not exist."
    exit 1
fi

# Убедимся, что папка назначения существует
if [ ! -d "$ENABLED_DIR" ]; then
    echo "Error: enabled directory '$ENABLED_DIR' does not exist."
    exit 1
fi

SITE_NAME=$(basename "$SITE_PATH")

ln -sf "$SITE_PATH" "$ENABLED_DIR/$SITE_NAME"
echo "Enabled site: $SITE_NAME"
