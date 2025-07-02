#!/bin/bash
# Usage: nginx-rename-config.sh <available-folder-path> <old-name> <new-name> [enabled-folder-path]

AVAILABLE_PATH="$1"
OLD_NAME="$2"
NEW_NAME="$3"
ENABLED_PATH="$4"

OLD_AVAILABLE="$AVAILABLE_PATH/$OLD_NAME"
NEW_AVAILABLE="$AVAILABLE_PATH/$NEW_NAME"

if [[ ! -f "$OLD_AVAILABLE" ]]; then
  echo "Error: file $OLD_AVAILABLE does not exist."
  exit 1
fi

mv "$OLD_AVAILABLE" "$NEW_AVAILABLE"
echo "✅ Renamed $OLD_NAME → $NEW_NAME in available"

if [[ -n "$ENABLED_PATH" ]]; then
  OLD_ENABLED="$ENABLED_PATH/$OLD_NAME"
  NEW_ENABLED="$ENABLED_PATH/$NEW_NAME"

  if [[ -L "$OLD_ENABLED" ]]; then
    rm "$OLD_ENABLED"
    echo "🔗 Removed old symlink $OLD_ENABLED"
  fi

  ln -s "../sites-available/$NEW_NAME" "$NEW_ENABLED"
  echo "🔗 Created new symlink $NEW_ENABLED"

  echo "🔍 Checking nginx config..."
  if nginx -t; then
    echo "✅ Nginx config OK. Reloading..."
    systemctl reload nginx
    echo "✅ Nginx reloaded"
  else
    echo "❌ Nginx config failed. Reverting..."

    mv "$NEW_AVAILABLE" "$OLD_AVAILABLE"
    [[ -L "$NEW_ENABLED" ]] && rm "$NEW_ENABLED"
    ln -s "../sites-available/$OLD_NAME" "$OLD_ENABLED"
    exit 1
  fi
fi
"