#!/bin/bash
# Usage: nginx-delete-config.sh <full-path-to-available-file> [full-path-to-enabled-symlink]

AVAILABLE_FILE="$1"
ENABLED_FILE="$2"

if [[ -n "$ENABLED_FILE" && -L "$ENABLED_FILE" ]]; then
  rm "$ENABLED_FILE"
  echo "🔗 Removed symlink $ENABLED_FILE"
fi

if [[ -f "$AVAILABLE_FILE" ]]; then
  rm "$AVAILABLE_FILE"
  echo "OK"
else
  echo "NOT_FOUND"
fi
